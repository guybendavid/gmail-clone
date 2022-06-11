export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
}

export interface DBEmail {
  id: string;
  sender_email: string;
  recipient_email: string;
  sender_full_name: string;
  recipient_full_name: string;
  subject: string;
  content: string;
}

export interface NewEmailResponse extends Pick<DBEmail, "subject" | "content"> {
  sender: string,
  recipient: string;
}

export interface SendEmailPayload {
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  content: string;
}

export type ParticipantType = "sender" | "recipient";