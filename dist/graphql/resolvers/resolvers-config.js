"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("./users"));
const emails_1 = __importDefault(require("./emails"));
exports.default = {
    Email: {
        createdAt: (parent) => parent.createdAt?.toISOString()
    },
    Query: {
        ...emails_1.default.Query
    },
    Mutation: {
        ...users_1.default.Mutation,
        ...emails_1.default.Mutation
    },
    Subscription: {
        ...emails_1.default.Subscription
    }
};
