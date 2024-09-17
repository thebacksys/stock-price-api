const yahooFinance = require('yahoo-finance2').default;
const { getStockData, searchCompany, YahooFinanceAPIError, InvalidDataError } = require('../../src/services/stockService');

// Mock the yahooFinance module
jest.mock('yahoo-finance2', () => ({
  default: {
    search: jest.fn(),
    quote: jest.fn()
  }
}));

describe('Stock Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchCompany', () => {
    it('should return the first equity result when searching by company name', async () => {
      const mockSearchResult = {
        quotes: [
          { quoteType: 'EQUITY', symbol: 'AAPL', shortname: 'Apple Inc.' },
          { quoteType: 'EQUITY', symbol: 'AAPL.BA', shortname: 'Apple Inc.' }
        ]
      };
      yahooFinance.search.mockResolvedValue(mockSearchResult);

      const result = await searchCompany('Apple');
      expect(result).toEqual({ quoteType: 'EQUITY', symbol: 'AAPL', shortname: 'Apple Inc.' });
      expect(yahooFinance.search).toHaveBeenCalledWith('Apple');
    });

    it('should return null when no results are found', async () => {
      yahooFinance.search.mockResolvedValue({ quotes: [] });

      const result = await searchCompany('NonexistentCompany');
      expect(result).toBeNull();
    });

    it('should throw YahooFinanceAPIError when an error occurs during search', async () => {
      yahooFinance.search.mockRejectedValue(new Error('API Error'));

      await expect(searchCompany('ErrorCompany')).rejects.toThrow(YahooFinanceAPIError);
    });
  });

  describe('getStockData', () => {
    it('should return stock data for a valid symbol', async () => {
      const mockSearchResult = {
        quotes: [{ quoteType: 'EQUITY', symbol: 'AAPL', shortname: 'Apple Inc.' }]
      };
      yahooFinance.search.mockResolvedValue(mockSearchResult);

      const mockQuote = {
        symbol: 'AAPL',
        longName: 'Apple Inc.',
        regularMarketPrice: 150,
        regularMarketChange: 2,
        regularMarketChangePercent: 1.33
      };
      yahooFinance.quote.mockResolvedValue(mockQuote);

      const result = await getStockData('AAPL');
      expect(result).toMatchObject({
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        price: 150,
        change: 2,
        changePercent: 1.33
      });
    });

    it('should throw an error for unknown company', async () => {
      yahooFinance.search.mockResolvedValue({ quotes: [] });

      await expect(getStockData('UnknownCompany')).rejects.toThrow('Company or symbol not found');
    });

    it('should throw YahooFinanceAPIError when an error occurs during quote fetch', async () => {
      const mockSearchResult = {
        quotes: [{ quoteType: 'EQUITY', symbol: 'ERROR', shortname: 'Error Company' }]
      };
      yahooFinance.search.mockResolvedValue(mockSearchResult);
      yahooFinance.quote.mockRejectedValue(new Error('API Error'));

      await expect(getStockData('ERROR')).rejects.toThrow(YahooFinanceAPIError);
    });

    it('should throw InvalidDataError when Yahoo Finance returns invalid data', async () => {
      const mockSearchResult = {
        quotes: [{ quoteType: 'EQUITY', symbol: 'INVALID', shortname: 'Invalid Company' }]
      };
      yahooFinance.search.mockResolvedValue(mockSearchResult);
      yahooFinance.quote.mockResolvedValue(null);

      await expect(getStockData('INVALID')).rejects.toThrow(InvalidDataError);
    });
  });
});