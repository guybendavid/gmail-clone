import { emailResolvers } from "#root/server/graphql/resolvers/emails";
import { userResolvers } from "#root/server/graphql/resolvers/users";

type EmailParent = {
  createdAt: Date | null;
};

export const resolversConfig = {
  Email: {
    createdAt: ({ createdAt }: EmailParent) => createdAt && createdAt.toISOString()
  },
  Query: {
    ...emailResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...emailResolvers.Mutation
  },
  Subscription: {
    ...emailResolvers.Subscription
  }
};
