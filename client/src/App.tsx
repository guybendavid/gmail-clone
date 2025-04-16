import { BrowserRouter } from "react-router-dom";
import AppRouter from "AppRouter/AppRouter";
import "styles/global-styles.css";

const App = () => {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
