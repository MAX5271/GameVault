import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataContext from "../context/DataContext";
import axios from "../api/axios";
import GameListItem from "../components/GameListItem";
import Modal from "../components/Modal";
import styles from "./Profile.module.css";

function Profile() {
  const { username } = useParams();
  const { user } = useContext(DataContext);

  const [gameGroups, setGameGroups] = useState({
    "WANT_TO_PLAY": [],
    "PLAYED": [],
    "ON_HOLD": [],
    "DROPPED": []
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.username) {
      navigate('/login');
    }
  }, [user.username, navigate]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }
    return () => {
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'unset';
        }
    };
  }, [isOpen]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchUserGames = async () => {
      if (!user?.accessToken) return;

      try {
        const response = await axios.get(`/api/v1/user/games`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          withCredentials: true,
        });

        console.log(response);

        if (!isMounted) return;

        const userGames = response.data.response.games;

        if (!userGames || userGames.length === 0) {
            setLoading(false);
            return;
        }

        const detailsPromises = userGames.map(game => {

          if(!game.gameId) return null;

          return axios.get('/api/v1/game', { params: { id: game.gameId } })
          .then(res => ({
            ...game,
            details: res.data.response
          }))
        }
        );

        const gamesWithDetails = await Promise.all(detailsPromises);
        
        if (isMounted) {
            const groups = {
                "WANT_TO_PLAY": [],
                "PLAYED": [],
                "ON_HOLD": [],
                "DROPPED": []
            };

            gamesWithDetails.forEach(game => {
                if (game && game.details && groups[game.status] !== undefined) {
                    groups[game.status].push(game.details);
                }
            });

            setGameGroups(groups);
            setLoading(false);
        }

      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };

    fetchUserGames();
    
    return () => { isMounted = false; };
  }, [user]);

  const handleOpenModal = (id) => {
    setActiveId(id);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setActiveId(null);
  };

  const handleLogout = async () => {
    await axios.get('/api/v1/logout');
    navigate('/login');
    window.location.reload();
  };

  const renderSection = (title, games) => (
    <>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {games.length > 0 ? (
            <div className={styles.list}>
                {games.map((game) => (
                    <GameListItem
                        key={game.id}
                        imgSrc={game.background_image}
                        gameName={game.name}
                        id={game.id}
                        onClick={() => handleOpenModal(game.id)}
                    />
                ))}
            </div>
        ) : (
            <div className={styles.sectionEmpty}>No games in this category.</div>
        )}
    </>
  );

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>{username}</h1>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      {loading ? (
        <div className={styles.emptyState}>Loading library...</div>
      ) : (
        <>
            {renderSection("Want to Play", gameGroups["WANT_TO_PLAY"])}
            {renderSection("Played", gameGroups["PLAYED"])}
            {renderSection("On Hold", gameGroups["ON_HOLD"])}
            {renderSection("Dropped", gameGroups["DROPPED"])}
        </>
      )}

      {isOpen && (
        <Modal 
            activeId={activeId} 
            onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}

export default Profile;