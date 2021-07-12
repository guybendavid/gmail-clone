interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
}

interface Email {
  sender: string;
  recipient: string;
  subject: string;
  content: string;
}

interface SendEmailPayload {
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  content: string;
  isSenderNameInClient?: boolean;
  isRecipientNameInClient?: boolean;
}

type ParticipantType = "sender" | "recipient";

export { User, Email, SendEmailPayload, ParticipantType };