const express = require('express');
const path = require('path');
const router = require('./router.js');
const { connectToDB } = require('./models.js');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use('/', router);

connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`QADBService listening on port ${port}!`);
      console.log(`ENV VARS
      LOADERIO:${process.env.LOADERIO}
      DBUSERNAME:${process.env.DBUSERNAME}
      DBPASSWORD:${process.env.DBPASSWORD}
      DB:${process.env.DB}
      DBHOST:${process.env.DBHOST}
      DBPORT:${process.env.DBPORT}
      MAXCLIENTS:${process.env.MAXCLIENTS}`);
    });
  })
  .catch(err => {
    console.error('NOT CONNECTED TO DB');
    console.error(err);
    app.listen(port, () =>
      console.log(`QADBService listening on port ${port}!`)
    );
  });

module.exports = app;
