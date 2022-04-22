import { DBEmail, NewEmailResponse, ParticipantType } from "../db/interfaces/interfaces";
import { sequelize, User } from "../db/models/models-config";
import { QueryTypes } from "sequelize";
import { AuthenticationError } from "apollo-server";
import { getEmailsWithParticiapntsName } from "../db/raw-queries/emails";

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

const getFormattedNewEmail = async (newEmail: NewEmailResponse) => ({
  ...newEmail,
  sender: await formatNewEmailParticipant(newEmail, "sender"),
  recipient: await formatNewEmailParticipant(newEmail, "recipient")
});

const formatNewEmailParticipant = async (newEmail: NewEmailResponse, participantType: ParticipantType) => {
  const emailAdderss = newEmail[participantType];
  return { email: emailAdderss, fullName: await getFullNameByEmail(emailAdderss) };
};

const getFullNameByEmail = async (email: string) => {
  const { firstName, lastName } = await User.findOne({ where: { email } });
  return `${firstName} ${lastName}`;
};

export { getEmails, getFormattedNewEmail };