const express = require('express');
const client = require('prom-client');

const app = express();

// Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const counter = new client.Counter({
  name: 'hello_requests_total',
  help: 'Total hello requests'
});

app.get('/', (req, res) => {
  counter.inc();
  res.send('Hello from CI/CD demo!');
});

// metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

module.exports = app;
