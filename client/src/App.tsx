import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "AppRouter/AppRouter";
import "styles/global-styles.css";

export const App = () => (
  <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
);
