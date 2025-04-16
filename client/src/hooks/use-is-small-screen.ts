import { useMediaQuery } from "@material-ui/core";

const useIsSmallScreen = () => {
  const isSmallScreen = useMediaQuery("(max-width:765px)");
  return { isSmallScreen };
};

export default useIsSmallScreen;
