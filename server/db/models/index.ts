/* eslint-disable @typescript-eslint/no-var-requires */
import Sequelize from "sequelize";
const config = require(__dirname + "/../config/config.js")[`${process.env.NODE_ENV || "development"}`];
// @ts-ignore
const sequelize = new Sequelize(config);

const models: any = {
  User: require("./User")(sequelize, Sequelize.DataTypes),
  Email: require("./Email")(sequelize, Sequelize.DataTypes)
};

models.User.hasMany(models.Email, { foreignKey: "senderId" });
models.User.hasMany(models.Email, { foreignKey: "recipientId" });
models.Email.belongsTo(models.User, { foreignKey: "senderId" });
models.Email.belongsTo(models.User, { foreignKey: "recipientId" });

Object.keys(models).map(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

const { User, Email } = models;
export { sequelize, User, Email };