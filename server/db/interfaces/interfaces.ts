interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
};

interface Email {
  sender: string;
  recipient: string;
  subject: string;
  content: string;
};

interface SendEmailPayload {
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  content: string;
};

export { User, Email, SendEmailPayload };