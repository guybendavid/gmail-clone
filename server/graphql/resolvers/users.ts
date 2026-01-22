import { db } from "../../db/connection";
import { eq } from "drizzle-orm";
import { getGenerateToken } from "../../utils/generate-token";
import { UserInputError } from "apollo-server";
import { users } from "../../db/schema";
import { getGeneratedImage } from "../../utils/generate-image";
import type { User as UserType } from "../../types/types";
import bcrypt from "bcrypt";

export const userResolvers = {
  Mutation: {
    register: async (_parent: unknown, args: Omit<UserType, "id">) => {
      const { firstName, lastName, email, password } = args;
      const [isUserExists] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (isUserExists) {
        throw new UserInputError("Email already exists");
      }

      const hasedPassword = await bcrypt.hash(password as string, 6);

      const [user] = await db
        .insert(users)
        .values({ firstName, lastName, email, password: hasedPassword, image: getGeneratedImage() })
        .returning();

      if (!user) {
        throw new UserInputError("User was not created");
      }

      const { password: _userPassword, ...safeUserData } = user;

      return {
        user: safeUserData,
        token: getGenerateToken({ id: String(user.id), email, firstName, lastName })
      };
    },
    login: async (_parent: unknown, args: Pick<UserType, "email" | "password">) => {
      const { email, password } = args;
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (!user) {
        throw new UserInputError("Email not found");
      }

      const correctPassword = await bcrypt.compare(password as string, user.password);

      if (!correctPassword) {
        throw new UserInputError("Password is incorrect");
      }

      const { id, firstName, lastName, image } = user;

      return {
        user: { id, firstName, lastName, image },
        token: getGenerateToken({ id: String(id), email, firstName, lastName })
      };
    }
  }
};
