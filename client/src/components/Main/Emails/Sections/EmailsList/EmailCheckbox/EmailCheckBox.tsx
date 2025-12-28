import { useEmailsStore } from "stores/emails-store";
import { SectionEmail } from "types/types";
import { Checkbox } from "@material-ui/core";

type Props = {
  email: SectionEmail;
};

export const EmailCheckbox = ({ email }: Props) => {
  const { selectedEmails, setSelectedEmails } = useEmailsStore((state) => state);
  const selectedEmail = selectedEmails.find((selectedEmail: SectionEmail) => selectedEmail.id === email.id);
  const isChecked = Boolean(selectedEmail);

  const setEmailAsSelected = (email: SectionEmail) => {
    const index = selectedEmails.findIndex((selectedEmail: SectionEmail) => selectedEmail.id === email.id);

    if (index > -1) {
      const newArr = [...selectedEmails];
      newArr.splice(index, 1);
      setSelectedEmails(newArr);
      return;
    }

    setSelectedEmails([...selectedEmails, email]);
  };

  return (
    <Checkbox
      checked={isChecked}
      onClick={(e) => e.stopPropagation()}
      onChange={() => setEmailAsSelected(email)}
      inputProps={{ "aria-label": "uncontrolled-checkbox" }}
      size="small"
    />
  );
};
