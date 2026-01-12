import { Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import GameDetails from "./pages/GameDetails";
import Register from "./pages/Register";
import { DataProvider } from "./context/DataContext";
import Login from "./pages/Login";

 const LayoutWithNav = () => {
    return <>
      <Nav />
      <Outlet/>
    </>
  }

function App() {
  return (
    <div className="App">
      <Header title="GameVault" />
      <DataProvider>
        <Routes>
          <Route element={<LayoutWithNav/>}>
          <Route path="/" element={<Home/>} />
          <Route path="detail/:id" element={<GameDetails />} />
          </Route>
          <Route path='register' element={<Register/>}/>
          <Route path='login' element={<Login/>}/>
        </Routes>
      </DataProvider>
      <Footer />
    </div>
  );
}

export default App;
