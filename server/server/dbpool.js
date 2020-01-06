const { Pool } = require('pg');

const connectToDB = () => {
  return new Promise((resolve, reject) => {
    const pool = new Pool({
      user: 'dude',
      password: 'qanon',
      database: 'qa',
      host: 'localhost',
      port: 5431
    });

    pool
      .query('SELECT * FROM answers limit 3')
      .then(res => {
        console.log('LENGTH OF RESULTS', res.rows.length);
        resolve(res.rows);
      })
      .catch(err => {
        console.error(err.stack);
        reject(err);
      });
  });
};

module.exports = { connectToDB: connectToDB };
