import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "#root/client/components/AppRouter/AppRouter";
import "#root/client/styles/global-styles.css";

export const App = () => (
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
);
