import { useAppStore, AppStore } from "stores/appStore";
import { useEmailsStore, EmailsStore } from "stores/emailsStore";
import { Email } from "interfaces/interfaces";
import { useMutation, ApolloError } from "@apollo/client";
import { getAuthData } from "services/auth";
import { DELETE_EMAILS } from "services/graphql";
import { deleteEmailsFromCache } from "services/emails-helper";
import { IconButton, TablePagination } from "@material-ui/core";
import useEmails from "hooks/use-emails";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./Actions.scss";

const Actions = () => {
  const { loggedInUser } = getAuthData();
  const { emails } = useEmails();
  const handleErrors = useAppStore((state: AppStore) => state.handleErrors);
  const setSnackBarMessage = useAppStore((state: AppStore) => state.setSnackBarMessage);
  const selectedEmails = useEmailsStore((state: EmailsStore) => state.selectedEmails);
  const setSelectedEmails = useEmailsStore((state: EmailsStore) => state.setSelectedEmails);
  const activeTab = useEmailsStore((state: EmailsStore) => state.activeTab);
  const [deleteEmails, { client }] = useMutation(DELETE_EMAILS);
  const ids = selectedEmails.map((email: Email) => email.id);

  const deleteFunc = async () => {
    if (ids.length > 0) {
      try {
        await deleteEmails({ variables: { ids } });
        deleteEmailsFromCache(ids, activeTab, loggedInUser?.email, client);
        setSnackBarMessage({ content: `Email${selectedEmails.length > 1 ? "s" : ""} deleted successfully`, severity: "info" });
        setSelectedEmails([]);
      } catch (err) {
        handleErrors(err as ApolloError);
      }
    }
  };

  return (
    <div className="actions">
      <div className="left-side">
        {selectedEmails?.length > 0 ?
          <IconButton onClick={deleteFunc} className="delete-icon">
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