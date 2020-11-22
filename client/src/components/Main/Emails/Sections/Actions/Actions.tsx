import React, { useContext } from "react";
import { AppContext } from "../../../../../contexts/AppContext";
import { Email } from "../../../../../interfaces/interfaces";
import { useMutation } from "@apollo/client";
import { DELETE_EMAILS } from "../../../../../services/graphql";
import { IconButton, TablePagination } from "@material-ui/core";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DeleteIcon from '@material-ui/icons/Delete';
import RefreshIcon from '@material-ui/icons/Refresh';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./Actions.scss";

interface Props {
  displayedEmails: Email[];
}

const Actions: React.FC<Props> = ({ displayedEmails }) => {
  const { selectedEmails, setSelectedEmails, refetchEmails } = useContext(AppContext);
  const [deleteEmails] = useMutation(DELETE_EMAILS);
  const ids = selectedEmails.map((email: Email) => email.id);

  const deleteFunc = async () => {
    if (ids.length > 0) {
      await deleteEmails({ variables: { ids } });
      refetchEmails();
      setSelectedEmails([]);
    }
  };

  return (
    <div className="actions">
      <div className="left-side">
        {selectedEmails?.length > 0 ?
          <IconButton onClick={deleteFunc}>
            <DeleteIcon />
          </IconButton>
          :
          [CheckBoxOutlineBlankIcon, RefreshIcon, MoreVertIcon].map((Icon, index) => (
            <React.Fragment key={index}>
              <IconButton>
                <Icon fontSize="small" />
              </IconButton>
            </React.Fragment>
          ))
        }
      </div>
      <div className="right-side">
        <TablePagination
          component="div"
          count={displayedEmails?.length || 0}
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