import GameCard from "./GameCard";
import styles from "./RecentlyViewedStrip.module.css";

function RecentlyViewedStrip({ games, onOpen }) {
  if (!games || games.length === 0) return null;

  return (
    <div className={styles.strip}>
      <h2 className={styles.heading}>Recently Viewed</h2>
      <div className={styles.row}>
        {games.map((game) => (
          <div key={game.id} className={styles.item}>
            <GameCard
              imgSrc={game.background_image}
              gameName={game.name}
              metacritic={game.metacritic}
              onClick={() => onOpen(game.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewedStrip;
