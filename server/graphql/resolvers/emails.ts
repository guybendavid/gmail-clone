import { Op } from "sequelize";
import { UserInputError } from "apollo-server";
import { withFilter } from "graphql-subscriptions";
import { Email, User } from "../../db/models/models-config";
import { DBEmail, ContextUser } from "../../types/types";
import { getFormattedNewEmail, getEmailsByParticipantType } from "../../utils/emails-helper";
import { pubsub } from "../../app";

interface SendEmailPayload extends Pick<DBEmail, "subject" | "content"> {
  senderEmail: string;
  recipientEmail: string;
}

const getIsIdNotValid = (id: string) => isNaN(Number(id));

type GraphQLContext = { user: ContextUser };

type NewEmailPayload = {
  newEmail: {
    sender: { email: string };
    recipient: { email: string };
  };
};

const getIsRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) return false;
  return !Array.isArray(value);
};

const getIsNewEmailPayload = (value: unknown): value is NewEmailPayload => {
  if (!getIsRecord(value)) return false;
  const { newEmail } = value;
  if (!getIsRecord(newEmail)) return false;
  const { sender, recipient } = newEmail;
  if (!getIsRecord(sender) || !getIsRecord(recipient)) return false;
  return typeof sender.email === "string" && typeof recipient.email === "string";
};

export const emailResolvers = {
  Query: {
    getReceivedEmails: (_parent: unknown, args: { loggedInUserEmail: string }, _context: GraphQLContext) => {
      const { loggedInUserEmail } = args;
      return getEmailsByParticipantType({ loggedInUserEmail, participantType: "recipient" });
    },
    getSentEmails: (_parent: unknown, args: { loggedInUserEmail: string }, _context: GraphQLContext) => {
      const { loggedInUserEmail } = args;
      return getEmailsByParticipantType({ loggedInUserEmail, participantType: "sender" });
    }
  },
  Mutation: {
    sendEmail: async (_parent: unknown, args: SendEmailPayload, _context: GraphQLContext) => {
      const { senderEmail, recipientEmail, subject, content } = args;
      const recipientUser = await User.findOne({ where: { email: recipientEmail } });

      if (!recipientUser) {
        throw new UserInputError("Email not found");
      }

      const email = await Email.create({ sender: senderEmail, recipient: recipientEmail, subject, content });
      pubsub.publish("NEW_EMAIL", { newEmail: await getFormattedNewEmail({ ...email.toJSON() }) });
      return email;
    },
    deleteEmails: async (_parent: unknown, args: { ids: string[] }, _context: GraphQLContext) => {
      const { ids } = args;

      if (ids.length > 0 && !ids.some(getIsIdNotValid)) {
        await Email.destroy({ where: { id: { [Op.in]: ids } } });
      }

      if (ids.length === 0 || ids.some(getIsIdNotValid)) {
        throw new UserInputError("Please send a valid id's array");
      }
    }
  },
  Subscription: {
    newEmail: {
      subscribe: withFilter(
        (_parent: unknown, _args: unknown) => pubsub.asyncIterableIterator("NEW_EMAIL"),
        (payload: unknown, _args: unknown, context: GraphQLContext | undefined) => {
          if (!context) return false;

          const { user } = context;

          if (!getIsNewEmailPayload(payload)) return false;
          const { newEmail } = payload;
          return newEmail.sender.email === user.email || newEmail.recipient.email === user.email;
        }
      )
    }
  }
};
