import { AppContextProvider } from "contexts/AppContext";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "AppRouter/AppRouter";
import "styles/Style.scss";

const App = () => {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppContextProvider>
  );
};

export default App;