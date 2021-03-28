/* eslint-disable @typescript-eslint/no-var-requires */
import Sequelize from "sequelize";

const { NODE_ENV, DB, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;
let config;

if (NODE_ENV === "production") {
  config = {
    database: DB,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  };
} else {
  config = require(__dirname + "/../config/config.js")["development"];
}

// @ts-ignore
const sequelize = new Sequelize(config);

const models: any = {
  User: require("./user")(sequelize, Sequelize.DataTypes),
  Email: require("./email")(sequelize, Sequelize.DataTypes)
};

const { User, Email } = models;

User.hasMany(Email, { foreignKey: "sender" });
User.hasMany(Email, { foreignKey: "recipient" });
Email.belongsTo(User, { foreignKey: "sender" });
Email.belongsTo(User, { foreignKey: "recipient" });

Object.keys(models).map(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export { sequelize, User, Email };