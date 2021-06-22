import { ApolloServer } from "apollo-server";
import { sequelize } from "./db/models/modelsConfig";
import resolvers from "./graphql/resolvers/resolversConfig";
import typeDefs from "./graphql/typeDefs";
import contextMiddleware from "./utils/contextMiddleware";
import asyncRedis from "async-redis";
import pino from "pino";

const { LOG_LEVEL, REDIS_URL, PORT } = process.env;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  subscriptions: { path: "/" }
});

const logger = pino({ level: LOG_LEVEL || "info" });
const redisClient = (asyncRedis as any).createClient(REDIS_URL || "");

sequelize.authenticate()
  .then(() => logger.info("Database connected!"))
  .then(() => server.listen({ port: PORT || 4000 })
    .then(({ url, subscriptionsUrl }) => {
      logger.info(`Server ready at ${url}`);
      logger.info(`Susbscription ready at ${subscriptionsUrl}`);
    }))
  .catch((err: Error) => logger.error(err));

export { redisClient };