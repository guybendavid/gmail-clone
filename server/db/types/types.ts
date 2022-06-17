export type User = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  password: string;
};

export type DBEmail = {
  id: string;
  subject: string;
  content: string;
  sender: string,
  recipient: string;
};

export type ParticipantType = "sender" | "recipient";