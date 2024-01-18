const express = require('express');
const { loginController } = require('../../controllers/auth/loginController');
const refreshController = require('../../controllers/auth/refreshController');
const checkRefresh = require('../../middleware/jwt/checkRefresh');
const { changePasswordController } = require('../../controllers/auth/changePasswordController');
const { resetPasswordController } = require('../../controllers/auth/resetPasswordController');
const validateResetPassword = require('../../controllers/auth/validateResetPassword');
const router = express.Router();


router.post('/login', loginController);
router.post('/change-password', changePasswordController);
router.post('/reset-password', resetPasswordController);
router.get('/reset-password/:hash', validateResetPassword, changePasswordController);
router.get('/refresh', checkRefresh, refreshController);


module.exports = router;
