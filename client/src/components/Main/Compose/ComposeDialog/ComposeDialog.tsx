import { forwardRef, ReactElement, Ref } from "react";
import { Store, useStore } from "store/store";
import { AppBar, Dialog, Toolbar, IconButton, Typography, Slide } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import CloseIcon from '@material-ui/icons/Close';
import ComposeForm from "../ComposeForm/ComposeForm";
import "./ComposeDialog.scss";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement; },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ComposeDialog = () => {
  const isComposeOpened = useStore((state: Store) => state.isComposeOpened);
  const setIsComposeOpened = useStore((state: Store) => state.setIsComposeOpened);

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