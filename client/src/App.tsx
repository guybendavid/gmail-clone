import { useState } from "react";
import { AppContextProvider } from "contexts/AppContext";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "AppRouter/AppRouter";
import "styles/Style.scss";

const App = () => {
  const [history, setHistory] = useState({});

  return (
    <AppContextProvider history={history}>
      <BrowserRouter>
        <AppRouter setHistory={setHistory} />
      </BrowserRouter>
    </AppContextProvider>
  );
};

export default App;