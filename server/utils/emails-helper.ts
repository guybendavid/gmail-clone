import { DBEmail, ParticipantType } from "../types/types";
import { sequelize, User } from "../db/models/models-config";
import { QueryTypes } from "sequelize";
import { AuthenticationError } from "apollo-server";
import { getEmailsWithParticipantsName } from "../db/raw-queries/emails";

type GetEmailsByParticipantType = {
  loggedInUserEmail: string;
  participantType: ParticipantType;
};

type GetEmailsWithParticipantsNameQueryResponse = {
  id: string;
  sender_email: string;
  recipient_email: string;
  sender_full_name: string;
  recipient_full_name: string;
  subject: string;
  content: string;
}[];

export const getEmailsByParticipantType = async ({
  loggedInUserEmail,
  participantType
}: GetEmailsByParticipantType) => {
  if (!loggedInUserEmail) {
    throw new AuthenticationError("Please send a valid email");
  }

  const emails = await sequelize.query(getEmailsWithParticipantsName(participantType), {
    type: QueryTypes.SELECT,
    replacements: [loggedInUserEmail, loggedInUserEmail]
  });

  return formatDBEmailsToApiShape(emails);
};

export const getFormattedNewEmail = async (newEmail: DBEmail) => ({
  ...newEmail,
  sender: await formatNewEmailParticipant(newEmail, "sender"),
  recipient: await formatNewEmailParticipant(newEmail, "recipient")
});

const formatDBEmailsToApiShape = (emails: GetEmailsWithParticipantsNameQueryResponse) =>
  emails.map((email) => ({
    ...email,
    sender: { email: email.sender_email, fullName: email.sender_full_name },
    recipient: { email: email.recipient_email, fullName: email.recipient_full_name }
  }));

const formatNewEmailParticipant = async (newEmail: DBEmail, participantType: ParticipantType) => {
  const emailAdderss = newEmail[participantType];
  return { email: emailAdderss, fullName: await getFullNameByEmail(emailAdderss) };
};

const getFullNameByEmail = async (email: string) => {
  const { firstName, lastName } = await User.findOne({ where: { email } });
  return `${firstName} ${lastName}`;
};
