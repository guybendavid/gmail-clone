interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
}

interface Email {
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
}

export { User, Email };