import { useContext } from "react";
import GameCard from "../components/GameCard";
import DataContext from "../context/DataContext";

function Home() {
  const { searchResult } = useContext(DataContext);
  if (!searchResult) {
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100px', 
            color: '#888', 
            fontSize: '1.2rem'
        }}>
            Loading...
        </div>
    );
}
  return (
    <>
      <div className="Home">
        {searchResult.map((game) => (
          <GameCard
            key={game.id}
            imgSrc={game.background_image}
            gameName={game.name}
            id={game.id}
          />
        ))}
      </div>
    </>
  );
}

export default Home;
