"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pubsub = void 0;
const express_1 = __importDefault(require("express"));
const apollo_server_1 = require("apollo-server");
const apollo_server_express_1 = require("apollo-server-express");
const models_config_1 = require("./db/models/models-config");
const http_1 = __importDefault(require("http"));
const pino_1 = __importDefault(require("pino"));
const path_1 = __importDefault(require("path"));
const resolvers_config_1 = __importDefault(require("./graphql/resolvers/resolvers-config"));
const type_definitions_1 = __importDefault(require("./graphql/type-definitions"));
const context_middleware_1 = __importDefault(require("./graphql/context-middleware"));
exports.pubsub = new apollo_server_1.PubSub();
const { NODE_ENV, LOG_LEVEL, PORT, BASE_URL_PROD } = process.env;
const logger = (0, pino_1.default)({ level: LOG_LEVEL || "info" });
const serverConfig = { typeDefs: type_definitions_1.default, resolvers: resolvers_config_1.default, context: context_middleware_1.default, subscriptions: { path: "/" } };
const port = PORT || 4000;
const startProductionServer = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.static(path_1.default.join(__dirname, "client")));
    app.get("*", (_req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "client", "index.html"));
    });
    const server = new apollo_server_express_1.ApolloServer(serverConfig);
    server.applyMiddleware({ app });
    const httpServer = http_1.default.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    connect({ server: httpServer, isProd: true });
};
const startDevelopmentServer = () => {
    const server = new apollo_server_1.ApolloServer(serverConfig);
    connect({ server });
};
const connect = async ({ server, isProd }) => {
    try {
        await models_config_1.sequelize.authenticate();
        logger.info("Database connected!");
        if (isProd) {
            await server.listen(port);
            logger.info(`Server ready at https://${BASE_URL_PROD}`);
            logger.info(`Subscriptions ready at wss://${BASE_URL_PROD}`);
            return;
        }
        const { url, subscriptionsUrl } = await server.listen({ port });
        logger.info(`Server ready at ${url}`);
        logger.info(`Susbscription ready at ${subscriptionsUrl}`);
    }
    catch (err) {
        logger.error(err);
    }
};
NODE_ENV === "production" ? startProductionServer() : startDevelopmentServer();
