import { forwardRef, ReactElement, Ref } from "react";
import { useEmailsStore } from "stores/emails-store";
import { css } from "@emotion/css";
import { AppBar, Dialog, Toolbar, IconButton, Typography, Slide } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { Close as CloseIcon } from "@material-ui/icons";
import { ComposeForm } from "../ComposeForm/ComposeForm";

const Transition = forwardRef((props: TransitionProps & { children?: ReactElement }, ref: Ref<unknown>) => (
  <Slide direction="up" ref={ref} {...props} />
));

export const ComposeDialog = () => {
  const { isComposeOpen, setIsComposeOpen } = useEmailsStore((state) => state);

  return (
    <Dialog
      fullScreen={true}
      className={composeDialogStyle}
      TransitionComponent={Transition}
      open={isComposeOpen}
      onClose={() => setIsComposeOpen(false)}
    >
      <AppBar position="relative">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setIsComposeOpen(false)} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className="title">
            Compose
          </Typography>
        </Toolbar>
      </AppBar>
      <ComposeForm />
    </Dialog>
  );
};

const composeDialogStyle = css`
  .title {
    flex: 1;
    margin-left: 16px;
  }
`;
