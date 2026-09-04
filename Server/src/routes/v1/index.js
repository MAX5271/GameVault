const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');
const authController = require('../../controllers/authController');
const gameController = require('../../controllers/gameController');
const scoreController = require('../../controllers/scoreController');
const { verifyJWT } = require('../../middlewares/verifyJWT');
const { authLimiter } = require('../../middlewares/rateLimiter');

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'active', message: 'GameVault server is awake' });
});

router.post('/register',authLimiter,userController.createUser);
router.post('/user/game/add',verifyJWT,userController.addStatus);
router.post('/user/game',verifyJWT,userController.getStatus);
router.post('/user/updateGame',verifyJWT,userController.updateStatus);
router.post('/user/removeGame',verifyJWT,userController.removeGame);
router.post('/user/setSpecs',verifyJWT,userController.setPcSpecs);
router.post('/user/searchCpu',userController.searchCpu);
router.post('/user/searchGpu',userController.searchGpu);
router.post('/user/addReview',verifyJWT,userController.addReview);
router.post('/user/updateReview',verifyJWT,userController.updateReview);

router.get('/user/getSpecs',verifyJWT,userController.getPcSpecs);
router.get('/user/games',verifyJWT,userController.getUserGames);
router.get('/user/review',verifyJWT,userController.getReview);
router.get('/user/:username',verifyJWT,userController.getUser);

router.patch('/user',verifyJWT,userController.updateUserPassword);
router.delete('/user',verifyJWT,userController.deleteUser);

router.post('/login',authLimiter,authController.handleLogin);
router.get('/logout',authController.handleLogout);
router.get('/refresh',authLimiter,authController.handleRefreshToken);

router.get('/games',gameController.fetchHomePageGames);
router.get('/game',gameController.fetchGameDetails);
router.get('/gameRec',verifyJWT,gameController.fetchRequirements);

router.get('/cpuScore',scoreController.cpuScore);
router.get('/gpuScore',scoreController.gpuScore);

module.exports = router;