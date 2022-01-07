import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { Email } from "interfaces/interfaces";
import { Checkbox } from "@material-ui/core";

interface Props {
  email: Email;
}

const EmailCheckbox = ({ email }: Props) => {
  const selectedEmails = useEmailsStore((state: EmailsStore) => state.selectedEmails);
  const setSelectedEmails = useEmailsStore((state: EmailsStore) => state.setSelectedEmails);

  const selectedEmail = selectedEmails.find((selectedEmail: Email) => selectedEmail.id === email.id);
  const checked = selectedEmail ? true : false;

  const setEmailAsSelected = (email: Email) => {
    const index = selectedEmails.findIndex((selectedEmail: Email) => selectedEmail.id === email.id);

    if (index > -1) {
      const newArr = [...selectedEmails];
      newArr.splice(index, 1);
      setSelectedEmails(newArr);
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  return (
    <Checkbox
      checked={checked}
      onClick={(e) => e.stopPropagation()}
      onChange={() => setEmailAsSelected(email)}
      inputProps={{ 'aria-label': 'uncontrolled-checkbox' }}
      size="small" />
  );
};

export default EmailCheckbox;