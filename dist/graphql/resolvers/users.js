"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const generate_token_1 = __importDefault(require("../../utils/generate-token"));
const apollo_server_1 = require("apollo-server");
const models_config_1 = require("../../db/models/models-config");
// eslint-disable-next-line
const generateImage = require("../../utils/generate-image");
exports.default = {
    Mutation: {
        register: async (_parent, args) => {
            const { firstName, lastName, email, password } = args;
            const isUserExists = await models_config_1.User.findOne({ where: { email } });
            if (isUserExists) {
                throw new apollo_server_1.UserInputError("Email already exists");
            }
            const hasedPassword = await bcrypt_1.default.hash(password, 6);
            const user = await models_config_1.User.create({ firstName, lastName, email, password: hasedPassword, image: generateImage() });
            const { password: userPassword, ...safeUserData } = user.toJSON();
            return { user: safeUserData, token: (0, generate_token_1.default)({ id: user.id, email, firstName, lastName }) };
        },
        login: async (_parent, args) => {
            const { email, password } = args;
            const user = await models_config_1.User.findOne({ where: { email } });
            if (!user) {
                throw new apollo_server_1.UserInputError("Email not found");
            }
            const correctPassword = await bcrypt_1.default.compare(password, user.password);
            if (!correctPassword) {
                throw new apollo_server_1.UserInputError("Password is incorrect");
            }
            const { id, firstName, lastName, image } = user;
            return { user: { id, firstName, lastName, image }, token: (0, generate_token_1.default)({ id, email, firstName, lastName }) };
        }
    }
};
