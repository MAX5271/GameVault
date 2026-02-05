const userService = require('../services/userService');
const specsRepository = require("../repository/specsRepository");

const createUser = async (req,res)=>{
    try {
        const response = await userService.createUser(req.body.username,req.body.password);
        return res.status(201).json({
            "message":"User created successfully",
            "response": response,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(409).json({
            "message": error.message,
            "success": false
        });
    }
}

const updateUserPassword = async (req,res)=>{
    try {
        const response = await userService.updateUserPassword(req.user,req.body.password,req.body.newPassword);
        return res.status(200).json({
            "message":"Changed password successfully",
            "response": response,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({
            "message": error.message,
            "success": false
        });
    }
}

const deleteUser = async (req,res)=>{
    try {
        const response = await userService.deleteUser(req.user,req.body.password);
        return res.status(200).json({
            "message":"Deleted user successfully",
            "response": response,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({
            "message": error.message,
            "success": false
        });
    }
}

const getUser = async (req,res)=>{
    try {
        const username = req.user;
        const response = await userService.getUser(username);
          const result = {
            username: response.username,
            games: response.games,
            reviews: response.reviews,
          };
        return res.status(200).json({
            "message":"User fetched successfully",
            "response": result,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const getUserGames = async (req,res) => {
    try {
        const username = req.user;
        const response = await userService.getUserGames(username);
        return res.status(200).json({
            "message":"User's games fetched successfully",
            "response": response,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const addStatus = async (req,res) => {
    try {
        const username = req.user;
        const response = await userService.addStatus(username,req.body.gameId,req.body.status);
 
        return res.status(200).json({
            "message":"Games's status added successfully",
            "response": response,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const getStatus = async (req,res) => {
    try {
        const username = req.user;
        const response = await userService.getStatus(username,req.body.gameId);
        return res.status(200).json({
            "message":"Games's status added successfully",
            "response": response,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const updateStatus = async (req,res) => {
    try {
        const username = req.user;
        const response = await userService.updateStatus(username,req.body.gameId,req.body.status);
        return res.status(200).json({
            "message":"Games's status added successfully",
            "response": response,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const removeGame = async (req,res) => {
    try {
        const username = req.user;
        const response = await userService.updateStatus(username,req.body.gameId);
        return res.status(200).json({
            "message":"Games removed successfully",
            "response": response,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const setPcSpecs = async (req,res) => {
    try {
        const username = req.user;
        const response = await userService.setPcSpecs(username,req.body.cpu,req.body.gpu,req.body.ram);
        return res.status(200).json({
            "message":"Data updated successfully",
            "response": response,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const getPcSpecs = async (req,res) => {
    try {
        const username = req.user;
        const response = await userService.getPcSpecs(username);
        return res.status(200).json({
            "message":"Data Fetched successfully",
            "response": response,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const searchCpu = (req,res) => {
    try {
        const cpuArray = specsRepository.searchCpu(req.body.cpu);
        return res.status(200).json({
            "message":"Data Fetched successfully",
            "response": cpuArray,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const searchGpu = (req,res) => {
    try {
        const gpuArray = specsRepository.searchGpu(req.body.gpu);
        return res.status(200).json({
            "message":"Data Fetched successfully",
            "response": gpuArray,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const addReview = async (req,res) => {
    try {
        const username = req.user;
        const result = await userService.addReview(username,req.body.gameId,req.body.rating);
        return res.status(200).json({
            "message":"Review added successfully",
            "response": result,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const updateReview = async (req,res) => {
    try {
        const username = req.user;
        const result = await userService.updateReview(username,req.body.gameId,req.body.rating);
        return res.status(200).json({
            "message":"Review updated successfully",
            "response": result,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

const getReview = async (req,res) => {
    try {
        const username = req.user;
        const {gameId} = req.query;
        const result = await userService.getReview(username,gameId);
        return res.status(200).json({
            "message":"Review fetched successfully",
            "response": result,
            "success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "message": error.message,
            "success": false
        });
    }
}

module.exports = {
    getUser,
    createUser,
    deleteUser,
    updateUserPassword,
    getUserGames,
    addStatus,
    getStatus,
    updateStatus,
    removeGame,
    setPcSpecs,
    getPcSpecs,
    searchCpu,
    searchGpu,
    addReview,
    updateReview,
    getReview
}