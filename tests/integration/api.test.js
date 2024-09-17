const request = require('supertest');
const app = require('../../app');
const yahooFinance = require('yahoo-finance2').default;

jest.mock('yahoo-finance2', () => ({
  default: {
    search: jest.fn(),
    quote: jest.fn()
  }
}));

describe('Stock API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/stock/:identifier', () => {
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

      const response = await request(app).get('/api/stock/AAPL');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        price: 150,
        change: 2,
        changePercent: 1.33
      });
    });

    it('should return stock data for a valid company name', async () => {
      const mockSearchResult = {
        quotes: [{ quoteType: 'EQUITY', symbol: 'GOOGL', shortname: 'Alphabet Inc.' }]
      };
      yahooFinance.search.mockResolvedValue(mockSearchResult);
      
      const mockQuote = {
        symbol: 'GOOGL',
        longName: 'Alphabet Inc.',
        regularMarketPrice: 2800,
        regularMarketChange: 50,
        regularMarketChangePercent: 1.79
      };
      yahooFinance.quote.mockResolvedValue(mockQuote);

      const response = await request(app).get('/api/stock/Google');
      
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        symbol: 'GOOGL',
        companyName: 'Alphabet Inc.',
        price: 2800,
        change: 50,
        changePercent: 1.79
      });
    });

    it('should return 404 for unknown company', async () => {
      yahooFinance.search.mockResolvedValue({ quotes: [] });

      const response = await request(app).get('/api/stock/UnknownCompany');
      
      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        error: 'Unable to fetch stock data',
        message: 'Company or symbol not found'
      });
    });

    it('should return 502 for Yahoo Finance API search errors', async () => {
      yahooFinance.search.mockRejectedValue(new Error('Yahoo Finance API Error'));

      const response = await request(app).get('/api/stock/ErrorCompany');
      
      expect(response.status).toBe(502);
      expect(response.body).toMatchObject({
        error: 'Unable to fetch stock data',
        message: 'External service error'
      });
    });

    it('should return 502 for Yahoo Finance API quote errors', async () => {
      const mockSearchResult = {
        quotes: [{ quoteType: 'EQUITY', symbol: 'ERROR', shortname: 'Error Company' }]
      };
      yahooFinance.search.mockResolvedValue(mockSearchResult);
      yahooFinance.quote.mockRejectedValue(new Error('Yahoo Finance API Error'));

      const response = await request(app).get('/api/stock/ERROR');
      
      expect(response.status).toBe(502);
      expect(response.body).toMatchObject({
        error: 'Unable to fetch stock data',
        message: 'External service error'
      });
    });

    it('should return 502 for invalid data from Yahoo Finance', async () => {
      const mockSearchResult = {
        quotes: [{ quoteType: 'EQUITY', symbol: 'INVALID', shortname: 'Invalid Company' }]
      };
      yahooFinance.search.mockResolvedValue(mockSearchResult);
      yahooFinance.quote.mockResolvedValue(null);

      const response = await request(app).get('/api/stock/INVALID');
      
      expect(response.status).toBe(502);
      expect(response.body).toMatchObject({
        error: 'Unable to fetch stock data',
        message: 'External service returned invalid data'
      });
    });
  });
});