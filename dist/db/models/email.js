"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (sequelize, DataTypes) => {
    const Email = sequelize.define("Email", {
        sender: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "sender",
            references: {
                key: "email",
                model: "users"
            }
        },
        recipient: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "recipient",
            references: {
                key: "email",
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
        },
        createdAt: {
            type: DataTypes.DATE,
            field: "created_at"
        }
    }, {
        modelName: "Email",
        tableName: "emails",
        updatedAt: false
    });
    return Email;
};
