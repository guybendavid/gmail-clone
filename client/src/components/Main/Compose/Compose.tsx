import { ComposeDialog } from "./ComposeDialog/ComposeDialog";
import { ComposeModal } from "./ComposeModal/ComposeModal";
import { useIsSmallScreen } from "hooks/use-is-small-screen";

export const Compose = () => {
  const { isSmallScreen } = useIsSmallScreen();

  return <>{isSmallScreen ? <ComposeDialog /> : <ComposeModal />}</>;
};
