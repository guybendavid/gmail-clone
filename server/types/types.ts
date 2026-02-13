export type User = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  password: string;
};

export type DBEmail = {
  id: number;
  subject: string;
  content: string;
  sender: string;
  recipient: string;
  createdAt: Date;
};

export type ParticipantType = "sender" | "recipient";

export type ContextUser = Omit<User, "image" | "password">;
