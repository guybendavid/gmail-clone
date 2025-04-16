"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = exports.User = exports.sequelize = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const user_1 = __importDefault(require("./user"));
const email_1 = __importDefault(require("./email"));
// @ts-ignore
const config_1 = __importDefault(require("../config/config"));
const { NODE_ENV } = process.env;
const environmentConfig = config_1.default[NODE_ENV === "production" ? "production" : "development"];
// @ts-ignore
const sequelize = new sequelize_1.default(environmentConfig);
exports.sequelize = sequelize;
const models = {
    User: (0, user_1.default)(sequelize, sequelize_1.default.DataTypes),
    Email: (0, email_1.default)(sequelize, sequelize_1.default.DataTypes)
};
const { User, Email } = models;
exports.User = User;
exports.Email = Email;
User.hasMany(Email, { foreignKey: "sender" });
User.hasMany(Email, { foreignKey: "recipient" });
Email.belongsTo(User, { foreignKey: "sender" });
Email.belongsTo(User, { foreignKey: "recipient" });
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});
models.sequelize = sequelize;
models.Sequelize = sequelize_1.default;
