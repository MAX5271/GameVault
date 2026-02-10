import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { isCancel } from "axios";
import axiosInstance from "../api/axios";
import GameCard from "../components/GameCard";
import Modal from "../components/Modal";
import styles from "./Home.module.css";
import { AnimatePresence, motion } from "framer-motion";
import SearchContext from "../context/SearchContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 20,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};

function Home() {
  const { searchResult, setSearchResult, search } = useContext(SearchContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);

  const prevSearchRef = useRef(search);

  useEffect(() => {
    const controller = new AbortController();

    const fetchGames = async () => {
      const isNewSearch = search !== prevSearchRef.current;
      const currentPage = isNewSearch ? 1 : page;

      if (!isNewSearch && (loading || !hasMore)) return;

      setLoading(true);

      if (isNewSearch) {
        setSearchResult([]);
        setPage(1);
        setHasMore(true);
        prevSearchRef.current = search;
      }

      try {
        const res = await axiosInstance.get("/api/v1/games", {
          params: { search, page: currentPage },
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
        console.error(error.message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchGames();
    return () => controller.abort();
  }, [page, search, setSearchResult]);

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight - 300
    ) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleOpenModal = (id) => {
    setActiveId(id);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setActiveId(null);
    document.body.style.overflow = "unset";
  };

  if (loading && searchResult.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
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
      </motion.div>
      <AnimatePresence>
        {isOpen && <Modal activeId={activeId} onClose={handleCloseModal} />}
      </AnimatePresence>
    </>
  );
}

export default Home;