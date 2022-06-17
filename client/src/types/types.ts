export type User = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  password: string;
};

export type Email = {
  id: string;
  sender: Participant;
  recipient: Participant;
  subject: string;
  content: string;
  createdAt: string;
};

export type SectionEmail = RecievedEmail | SentEmail;

type RecievedEmail = Omit<Email, "recipient">;
type SentEmail = Omit<Email, "sender">;

type Participant = {
  email: string;
  fullName: string;
};