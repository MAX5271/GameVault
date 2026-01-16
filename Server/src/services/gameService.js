const apiKey = process.env.RAWG_API_KEY;
const axios = require("axios");
const api = axios.create({
  baseURL: `https://api.rawg.io/api`,
});

const fetchHomePageGames = async (search,page) => {
  const res = await api.get("/games", {
    params: {
      key: apiKey,
      search: search,
      page: page,
      page_size: 21
    },
  });

  const gamesArray = res.data.results.map((game) => {
    return {
      id: game.id,
      name: game.name,
      background_image: game.background_image,
    };
  });
  return gamesArray;
};

const fetchGameDetails = async (id) => {
  try {
    const res = await api.get(`/games/${id}`, {
        params:{
            key: apiKey,
        }
    });
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  fetchHomePageGames,
  fetchGameDetails,
};
