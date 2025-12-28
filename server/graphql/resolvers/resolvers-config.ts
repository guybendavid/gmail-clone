import { userResolvers } from "./users";
import { emailResolvers } from "./emails";

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
