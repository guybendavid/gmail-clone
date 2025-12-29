import { getGenerateToken } from "../../utils/generate-token";
import { User } from "../../db/models/models-config";
import type { User as UserType } from "../../types/types";
import { UserInputError } from "apollo-server";
import bcrypt from "bcrypt";
// eslint-disable-next-line
const generateImage = require("../../utils/generate-image");

export const userResolvers = {
  Mutation: {
    register: async (_parent: unknown, args: Omit<UserType, "id">) => {
      const { firstName, lastName, email, password } = args;
      const isUserExists = await User.findOne({ where: { email } });

      if (isUserExists) {
        throw new UserInputError("Email already exists");
      }

      const hasedPassword = await bcrypt.hash(password as string, 6);
      const user = await User.create({ firstName, lastName, email, password: hasedPassword, image: generateImage() });
      const { password: _userPassword, ...safeUserData } = user.toJSON();
      return { user: safeUserData, token: getGenerateToken({ id: user.id, email, firstName, lastName }) };
    },
    login: async (_parent: unknown, args: Pick<UserType, "email" | "password">) => {
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
      return { user: { id, firstName, lastName, image }, token: getGenerateToken({ id, email, firstName, lastName }) };
    }
  }
};
