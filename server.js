/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');
const history = require('./http-rewrite/history-plugin');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;
const entryPoint = path.resolve(__dirname, 'dist', 'index.html');

app.use(express.static(path.resolve(__dirname, 'dist')));
app.use(history);

app.get('/', (_, res) => {
  res.sendFile(entryPoint);
});

app.get('/error-page-404', (_, res) => {
  res.statusCode = 404;
  res.sendFile(entryPoint);
});

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});
