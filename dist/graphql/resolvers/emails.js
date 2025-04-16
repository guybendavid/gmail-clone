"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const apollo_server_1 = require("apollo-server");
const models_config_1 = require("../../db/models/models-config");
const emails_helper_1 = require("../../utils/emails-helper");
const app_1 = require("../../app");
exports.default = {
    Query: {
        getReceivedEmails: (_parent, args, _context) => {
            const { loggedInUserEmail } = args;
            return (0, emails_helper_1.getEmailsByParticipantType)({ loggedInUserEmail, participantType: "recipient" });
        },
        getSentEmails: (_parent, args, _context) => {
            const { loggedInUserEmail } = args;
            return (0, emails_helper_1.getEmailsByParticipantType)({ loggedInUserEmail, participantType: "sender" });
        }
    },
    Mutation: {
        sendEmail: async (_parent, args, _context) => {
            const { senderEmail, recipientEmail, subject, content } = args;
            const recipientUser = await models_config_1.User.findOne({ where: { email: recipientEmail } });
            if (!recipientUser) {
                throw new apollo_server_1.UserInputError("Email not found");
            }
            const email = await models_config_1.Email.create({ sender: senderEmail, recipient: recipientEmail, subject, content });
            app_1.pubsub.publish("NEW_EMAIL", { newEmail: await (0, emails_helper_1.getFormattedNewEmail)({ ...email.toJSON() }) });
            return email;
        },
        deleteEmails: async (_parent, args, _context) => {
            const { ids } = args;
            const idIsNotValid = (id) => isNaN(Number(id));
            if (ids.length > 0 && !ids.some(idIsNotValid)) {
                await models_config_1.Email.destroy({ where: { id: { [sequelize_1.Op.in]: ids } } });
            }
            else {
                throw new apollo_server_1.UserInputError("Please send a valid id's array");
            }
        }
    },
    Subscription: {
        newEmail: {
            subscribe: (0, apollo_server_1.withFilter)((_parent, _args, _context) => app_1.pubsub.asyncIterator("NEW_EMAIL"), ({ newEmail }, _args, { user }) => newEmail.sender.email === user.email || newEmail.recipient.email === user.email)
        }
    }
};
