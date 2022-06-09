import { useAppStore, AppStore } from "stores/appStore";
import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { Email } from "interfaces/interfaces";
import { useMutation } from "@apollo/client";
import { getAuthData } from "services/auth";
import { DELETE_EMAILS } from "services/graphql";
import { deleteEmailsFromCache } from "services/emails-helper";
import { IconButton, TablePagination } from "@material-ui/core";
import { getFormValidationErrors } from "@guybendavid/utils";
import useEmails from "hooks/use-emails";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./Actions.scss";

const Actions = () => {
  const { loggedInUser } = getAuthData();
  const { emails } = useEmails();
  const handleServerErrors = useAppStore((state: AppStore) => state.handleServerErrors);
  const setSnackBarMessage = useAppStore((state: AppStore) => state.setSnackBarMessage);
  const selectedEmails = useEmailsStore((state: EmailsStore) => state.selectedEmails);
  const setSelectedEmails = useEmailsStore((state: EmailsStore) => state.setSelectedEmails);
  const activeTab = useEmailsStore((state: EmailsStore) => state.activeTab);

  const [deleteEmails, { client }] = useMutation(DELETE_EMAILS, {
    onError: (err) => handleServerErrors(err)
  });

  const ids = selectedEmails.map((email: Email) => email.id);

  const deleteFunc = async () => {
    if (ids.length > 0) {
      const deleteEmailsPayload = { ids };
      const { message: errorMessage } = getFormValidationErrors(deleteEmailsPayload);

      if (errorMessage) {
        setSnackBarMessage({ content: errorMessage, severity: "error" });
        return;
      }

      await deleteEmails({ variables: deleteEmailsPayload });
      deleteEmailsFromCache(ids, activeTab, loggedInUser.email, client);
      setSnackBarMessage({ content: `Email${selectedEmails.length > 1 ? "s" : ""} deleted successfully`, severity: "info" });
      setSelectedEmails([]);
    }
  };

  return (
    <div className="actions">
      <div className="left-side">
        {selectedEmails?.length > 0 ?
          <IconButton onClick={deleteFunc} className="delete-icon-wrapper">
            <DeleteIcon />
          </IconButton>
          :
          [CheckBoxOutlineBlankIcon, RefreshIcon, MoreVertIcon].map((Icon, index) => (
            <IconButton key={index}>
              <Icon fontSize="small" />
            </IconButton>
          ))}
      </div>
      <div className="right-side">
        <TablePagination
          component="div"
          count={emails?.length || 0}
          page={0}
          onChangePage={() => null}
          rowsPerPage={1000}
          rowsPerPageOptions={[]}
        />
      </div>
    </div>
  );
};

export default Actions;