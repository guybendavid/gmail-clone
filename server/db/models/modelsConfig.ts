import Sequelize from "sequelize";
import config from "../config/config.json";
import user from "./user";
import email from "./email";

const { NODE_ENV } = process.env;
const environmentConfig = config[NODE_ENV === "production" ? "production" : "development"];

// @ts-ignore
const sequelize = new Sequelize(environmentConfig);

const models: any = {
  User: user(sequelize, Sequelize.DataTypes),
  Email: email(sequelize, Sequelize.DataTypes)
};

const { User, Email } = models;

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
models.Sequelize = Sequelize;

export { sequelize, User, Email };