import axios from "../api/axios";
import {  useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/DataContext";
import styles from "./GameDetails.module.css";
import { motion } from "framer-motion";
import debounce from 'lodash.debounce';
import BtnSlider from "../components/BtnSlider";

const modalVariants = {
  hidden: {
    y: "100vh",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

function GameDetails({ id, onLoaded }) {
  const { user } = useContext(DataContext);
  const [gameData, setGameData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [requirements, setRequirements] = useState({});
  const [review, setReview] = useState(0);
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const exists = useRef(null);

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
        if(error.status===404) setError(error.message);
        if (error.name !== "CanceledError") {
          console.error(error);
        }
      }
    };

    fetchGame();
    return () => controller.abort();
  }, [id, onLoaded]);

  useEffect(() => {
    if (!user || !id) return;

    const controller = new AbortController();

    const fetchReview = async () => {
      try {
        const response = await axios.get("/api/v1/user/review", {
          params: { gameId: id },

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${user.accessToken}`,
          },

          withCredentials: true,

          signal: controller.signal,
        });

        console.log(response);
        setReview(response.data.response.rating);
        if(response.status===200) exists.current = true;
        
      } catch (error) {
        if(error.status===404) setError(error.message);
        console.log(error.message);
      }
    };

    fetchReview();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!user || !id) return;

    const fetchRequirements = async () => {
      try {
        const res = await axios.get(`/api/v1/gameRec`, {
          params: { id: id },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
          withCredentials: true,
        });
        setRequirements(res.data.response);
      } catch (err) {
        if(error.status===404) setError(error.message);
        console.log(err.message);
      }
    };

    fetchRequirements();
  }, [id, user?.accessToken]);

  useEffect(() => {
    let isMounted = true;

    const fetchUserGameStatus = async () => {
      if (!user?.username || !user?.accessToken) {
        if (isMounted) setLoadingStatus(false);
        return;
      }

      try {
        const response = await axios.post(
          `/api/v1/user/game`,
          { gameId: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.accessToken}`,
            },
            withCredentials: true,
          },
        );
        if (isMounted) {
          if (response.data && response.data.success) {
            setCurrentStatus(response.data.response?.status || "");
          } else {
            setCurrentStatus("");
          }
        }
      } catch (err) {
        if(error.status===404) setError(error.message);
        console.log(err);
        if (isMounted) setCurrentStatus("");
      } finally {
        if (isMounted) setLoadingStatus(false);
      }
    };

    fetchUserGameStatus();

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    
    if (!user?.accessToken) {
      navigate("/login");
      return;
    }

    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        withCredentials: true,
      };

      let res;
      if (newStatus === "") {
        res = await axios.post(
          "/api/v1/user/removeGame",
          { gameId: id },
          config,
        );
      } else if (previousStatus === "") {
        res = await axios.post(
          "/api/v1/user/game/add",
          { gameId: id, status: newStatus },
          config,
        );
      } else {
        res = await axios.post(
          "/api/v1/user/updateGame",
          { gameId: id, status: newStatus },
          config,
        );
      }

      if (!res.data || !res.data.success) {
        throw new Error("API reported failure");
      }
    } catch (error) {
        if(error.status===404) setError(error.message);
      console.error(error);
      setCurrentStatus(previousStatus);
    }
  };
  
  const saveToDb = useMemo(
  () =>
    debounce(async (val) => {
      const endpoint = exists.current ? 'updateReview' : 'addReview';

      try {
        const response = await axios.post(
          `api/v1/user/${endpoint}`,
          { gameId: id, rating: val },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${user.accessToken}`,
            },
            withCredentials: true,
          }
        );
        console.log(response);
        if(endpoint==='addReview')  exists.current=true;
      } catch (error) {
        console.error(error);
      }
    }, 500),
  [id, user.accessToken]
);

  const handleChange = (newValue)=> {
    setReview(newValue);
    saveToDb(newValue)
  }
  
  const handleShowMore = () => {
    if (gameData?.description_raw?.length > 500) setShowMore(!showMore);
  };

  const getStatusStyle = (status) => {
    if (status === true) {
      return {
        borderLeft: "4px solid #4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.25)",
        boxShadow: "inset 10px 0 20px -10px rgba(74, 222, 128, 0.3)",
      };
    }
    if (status === false) {
      return {
        borderLeft: "4px solid #f87171",
        backgroundColor: "rgba(248, 113, 113, 0.25)",
        boxShadow: "inset 10px 0 20px -10px rgba(248, 113, 113, 0.3)",
      };
    }
    return {};
  };

  if (!gameData) return <div className={styles.loading}>Loading...</div>;


  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={styles.gameDetailsContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.heroSection}>
        <img
          src={gameData.background_image}
          alt={gameData.name}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}></div>
      </div>
      {review?JSON.stringify(review.rating):null}
      <div className={styles.contentBody}>
        <div className={styles.headerRow}>
          <h1 className={styles.gameTitle}>{gameData.name}</h1>

          <select
            value={currentStatus}
            onChange={handleStatusChange}
            disabled={loadingStatus}
            className={`${styles.statusDropdown} ${currentStatus ? styles.statusActive : ""}`}
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
                <span
                  key={p.platform.id}
                  className={`${styles.tag} ${styles.platformTag}`}
                >
                  {p.platform.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <h3>About</h3>
          <p
            onClick={handleShowMore}
            style={{
              cursor:
                gameData.description_raw?.length > 500 ? "pointer" : "default",
            }}
          >
            {gameData.description_raw?.length > 500
              ? !showMore
                ? `${gameData.description_raw.slice(0, 500)}...show more`
                : gameData.description_raw
              : gameData.description_raw}
          </p>
        </div>

        <BtnSlider value={review} handleChange = {handleChange} />

        {gameData.req && (gameData.req.min?.cpu || gameData.req.rec?.cpu) && (
          <div className={styles.requirementsSection}>
            <h3>System Requirements (PC)</h3>
            <div className={styles.reqGrid}>
              <div className={styles.reqColumn}>
                <h4>Minimum</h4>

                <div
                  className={styles.specItem}
                  style={getStatusStyle(requirements?.minReq?.cpu)}
                >
                  <strong>CPU</strong>
                  <span>{gameData.req.min.cpu || "N/A"}</span>
                </div>

                <div
                  className={styles.specItem}
                  style={getStatusStyle(requirements?.minReq?.gpu)}
                >
                  <strong>GPU</strong>
                  <span>{gameData.req.min.gpu || "N/A"}</span>
                </div>

                <div
                  className={styles.specItem}
                  style={getStatusStyle(requirements?.minReq?.ram)}
                >
                  <strong>RAM</strong>
                  <span>
                    {gameData.req.min.ram
                      ? `${gameData.req.min.ram} GB`
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className={styles.reqColumn}>
                <h4>Recommended</h4>

                <div
                  className={styles.specItem}
                  style={getStatusStyle(requirements?.recReq?.cpu)}
                >
                  <strong>CPU</strong>
                  <span>{gameData.req.rec.cpu || "N/A"}</span>
                </div>

                <div
                  className={styles.specItem}
                  style={getStatusStyle(requirements?.recReq?.gpu)}
                >
                  <strong>GPU</strong>
                  <span>{gameData.req.rec.gpu || "N/A"}</span>
                </div>

                <div
                  className={styles.specItem}
                  style={getStatusStyle(requirements?.recReq?.ram)}
                >
                  <strong>RAM</strong>
                  <span>
                    {gameData.req.rec.ram
                      ? `${gameData.req.rec.ram} GB`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default GameDetails;
