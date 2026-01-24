const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');
const authController = require('../../controllers/authController');
const gameController = require('../../controllers/gameController');
const { verifyJWT } = require('../../middlewares/verifyJWT');

router.post('/register',userController.createUser);
router.post('/user/game/add',verifyJWT,userController.addStatus);
router.post('/user/game',verifyJWT,userController.getStatus);
router.post('/user/updateGame',verifyJWT,userController.updateStatus);
router.post('/user/removeGame',verifyJWT,userController.removeGame);
router.get('/user/:username',verifyJWT,userController.getUser);
router.get('/user/games',verifyJWT,userController.getUserGames);
router.patch('/user',verifyJWT,userController.updateUserPassword);
router.delete('/user',verifyJWT,userController.deleteUser);

router.post('/login',authController.handleLogin);
router.get('/logout',authController.handleLogout);
router.get('/refresh',authController.handleRefreshToken);

router.get('/games',gameController.fetchHomePageGames);
router.get('/game',gameController.fetchGameDetails)

module.exports = router;