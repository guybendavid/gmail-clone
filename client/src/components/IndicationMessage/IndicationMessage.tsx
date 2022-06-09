import { useState, useEffect } from "react";
import { useAppStore, AppStore } from "stores/appStore";
import { sanitize } from "dompurify";
import { classNamesGenerator } from "@guybendavid/utils";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import "./IndicationMessage.scss";

const anchorOrigin: SnackbarOrigin = { vertical: "bottom", horizontal: "left" };

const IndicationMessage = () => {
  const snackBarMessage = useAppStore((state: AppStore) => state.snackBarMessage);
  const clearSnackBarMessage = useAppStore((state: AppStore) => state.clearSnackBarMessage);
  const { content, severity } = snackBarMessage;
  const [open, setOpen] = useState(false);

  const closeMessage = () => {
    clearSnackBarMessage();
    setOpen(false);
  };

  useEffect(() => {
    content ? setOpen(true) : closeMessage();
    // eslint-disable-next-line
  }, [content]);

  return (
    <>
      {content && <Snackbar className={classNamesGenerator("indication-message", severity === "error" && "is-error")}
        anchorOrigin={anchorOrigin} open={open} autoHideDuration={5000} onClose={closeMessage}>
        <MuiAlert elevation={6} variant="filled" severity={severity} onClose={closeMessage}>
          <div dangerouslySetInnerHTML={{ __html: sanitize(content) }}></div>
        </MuiAlert>
      </Snackbar>}
    </>
  );
};

export default IndicationMessage;