import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Nav from "./Nav";
import GameDetails from "./GameDetails";
import { DataProvider } from "./context/DataContext";

function App() {
  return (
    <div className="App">
      <Header title="GameVault" />
      <DataProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="detail/:id" element={<GameDetails />} />
        </Routes>
      </DataProvider>
      <Footer />
    </div>
  );
}

export default App;
