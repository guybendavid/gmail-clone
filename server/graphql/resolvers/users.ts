import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken";
import { UserInputError } from "apollo-server";
import { User } from "../../db/models/modelsConfig";
import { User as IUSER } from "../../db/interfaces/interfaces";
// eslint-disable-next-line
const generateImage = require("../../utils/generateImage");

const usersResolver = {
  Mutation: {
    register: async (_parent: any, args: IUSER) => {
      const { firstName, lastName, email, password } = args;
      const isUserExists = await User.findOne({ where: { email } });

      if (isUserExists) {
        throw new UserInputError("email already exists");
      }

      const hasedPassword = await bcrypt.hash(password as string, 6);
      const image = generateImage();
      const user = await User.create({ firstName, lastName, email, password: hasedPassword, image });
      const { password: userPassword, ...safeUserData } = user.toJSON();
      return { ...safeUserData, token: generateToken({ id: user.id, email, firstName, lastName }) };
    },
    login: async (_parent: any, args: IUSER) => {
      const { email, password } = args;
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
    }
  }
};

export default usersResolver;