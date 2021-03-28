import { FC } from "react";
import { Store, useStore } from "store/store";
import { Email } from "interfaces/interfaces";
import { Checkbox } from "@material-ui/core";

interface Props {
  email: Email;
}

const EmailCheckbox: FC<Props> = ({ email }) => {
  const selectedEmails = useStore((state: Store) => state.selectedEmails);
  const setSelectedEmails = useStore((state: Store) => state.setSelectedEmails);

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