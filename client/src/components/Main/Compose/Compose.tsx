import { useContext } from "react";
import { AppContext, AppContextType } from "contexts/AppContext";
import ComposeDialog from "./ComposeDialog/ComposeDialog";
import ComposeModal from "./ComposeModal/ComposeModal";

const Compose = () => {
  const { isSmallScreen } = useContext(AppContext) as AppContextType;

  return (
    <>
      {isSmallScreen ? <ComposeDialog /> : <ComposeModal />}
    </>
  );
};

export default Compose;