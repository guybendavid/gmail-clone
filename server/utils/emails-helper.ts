import { GraphQLError } from "graphql";
import { alias } from "drizzle-orm/pg-core";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "#root/server/db/connection";
import { emails, users } from "#root/server/db/schema";
import type { DBEmail, ParticipantType } from "#root/server/types/types";

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
    throw new GraphQLError("Please send a valid email", {
      extensions: { code: "UNAUTHENTICATED" }
    });
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

const formatDBEmailsToApiShape = (emailsList: GetEmailsWithParticipantsNameQueryResponse) =>
  emailsList.map((email) => ({
    ...email,
    sender: { email: email.sender_email, fullName: email.sender_full_name },
    recipient: { email: email.recipient_email, fullName: email.recipient_full_name }
  }));

const formatNewEmailParticipant = async (newEmail: DBEmail, participantType: ParticipantType) => {
  const emailAddress = newEmail[participantType];
  return { email: emailAddress, fullName: await getFullNameByEmail(emailAddress) };
};

const getFullNameByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) return "";
  return `${user.firstName} ${user.lastName}`;
};
