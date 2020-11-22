import { Sequelize } from "sequelize";

export = (sequelize: Sequelize, DataTypes: any) => {
  const Email = sequelize.define("Email", {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "sender_id",
      references: {
        key: "id",
        model: "users"
      }
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "recipient_id",
      references: {
        key: "id",
        model: "users"
      }
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    modelName: "Email",
    tableName: "emails",
    updatedAt: false,
    underscored: true
  });

  return Email;
};