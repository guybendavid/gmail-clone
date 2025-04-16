"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { SECRET_KEY } = process.env;
exports.default = (userFields) => {
    if (SECRET_KEY) {
        return jsonwebtoken_1.default.sign(userFields, SECRET_KEY, { expiresIn: "7 days" });
    }
};
