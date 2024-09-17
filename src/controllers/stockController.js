const stockService = require('../services/stockService');

exports.getStockData = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const stockData = await stockService.getStockData(identifier);
    res.json(stockData);
  } catch (error) {
    console.error(`Error in stockController for ${req.params.identifier}:`, error);
    if (error.message === 'Company or symbol not found') {
      res.status(404).json({ error: 'Unable to fetch stock data', message: error.message });
    } else if (error instanceof stockService.YahooFinanceAPIError) {
      res.status(502).json({ error: 'Unable to fetch stock data', message: 'External service error' });
    } else if (error instanceof stockService.InvalidDataError) {
      res.status(502).json({ error: 'Unable to fetch stock data', message: 'External service returned invalid data' });
    } else {
      res.status(500).json({ error: 'Internal server error', message: 'An unexpected error occurred' });
    }
  }
};