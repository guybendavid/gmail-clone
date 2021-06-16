import { useContext } from "react";
import { AppContext, AppContextType } from "contexts/AppContext";
import { Store, useStore } from "store/store";
import { Email, User } from "interfaces/interfaces";
import { useMutation } from "@apollo/client";
import { DELETE_EMAILS } from "services/graphql";
import { deleteEmailsFromCache } from "services/emailsHelper";
import { IconButton, TablePagination } from "@material-ui/core";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./Actions.scss";

const Actions = () => {
  const { emails, handleErrors } = useContext(AppContext) as AppContextType;
  const loggedInUser = useStore((state: Store) => state.loggedInUser as User);
  const setSnackBarMessage = useStore((state: Store) => state.setSnackBarMessage);
  const selectedEmails = useStore((state: Store) => state.selectedEmails);
  const setSelectedEmails = useStore((state: Store) => state.setSelectedEmails);
  const activeTab = useStore((state: Store) => state.activeTab);
  
  const [deleteEmails, { client }] = useMutation(DELETE_EMAILS);
  const ids = selectedEmails.map((email: Email) => email.id);

  const deleteFunc = async () => {
    if (ids.length > 0) {
      try {
        await deleteEmails({ variables: { ids } });
        deleteEmailsFromCache(ids, activeTab, loggedInUser.email, client);
        setSnackBarMessage({ content: `Email${selectedEmails.length > 1 ? "s" : ""} deleted successfully`, severity: "info" });
        setSelectedEmails([]);
      } catch (err) {
        handleErrors(err);
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