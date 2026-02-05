import { useMutation } from "@apollo/client";
import { css } from "@emotion/css";
import { getFormValidationErrors } from "@guybendavid/utils";
import { IconButton, TablePagination } from "@material-ui/core";
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon
} from "@material-ui/icons";
import { useEmails } from "#root/client/hooks/use-emails";
import { getAuthData } from "#root/client/services/auth";
import { deleteEmailsFromCache } from "#root/client/services/emails-helper";
import { DELETE_EMAILS } from "#root/client/services/graphql";
import { useAppStore } from "#root/client/stores/app-store";
import { useEmailsStore } from "#root/client/stores/emails-store";
import type { SectionEmail } from "#root/client/types/types";

export const Actions = () => {
  const { loggedInUser } = getAuthData();
  const { emails } = useEmails();
  const { handleServerErrors, setSnackBarMessage } = useAppStore((state) => state);
  const { selectedEmails, setSelectedEmails, activeTab } = useEmailsStore((state) => state);
  const selectedEmailIds = selectedEmails.map((email: SectionEmail) => email.id);

  const [deleteEmails, { client }] = useMutation(DELETE_EMAILS, {
    onCompleted: () => {
      deleteEmailsFromCache({
        idsToDelete: selectedEmailIds,
        activeTab,
        loggedInUserEmail: loggedInUser.email,
        client
      });

      setSnackBarMessage({
        content: `Email${selectedEmails.length > 1 ? "s" : ""} deleted successfully`,
        severity: "info"
      });

      setSelectedEmails([]);
    },
    onError: (err) => handleServerErrors(err)
  });

  const deleteFunc = async () => {
    if (selectedEmailIds.length > 0) {
      const deleteEmailsPayload = { ids: selectedEmailIds };
      const { message: errorMessage } = getFormValidationErrors(deleteEmailsPayload);

      if (errorMessage) {
        setSnackBarMessage({ content: errorMessage, severity: "error" });
        return;
      }

      await deleteEmails({ variables: deleteEmailsPayload });
    }
  };

  return (
    <div className={actionsStyle}>
      <div className="left-side">
        {selectedEmails.length > 0 ? (
          <IconButton onClick={deleteFunc} className="delete-icon-wrapper">
            <DeleteIcon />
          </IconButton>
        ) : (
          [CheckBoxOutlineBlankIcon, RefreshIcon, MoreVertIcon].map((Icon, index) => (
            <IconButton key={index}>
              <Icon fontSize="small" />
            </IconButton>
          ))
        )}
      </div>
      <div className="right-side">
        <TablePagination
          component="div"
          count={emails.length || 0}
          page={0}
          onPageChange={() => null}
          rowsPerPage={1000}
          rowsPerPageOptions={[]}
        />
      </div>
    </div>
  );
};

const actionsStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 2px;

  @media only screen and (max-width: 765px) {
    padding: 10px 13px;
  }

  .delete-icon-wrapper {
    padding-left: 10px;
  }
`;
