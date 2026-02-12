import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DataContext from "../context/DataContext";
import axios from "../api/axios";
import GameListItem from "../components/GameListItem";
import Modal from "../components/Modal";
import styles from "./Profile.module.css";
import { motion, AnimatePresence } from "framer-motion";
import SystemSpecModal from "../components/SystemSpecModal";

const logOutVariants = {
  animate: { z: 5, y: -5, scale: 1.05 },
  whileTap: { z: 0, y: 0, scale: 0.9 },
};

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
        console.error(err);
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
        <motion.h1
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 300,
            damping: 12,
          }}
          className={styles.title}
        >
          {username}
        </motion.h1>
        
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenSpec}
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.15)", 
            borderRadius: "12px",
            padding: "16px 24px",
            color: "#e5e5e5", 
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
          }}
        >
          <span style={{ fontSize: "20px" }}>✍︎</span>
          <span>Edit System Specs</span>
        </motion.button>

        <AnimatePresence>
          {specIsOpen && <SystemSpecModal onClose={handleCloseSpec}/>}
        </AnimatePresence>
        
        <motion.button
          variants={logOutVariants}
          whileHover="animate"
          whileTap="whileTap"
          transition={{ duration: 0.01 }}
          className={styles.logoutBtn}
          onClick={handleLogout}
        >
          Logout
        </motion.button>
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

      {isOpen && <Modal activeId={activeId} onClose={handleCloseModal} />}
    </div>
  );
}

export default Profile;