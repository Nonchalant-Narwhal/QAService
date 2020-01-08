const { Pool } = require('pg');

// set these to environemnt variables eventually
const pool = new Pool({
  user: 'dude',
  password: 'qanon',
  database: 'qa',
  host: 'localhost',
  port: 5431
});

pool.on('connect', () => {
  console.log('\x1b[32m', 'Successfully connected to DB!', '\x1b[0m');
});
pool.on('acquire', () => {
  console.log('Client acquired');
  console.log('total clients in pool:', pool.totalCount);
});
pool.on('remove', () => {
  console.log('\x1b[33m', 'Client removed', '\x1b[0m');
});
pool.on('error', err => {
  console.error('\x1b[31m', err, '\x1b[0m');
});

const pgquery = queryText => {
  return new Promise((resolve, reject) => {
    pool.connect().then(client => {
      client
        .query(queryText)
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

module.exports = { connectToDB, pgquery };
