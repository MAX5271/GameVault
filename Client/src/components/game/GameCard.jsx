import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./GameCard.module.css";

function GameCard({ imgSrc, gameName, metacritic, onClick }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const getScoreColor = (score) => {
    if (!score) return "#888";
    if (score >= 75) return "#66cc33";
    if (score >= 50) return "#ffcc33";
    return "#ff4d4d";
  };

  const badgeColor = getScoreColor(metacritic);

  return (
    <motion.div
      className={styles.card}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover="hover"
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className={styles.imageContainer}>
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              className={styles.skeleton}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        <motion.img
          src={imgSrc}
          alt={gameName}
          className={styles.image}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          variants={{
            hover: { scale: 1.1 },
          }}
          transition={{ duration: 0.4 }}
        />

        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          {metacritic && (
            <motion.span
              className={styles.metacriticBadge}
              style={{
                borderColor: badgeColor,
                color: badgeColor,
                boxShadow: `0 0 10px ${badgeColor}40`,
              }}
              whileHover={{ scale: 1.1, backgroundColor: `${badgeColor}20` }}
            >
              {metacritic}
            </motion.span>
          )}
        </div>

        <div className={styles.info}>
          <motion.h3
            className={styles.name}
            variants={{
              hover: { y: -5 },
            }}
          >
            {gameName}
          </motion.h3>
          
          <motion.div 
            className={styles.cta}
            variants={{
                hover: { opacity: 1, y: 0 }
            }}
            initial={{ opacity: 0, y: 10 }}
          >
            View Details
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default GameCard;