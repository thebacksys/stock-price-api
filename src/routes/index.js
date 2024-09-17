const express = require('express');
const stockController = require('../controllers/stockController');

const router = express.Router();

router.get('/stock/:identifier', stockController.getStockData);

module.exports = router;