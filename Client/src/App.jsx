import { Outlet, Route, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import TopBar from "./components/layout/TopBar";
import PersistLogin from "./components/auth/PersistLogin";
import ToastContainer from "./components/ui/ToastContainer";
import Home from "./pages/main/Home";
import NotFound from "./pages/main/NotFound";
import GameDetails from "./pages/game/GameDetails";
import Register from "./pages/auth/Register";
import { DataProvider } from "./context/DataContext";
import Login from "./pages/auth/Login";
import Profile from "./pages/user/Profile";
import { SearchProvider } from "./context/SearchContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import styles from "./App.module.css";

const LayoutWithNav = () => {
  return <Outlet />;
};

const AppShell = () => {
  return (
    <div className="App">
      <TopBar />
      <div className={styles.centerColumn}>
        <Routes>
          <Route element={<PersistLogin />}>
            <Route element={<LayoutWithNav />}>
              <Route path="/" element={<Home />} />
              <Route path="detail/:id" element={<GameDetails />} />
            </Route>
            <Route path="profile/:username" element={<Profile />} />
          </Route>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <ToastProvider>
          <SearchProvider>
            <AppShell />
          </SearchProvider>
        </ToastProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
