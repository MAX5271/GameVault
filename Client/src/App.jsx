import { Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import GameDetails from "./pages/GameDetails";
import Register from "./pages/Register";
import DataContext, { DataProvider } from "./context/DataContext";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PersistLogin from "./components/PersistLogin";
import { useContext } from "react";

const LayoutWithNav = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

function App() {
  const { user } = useContext(DataContext);
  console.log(JSON.stringify(user));

  return (
    <div className="App">
      <DataProvider>
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
        </Routes>
      </DataProvider>
      <Footer />
    </div>
  );
}

export default App;
