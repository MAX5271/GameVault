import GameCard from "./GameCard";
import useHorizontalScroll from "../../hooks/useHorizontalScroll";
import styles from "./RecentlyViewedStrip.module.css";

function RecentlyViewedStrip({ games, onOpen }) {
  const { ref, canScrollLeft, canScrollRight, scrollLeft, scrollRight } = useHorizontalScroll([
    games?.length,
  ]);

  if (!games || games.length === 0) return null;

  return (
    <div className={styles.strip}>
      <h2 className={styles.heading}>Recently Viewed</h2>
      <div className={styles.rowWrapper}>
        {canScrollLeft && (
          <button type="button" className={`${styles.scrollBtn} ${styles.scrollBtnLeft}`} onClick={scrollLeft} aria-label="Scroll left">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        )}
        <div className={styles.row} ref={ref}>
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
        {canScrollRight && (
          <button type="button" className={`${styles.scrollBtn} ${styles.scrollBtnRight}`} onClick={scrollRight} aria-label="Scroll right">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default RecentlyViewedStrip;
