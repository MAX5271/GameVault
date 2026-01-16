import { useContext, useEffect, useState, useCallback } from "react";
import GameCard from "../components/GameCard";
import DataContext from "../context/DataContext";
import styles from "./Home.module.css";
import axios from "../api/axios";
import ax from 'axios';

function Home() {
  const { searchResult, setSearchResult, search } = useContext(DataContext);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(1);
    setSearchResult([]);
    setHasMore(true);
  }, [search, setSearchResult]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchGames = async () => {
      if (!hasMore && page !== 1) return; 
      
      setLoading(true);
      try {
        const res = await axios.get("/api/v1/games", {
          params: {
            search: search,
            page: page,
          },
          signal: controller.signal,
          withCredentials: true,
        });

        const newGames = res.data.response || [];

        setSearchResult((prev) => {
          if (page === 1) return newGames;
          
          const existingIds = new Set(prev.map(g => g.id));
          const uniqueNewGames = newGames.filter(g => !existingIds.has(g.id));
          return [...prev, ...uniqueNewGames];
        });

        if (newGames.length === 0) setHasMore(false);
        
      } catch (error) {
        if (ax.isCancel(error)) return;
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();

    return () => controller.abort();
  }, [page, search, setSearchResult]); 

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight - 300
    ) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!searchResult && loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {searchResult?.map((game) => (
        <GameCard
          key={game.id}
          imgSrc={game.background_image}
          gameName={game.name}
          id={game.id}
        />
      ))}
      {loading && (
        <div className={styles.loadingContainer} style={{ height: '100px' }}>
             <div className={styles.spinner}></div>
        </div>
      )}
    </div>
  );
}

export default Home;