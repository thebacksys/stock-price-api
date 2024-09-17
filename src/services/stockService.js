const yahooFinance = require('yahoo-finance2').default;
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300 });

class YahooFinanceAPIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'YahooFinanceAPIError';
  }
}

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidDataError';
  }
}

async function searchCompany(query) {
  try {
    const results = await yahooFinance.search(query);
    if (results.quotes && results.quotes.length > 0) {
      const equityResults = results.quotes.filter(quote => quote.quoteType === 'EQUITY');
      
      if (equityResults.length > 0) {
        const exactMatch = equityResults.find(quote => 
          quote.symbol.toLowerCase() === query.toLowerCase() ||
          quote.shortname?.toLowerCase() === query.toLowerCase() ||
          quote.longname?.toLowerCase() === query.toLowerCase()
        );
        
        return exactMatch || equityResults[0];
      }
    }
    return null;
  } catch (error) {
    console.error(`Error searching for ${query}:`, error);
    throw new YahooFinanceAPIError('Error occurred while searching for company');
  }
}

async function getStockData(identifier) {
  try {
    const cachedData = cache.get(identifier);
    if (cachedData) {
      return cachedData;
    }

    const searchResult = await searchCompany(identifier);
    if (!searchResult || !searchResult.symbol) {
      throw new Error('Company or symbol not found');
    }

    const symbol = searchResult.symbol;
    let quote;
    try {
      quote = await yahooFinance.quote(symbol);
    } catch (error) {
      throw new YahooFinanceAPIError('Error occurred while fetching quote data');
    }
    
    if (!quote || typeof quote !== 'object') {
      throw new InvalidDataError('Invalid data received from Yahoo Finance');
    }

    const stockData = {
      symbol: quote.symbol || symbol,
      companyName: quote.longName || quote.shortName || searchResult.shortname || searchResult.longname || 'N/A',
      price: quote.regularMarketPrice || quote.currentPrice || 'N/A',
      change: quote.regularMarketChange || 'N/A',
      changePercent: quote.regularMarketChangePercent || 'N/A',
      timestamp: new Date().toISOString()
    };

    cache.set(identifier, stockData);
    cache.set(symbol, stockData);

    return stockData;
  } catch (error) {
    console.error(`Error fetching stock data for ${identifier}:`, error);
    throw error; // Re-throw the error to be handled by the controller
  }
}

module.exports = {
  getStockData,
  searchCompany,
  YahooFinanceAPIError,
  InvalidDataError
};