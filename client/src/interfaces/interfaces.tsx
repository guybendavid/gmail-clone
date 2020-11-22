interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: string;
  token?: string;
}

interface Email {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  createdAt: string;
}

export type { User, Email };