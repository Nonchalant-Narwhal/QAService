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
  console.log('\x1b[32m', 'successfully connected to DB!', '\x1b[0m');
});
const getQuery = queryText => {
  (async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const res = await client.query(queryText);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  })().catch(e => console.error(e.stack));

  // const postQuery = (queryText, is) => {
  //   (async () => {
  //     const client = await pool.connect();
  //     try {
  //       await client.query('BEGIN');
  //       const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id';
  //       const res = await client.query(queryText, ['brianc']);
  //       const insertPhotoText =
  //         'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)';
  //       const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo'];
  //       await client.query(insertPhotoText, insertPhotoValues);
  //       await client.query('COMMIT');
  //     } catch (e) {
  //       await client.query('ROLLBACK');
  //       throw e;
  //     } finally {
  //       client.release();
  //     }
  //   })().catch(e => console.error(e.stack));

  // const putQuery = (queryText, is) => {
  //   (async () => {
  //     const client = await pool.connect();
  //     try {
  //       await client.query('BEGIN');
  //       const queryText = 'INSERT INTO users(name) VALUES($1) RETURNING id';
  //       const res = await client.query(queryText, ['brianc']);
  //       const insertPhotoText =
  //         'INSERT INTO photos(user_id, photo_url) VALUES ($1, $2)';
  //       const insertPhotoValues = [res.rows[0].id, 's3.bucket.foo'];
  //       await client.query(insertPhotoText, insertPhotoValues);
  //       await client.query('COMMIT');
  //     } catch (e) {
  //       await client.query('ROLLBACK');
  //       throw e;
  //     } finally {
  //       client.release();
  //     }
  //   })().catch(e => console.error(e.stack));
};
const connectToDB = () => {
  return new Promise((resolve, reject) => {
    pool
      .query('SELECT * FROM answers limit 1')
      .then(res => {
        console.log(res.rows);
        resolve(res.rows);
      })
      .catch(err => {
        console.error(err.stack);
        reject(err);
      });
  });
};

// const pool = new Pool();
// module.exports = {
//   query: (text, params, callback) => {
//     return pool.query(text, params, callback);
//   }
// };

module.exports = { connectToDB: connectToDB, getQuery: getQuery };
