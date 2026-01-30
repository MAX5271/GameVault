const scoreServices = require('../services/scoreServices');

const cpuScore = (req,res) => {
    try {
        const {cpu} = req.query;
        const response = scoreServices.cpuScore(cpu);
        return res.status(200).json({
            "message":"Data Fetched successfully",
            "response": response[0].g3dMark,
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

const gpuScore = (req,res) => {
    try {
        const {gpu} = req.query;
        const response = scoreServices.gpuScore(gpu);
        return res.status(200).json({
            "message":"Data Fetched successfully",
            "response": response[0].g3dMark,
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
    cpuScore,
    gpuScore
}