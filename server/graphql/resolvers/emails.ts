import { Op } from "sequelize";
import { UserInputError, withFilter } from "apollo-server";
import { Email, User } from "../../db/models/models-config";
import { DBEmail, ContextUser } from "../../types/types";
import { getFormattedNewEmail, getEmailsByParticipantType } from "../../utils/emails-helper";
import { pubsub } from "../../app";

interface SendEmailPayload extends Pick<DBEmail, "subject" | "content"> {
  senderEmail: string;
  recipientEmail: string;
}

export default {
  Query: {
    getReceivedEmails: (_parent: any, args: { loggedInUserEmail: string; }, _context: { user: ContextUser; }) => {
      const { loggedInUserEmail } = args;
      return getEmailsByParticipantType({ loggedInUserEmail, participantType: "recipient" });
    },
    getSentEmails: (_parent: any, args: { loggedInUserEmail: string; }, _context: { user: ContextUser; }) => {
      const { loggedInUserEmail } = args;
      return getEmailsByParticipantType({ loggedInUserEmail, participantType: "sender" });
    }
  },
  Mutation: {
    sendEmail: async (_parent: any, args: SendEmailPayload, _context: { user: ContextUser; }) => {
      const { senderEmail, recipientEmail, subject, content } = args;
      const recipientUser = await User.findOne({ where: { email: recipientEmail } });

      if (!recipientUser) {
        throw new UserInputError("Email not found");
      }

      const email = await Email.create({ sender: senderEmail, recipient: recipientEmail, subject, content });
      pubsub.publish("NEW_EMAIL", { newEmail: await getFormattedNewEmail({ ...email.toJSON() }) });
      return email;
    },
    deleteEmails: async (_parent: any, args: { ids: string[]; }, _context: { user: ContextUser; }) => {
      const { ids } = args;
      const idIsNotValid = (id: string) => isNaN(Number(id));

      if (ids.length > 0 && !ids.some(idIsNotValid)) {
        await Email.destroy({ where: { id: { [Op.in]: ids } } });
      } else {
        throw new UserInputError("Please send a valid id's array");
      }
    }
  },
  Subscription: {
    newEmail: {
      subscribe: withFilter(
        (_parent, _args, _context) => pubsub.asyncIterator("NEW_EMAIL"),
        ({ newEmail }, _args, { user }) => newEmail.sender.email === user.email || newEmail.recipient.email === user.email
      )
    }
  }
};