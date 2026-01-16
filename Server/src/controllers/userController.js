const userService = require('../services/userService');

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
            wantToPlay: response.wantToPlay,
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

const addWantToPlay = async (req,res)=>{
    try {
        const username = req.user;
        const response = await userService.addWantToPlay(username,req.body.gameId);
        return res.status(200).json({
            "message":"Game added successfully",
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

const removeWantToPlay = async (req,res)=>{
    try {
        console.log(req.user,req.body.gameId);
        const username = req.user;
        const response = await userService.removeWantToPlay(username,req.body.gameId);
        return res.status(200).json({
            "message":"Game removed successfully",
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

module.exports = {
    getUser,
    createUser,
    deleteUser,
    updateUserPassword,
    addWantToPlay,
    removeWantToPlay
}