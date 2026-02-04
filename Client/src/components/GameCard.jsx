import styles from "./GameCard.module.css";
import { useState } from "react";
import { motion } from "framer-motion";

function GameCard({ imgSrc, gameName, metacritic, onClick, cardVariants }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const getScoreColor = (score) => {
    if (!score) return "#ccc";
    if (score >= 75) return "#66cc33";
    if (score >= 50) return "#ffcc33";
    return "#ff0000";
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      className={styles.card}
      onClick={onClick}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {!isLoaded && <motion.div className={styles.placeholder} />}

      <img
        src={imgSrc}
        alt="../assets/ghostStock.eps"
        className={styles.image}
        style={isLoaded ? {} : { display: "none" }}
        onLoad={() => setIsLoaded(true)}
      />
      {metacritic && (
        <div
          className={styles.metacriticBadge}
          style={{
            borderColor: getScoreColor(metacritic),
            color: getScoreColor(metacritic),
          }}
        >
          {metacritic}
        </div>
      )}

      <p className={styles.name}>{gameName}</p>
    </motion.div>
  );
}

export default GameCard;
