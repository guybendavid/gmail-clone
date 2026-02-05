import { GraphQLError } from "graphql";
import { User } from "#root/server/db/models/models-config";
import { getGenerateToken } from "#root/server/utils/generate-token";
import bcrypt from "bcrypt";
import generateImage from "#root/server/utils/generate-image";
import type { User as UserType } from "#root/server/types/types";

export const userResolvers = {
  Mutation: {
    register: async (_parent: unknown, args: Omit<UserType, "id">) => {
      const { firstName, lastName, email, password } = args;
      const isUserExists = await User.findOne({ where: { email } });

      if (isUserExists) {
        throw new GraphQLError("Email already exists", {
          extensions: { code: "BAD_USER_INPUT" }
        });
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
        throw new GraphQLError("Email not found", {
          extensions: { code: "BAD_USER_INPUT" }
        });
      }

      const correctPassword = await bcrypt.compare(password as string, user.password);

      if (!correctPassword) {
        throw new GraphQLError("Password is incorrect", {
          extensions: { code: "BAD_USER_INPUT" }
        });
      }

      const { id, firstName, lastName, image } = user;
      return { user: { id, firstName, lastName, image }, token: getGenerateToken({ id, email, firstName, lastName }) };
    }
  }
};
