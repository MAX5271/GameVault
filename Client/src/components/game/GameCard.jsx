import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import styles from "./GameCard.module.css";

function GameCard({ imgSrc, gameName, metacritic, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const isLowScore = metacritic && metacritic < 50;

  return (
    <motion.button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`View details for ${gameName}`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      whileHover={prefersReducedMotion ? undefined : { x: -3, y: -3 }}
      whileTap={{ x: 0, y: 0 }}
    >
      <div className={styles.imageContainer}>
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              className={styles.skeleton}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        <img
          src={imgSrc}
          alt={gameName}
          className={styles.image}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
        />

        {metacritic && (
          <span className={`${styles.priceChip} ${isLowScore ? styles.lowScore : ""}`}>
            {metacritic}
          </span>
        )}
      </div>

      <div className={styles.caption}>
        <h3 className={styles.name}>{gameName}</h3>
        <span className={styles.subtitle}>VIEW DETAILS →</span>
      </div>
    </motion.button>
  );
}

export default GameCard;
