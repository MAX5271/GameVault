import axios from "../api/axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataContext from "../context/DataContext";
import styles from "./GameDetails.module.css";

function GameDetails() {
  const { id } = useParams();
  const { user } = useContext(DataContext);
  
  const [gameData, setGameData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false); 
  const [loadingLibrary, setLoadingLibrary] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchGame = async () => {
      try {
        const res = await axios.get(`api/v1/game`, {
          params: { id: id },
          signal: controller.signal,
        });
        if (!res.status) throw new Error("Error while loading the game!");
        setGameData(res.data.response);
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.log(error.message);
        }
      }
    };

    fetchGame();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    
    const checkLibraryStatus = async () => {
      if (!user?.username || !user?.accessToken) {
        if (isMounted) setLoadingLibrary(false);
        return;
      }

      try {
        const response = await axios.get(`/api/v1/user/${user.username}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          withCredentials: true,
        });

        if (isMounted) {
          const wtpList = response.data.response.wantToPlay || [];
          const exists = wtpList.some(gameId => String(gameId) === String(id));
          setIsInLibrary(exists);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoadingLibrary(false);
      }
    };

    checkLibraryStatus();

    return () => { isMounted = false; };
  }, [id, user]);

  const handleWTP = async () => {
    if (!user?.accessToken) {
      navigate('/login');
      return;
    }

    const previousState = isInLibrary;
    setIsInLibrary(!previousState);

    try {
      if (previousState) {
        await axios.patch('/api/v1/user/removeW', 
          { gameId: id },
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
            withCredentials: true
          }
        );
      } else {
        await axios.patch('/api/v1/user/addW', 
          { gameId: id }, 
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
            withCredentials: true
          }
        );
      }
    } catch (error) {
      console.error(error);
      setIsInLibrary(previousState);
    }
  };

  const handleShowMore = () => {
    if (gameData.description_raw.length > 500) setShowMore(!showMore);
  };

  if (!gameData) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.gameDetailsContainer}>
      <div className={styles.heroSection}>
        <img
          src={gameData.background_image}
          alt={gameData.name}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}></div>
      </div>

      <div className={styles.contentBody}>
        <div className={styles.headerRow}>
          <h1 className={styles.gameTitle}>{gameData.name}</h1>
          
          <button 
            onClick={handleWTP} 
            disabled={loadingLibrary}
            style={{
                backgroundColor: isInLibrary ? '#ef4444' : '#646cff',
                color: 'white',
                padding: '0.8rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
            }}
          >
            {loadingLibrary ? "..." : isInLibrary ? "Remove from List" : "Want to Play"}
          </button>

          {gameData.metacritic && (
            <div className={styles.metacriticBadge} title="Metacritic Score">
              {gameData.metacritic}
            </div>
          )}
        </div>

        <div className={styles.metaSection}>
          <div className={styles.metaGroup}>
            <h3>Genres</h3>
            <div className={styles.tagsList}>
              {gameData.genres.map((g) => (
                <span key={g.id} className={`${styles.tag} ${styles.genreTag}`}>
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.metaGroup}>
            <h3>Platforms</h3>
            <div className={styles.tagsList}>
              {gameData.platforms.map((p) => (
                <span key={p.platform.id} className={`${styles.tag} ${styles.platformTag}`}>
                  {p.platform.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <h3>About</h3>
          <p onClick={handleShowMore}>
            {gameData.description_raw.length > 500
              ? !showMore
                ? `${gameData.description_raw.slice(0, 500)}...`
                : gameData.description_raw
              : gameData.description_raw}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GameDetails;