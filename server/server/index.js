const express = require('express');
const path = require('path');
const router = require('./router.js');
const { connectToDB } = require('./models.js');
const app = express();
const port = 8888;

app.use(express.json());
app.use('/', router);

connectToDB().then(() => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});

module.exports = app;
