import { Op } from "sequelize";
import { UserInputError, withFilter, PubSub } from "apollo-server";
import { Email, User } from "../../db/models/modelsConfig";
import { SendEmailPayload, User as IUser } from "../../db/interfaces/interfaces";
import { getEmails, formatParticipant } from "../../utils/emailsHelper";

const emailsResolver = {
  Query: {
    getReceivedEmails: (_parent: any, args: { loggedInUserEmail: string; }, _context: { user: IUser; }) => {
      const { loggedInUserEmail } = args;
      return getEmails({ loggedInUserEmail, participantType: "recipient" });
    },
    getSentEmails: (_parent: any, args: { loggedInUserEmail: string; }, _context: { user: IUser; }) => {
      const { loggedInUserEmail } = args;
      return getEmails({ loggedInUserEmail, participantType: "sender" });
    }
  },
  Mutation: {
    sendEmail: async (_parent: any, args: SendEmailPayload, { pubsub }: { pubsub: PubSub; }) => {
      const { senderEmail, recipientEmail, subject, content, isSenderNameInClient, isRecipientNameInClient } = args;
      const recipientUser = await User.findOne({ where: { email: recipientEmail } });

      if (!recipientUser) {
        throw new UserInputError("Email not found");
      }

      const email = await Email.create({ sender: senderEmail, recipient: recipientEmail, subject, content });
      const newEmail = { ...email.toJSON() };
      newEmail.sender = await formatParticipant("sender", senderEmail, newEmail, isSenderNameInClient);
      newEmail.recipient = await formatParticipant("recipient", recipientEmail, newEmail, isRecipientNameInClient);
      pubsub.publish("NEW_EMAIL", { newEmail });
      return email;
    },
    deleteEmails: async (_parent: any, args: { ids: string[]; }, _context: { user: IUser; }) => {
      const { ids } = args;
      const idIsNotValid = (id: string) => isNaN(Number(id));

      if (ids.length > 0 && !ids.find(id => idIsNotValid(id))) {
        await Email.destroy({ where: { id: { [Op.in]: ids } } });
      } else {
        throw new UserInputError("Please send a valid id's array");
      }
    }
  },
  Subscription: {
    newEmail: {
      subscribe: withFilter((_parent, _args, { pubsub }) => {
        return pubsub.asyncIterator(["NEW_EMAIL"]);
      }, ({ newEmail }, _args, { user }) => newEmail.sender.email === user.email || newEmail.recipient.email === user.email)
    }
  }
};

export default emailsResolver;