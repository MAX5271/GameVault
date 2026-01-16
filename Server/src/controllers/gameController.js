const gameService = require('../services/gameService');

const fetchHomePageGames = async (req,res) => {
    try {
        const {search} = req.query;
        const result = await gameService.fetchHomePageGames(search);
        return res.status(200).json({
            response: result,
            message: "Home Page Games Fetched Successfully",
            success: true
        });
    } catch (error) {
        console.log(error.message);
    }
}

const fetchGameDetails = async (req,res) =>{
    try {
    const {id} = req.query;
    const result = await gameService.fetchGameDetails(id);
    return res.status(200).json({
            response: {
                id: id,
                name: result.name,
                description_raw: result.description_raw,
                background_image: result.background_image,
                metacritic: result.metacritic,
                genres: result.genres,
                platforms: result.platforms
            },
            message: "Home Page Games Fetched Successfully",
            success: true
    });
    } catch (error) {
       console.log(error.message); 
    }
}

module.exports={
    fetchHomePageGames,
    fetchGameDetails
}