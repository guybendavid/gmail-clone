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

const getIdIsNotValid = (id: string) => isNaN(Number(id));

export const emailResolvers = {
  Query: {
    getReceivedEmails: (_parent: any, args: { loggedInUserEmail: string }, _context: { user: ContextUser }) => {
      const { loggedInUserEmail } = args;
      return getEmailsByParticipantType({ loggedInUserEmail, participantType: "recipient" });
    },
    getSentEmails: (_parent: any, args: { loggedInUserEmail: string }, _context: { user: ContextUser }) => {
      const { loggedInUserEmail } = args;
      return getEmailsByParticipantType({ loggedInUserEmail, participantType: "sender" });
    }
  },
  Mutation: {
    sendEmail: async (_parent: any, args: SendEmailPayload, _context: { user: ContextUser }) => {
      const { senderEmail, recipientEmail, subject, content } = args;
      const recipientUser = await User.findOne({ where: { email: recipientEmail } });

      if (!recipientUser) {
        throw new UserInputError("Email not found");
      }

      const email = await Email.create({ sender: senderEmail, recipient: recipientEmail, subject, content });
      pubsub.publish("NEW_EMAIL", { newEmail: await getFormattedNewEmail({ ...email.toJSON() }) });
      return email;
    },
    deleteEmails: async (_parent: any, args: { ids: string[] }, _context: { user: ContextUser }) => {
      const { ids } = args;

      if (ids.length > 0 && !ids.some(getIdIsNotValid)) {
        await Email.destroy({ where: { id: { [Op.in]: ids } } });
      }

      if (ids.length === 0 || ids.some(getIdIsNotValid)) {
        throw new UserInputError("Please send a valid id's array");
      }
    }
  },
  Subscription: {
    newEmail: {
      subscribe: withFilter(
        (_parent: any, _args: any, _context: any) => pubsub.asyncIterableIterator("NEW_EMAIL"),
        ({ newEmail }: any, _args: any, { user }: any) =>
          newEmail.sender.email === user.email || newEmail.recipient.email === user.email
      )
    }
  }
};
