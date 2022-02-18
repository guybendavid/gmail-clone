import { Email as IEmail, ParticipantType } from "../db/interfaces/interfaces";
import { sequelize, User } from "../db/models/models-config";
import { QueryTypes } from "sequelize";
import { AuthenticationError } from "apollo-server";
import { getEmailsWithParticiapntsName } from "./raw-queries";

interface GetEmails {
  loggedInUserEmail: string;
  participantType: ParticipantType;
}

const getEmails = async ({ loggedInUserEmail, participantType }: GetEmails) => {
  if (!loggedInUserEmail) {
    throw new AuthenticationError("Please send a valid email");
  }

  const emails = await sequelize.query(getEmailsWithParticiapntsName(participantType),
    {
      type: QueryTypes.SELECT,
      replacements: [loggedInUserEmail, loggedInUserEmail]
    }
  );

  emails.forEach((email: any) => {
    email.sender = { email: email.sender_email, fullName: email.sender_full_name };
    email.recipient = { email: email.recipient_email, fullName: email.recipient_full_name };
  });

  return emails;
};

const formatParticipant = async (participantType: ParticipantType, participantEmail: string, newEmail: IEmail) => {
  const getFullNameByEmail = async () => {
    const { firstName, lastName } = await User.findOne({ where: { email: participantEmail } });
    return `${firstName} ${lastName}`;
  };

  return { email: newEmail[participantType], fullName: await getFullNameByEmail() };
};

export { getEmails, formatParticipant };