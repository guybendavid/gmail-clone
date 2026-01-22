import type { DBEmail, ParticipantType } from "../types/types";
import { db } from "../db/connection";
import { emails, users } from "../db/schema";
import { AuthenticationError } from "apollo-server";
import { alias } from "drizzle-orm/pg-core";
import { desc, eq, sql } from "drizzle-orm";

type GetEmailsByParticipantType = {
  loggedInUserEmail: string;
  participantType: ParticipantType;
};

type GetEmailsWithParticipantsNameQueryResponse = {
  id: number;
  sender_email: string;
  recipient_email: string;
  sender_full_name: string;
  recipient_full_name: string;
  subject: string;
  content: string;
  createdAt: Date;
}[];

export const getEmailsByParticipantType = async ({
  loggedInUserEmail,
  participantType
}: GetEmailsByParticipantType) => {
  if (!loggedInUserEmail) {
    throw new AuthenticationError("Please send a valid email");
  }

  const senderUser = alias(users, "users_sender");
  const recipientUser = alias(users, "users_recipient");

  const emailsResult: GetEmailsWithParticipantsNameQueryResponse = await db
    .select({
      id: emails.id,
      subject: emails.subject,
      content: emails.content,
      createdAt: emails.createdAt,
      sender_email: senderUser.email,
      recipient_email: recipientUser.email,
      sender_full_name: sql<string>`concat(${senderUser.firstName}, ' ', ${senderUser.lastName})`,
      recipient_full_name: sql<string>`concat(${recipientUser.firstName}, ' ', ${recipientUser.lastName})`
    })
    .from(emails)
    .innerJoin(senderUser, eq(emails.sender, senderUser.email))
    .innerJoin(recipientUser, eq(emails.recipient, recipientUser.email))
    .where(
      participantType === "sender" ? eq(emails.sender, loggedInUserEmail) : eq(emails.recipient, loggedInUserEmail)
    )
    .orderBy(desc(emails.createdAt));

  return formatDBEmailsToApiShape(emailsResult);
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
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) return "";
  return `${user.firstName} ${user.lastName}`;
};
