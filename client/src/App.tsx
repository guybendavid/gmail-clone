import { useState } from "react";
import { AppContextProvider } from "contexts/AppContext";
import { BrowserRouter } from "react-router-dom";
import { History, LocationState } from "history";
import AppRouter from "AppRouter/AppRouter";
import "styles/Style.scss";

export type HistoryType = History<LocationState>;

const App = () => {
  const [history, setHistory] = useState<HistoryType>();

  return (
    <AppContextProvider history={history}>
      <BrowserRouter>
        <AppRouter setHistory={setHistory} />
      </BrowserRouter>
    </AppContextProvider>
  );
};

export default App;