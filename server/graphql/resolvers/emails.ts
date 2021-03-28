import { Op } from "sequelize";
import { UserInputError, AuthenticationError, ApolloError, withFilter } from "apollo-server";
import { Email, User } from "../../db/models/modelsConfig";
import { SendEmailPayload } from "../../db/interfaces/interfaces";
import { validateEmailObj } from "../../utils/validatons";
import { getEmails, cacheFullName, getCachedFullName, formatParticipant } from "../../utils/emailsHelper";

export = {
  Query: {
    getReceivedEmails: (parent: any, args: { loggedInUserEmail: string; }, { user }: any) => {
      const { loggedInUserEmail } = args;
      return getEmails({ user, loggedInUserEmail, participantType: "recipient" });
    },
    getSentEmails: (parent: any, args: { loggedInUserEmail: string; }, { user }: any) => {
      const { loggedInUserEmail } = args;
      return getEmails({ user, loggedInUserEmail, participantType: "sender" });
    }
  },
  Mutation: {
    sendEmail: async (parent: any, args: SendEmailPayload, { user, pubsub }: any) => {
      const { senderEmail, recipientEmail, subject, content } = args;

      if (!user) {
        throw new AuthenticationError("Unauthenticated");
      }

      const recipientUser = await User.findOne({ where: { email: recipientEmail } });

      if (!recipientUser) {
        throw new UserInputError("Email not found");
      } else if (!await getCachedFullName(recipientUser.email)) {
        cacheFullName(recipientUser);
      }

      const validateEmail = validateEmailObj(args);

      if (validateEmail.isValid) {
        try {
          const email = await Email.create({ sender: senderEmail, recipient: recipientEmail, subject, content });
          const newEmail = { ...email.toJSON() };
          newEmail.sender = await formatParticipant(newEmail, "sender");
          newEmail.recipient = await formatParticipant(newEmail, "recipient");
          pubsub.publish("NEW_EMAIL", { newEmail });
          return email;
        } catch (err) {
          throw new ApolloError(err);
        }
      } else {
        throw new UserInputError(validateEmail.errors[0]);
      }
    },
    deleteEmails: async (parent: any, args: { ids: string[]; }, { user }: any) => {
      const { ids } = args;
      const idIsNotValid = (id: string) => isNaN(Number(id));

      if (!user) {
        throw new AuthenticationError("Unauthenticated");
      }

      if (ids.length > 0 && !ids.find(id => idIsNotValid(id))) {
        try {
          await Email.destroy({ where: { id: { [Op.in]: ids } } });
        } catch (err) {
          throw new ApolloError(err);
        }
      } else {
        throw new UserInputError("Please send a valid id's array");
      }
    }
  },
  Subscription: {
    newEmail: {
      subscribe: withFilter((parent, args, { pubsub, user }) => {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }

        return pubsub.asyncIterator(["NEW_EMAIL"]);
      }, ({ newEmail }, args, { user }) => newEmail.sender.email === user.email || newEmail.recipient.email === user.email)
    }
  }
};