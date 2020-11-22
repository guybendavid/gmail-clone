import { Email, User } from "../db/interfaces/interfaces";

const validateRegisterObj = ({ firstName, lastName, email, password }: User) => {
  const errors = [];

  if (!firstName) {
    errors.push("First Name must not be empty");
  }

  if (!lastName) {
    errors.push("Last Name must not be empty");
  }

  if (!email) {
    errors.push("email must not be empty");
  }

  if (!password) {
    errors.push("Password must not be empty");
  }

  return { errors, isValid: errors.length === 0 };
};

const validateLoginObj = ({ email, password }: User) => {
  const errors = [];

  if (!email) {
    errors.push("email must not be empty");
  }

  if (!password) {
    errors.push("Password must not be empty");
  }

  return { errors, isValid: errors.length === 0 };
};

const validateEmailObj = ({ recipientId, subject, content }: Email) => {
  const errors = [];

  if (!recipientId) {
    errors.push("RecipientId must not be empty");
  }

  if (!subject) {
    errors.push("Subject must not be empty");
  }

  if (!content) {
    errors.push("Content must not be empty");
  }

  return { errors, isValid: errors.length === 0 };
};

export { validateLoginObj, validateRegisterObj, validateEmailObj };