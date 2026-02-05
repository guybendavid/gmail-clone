import { getCreateEmailModel } from "#root/server/db/models/email";
import { getCreateUserModel } from "#root/server/db/models/user";
import Sequelize from "sequelize";
import config from "#root/server/db/config/config";

const { NODE_ENV } = process.env;
const environmentConfig = config[NODE_ENV === "production" ? "production" : "development"];

// @ts-expect-error - Config file is JavaScript
export const sequelize = new Sequelize(environmentConfig);

const models: any = {
  User: getCreateUserModel({ sequelize, DataTypes: Sequelize.DataTypes }),
  Email: getCreateEmailModel({ sequelize, DataTypes: Sequelize.DataTypes })
};

export const { User, Email } = models;

User.hasMany(Email, { foreignKey: "sender" });
User.hasMany(Email, { foreignKey: "recipient" });
Email.belongsTo(User, { foreignKey: "sender" });
Email.belongsTo(User, { foreignKey: "recipient" });

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
