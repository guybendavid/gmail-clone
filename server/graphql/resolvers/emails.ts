import { Op } from "sequelize";
import { UserInputError, AuthenticationError, ApolloError, withFilter, PubSub } from "apollo-server";
import { Email, User } from "../../db/models/modelsConfig";
import { SendEmailPayload, User as IUser } from "../../db/interfaces/interfaces";
import { validateEmailObj } from "../../utils/validatons";
import { getEmails, cacheFullName, getCachedFullName, formatParticipant } from "../../utils/emailsHelper";

export = {
  Query: {
    getReceivedEmails: (_parent: any, args: { loggedInUserEmail: string; }, { user }: { user: IUser; }) => {
      const { loggedInUserEmail } = args;
      return getEmails({ user, loggedInUserEmail, participantType: "recipient" });
    },
    getSentEmails: (_parent: any, args: { loggedInUserEmail: string; }, { user }: { user: IUser; }) => {
      const { loggedInUserEmail } = args;
      return getEmails({ user, loggedInUserEmail, participantType: "sender" });
    }
  },
  Mutation: {
    sendEmail: async (_parent: any, args: SendEmailPayload, { user, pubsub }: { user: IUser; pubsub: PubSub; }) => {
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
    deleteEmails: async (_parent: any, args: { ids: string[]; }, { user }: { user: IUser; }) => {
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
      subscribe: withFilter((_parent, _args, { pubsub, user }) => {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }

        return pubsub.asyncIterator(["NEW_EMAIL"]);
      }, ({ newEmail }, _args, { user }) => newEmail.sender.email === user.email || newEmail.recipient.email === user.email)
    }
  }
};