"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apollo_server_1 = require("apollo-server");
const utils_1 = require("@guybendavid/utils");
const { SECRET_KEY } = process.env;
exports.default = (context) => {
    if (context.req?.body) {
        const { message } = (0, utils_1.getFormValidationErrors)(context.req.body.variables);
        if (message)
            throw new apollo_server_1.UserInputError(message);
    }
    const token = (context.req?.headers?.authorization ||
        context.connection.context.authorization).split("Bearer ").pop();
    if (token === "null" && ["LoginUser", "RegisterUser"].includes(context.req.body.operationName)) {
        return context;
    }
    jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, decodedToken) => {
        if (err) {
            throw new apollo_server_1.AuthenticationError("Unauthenticated");
        }
        const { iat, exp, ...relevantUserFields } = decodedToken;
        context.user = { ...relevantUserFields };
    });
    return context;
};
