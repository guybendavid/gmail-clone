import { UserInputError } from "apollo-server";
import { withFilter } from "graphql-subscriptions";
import { db } from "../../db/connection";
import { emails, users } from "../../db/schema";
import type { DBEmail, ContextUser } from "../../types/types";
import { getFormattedNewEmail, getEmailsByParticipantType } from "../../utils/emails-helper";
import { pubsub } from "../../app";
import { eq, inArray } from "drizzle-orm";

interface SendEmailPayload extends Pick<DBEmail, "subject" | "content"> {
  senderEmail: string;
  recipientEmail: string;
}

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
      const [recipientUser] = await db.select().from(users).where(eq(users.email, recipientEmail)).limit(1);

      if (!recipientUser) {
        throw new UserInputError("Email not found");
      }

      const [email] = await db
        .insert(emails)
        .values({ sender: senderEmail, recipient: recipientEmail, subject, content })
        .returning();

      if (!email) {
        throw new UserInputError("Email was not created");
      }

      const { id, subject: emailSubject, content: emailContent, sender, recipient } = email;

      const createdAt =
        email.createdAt ||
        (await db.select({ createdAt: emails.createdAt }).from(emails).where(eq(emails.id, id)).limit(1))[0]?.createdAt;

      if (!createdAt) {
        throw new UserInputError("Email createdAt is missing");
      }

      pubsub.publish("NEW_EMAIL", {
        newEmail: await getFormattedNewEmail({
          id,
          subject: emailSubject,
          content: emailContent,
          sender,
          recipient,
          createdAt
        })
      });

      return email;
    },
    deleteEmails: async (_parent: unknown, args: { ids: string[] }, _context: GraphQLContext) => {
      const { ids } = args;
      const parsedIds = ids.map(Number).filter((id) => !Number.isNaN(id));

      if (ids.length > 0 && parsedIds.length === ids.length) {
        await db.delete(emails).where(inArray(emails.id, parsedIds));
        return true;
      }

      if (ids.length === 0 || parsedIds.length !== ids.length) {
        throw new UserInputError("Please send a valid id's array");
      }

      return false;
    }
  },
  Subscription: {
    newEmail: {
      subscribe: withFilter(
        (_parent: unknown, _args: unknown) => pubsub.asyncIterableIterator("NEW_EMAIL"),
        (payload: unknown, _args: unknown, context?: GraphQLContext) => {
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
