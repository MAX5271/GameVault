const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');
const authController = require('../../controllers/authController');
const gameController = require('../../controllers/gameController');
const scoreController = require('../../controllers/scoreController');
const { verifyJWT } = require('../../middlewares/verifyJWT');

router.post('/register',userController.createUser);
router.post('/user/game/add',verifyJWT,userController.addStatus);
router.post('/user/game',verifyJWT,userController.getStatus);
router.post('/user/updateGame',verifyJWT,userController.updateStatus);
router.post('/user/removeGame',verifyJWT,userController.removeGame);
router.post('/user/setSpecs',verifyJWT,userController.setPcSpecs);
router.post('/user/searchCpu',userController.searchCpu);
router.post('/user/searchGpu',userController.searchGpu);

router.get('/user/getSpecs',verifyJWT,userController.getPcSpecs);
router.get('/user/:username',verifyJWT,userController.getUser);
router.get('/user/games',verifyJWT,userController.getUserGames);

router.patch('/user',verifyJWT,userController.updateUserPassword);
router.delete('/user',verifyJWT,userController.deleteUser);



router.post('/login',authController.handleLogin);
router.get('/logout',authController.handleLogout);
router.get('/refresh',authController.handleRefreshToken);



router.get('/games',gameController.fetchHomePageGames);
router.get('/game',gameController.fetchGameDetails);
router.get('/gameRec',verifyJWT,gameController.fetchRequirements);



router.get('/cpuScore',scoreController.cpuScore);
router.get('/gpuScore',scoreController.gpuScore);


module.exports = router;