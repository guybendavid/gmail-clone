import ComposeDialog from "./ComposeDialog/ComposeDialog";
import ComposeModal from "./ComposeModal/ComposeModal";
import useIsSmallScreen from "hooks/use-is-small-screen";

const Compose = () => {
  const { isSmallScreen } = useIsSmallScreen();

  return (
    <>
      {isSmallScreen ? <ComposeDialog /> : <ComposeModal />}
    </>
  );
};

export default Compose;