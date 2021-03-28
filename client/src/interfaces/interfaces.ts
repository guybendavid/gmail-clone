interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image: string;
  token?: string;
};

interface Email {
  id: string;
  sender?: Participant;
  recipient?: Participant;
  subject: string;
  content: string;
  createdAt: string;
};

interface Participant {
  email: string;
  fullName: string;
};

export type { User, Email, Participant };