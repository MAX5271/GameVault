import styles from "./GameListItem.module.css";

function GameListItem({ imgSrc, gameName, onClick }) {
  return (
    <div className={styles.gameListItem} onClick={onClick}>
      <img src={imgSrc} alt={gameName} className={styles.gameImage} />
      <div className={styles.gameInfo}>
        <h3 className={styles.gameName}>{gameName}</h3>
      </div>
    </div>
  );
}

export default GameListItem;