import axios from "../../api/axios";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../../context/DataContext";
import styles from "./GameDetails.module.css";
import { motion, useReducedMotion } from "framer-motion";
import debounce from "lodash.debounce";
import BtnSlider from "../../components/ui/BtnSlider";
import GameCard from "../../components/game/GameCard";
import useHorizontalScroll from "../../hooks/useHorizontalScroll";
import { useToast } from "../../context/ToastContext";

const modalVariants = {
  hidden: {
    y: "6vh",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 28,
      stiffness: 380,
    },
  },
  exit: {
    y: "6vh",
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: "easeIn",
    },
  },
};

const reducedModalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

function GameDetails({ id, onLoaded, onNavigate }) {
  const { user } = useContext(DataContext);
  const prefersReducedMotion = useReducedMotion();
  const [gameData, setGameData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [requirements, setRequirements] = useState({});
  const [review, setReview] = useState(0);
  const [error, setError] = useState("");
  const [similarGames, setSimilarGames] = useState([]);
  const navigate = useNavigate();
  const showToast = useToast();

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
        if (error.response?.status === 404) setError(error.message);
        if (error.name !== "CanceledError") {
          console.error(error);
        }
      }
    };

    fetchGame();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!gameData?.genres?.length) {
      setSimilarGames([]);
      return;
    }

    const controller = new AbortController();

    const fetchSimilarGames = async () => {
      try {
        const res = await axios.get("/api/v1/games", {
          params: {
            genres: gameData.genres.map((g) => g.slug).join(","),
            ordering: "-rating",
            page_size: 9,
          },
          signal: controller.signal,
        });
        const results = res.data.response || [];
        setSimilarGames(results.filter((g) => String(g.id) !== String(id)).slice(0, 8));
      } catch (error) {
        if (error.name !== "CanceledError") console.debug(error.message);
      }
    };

    fetchSimilarGames();
    return () => controller.abort();
  }, [id, gameData?.genres]);

  useEffect(() => {
    if (!user?.accessToken || !id) return;

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
        setReview(response.data.response.rating);
        if (response.status === 200) exists.current = true;
      } catch (error) {
        if (error.response?.status === 404) setError(error.message);
        console.log(error.message);
      }
    };

    fetchReview();
    return () => controller.abort();
  }, [id, user?.accessToken]);

  useEffect(() => {
    if (!user?.accessToken || !id) return;

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
        if (err.response?.status === 404) setError(err.message);
        console.log(err.message);
      }
    };

    fetchRequirements();
  }, [id, user?.accessToken]);

  useEffect(() => {
    let isMounted = true;

    const fetchUserGameStatus = async () => {
      if (!user?.accessToken || !id) {
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
        if (err.response?.status === 404) setError(err.message);
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
  }, [id, user?.accessToken]);

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
      if (error.response?.status === 404) setError(error.message);
      console.error(error);
      setCurrentStatus(previousStatus);
      showToast("Couldn't update your library. Please try again.");
    }
  };

  const saveToDb = useMemo(
    () =>
      debounce(async (val) => {
        if (!user?.accessToken) return;
        const endpoint = exists.current ? "updateReview" : "addReview";

        try {
          const response = await axios.post(
            `api/v1/user/${endpoint}`,
            { gameId: id, rating: val },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.accessToken}`,
              },
              withCredentials: true,
            },
          );
          if (response.status !== 200)
            throw new Error("Rating updation or addition failed");
          if (endpoint === "addReview") exists.current = true;
        } catch (error) {
          console.error(error);
          showToast("Couldn't save your rating. Please try again.");
        }
      }, 500),
    [id, user?.accessToken, showToast],
  );

  const handleChange = (newValue) => {
    setReview(newValue);
    saveToDb(newValue);
  };

  const handleShowMore = () => {
    if (gameData?.description_raw?.length > 500) setShowMore(!showMore);
  };

  const getStatusStyle = (status) => {
    if (status === true) {
      return {
        borderLeft: "4px solid var(--color-green-deep)",
        backgroundColor: "color-mix(in srgb, var(--color-green-deep) 10%, transparent)",
      };
    }
    if (status === false) {
      return {
        borderLeft: "4px solid var(--color-red-deep)",
        backgroundColor: "color-mix(in srgb, var(--color-red-deep) 10%, transparent)",
      };
    }
    return {};
  };

  const getMetacriticColor = (score) => {
    if (!score) return "var(--color-ink-muted)";
    if (score >= 75) return "var(--color-ink)";
    if (score >= 50) return "var(--color-ink-muted)";
    return "var(--color-red-deep)";
  };

  const screenshotsScroll = useHorizontalScroll([gameData?.screenshots?.length]);
  const similarScroll = useHorizontalScroll([similarGames.length]);

  if (!gameData) return <div className={styles.loading}>Loading...</div>;

  return (
    <>
      <motion.div
        variants={prefersReducedMotion ? reducedModalVariants : modalVariants}
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
          <div className={styles.heroContent}>
            <h1 className={styles.gameTitle}>{gameData.name}</h1>
          </div>
        </div>

        <div className={styles.contentBody}>
          {gameData.screenshots?.length > 0 && (
            <div className={styles.rowWrapper}>
              {screenshotsScroll.canScrollLeft && (
                <button type="button" className={`${styles.scrollBtn} ${styles.scrollBtnLeft}`} onClick={screenshotsScroll.scrollLeft} aria-label="Scroll left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
              )}
              <div className={`${styles.screenshotsRow} ${styles.hideScrollbar}`} ref={screenshotsScroll.ref}>
                {gameData.screenshots.map((shot) => (
                  <img
                    key={shot.id}
                    src={shot.image}
                    alt={`${gameData.name} screenshot`}
                    className={styles.screenshotImage}
                    loading="lazy"
                  />
                ))}
              </div>
              {screenshotsScroll.canScrollRight && (
                <button type="button" className={`${styles.scrollBtn} ${styles.scrollBtnRight}`} onClick={screenshotsScroll.scrollRight} aria-label="Scroll right">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              )}
            </div>
          )}

          <div className={styles.headerRow}>
            <select
              value={currentStatus}
              onChange={handleStatusChange}
              disabled={loadingStatus}
              className={`${styles.statusDropdown} ${currentStatus ? styles.statusActive : ""}`}
            >
              <option value="">+ Add to Library</option>
              <option value="WANT_TO_PLAY">Want to Play</option>
              <option value="PLAYED">Played</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="DROPPED">Dropped</option>
            </select>

            {gameData.metacritic && (
              <div
                className={styles.metacriticBadge}
                style={{
                    color: getMetacriticColor(gameData.metacritic),
                    borderColor: getMetacriticColor(gameData.metacritic),
                }}
                title="Metacritic Score"
              >
                {gameData.metacritic}
              </div>
            )}
          </div>

          {gameData.stores?.length > 0 && (
            <div className={styles.storesSection}>
              <h3>Available On</h3>
              <div className={styles.tagsList}>
                {gameData.stores.map((store) => (
                  <a
                    key={store.id}
                    href={store.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.tag} ${styles.platformTag}`}
                  >
                    {store.name}
                  </a>
                ))}
              </div>
            </div>
          )}

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

            {gameData.released && (
              <div className={styles.metaGroup}>
                <h3>Released</h3>
                <p className={styles.metaValue}>
                  {new Date(gameData.released).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            {gameData.developers?.length > 0 && (
              <div className={styles.metaGroup}>
                <h3>Developer</h3>
                <p className={styles.metaValue}>{gameData.developers.join(", ")}</p>
              </div>
            )}

            {gameData.publishers?.length > 0 && (
              <div className={styles.metaGroup}>
                <h3>Publisher</h3>
                <p className={styles.metaValue}>{gameData.publishers.join(", ")}</p>
              </div>
            )}
          </div>

          <div className={styles.descriptionSection}>
            <h3>About</h3>
            <p className={styles.descriptionText}>
              {gameData.description_raw?.length > 500
                ? !showMore
                  ? `${gameData.description_raw.slice(0, 500)}...`
                  : gameData.description_raw
                : gameData.description_raw}
              {" "}
              {gameData.description_raw?.length > 500 && (
                 <button
                   type="button"
                   onClick={handleShowMore}
                   className={styles.readMoreLink}
                 >
                   {showMore ? "Show Less" : "Read More"}
                 </button>
              )}
            </p>
          </div>

          {user?.accessToken && (
            <>
              <div className={styles.divider}></div>
              <div className={styles.descriptionSection}>
                <h3>Rating</h3>
              </div>
              <BtnSlider value={review} size={100} handleChange={handleChange} />
            </>
          )}

          {gameData.req && (gameData.req.min?.cpu || gameData.req.rec?.cpu) && (
            <div className={styles.requirementsSection}>
              <h3>System Requirements</h3>
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

          {similarGames.length > 0 && (
            <div className={styles.similarSection}>
              <h3>More Like This</h3>
              <div className={styles.rowWrapper}>
                {similarScroll.canScrollLeft && (
                  <button type="button" className={`${styles.scrollBtn} ${styles.scrollBtnLeft}`} onClick={similarScroll.scrollLeft} aria-label="Scroll left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                )}
                <div className={`${styles.similarRow} ${styles.hideScrollbar}`} ref={similarScroll.ref}>
                  {similarGames.map((game) => (
                    <div key={game.id} className={styles.similarItem}>
                      <GameCard
                        imgSrc={game.background_image}
                        gameName={game.name}
                        metacritic={game.metacritic}
                        onClick={() => onNavigate?.(game.id)}
                      />
                    </div>
                  ))}
                </div>
                {similarScroll.canScrollRight && (
                  <button type="button" className={`${styles.scrollBtn} ${styles.scrollBtnRight}`} onClick={similarScroll.scrollRight} aria-label="Scroll right">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default GameDetails;