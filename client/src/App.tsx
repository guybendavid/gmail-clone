import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorageTracker from "hooks/use-local-storage-tracker";
import AppRouter from "AppRouter/AppRouter";
import "styles/Style.scss";

const App = () => {
  const { listen: listenToChangesInLS } = useLocalStorageTracker();

  useEffect(() => {
    listenToChangesInLS();
    // eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;