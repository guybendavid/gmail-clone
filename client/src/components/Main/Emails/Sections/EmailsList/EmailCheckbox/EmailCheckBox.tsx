import { useEmailsStore } from "stores/emailsStore";
import { SectionEmail } from "types/types";
import { Checkbox } from "@material-ui/core";

type Props = {
  email: SectionEmail;
};

const EmailCheckbox = ({ email }: Props) => {
  const { selectedEmails, setSelectedEmails } = useEmailsStore(state => state);
  const selectedEmail = selectedEmails.find((selectedEmail: SectionEmail) => selectedEmail.id === email.id);
  const checked = selectedEmail ? true : false;

  const setEmailAsSelected = (email: SectionEmail) => {
    const index = selectedEmails.findIndex((selectedEmail: SectionEmail) => selectedEmail.id === email.id);

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
      inputProps={{ "aria-label": "uncontrolled-checkbox" }}
      size="small" />
  );
};

export default EmailCheckbox;