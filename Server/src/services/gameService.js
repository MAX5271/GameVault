const apiKey = process.env.RAWG_API_KEY;
const axios = require("axios");
const api = axios.create({
  baseURL: `https://api.rawg.io/api`,
});

const getCroppedImageUrl = (url) => {
  if (!url) return "";
  const target = "media/";
  const index = url.indexOf(target) + target.length;
  return url.slice(0, index) + "crop/600/400/" + url.slice(index);
};

const fetchHomePageGames = async (search, page, { ordering, genres, platforms, page_size } = {}) => {
  const res = await api.get("/games", {
    params: {
      key: apiKey,
      search: search,
      page: page,
      page_size: page_size || 20,
      ordering,
      genres,
      platforms,
    },
  });

  const gamesArray = res.data.results.map((game) => {
    return {
      id: game.id,
      metacritic: game.metacritic,
      name: game.name,
      background_image: getCroppedImageUrl(game.background_image),
    };
  });
  return gamesArray;
};

const fetchGameDetails = async (id) => {
  const res = await api.get(`/games/${id}`, {
      params:{
          key: apiKey,
      }
  });
  return res.data;
};

const fetchGameScreenshots = async (id) => {
  const res = await api.get(`/games/${id}/screenshots`, {
    params: { key: apiKey },
  });
  return res.data.results;
};

const fetchGameStores = async (id) => {
  const res = await api.get(`/games/${id}/stores`, {
    params: { key: apiKey },
  });
  return res.data.results;
};

module.exports = {
  fetchHomePageGames,
  fetchGameDetails,
  fetchGameScreenshots,
  fetchGameStores,
};
