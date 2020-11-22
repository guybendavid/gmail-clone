import React, { useContext } from "react";
import { AppContext } from "../../../contexts/AppContext";
import ComposeDialog from "./ComposeDialog/ComposeDialog";
import ComposeModal from "./ComposeModal/ComposeModal";

const Compose = () => {
  const { isSmallScreen } = useContext(AppContext);

  return (
    <>
      {isSmallScreen ? <ComposeDialog /> : <ComposeModal />}
    </>
  );
};

export default Compose;