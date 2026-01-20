import styles from "./GameCard.module.css";
import { useState } from "react";

function GameCard({ imgSrc, gameName, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={styles.card} onClick={onClick}>
      {!isLoaded && <div className={styles.placeholder} />}
      <img
        src={imgSrc}
        alt={gameName}
        className={styles.image}
        style={isLoaded ? {} : { display: "none" }}
        onLoad={() => setIsLoaded(true)}
      />
      <p className={styles.name}>{gameName}</p>
    </div>
  );
}

export default GameCard;