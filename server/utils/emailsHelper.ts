import { Email as IEmail, ParticipantType } from "../db/interfaces/interfaces";
import { sequelize, User } from "../db/models/modelsConfig";
import { QueryTypes } from "sequelize";
import { AuthenticationError } from "apollo-server";
import { getEmailsWithParticiapntsName } from "./rawQueries";

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

  for await (const email of emails) {
    email.sender = { email: email.sender_email, fullName: email.sender_full_name };
    email.recipient = { email: email.recipient_email, fullName: email.recipient_full_name };
  }

  return emails;
};

// To do: remove ts-ignore
// @ts-ignore
const formatParticipant = async (isParticipantFullName?: boolean, participantEmail: string, newEmail: IEmail,
  participantType: ParticipantType) => {

  const getFullNameByEmail = async () => {
    // To do: here is the area to check
    const { firstName, lastName } = await User.findOne({ where: { email: participantEmail } });
    return `${firstName} ${lastName}`;
  };

  return isParticipantFullName ?
    { email: participantEmail } :
    { email: newEmail[participantType], fullName: await getFullNameByEmail() };
};

export { getEmails, formatParticipant };