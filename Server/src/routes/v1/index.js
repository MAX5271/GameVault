const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');
const authController = require('../../controllers/authController');
const { verifyJWT } = require('../../middlewares/verifyJWT');

router.post('/register',userController.createUser);
router.delete('/user',verifyJWT,userController.deleteUser);
router.get('/user/:username',verifyJWT,userController.getUser);
router.patch('/user',verifyJWT,userController.updateUserPassword);
router.patch('/user/addW',verifyJWT,userController.addWantToPlay);
router.patch('/user/removeW',verifyJWT,userController.removeWantToPlay);

router.post('/login',authController.handleLogin);
router.get('/logout',authController.handleLogout);
router.get('/refresh',authController.handleRefreshToken);

module.exports = router;