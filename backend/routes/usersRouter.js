const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/registro', userController.register);
router.post('/login', userController.login);

// Rutas protegidas
router.get('/', authMiddleware, userController.getUsers);

module.exports = router;