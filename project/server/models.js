const { Pool } = require('pg');

// set these to environemnt variables eventually
const pool = new Pool({
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  database: process.env.DB,
  host: process.env.DBHOST,
  port: process.env.DBPORT || 5432,
  max: process.env.MAXCLIENTS || 20
});

const pgQuery = (queryText, values) => {
  return new Promise((resolve, reject) => {
    pool.connect().then(client => {
      client
        .query(queryText, values)
        .then(result => {
          resolve(result);
        })
        .catch(e => {
          reject(e);
        });
      client.release();
    });
  });
};

const connectToDB = () => {
  return new Promise((resolve, reject) => {
    pool
      .query('SELECT * FROM answers limit 1')
      .then(res => {
        resolve(res.rows);
      })
      .catch(err => {
        console.error(err.stack);
        reject(err);
      });
  });
};

module.exports = { connectToDB, pgQuery };
