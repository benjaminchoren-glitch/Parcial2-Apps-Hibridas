const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');

// Lectura de catálogo
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getService);

// Operaciones de escritura protegidas con JWT
router.post('/', authMiddleware, serviceController.createService);
router.put('/:id', authMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router;