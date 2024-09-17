# 📈 Stock Price API

Welcome to the Stock Price API project! This Node.js application allows you to fetch real-time stock prices.

## 🚀 Features

- Retrieve stock data by ticker symbol (e.g., AAPL, GOOGL)
- Look up stocks by company name (e.g., "Apple", "Google")
- Real-time data powered by Yahoo Finance
- Built-in caching for improved performance
- Comprehensive error handling for a smooth experience

## 🛠 Technology Stack

- Node.js
- Express.js (for API routing)
- Yahoo Finance API (data source)
- Jest (for testing)

## 🏃‍♂️ Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/thebacksys/stock-price-api.git
   cd stock-price-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. The API is now running on `http://localhost:3000`.

## 🔍 API Usage

To get stock data, use the following endpoint:
```
GET /api/stock/:identifier
```

Replace `:identifier` with a stock symbol or company name. Examples:
- `GET /api/stock/AAPL`
- `GET /api/stock/Apple`

Sample response:
```json
{
  "symbol": "AAPL",
  "companyName": "Apple Inc.",
  "price": 150.25,
  "change": 2.75,
  "changePercent": 1.86,
  "timestamp": "2024-09-17T12:34:56.789Z"
}
```

## 🧪 Testing

- Run all tests: `npm test`
- Run unit tests: `npm run test:unit`
- Run integration tests: `npm run test:integration`

## 📮 Postman Collection

For easy testing and exploration of the API, a Postman collection is included in the project as `stock-api-postman-collection.json`.