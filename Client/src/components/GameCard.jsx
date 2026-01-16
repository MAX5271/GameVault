import { useNavigate } from "react-router-dom";
import styles from "./GameCard.module.css";

function GameCard({ imgSrc, gameName, id }) {
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/detail/${id}`)}>
      <img src={imgSrc} alt={gameName} className={styles.image} />
      <p className={styles.name}>{gameName}</p>
    </div>
  );
}

export default GameCard;