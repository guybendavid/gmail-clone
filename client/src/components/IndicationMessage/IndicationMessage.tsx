import { useState, useEffect } from "react";
import { useAppStore } from "stores/app-store";
import type { SnackbarProps } from "@material-ui/core/Snackbar";
import { css, cx } from "@emotion/css";
import Snackbar from "@material-ui/core/Snackbar";
import dompurify from "dompurify";
import MuiAlert from "@material-ui/lab/Alert";

const { sanitize } = dompurify;
const anchorOrigin: SnackbarProps["anchorOrigin"] = { vertical: "bottom", horizontal: "left" };

export const IndicationMessage = () => {
  const { snackBarMessage, clearSnackBarMessage } = useAppStore((state) => state);
  const { content, severity } = snackBarMessage;
  const [open, setOpen] = useState(false);

  const closeMessage = () => {
    clearSnackBarMessage();
    setOpen(false);
  };

  useEffect(() => {
    if (content) {
      setOpen(true);
      return;
    }

    closeMessage();
  }, [content]);

  return (
    <>
      {content && (
        <Snackbar
          className={cx(indicationMessageStyle, severity === "error" && "is-error")}
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={5000}
          onClose={closeMessage}
        >
          <MuiAlert elevation={6} variant="filled" severity={severity} onClose={closeMessage}>
            <div dangerouslySetInnerHTML={{ __html: sanitize(content) }}></div>
          </MuiAlert>
        </Snackbar>
      )}
    </>
  );
};

const indicationMessageStyle = css`
  z-index: 100000 !important;

  &:not(.is-error) {
    .MuiPaper-root {
      background: #202124;
    }
  }
`;
