const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Stock Price API listening at http://localhost:${port}`);
});