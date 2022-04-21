import { DBEmail, EmailResponse, ParticipantType } from "../db/interfaces/interfaces";
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

  return emails.map((email: DBEmail) => ({
    ...email,
    sender: { email: email.sender_email, fullName: email.sender_full_name },
    recipient: { email: email.recipient_email, fullName: email.recipient_full_name }
  }));
};

const getNewEmailFormattedParticipant =
  async (participantType: ParticipantType, participantEmail: string, newEmail: EmailResponse) => {
    return { email: newEmail[participantType], fullName: await getFullNameByEmail(participantEmail) };
  };

const getFullNameByEmail = async (email: string) => {
  const { firstName, lastName } = await User.findOne({ where: { email } });
  return `${firstName} ${lastName}`;
};

export { getEmails, getNewEmailFormattedParticipant };