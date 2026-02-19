import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataContext from "../context/DataContext";
import axios from "../api/axios";
import GameListItem from "../components/GameListItem";
import Modal from "../components/Modal";
import styles from "./Profile.module.css";
import { motion, AnimatePresence } from "framer-motion";
import SystemSpecModal from "../components/SystemSpecModal";

function Profile() {
  const { username } = useParams();
  const { user } = useContext(DataContext);

  const [gameGroups, setGameGroups] = useState({
    WANT_TO_PLAY: [],
    PLAYED: [],
    ON_HOLD: [],
    DROPPED: [],
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [specIsOpen, setSpecIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.username) {
      navigate("/login");
    }
  }, [user.username, navigate]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isOpen || specIsOpen ? "hidden" : "unset";
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen, specIsOpen]);

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

        if (!isMounted) return;

        const userGames = response.data.response;
        if (!userGames || userGames.length === 0) {
          setLoading(false);
          return;
        }

        const detailsPromises = userGames.map((game) =>
          axios
            .get("/api/v1/game", { params: { id: game.gameId } })
            .then((res) => ({
              ...game,
              details: res.data.response,
            })),
        );

        const gamesWithDetails = await Promise.all(detailsPromises);

        if (isMounted) {
          const groups = {
            WANT_TO_PLAY: [],
            PLAYED: [],
            ON_HOLD: [],
            DROPPED: [],
          };

          gamesWithDetails.forEach((game) => {
            if (game && game.details && groups[game.status] !== undefined) {
              groups[game.status].push(game.details);
            }
          });

          setGameGroups(groups);
          setLoading(false);
        }
      } catch (err) {
        console.debug(err);
        if (isMounted) setLoading(false);
      }
    };

    fetchUserGames();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleOpenModal = (id) => {
    setActiveId(id);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setActiveId(null);
  };

  const handleOpenSpec = () => {
    setSpecIsOpen(true);
  };

  const handleCloseSpec = () => {
    setSpecIsOpen(false);
  };

  const handleLogout = async () => {
    await axios.get("/api/v1/logout");
    navigate("/login");
    window.location.reload();
  };

  const renderSection = (title, games) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={styles.sectionWrapper}
    >
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
    </motion.div>
  );

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.title}
          >
            {username}
          </motion.h1>
        </div>
        
        <div className={styles.actions}>
          <motion.button
            className={styles.editSpecBtn}
            whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "#000" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenSpec}
          >
            <span className={styles.icon}>⚙</span>
            <span>System Specs</span>
          </motion.button>

          <motion.button
            className={styles.logoutBtn}
            whileHover={{ scale: 1.02, borderColor: "#ef4444", color: "#ef4444" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
          >
            Logout
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {specIsOpen && <SystemSpecModal onClose={handleCloseSpec}/>}
      </AnimatePresence>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div className={styles.libraryGrid}>
          {renderSection("Want to Play", gameGroups["WANT_TO_PLAY"])}
          {renderSection("Played", gameGroups["PLAYED"])}
          {renderSection("On Hold", gameGroups["ON_HOLD"])}
          {renderSection("Dropped", gameGroups["DROPPED"])}
        </div>
      )}

      {isOpen && <Modal activeId={activeId} onClose={handleCloseModal} />}
    </div>
  );
}

export default Profile;