import React, { useContext } from "react";
import { AppContext } from "../../../../contexts/AppContext";
import { AppBar, Dialog, Toolbar, IconButton, Typography, Slide } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import CloseIcon from '@material-ui/icons/Close';
import ComposeForm from "../ComposeForm/ComposeForm";
import "./ComposeDialog.scss";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement; },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ComposeDialog = () => {
  const { isComposeOpened, setIsComposeOpened } = useContext(AppContext);

  return (
    <>
      <Dialog fullScreen open={isComposeOpened} onClose={() => setIsComposeOpened(false)} TransitionComponent={Transition}
        className="compose-dialog">
        <AppBar position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setIsComposeOpened(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className="title">Compose</Typography>
          </Toolbar>
        </AppBar>
        <ComposeForm />
      </Dialog>
    </>
  );
};

export default ComposeDialog;