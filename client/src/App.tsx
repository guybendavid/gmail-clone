import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useAppStore, AppStore } from "stores/appStore";
import AppRouter from "AppRouter/AppRouter";
import "styles/Style.scss";

const App = () => {
  const logout = useAppStore((state: AppStore) => state.logout);

  useEffect(() => {
    const handleChangesInLocalStorage = (e: any) => {
      const authKeys = ["loggedInUser", "token"];
      const { oldValue, newValue } = e;

      if (localStorage.length === 0 || (authKeys.includes(e.key) && newValue !== oldValue)) {
        logout();
      }
    };

    window.addEventListener('storage', handleChangesInLocalStorage);
    return () => window.removeEventListener("storage", handleChangesInLocalStorage);
    // eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;