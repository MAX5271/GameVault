import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import DataContext from "../../context/DataContext";
import axios from "../../api/axios";
import GameListItem from "../../components/game/GameListItem";
import SystemSpec from "../../components/system/SystemSpec";
import AccountSettings from "../../components/user/AccountSettings";
import Modal from "../../components/ui/Modal";
import styles from "./Profile.module.css";
import { useToast } from "../../context/ToastContext";

const SECTIONS = [
  { id: "library", label: "Library" },
  { id: "reviews", label: "Reviews" },
  { id: "specs", label: "System Specs" },
  { id: "account", label: "Account" },
];

const rootVariants = {
  initial: { x: -60, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 420, damping: 34 } },
  exit: { x: -60, opacity: 0, transition: { duration: 0.15 } },
};

const sectionVariants = {
  initial: { x: 60, opacity: 0, skewX: -2 },
  animate: { x: 0, opacity: 1, skewX: 0, transition: { type: "spring", stiffness: 420, damping: 34 } },
  exit: { x: 60, opacity: 0, transition: { duration: 0.15 } },
};

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

function Profile() {
  const { username: routeUsername } = useParams();
  const { user, setUser } = useContext(DataContext);
  const navigate = useNavigate();
  const showToast = useToast();
  const prefersReducedMotion = useReducedMotion();

  const [gameGroups, setGameGroups] = useState({
    WANT_TO_PLAY: [],
    PLAYED: [],
    ON_HOLD: [],
    DROPPED: [],
  });
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const [activeSection, setActiveSection] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const [reviews, setReviews] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (!user.username) {
      navigate("/login");
    } else if (routeUsername !== user.username) {
      navigate(`/profile/${user.username}`, { replace: true });
    }
  }, [user.username, routeUsername, navigate]);

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
        if (isMounted) {
          setLoading(false);
          showToast("Couldn't load your library. Please try again.");
        }
      }
    };

    fetchUserGames();

    return () => {
      isMounted = false;
    };
  }, [user, showToast]);

  useEffect(() => {
    if (activeSection !== "reviews" || reviews !== null || !user?.accessToken) return;
    let isMounted = true;

    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await axios.get(`/api/v1/user/${user.username}`, {
          headers: { Authorization: `Bearer ${user.accessToken}` },
          withCredentials: true,
        });
        const rawReviews = res.data.response?.reviews || [];

        const withDetails = await Promise.all(
          rawReviews.map((r) =>
            axios
              .get("/api/v1/game", { params: { id: r.gameId } })
              .then((gr) => ({ ...r, details: gr.data.response }))
              .catch(() => null),
          ),
        );

        if (isMounted) setReviews(withDetails.filter(Boolean));
      } catch (err) {
        console.debug(err);
        if (isMounted) {
          setReviews([]);
          showToast("Couldn't load your reviews.");
        }
      } finally {
        if (isMounted) setReviewsLoading(false);
      }
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [activeSection, reviews, user, showToast]);

  const handleOpenModal = (id) => {
    setActiveId(id);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setActiveId(null);
  };

  const handleLogout = async () => {
    await axios.get("/api/v1/logout");
    navigate("/login");
    window.location.reload();
  };

  const handleAccountDeleted = () => {
    setUser({});
    navigate("/login");
    window.location.reload();
  };

  const handleCloseMenu = useCallback(() => {
    setIsExiting(true);
  }, []);

  useEffect(() => {
    if (!isExiting) return;
    const delay = prefersReducedMotion ? 0 : 240;
    const timer = setTimeout(() => {
      if (window.history.length > 1) navigate(-1);
      else navigate("/");
    }, delay);
    return () => clearTimeout(timer);
  }, [isExiting, navigate, prefersReducedMotion]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isExiting || isOpen) return;

      if (activeSection === null) {
        if (e.key === "Escape") {
          handleCloseMenu();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setFocusedIndex((i) => (i + 1) % SECTIONS.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setFocusedIndex((i) => (i - 1 + SECTIONS.length) % SECTIONS.length);
        } else if (e.key === "Enter") {
          setActiveSection(SECTIONS[focusedIndex].id);
        }
      } else if (e.key === "Escape") {
        setActiveSection(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, focusedIndex, isExiting, isOpen, handleCloseMenu]);

  const variants = prefersReducedMotion ? reducedVariants : null;

  const totalGames =
    gameGroups.WANT_TO_PLAY.length +
    gameGroups.PLAYED.length +
    gameGroups.ON_HOLD.length +
    gameGroups.DROPPED.length;

  const renderLibrarySection = (title, games) => (
    <div className={styles.librarySubsection} key={title}>
      <h4 className={styles.libraryTitle}>{title}</h4>
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
        <div className={styles.sectionEmpty}>Nothing here yet.</div>
      )}
    </div>
  );

  if (!user.username) return null;

  return (
    <div className={`${styles.pauseMenu} ${isExiting ? styles.exiting : ""}`}>
      <AnimatePresence mode="wait">
        {activeSection === null ? (
          <motion.div
            key="root"
            className={styles.rootView}
            variants={variants || rootVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className={styles.identityBlock}>
              <div className={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
              <div>
                <div className={styles.eyebrow}>PROFILE</div>
                <h1 className={styles.username}>{user.username}</h1>
                <div className={styles.statRow}>
                  <span className={styles.statChip}>{totalGames} GAMES</span>
                  <span className={styles.statChip}>{gameGroups.PLAYED.length} PLAYED</span>
                </div>
              </div>
              <button type="button" className={styles.exitBtn} onClick={handleCloseMenu}>
                ESC · CLOSE
              </button>
            </div>

            <nav className={styles.menuList} aria-label="Profile sections">
              {SECTIONS.map((section, i) => (
                <button
                  type="button"
                  key={section.id}
                  className={`${styles.menuItem} ${i === focusedIndex ? styles.menuItemFocused : ""}`}
                  onClick={() => setActiveSection(section.id)}
                  onMouseEnter={() => setFocusedIndex(i)}
                >
                  <span className={styles.menuIndicator}>{i === focusedIndex ? "▶" : ""}</span>
                  <span className={styles.menuLabel}>{section.label}</span>
                  <span className={styles.menuArrow}>→</span>
                </button>
              ))}

              <button type="button" className={styles.logoutMenuItem} onClick={handleLogout}>
                <span className={styles.menuIndicator}></span>
                <span className={styles.menuLabel}>Logout</span>
                <span className={styles.menuArrow}>×</span>
              </button>
            </nav>
          </motion.div>
        ) : (
          <motion.div
            key={activeSection}
            className={styles.sectionView}
            variants={variants || sectionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className={styles.sectionHeader}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setActiveSection(null)}
              >
                ← BACK
              </button>
              <div className={styles.breadcrumb}>
                PROFILE <span className={styles.breadcrumbSep}>/</span>{" "}
                {SECTIONS.find((s) => s.id === activeSection)?.label.toUpperCase()}
              </div>
            </div>

            <div className={styles.sectionBody}>
              {activeSection === "library" && (
                loading ? (
                  <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                  </div>
                ) : (
                  <div className={styles.libraryGrid}>
                    {renderLibrarySection("Want to Play", gameGroups.WANT_TO_PLAY)}
                    {renderLibrarySection("Played", gameGroups.PLAYED)}
                    {renderLibrarySection("On Hold", gameGroups.ON_HOLD)}
                    {renderLibrarySection("Dropped", gameGroups.DROPPED)}
                  </div>
                )
              )}

              {activeSection === "reviews" && (
                reviewsLoading ? (
                  <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className={styles.reviewsList}>
                    {reviews.map((r) => (
                      <div className={styles.reviewRow} key={r.gameId}>
                        <img
                          src={r.details?.background_image}
                          alt=""
                          className={styles.reviewImage}
                        />
                        <span className={styles.reviewName}>{r.details?.name || r.gameId}</span>
                        <span className={styles.reviewScore}>{r.rating}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.sectionEmpty}>You haven't rated any games yet.</div>
                )
              )}

              {activeSection === "specs" && <SystemSpec />}
              {activeSection === "account" && (
                <AccountSettings onAccountDeleted={handleAccountDeleted} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && <Modal activeId={activeId} onClose={handleCloseModal} />}
    </div>
  );
}

export default Profile;
