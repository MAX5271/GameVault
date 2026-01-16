import { useNavigate } from "react-router-dom";
import styles from "./GameListItem.module.css";

function GameListItem({ imgSrc, gameName, id }) {
  const navigate = useNavigate();

  return (
    <div className={styles.container} onClick={() => navigate(`/detail/${id}`)}>
      <img src={imgSrc} alt={gameName} className={styles.image} />
      <span className={styles.name}>{gameName}</span>
    </div>
  );
}

export default GameListItem;