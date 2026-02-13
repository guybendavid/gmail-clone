import { eq } from "drizzle-orm";
import { GraphQLError } from "graphql";
import { db } from "#root/server/db/connection";
import { users } from "#root/server/db/schema";
import { getGenerateToken } from "#root/server/utils/generate-token";
import { getGeneratedImage } from "#root/server/utils/generate-image";
import bcrypt from "bcrypt";
import type { User as UserType } from "#root/server/types/types";

export const userResolvers = {
  Mutation: {
    register: async (_parent: unknown, args: Omit<UserType, "id">) => {
      const { firstName, lastName, email, password } = args;
      const [isUserExists] = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (isUserExists) {
        throw new GraphQLError("Email already exists", {
          extensions: { code: "BAD_USER_INPUT" }
        });
      }

      const hasedPassword = await bcrypt.hash(password as string, 6);

      const [user] = await db
        .insert(users)
        .values({ firstName, lastName, email, password: hasedPassword, image: getGeneratedImage() })
        .returning();

      if (!user) {
        throw new GraphQLError("User was not created", {
          extensions: { code: "INTERNAL_SERVER_ERROR" }
        });
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

      return {
        user: { id, firstName, lastName, image },
        token: getGenerateToken({ id: String(id), email, firstName, lastName })
      };
    }
  }
};
