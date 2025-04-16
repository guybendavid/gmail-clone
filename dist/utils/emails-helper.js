"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedNewEmail = exports.getEmailsByParticipantType = void 0;
const models_config_1 = require("../db/models/models-config");
const sequelize_1 = require("sequelize");
const apollo_server_1 = require("apollo-server");
const emails_1 = require("../db/raw-queries/emails");
const getEmailsByParticipantType = async ({ loggedInUserEmail, participantType }) => {
    if (!loggedInUserEmail) {
        throw new apollo_server_1.AuthenticationError("Please send a valid email");
    }
    const emails = await models_config_1.sequelize.query((0, emails_1.getEmailsWithParticipantsName)(participantType), {
        type: sequelize_1.QueryTypes.SELECT,
        replacements: [loggedInUserEmail, loggedInUserEmail]
    });
    return formatDBEmailsToApiShape(emails);
};
exports.getEmailsByParticipantType = getEmailsByParticipantType;
const getFormattedNewEmail = async (newEmail) => ({
    ...newEmail,
    sender: await formatNewEmailParticipant(newEmail, "sender"),
    recipient: await formatNewEmailParticipant(newEmail, "recipient")
});
exports.getFormattedNewEmail = getFormattedNewEmail;
const formatDBEmailsToApiShape = (emails) => emails.map(email => ({
    ...email,
    sender: { email: email.sender_email, fullName: email.sender_full_name },
    recipient: { email: email.recipient_email, fullName: email.recipient_full_name }
}));
const formatNewEmailParticipant = async (newEmail, participantType) => {
    const emailAdderss = newEmail[participantType];
    return { email: emailAdderss, fullName: await getFullNameByEmail(emailAdderss) };
};
const getFullNameByEmail = async (email) => {
    const { firstName, lastName } = await models_config_1.User.findOne({ where: { email } });
    return `${firstName} ${lastName}`;
};
