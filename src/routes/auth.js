const authController = require('../controllers/authControllers');

const router = require('express').Router();

router.post('/register', authController.registerUser);
router.post('/google/verify', authController.loginGoogle);
router.post('/login', authController.loginUser);
router.post("/refresh", authController.requestRefreshToken);

module.exports = router;