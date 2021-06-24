import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken";
import { UserInputError, ApolloError } from "apollo-server";
import { User } from "../../db/models/modelsConfig";
import { validateRegisterObj, validateLoginObj } from "../../utils/validations";
import { User as IUSER } from "../../db/interfaces/interfaces";
// eslint-disable-next-line
const imageGenerator = require("../../utils/imageGenerator");

export = {
  Mutation: {
    register: async (_parent: any, args: IUSER) => {
      const { firstName, lastName, email, password } = args;
      const validateUser = validateRegisterObj(args);

      if (validateUser.isValid) {
        try {
          const isUserExists = await User.findOne({ where: { email } });

          if (isUserExists) {
            throw new UserInputError("email already exists");
          }

          const hasedPassword = await bcrypt.hash(password as string, 6);
          const image = imageGenerator();
          const user = await User.create({ firstName, lastName, email, password: hasedPassword, image });
          const { password: userPassword, ...safeUserData } = user.toJSON();
          return { ...safeUserData, token: generateToken({ id: user.id, email, firstName, lastName }) };
        } catch (err) {
          throw new ApolloError(err);
        }
      } else {
        throw new UserInputError(validateUser.errors[0]);
      }
    },
    login: async (_parent: any, args: IUSER) => {
      const { email, password } = args;
      const validateUser = validateLoginObj(args);

      if (validateUser.isValid) {
        try {
          const user = await User.findOne({ where: { email } });

          if (!user) {
            throw new UserInputError("Email not found");
          }

          const correctPassword = await bcrypt.compare(password as string, user.password);

          if (!correctPassword) {
            throw new UserInputError("Password is incorrect");
          }

          const { id, firstName, lastName, image } = user;
          return { id, firstName, lastName, image, token: generateToken({ id, email, firstName, lastName }) };
        } catch (err) {
          throw new ApolloError(err);
        }
      } else {
        throw new UserInputError(validateUser.errors[0]);
      }
    }
  }
};