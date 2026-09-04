import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { isCancel } from "axios";
import axiosInstance from "../../api/axios";
import GameCard from "../../components/game/GameCard";
import Modal from "../../components/ui/Modal";
import DiscoveryToolbar from "../../components/game/DiscoveryToolbar";
import RecentlyViewedStrip from "../../components/game/RecentlyViewedStrip";
import styles from "./Home.module.css";
import { AnimatePresence, motion } from "framer-motion";
import SearchContext from "../../context/SearchContext";
import { useToast } from "../../context/ToastContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
    y: 15,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 20,
    },
  },
};

const RECENTLY_VIEWED_KEY = "gv-recently-viewed";
const RECENTLY_VIEWED_LIMIT = 12;

const readRecentlyViewed = () => {
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

function Home() {
  const { searchResult, setSearchResult, search } = useContext(SearchContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [ordering, setOrdering] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState(readRecentlyViewed);

  const prevQueryRef = useRef(null);
  const observer = useRef();
  const showToast = useToast();

  const hasActiveFilters = Boolean(search) || Boolean(ordering) || selectedGenres.length > 0 || selectedPlatforms.length > 0;

  const toggleGenre = (slug) => {
    setSelectedGenres((prev) => (prev.includes(slug) ? prev.filter((g) => g !== slug) : [...prev, slug]));
  };

  const togglePlatform = (id) => {
    setSelectedPlatforms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const lastGameElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const controller = new AbortController();

    const fetchGames = async () => {
      const querySignature = JSON.stringify({ search, ordering, selectedGenres, selectedPlatforms });
      const isNewQuery = querySignature !== prevQueryRef.current;
      const currentPage = isNewQuery ? 1 : page;

      if (!isNewQuery && (loading || !hasMore)) return;

      setLoading(true);

      if (isNewQuery) {
        setSearchResult([]);
        setHasMore(true);
        prevQueryRef.current = querySignature;
      }

      try {
        const res = await axiosInstance.get("/api/v1/games", {
          params: {
            search,
            page: currentPage,
            ordering: ordering || undefined,
            genres: selectedGenres.length ? selectedGenres.join(",") : undefined,
            platforms: selectedPlatforms.length ? selectedPlatforms.join(",") : undefined,
          },
          signal: controller.signal,
          withCredentials: true,
        });

        const newGames = res.data.response || [];

        setSearchResult((prev) => {
          if (currentPage === 1) return newGames;
          const existingIds = new Set(prev.map((g) => g.id));
          const uniqueNewGames = newGames.filter((g) => !existingIds.has(g.id));
          return [...prev, ...uniqueNewGames];
        });

        if (newGames.length === 0) setHasMore(false);
      } catch (error) {
        if (isCancel(error)) return;
        console.debug(error.message);
        setHasMore(false);
        showToast("Couldn't load games. Please check your connection and try again.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setHasLoadedOnce(true);
        }
      }
    };

    fetchGames();
    return () => controller.abort();
  }, [page, search, ordering, selectedGenres, selectedPlatforms, setSearchResult]);

  const handleOpenModal = (id) => {
    setActiveId(id);
    setIsOpen(true);

    const game = searchResult.find((g) => g.id === id);
    if (game) {
      setRecentlyViewed((prev) => {
        const filtered = prev.filter((g) => g.id !== id);
        const next = [
          { id: game.id, name: game.name, metacritic: game.metacritic, background_image: game.background_image },
          ...filtered,
        ].slice(0, RECENTLY_VIEWED_LIMIT);
        try {
          localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
        } catch {
          // localStorage unavailable — recently-viewed still works for this session
        }
        return next;
      });
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setActiveId(null);
  };

  return (
    <>
      <DiscoveryToolbar
        ordering={ordering}
        onOrderingChange={setOrdering}
        selectedGenres={selectedGenres}
        onToggleGenre={toggleGenre}
        selectedPlatforms={selectedPlatforms}
        onTogglePlatform={togglePlatform}
      />

      {!hasActiveFilters && (
        <RecentlyViewedStrip games={recentlyViewed} onOpen={handleOpenModal} />
      )}

      {(loading || !hasLoadedOnce) && searchResult.length === 0 ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : !loading && searchResult.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyStateText}>
            {search
              ? `No games matched "${search}"`
              : hasActiveFilters
              ? "No games matched these filters."
              : "No games found."}
          </p>
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.home}
          >
            {searchResult?.map((game) => (
              <GameCard
                key={game.id}
                imgSrc={game.background_image}
                gameName={game.name}
                metacritic={game.metacritic}
                id={game.id}
                onClick={() => handleOpenModal(game.id)}
                cardVariants={cardVariants}
              />
            ))}
            {searchResult.length > 0 && (
              <div ref={lastGameElementRef} style={{ height: "1px", width: "100%" }} />
            )}
          </motion.div>
          {loading && searchResult.length > 0 && (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {isOpen && <Modal activeId={activeId} onClose={handleCloseModal} onNavigate={handleOpenModal} />}
      </AnimatePresence>
    </>
  );
}

export default Home;