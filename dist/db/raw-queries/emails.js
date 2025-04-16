"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailsWithParticipantsName = void 0;
const getEmailsWithParticipantsName = (particapntType) => {
    return `
  select emails.id,
  emails.subject,
  emails.content, 
  emails.created_at as "createdAt",
  users_sender.email as sender_email, 
	users_recipient.email as recipient_email,
	concat(users_sender.first_name, ' ', users_sender.last_name) as sender_full_name,
	concat(users_recipient.first_name, ' ', users_recipient.last_name) as recipient_full_name
  from public.emails
  inner join public.users as users_sender on emails.sender = users_sender.email
  inner join public.users as users_recipient on emails.recipient = users_recipient.email
  where ${particapntType === "sender" ? "emails.sender = ?" : "emails.recipient = ?"}
  order by "createdAt" desc`;
};
exports.getEmailsWithParticipantsName = getEmailsWithParticipantsName;
