import { Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Nav from "./components/layout/Nav";
import PersistLogin from "./components/auth/PersistLogin";
import BackgroundVideo from "./components/ui/BackgroundVideo";
import Home from "./pages/main/Home";
import GameDetails from "./pages/game/GameDetails";
import Register from "./pages/auth/Register";
import { DataProvider } from "./context/DataContext";
import Login from "./pages/auth/Login";
import Profile from "./pages/user/Profile";
import { SearchProvider } from "./context/SearchContext";

const LayoutWithNav = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <div className="App">
        <BackgroundVideo/>
      <DataProvider>
          <SearchProvider>
        <Header title="GameVault" />
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
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
          </SearchProvider>
      </DataProvider>
      <Footer />
    </div>
  );
}

export default App;
