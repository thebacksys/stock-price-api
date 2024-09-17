const express = require('express');
const routes = require('./src/routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;