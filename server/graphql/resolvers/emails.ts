import { Op } from "sequelize";
import { UserInputError, AuthenticationError, ApolloError } from "apollo-server";
import { Email, User } from "../../db/models";
import { Email as EmailInterface } from "../../db/interfaces/interfaces";
import { validateEmailObj } from "../../utils/validatons";

export = {
  Query: {
    getEmails: async (parent: any, args: any, { user }: any) => {
      if (!user) {
        throw new AuthenticationError("Unauthenticated");
      }

      try {
        const emails = await Email.findAll({
          where: {
            [Op.or]: [
              { senderId: user.id },
              { recipientId: user.id }
            ]
          },
          order: [["createdAt", "ASC"]]
        });

        return emails;
      } catch (err) {
        throw new ApolloError(err);
      }
    }
  },
  Mutation: {
    sendEmail: async (parent: any, args: EmailInterface, { user }: any) => {
      const { recipientId, subject, content } = args;

      if (!user) {
        throw new AuthenticationError("Unauthenticated");
      }

      if (recipientId.toString() === user.id.toString()) {
        throw new UserInputError("You cant message yourself");
      }

      const recipient = await User.findOne({ where: { id: recipientId } });

      if (!recipient) {
        throw new UserInputError("Please send an exists recipientId");
      }

      const validateEmail = validateEmailObj(args);

      if (validateEmail.isValid) {
        try {
          const email = await Email.create({ senderId: user.id, recipientId, subject, content });
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
  }
};