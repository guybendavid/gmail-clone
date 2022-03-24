interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
}

interface Participant {
  email: string;
  fullName: string;
}

interface DBEmail {
  sender_email: string;
  recipient_email: string;
  sender_full_name: string;
  recipient_full_name: string;
  subject: string;
  content: string;
}

interface EmailResponse extends Pick<DBEmail, "subject" | "content"> {
  sender: Participant,
  recipient: Participant;
}

interface SendEmailPayload {
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  content: string;
}

type ParticipantType = "sender" | "recipient";

export { User, DBEmail, EmailResponse, SendEmailPayload, ParticipantType };