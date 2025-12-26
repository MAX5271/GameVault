import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const api = axios.create({
  baseURL: `https://api.rawg.io/api`,
});

function GameDetails() {
  const apiKey = import.meta.env.VITE_API_KEY;

  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchGame = async () => {
      try {
        const res = await api.get(`games/${id}`, {
          params: {
            key: apiKey,
          },
          signal: controller.signal,
        });
        if (!res.status) throw new Error("Error while loading the game!");
        setGameData(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchGame();
    return () => controller.abort();
  }, [id]);

  if (!gameData) return <div className="loading">Loading...</div>;

  const handleShowMore = () => {
    if (gameData.description_raw.length > 500) setShowMore(!showMore);
  };

  return (
    <div className="game-details-container">
      <div className="hero-section">
        <img
          src={gameData.background_image}
          alt={gameData.name}
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="content-body">
        <div className="header-row">
          <h1 className="game-title">{gameData.name}</h1>
          {gameData.metacritic && (
            <div className="metacritic-badge" title="Metacritic Score">
              {gameData.metacritic}
            </div>
          )}
        </div>

        <div className="meta-section">
          <div className="meta-group">
            <h3>Genres</h3>
            <div className="tags-list">
              {gameData.genres.map((g) => (
                <span key={g.id} className="tag genre-tag">
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          <div className="meta-group">
            <h3>Platforms</h3>
            <div className="tags-list">
              {gameData.platforms.map((p) => (
                <span key={p.platform.id} className="tag platform-tag">
                  {p.platform.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="description-section">
          <h3>About</h3>
          <p onClick={handleShowMore}>
            {gameData.description_raw.length > 500
              ? !showMore
                ? `${gameData.description_raw.slice(0, 500)}...`
                : gameData.description_raw
              : gameData.description_raw}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GameDetails;
