const gameService = require('../services/gameService');
const compareSpecs = require("../utils/compareSpecs");
const userService = require("../services/userService");
const compareService = require('../services/compareService');

const ALLOWED_ORDERINGS = ['-rating', 'rating', '-released', 'released', 'name', '-name', '-added', 'added'];
const SLUG_LIST_REGEX = /^[a-z0-9,-]+$/i;

const getPcRequirements = (game) => {
    const pcPlatform = game?.platforms?.find((p) => p.platform.name === "PC");
    return {
        minimum: pcPlatform?.requirements?.minimum || "",
        recommended: pcPlatform?.requirements?.recommended || "",
    };
};

const fetchHomePageGames = async (req,res) => {
    try {
        const {search,page,ordering,genres,platforms,page_size} = req.query;

        const options = {
            ordering: ALLOWED_ORDERINGS.includes(ordering) ? ordering : undefined,
            genres: SLUG_LIST_REGEX.test(genres || '') ? genres : undefined,
            platforms: SLUG_LIST_REGEX.test(platforms || '') ? platforms : undefined,
            page_size: Math.min(Math.max(Number(page_size) || 20, 1), 20),
        };

        const result = await gameService.fetchHomePageGames(search,page,options);
        return res.status(200).json({
            response: result,
            message: "Home Page Games Fetched Successfully",
            success: true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(502).json({
            message: "Failed to fetch games",
            success: false
        });
    }
}

const fetchRequirements = async (req,res) =>{
    try {
    const username = req.user;
    const {id} = req.query;
    const pcSpecs = await userService.getPcSpecs(username);
    const result = await gameService.fetchGameDetails(id);
    const pcRequirements = getPcRequirements(result);
    const minReq = compareSpecs.parseRequirements(pcRequirements.minimum);
    const recReq = compareSpecs.parseRequirements(pcRequirements.recommended);

    const response = {
                id: id,
                req:{
                    min: {
                        cpu: minReq.cpu.join(' / '),
                        gpu: minReq.gpu.join(' / '),
                        ram: minReq.ram
                    },
                    rec: {
                        cpu: recReq.cpu.join(' / '),
                        gpu: recReq.gpu.join(' / '),
                        ram: recReq.ram
                    }
                },
                minReq:{
                    cpu: minReq.cpu? compareService.compareCpu(pcSpecs.cpu,minReq.cpu):null,
                    gpu: minReq.gpu? compareService.compareGpu(pcSpecs.gpu,minReq.gpu):null,
                    ram: minReq.ram? pcSpecs.ram>=minReq.ram:null
                },
                recReq:{
                    cpu: recReq.cpu? compareService.compareCpu(pcSpecs.cpu,recReq.cpu):null,
                    gpu: recReq.gpu? compareService.compareGpu(pcSpecs.gpu,recReq.gpu):null,
                    ram: recReq.ram? pcSpecs.ram>=recReq.ram:null
                },
            };
    return res.status(200).json({
            response: response,
            message: "Requirements Fetched Successfully",
            success: true
    });
    } catch (error) {
       console.log(error.message);
       return res.status(502).json({
           message: "Failed to fetch game requirements",
           success: false
       });
    }
}

const fetchGameDetails = async (req,res) =>{
    try {
    const {id} = req.query;
    const [result, screenshots, storesRaw] = await Promise.all([
        gameService.fetchGameDetails(id),
        gameService.fetchGameScreenshots(id).catch(() => []),
        gameService.fetchGameStores(id).catch(() => []),
    ]);
    const pcRequirements = getPcRequirements(result);
    const minReq = compareSpecs.parseRequirements(pcRequirements.minimum);
    const recReq = compareSpecs.parseRequirements(pcRequirements.recommended);

    const storeMetaById = new Map((result.stores || []).map((s) => [s.store.id, s.store]));
    const stores = storesRaw
        .filter((s) => s.url && storeMetaById.has(s.store_id))
        .map((s) => ({
            id: s.store_id,
            name: storeMetaById.get(s.store_id).name,
            domain: storeMetaById.get(s.store_id).domain,
            url: s.url,
        }));

    const response = {
                id: id,
                req:{
                    min: {
                        cpu: minReq.cpu.join(' / '),
                        gpu: minReq.gpu.join(' / '),
                        ram: minReq.ram
                    },
                    rec: {
                        cpu: recReq.cpu.join(' / '),
                        gpu: recReq.gpu.join(' / '),
                        ram: recReq.ram
                    }
                },
                name: result.name,
                description_raw: result.description_raw,
                background_image: result.background_image,
                metacritic: result.metacritic,
                genres: result.genres,
                platforms: result.platforms,
                released: result.released,
                developers: (result.developers || []).map((d) => d.name),
                publishers: (result.publishers || []).map((p) => p.name),
                stores,
                screenshots: screenshots.map((s) => ({ id: s.id, image: s.image })),
            };
    return res.status(200).json({
            response: response,
            message: "Home Page Games Fetched Successfully",
            success: true
    });
    } catch (error) {
       console.log(error.message);
       return res.status(404).json({
           message: "Game not found",
           success: false
       });
    }
}

module.exports={
    fetchHomePageGames,
    fetchGameDetails,
    fetchRequirements
}