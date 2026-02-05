import { ComposeDialog } from "#root/client/components/Main/Compose/ComposeDialog/ComposeDialog";
import { ComposeModal } from "#root/client/components/Main/Compose/ComposeModal/ComposeModal";
import { useIsSmallScreen } from "#root/client/hooks/use-is-small-screen";

export const Compose = () => {
  const { isSmallScreen } = useIsSmallScreen();

  return <>{isSmallScreen ? <ComposeDialog /> : <ComposeModal />}</>;
};
