const express = require('express');
const router = require('express').Router();
const path = require('path');
const { connectToDB } = require('./dbpool.js');
const app = express();
const port = 8888;

app.use('/', router);
app.get('/', (req, res) => res.send("Hello Worl d! I'm running in docker"));

connectToDB().then(() => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
