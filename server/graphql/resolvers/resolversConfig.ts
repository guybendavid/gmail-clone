import userResolvers from "./users";
import emailResolvers from "./emails";

export = {
  Email: {
    createdAt: (parent: any) => parent.createdAt?.toISOString()
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