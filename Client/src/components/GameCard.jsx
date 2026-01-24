import styles from "./GameCard.module.css";
import { useState } from "react";

function GameCard({ imgSrc, gameName, metacritic, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const getScoreColor = (score) => {
    if (!score) return "#ccc";
    if (score >= 75) return "#66cc33";
    if (score >= 50) return "#ffcc33";
    return "#ff0000";
  };

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

      {metacritic && (
        <div 
          className={styles.metacriticBadge}
          style={{ 
            borderColor: getScoreColor(metacritic),
            color: getScoreColor(metacritic)
          }}
        >
          {metacritic}
        </div>
      )}

      <p className={styles.name}>{gameName}</p>
    </div>
  );
}

export default GameCard;