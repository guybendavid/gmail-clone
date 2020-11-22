import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../contexts/AppContext";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import "./ErrorMessage.scss";

const ErrorMessage: React.FC = () => {
  const { error, clearError } = useContext(AppContext);
  const [open, setOpen] = useState(false);

  const closeError = () => {
    clearError();
    setOpen(false);
  };

  useEffect(() => {
    error ? setOpen(true) : closeError();

    // eslint-disable-next-line
  }, [error]);

  return (
    <>
      {error && <Snackbar open={open} autoHideDuration={3000} onClose={() => closeError()} className="error-message">
        <MuiAlert elevation={6} variant="filled" severity="error" onClose={() => closeError()}>{error}</MuiAlert>
      </Snackbar>}
    </>
  );
};

export default ErrorMessage;