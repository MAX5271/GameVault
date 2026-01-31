const gameService = require('../services/gameService');
const compareSpecs = require("../utils/compareSpecs");
const userService = require("../services/userService");
const compareService = require('../services/compareService');

const fetchHomePageGames = async (req,res) => {
    try {
        const {search,page} = req.query;
        const result = await gameService.fetchHomePageGames(search,page);
        return res.status(200).json({
            response: result,
            message: "Home Page Games Fetched Successfully",
            success: true
        });
    } catch (error) {
        console.log(error.message);
    }
}

const fetchRequirements = async (req,res) =>{
    try {
    const username = req.user;
    const {id} = req.query;
    const pcSpecs = await userService.getPcSpecs(username);
    const result = await gameService.fetchGameDetails(id);
    const minReq = compareSpecs.parseRequirements(result.platforms.filter((p)=>p.platform.name=="PC")[0].requirements.minimum);
    const recReq = compareSpecs.parseRequirements(result.platforms.filter((p)=>p.platform.name=="PC")[0].requirements.recommended);

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
    }
}

const fetchGameDetails = async (req,res) =>{
    try {
    const {id} = req.query;
    const result = await gameService.fetchGameDetails(id);
    const minReq = compareSpecs.parseRequirements(result.platforms.filter((p)=>p.platform.name=="PC")[0].requirements.minimum);
    const recReq = compareSpecs.parseRequirements(result.platforms.filter((p)=>p.platform.name=="PC")[0].requirements.recommended);

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
                platforms: result.platforms
            };
    return res.status(200).json({
            response: response,
            message: "Home Page Games Fetched Successfully",
            success: true
    });
    } catch (error) {
       console.log(error.message); 
    }
}

module.exports={
    fetchHomePageGames,
    fetchGameDetails,
    fetchRequirements
}