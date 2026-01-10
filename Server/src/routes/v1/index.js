const express = require('express');
const router = express.Router();

const userController = require('../../controllers/userController');

router.post('/user',userController.createUser);
router.delete('/user/',userController.deleteUser);
router.get('/user/:username',userController.getUser);
router.patch('/user',userController.updateUserPassword);
router.patch('/user/addW/:username',userController.addWantToPlay);
router.patch('/user/removeW/:username',userController.removeWantToPlay);

module.exports = router;