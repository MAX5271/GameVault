import { useContext } from "react";
import GameCard from "../components/GameCard";
import DataContext from "../context/DataContext";
import styles from "./Home.module.css";

function Home() {
  const { searchResult } = useContext(DataContext);

  if (!searchResult) {
    return (
        <div className={styles.loading}>
            Loading...
        </div>
    );
  }

  return (
    <div className={styles.home}>
      {searchResult.map((game) => (
        <GameCard
          key={game.id}
          imgSrc={game.background_image}
          gameName={game.name}
          id={game.id}
        />
      ))}
    </div>
  );
}

export default Home;