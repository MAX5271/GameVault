import axios from "../api/axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";
import styles from "./GameDetails.module.css";

function GameDetails({ id, onLoaded }) {
  const { user } = useContext(DataContext);
  
  const [gameData, setGameData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(""); 
  const [loadingStatus, setLoadingStatus] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const fetchGame = async () => {
      try {
        const res = await axios.get(`/api/v1/game`, {
          params: { id: id },
          signal: controller.signal,
        });
        
        if (res.data && res.data.success) {
            setGameData(res.data.response);
            if (onLoaded) onLoaded();
        } else {
            throw new Error("Failed to retrieve game data");
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error(error);
        }
      }
    };

    fetchGame();
    return () => controller.abort();
  }, [id, onLoaded]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUserGameStatus = async () => {
      if (!user?.username || !user?.accessToken) {
        if (isMounted) setLoadingStatus(false);
        return;
      }

      try {
        const response = await axios.post(`/api/v1/user/game`, 
          { gameId: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
            withCredentials: true,
          }
        );

        if (isMounted) {
            if (response.data && response.data.success) {
                setCurrentStatus(response.data.response?.status || "");
            } else {
                setCurrentStatus("");
            }
        }
      } catch (err) {
        console.log(err);
        if (isMounted) setCurrentStatus("");
      } finally {
        if (isMounted) setLoadingStatus(false);
      }
    };

    fetchUserGameStatus();

    return () => { isMounted = false; };
  }, [id, user]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    if (!user?.accessToken) {
      navigate('/login');
      return;
    }

    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);

    try {
        const config = {
            headers: { Authorization: `Bearer ${user.accessToken}` },
            withCredentials: true
        };

        let res;
        if (newStatus === "") {
            res = await axios.post('/api/v1/user/removeGame', { gameId: id }, config);
        } else if (previousStatus === "") {
            res = await axios.post('/api/v1/user/game/add', { gameId: id, status: newStatus }, config);
        } else {
            res = await axios.post('/api/v1/user/updateGame', { gameId: id, status: newStatus }, config);
        }

        if (!res.data || !res.data.success) {
            throw new Error("API reported failure");
        }

    } catch (error) {
      console.error(error);
      setCurrentStatus(previousStatus);
    }
  };

  const handleShowMore = () => {
    if (gameData?.description_raw?.length > 500) setShowMore(!showMore);
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
          
          <select 
            value={currentStatus} 
            onChange={handleStatusChange}
            disabled={loadingStatus}
            className={`${styles.statusDropdown} ${currentStatus ? styles.statusActive : ''}`}
          >
            <option value="">Add to Library</option>
            <option value="WANT_TO_PLAY">Want to Play</option>
            <option value="PLAYED">Played</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="DROPPED">Dropped</option>
          </select>

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
              {gameData.genres?.map((g) => (
                <span key={g.id} className={`${styles.tag} ${styles.genreTag}`}>
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.metaGroup}>
            <h3>Platforms</h3>
            <div className={styles.tagsList}>
              {gameData.platforms?.map((p) => (
                <span key={p.platform.id} className={`${styles.tag} ${styles.platformTag}`}>
                  {p.platform.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <h3>About</h3>
          <p onClick={handleShowMore} style={{ cursor: gameData.description_raw?.length > 500 ? 'pointer' : 'default' }}>
            {gameData.description_raw?.length > 500
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