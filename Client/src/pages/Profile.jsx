import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DataContext from "../context/DataContext";
import axios from "../api/axios";
import GameCard from "../components/GameCard";
import styles from "./Profile.module.css";

function Profile() {
  const { username } = useParams();
  const { user } = useContext(DataContext);

  const [wantToPlayIDs, setWantToPlayIDs] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchWTPIds = async () => {
      try {
        const response = await axios.get(`/api/v1/user/${username}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          withCredentials: true,
        });
        if (isMounted) {
          const ids = response.data.response.wantToPlay;
          setWantToPlayIDs(ids);
          if (!ids || ids.length === 0) setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    
    if (user?.accessToken) fetchWTPIds();
    
    return () => { isMounted = false; };
  }, [username, user]);

  useEffect(() => {
    let isMounted = true;
    const fetchGameDetails = async () => {
        if (wantToPlayIDs.length === 0) return;

        try {
            const requests = wantToPlayIDs.map(id => 
                axios.get('/api/v1/game', { params: { id } }) 
            );

            const responses = await Promise.all(requests);
            if (isMounted) {
                const gameData = responses.map(res => res.data.response);
                setGames(gameData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            if (isMounted) setLoading(false);
        }
    };

    fetchGameDetails();
    
    return () => { isMounted = false; };
  }, [wantToPlayIDs]);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>{username}'s Library</h1>
        <p className={styles.subtitle}>
            {games.length} Game{games.length !== 1 ? 's' : ''} in Want to Play
        </p>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Loading library...</div>
      ) : games.length > 0 ? (
        <div className={styles.grid}>
          {games.map((game) => (
            <GameCard
              key={game.id}
              imgSrc={game.background_image}
              gameName={game.name}
              id={game.id}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
            <p>No games added yet.</p>
        </div>
      )}
    </div>
  );
}

export default Profile;