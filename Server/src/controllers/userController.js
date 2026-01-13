const userService = require('../services/userService');

const createUser = async (req,res)=>{
    try {
        const response = await userService.createUser(req.body.username,req.body.password);
        return res.status(201).json({
            "Message":"User created Successfully",
            "Response": response,
            "Success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(409).json({
            "Message": error.message,
            "Success": false
        });
    }
}

const updateUserPassword = async (req,res)=>{
    try {
        const response = await userService.updateUserPassword(req.user,req.body.password,req.body.newPassword);
        return res.status(200).json({
            "Message":"Changed password successfully",
            "Response": response,
            "Success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({
            "Message": error.message,
            "Success": false
        });
    }
}

const deleteUser = async (req,res)=>{
    try {
        const response = await userService.deleteUser(req.user,req.body.password);
        return res.status(200).json({
            "Message":"Deleted user successfully",
            "Response": response,
            "Success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({
            "Message": error.message,
            "Success": false
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
            "Message":"User fetched successfully",
            "Response": result,
            "Success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "Message": error.message,
            "Success": false
        });
    }
}

const addWantToPlay = async (req,res)=>{
    try {
        const username = req.user;
        const response = await userService.addWantToPlay(username,req.body.gameId);
        return res.status(200).json({
            "Message":"Game added successfully",
            "Response": response,
            "Success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "Message": error.message,
            "Success": false
        });
    }
}

const removeWantToPlay = async (req,res)=>{
    try {
        const username = req.user;
        const response = await userService.removeWantToPlay(username,req.body.gameId);
        return res.status(200).json({
            "Message":"Game removed successfully",
            "Response": response,
            "Success": true
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            "Message": error.message,
            "Success": false
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