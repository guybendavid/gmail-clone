import { redisClient } from "../app";
import { User as IUser, Email as IEmail, ParticipantType } from "../db/interfaces/interfaces";
import { sequelize, User } from "../db/models/modelsConfig";
import { QueryTypes } from "sequelize";
import { AuthenticationError } from "apollo-server";
import { getEmailsWithParticiapntsName } from "./rawQueries";

interface Participant extends IUser {
  email: string;
}

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

const cacheFullName = async (participant: Participant) => {
  const { email, firstName, lastName } = participant;
  const fullName = `${firstName} ${lastName}`;
  await redisClient.setex(email, 1800, fullName);
  return fullName;
};

const getCachedFullName = async (email: string) => {
  return await redisClient.get(email);
};

const getFullNameByEmail = async (email: string) => {
  let fullName;
  const cachedFullName = await getCachedFullName(email);

  if (cachedFullName) {
    fullName = cachedFullName;
  } else {
    const participant = await User.findOne({ where: { email } });
    fullName = await cacheFullName(participant);
  }

  return fullName;
};

const formatParticipant = async (email: IEmail, participantType: ParticipantType) => {
  return { email: email[participantType], fullName: await getFullNameByEmail(email[participantType]) };
};

export { cacheFullName, getCachedFullName, getFullNameByEmail, formatParticipant, getEmails };