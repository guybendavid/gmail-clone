import { useMediaQuery } from "@material-ui/core";

export const useIsSmallScreen = () => {
  const isSmallScreen = useMediaQuery("(max-width:765px)");
  return { isSmallScreen };
};
