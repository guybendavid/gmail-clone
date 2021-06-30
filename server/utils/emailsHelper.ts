import { redisClient } from "../app";
import { User, Email } from "../db/models/modelsConfig";
import { User as IUser, Email as IEmail } from "../db/interfaces/interfaces";
import { AuthenticationError } from "apollo-server";

type ParticipantType = "sender" | "recipient";

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

  const emails = await Email.findAll({
    where: participantType === "sender" ? { sender: loggedInUserEmail } : { recipient: loggedInUserEmail },
    order: [["createdAt", "ASC"]]
  });

  for await (const email of emails) {
    email.sender = formatParticipant(email, "sender");
    email.recipient = formatParticipant(email, "recipient");
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