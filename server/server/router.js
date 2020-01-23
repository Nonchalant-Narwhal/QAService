const router = require('express').Router();
const dateformat = require('dateformat');
const { pgQuery } = require('./models.js');
const getQueryParser = require('./parsers/getQueryParsers.js');

const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient({
  host: process.env.REDISHOST || 'redis'
});
const asyncRedisClientSet = promisify(redisClient.set).bind(redisClient);
let currentDate = () => {
  return dateformat('isoDate');
};

// Gets questions and answers/photos for a product
router.get('/qa/:product_id', (req, res) => {
  let product_id = req.params.product_id;

  redisClient.get(product_id, (err, result) => {
    if (result) {
      res.status(200).send(JSON.parse(result));
    } else {
      let limit = req.query.count || 5;
      let offset = req.query.page * limit || 0;
      let columns =
        'q.question_id, q.question_body, q.question_date, q.asker_name, q.question_helpfulness, q.reported, a.answer_id, a.body, a.date_written, a.answerer_name, a.helpfulness, asph.id, asph.url';
      pgQuery(
        `SELECT ${columns}
          FROM (
              SELECT *
              FROM questions
              WHERE product_id = $1 AND reported = 0
          ) AS q
          LEFT JOIN answers AS a ON q.question_id = a.question_id AND q.reported = 0
          LEFT JOIN answer_photos AS asph ON a.answer_id = asph.answer_id OFFSET $2 LIMIT $3`,
        [Number(product_id), offset, limit]
      )
        .then(result => {
          let parsed = getQueryParser.getProducts(result.rows, product_id);
          asyncRedisClientSet(product_id, JSON.stringify(parsed), 'EX', 30)
            .then(() => {
              res.status(200);
              res.send(parsed);
            })
            .catch(err => {
              console.error(err);
              res.sendStatus(400);
            });
        })
        .catch(err => {
          console.error(err);
        });
    }
  });
});
// Gets answers for a particular question
router.get('/qa/:question_id/answers', (req, res) => {
  let { question_id } = req.params;
  let limit = req.query.count || 5;
  let page = req.query.page * limit || 0;
  const columns =
    'a.answer_id, a.body, a.date_written, a.answerer_name, a.helpfulness, asph.id, asph.url';
  pgQuery(
    `SELECT ${columns} 
        FROM answers AS a 
    LEFT JOIN answer_photos AS asph ON a.answer_id = asph.answer_id 
    WHERE question_id = $1 AND a.reported = 0 OFFSET $2 LIMIT $3`,
    [Number(question_id), page, limit]
  )
    .then(result => {
      let parsed = getQueryParser.getAnswers(
        result.rows,
        question_id,
        (page = 0),
        (count = 0)
      );
      res.send(parsed);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

// Adds a question for the given product
router.post('/qa/:product_id', (req, res) => {
  let { product_id } = req.params;
  // default params!
  let { body, name, email } = req.body;
  console.log(`
  Product ID: ${product_id}
  BODY: ${body}
  NAME: ${name}
  email: ${email}`);
  pgQuery(
    `INSERT INTO questions 
  (product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) 
  VALUES 
  ($1, $2, $3, $4, $5, 0, '0')`,
    [Number(product_id), body, currentDate(), name, email]
  )
    .then(() => {
      res.sendStatus(201);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

// Adds an answer for the given question
router.post('/qa/:question_id/answers', (req, res) => {
  let { question_id } = req.params;
  let { body, name, email, photos } = req.body;
  let pg1Params = [Number(question_id), body, currentDate(), name, email];
  let parsedPhotos = [];
  if (photos) {
    try {
      parsedPhotos = JSON.parse(photos);
    } catch (err) {
      console.error;
      parsedPhotos = [];
    }
  }
  // need two queries because can't use same prepared values in two seperate queries, IN one transaction.
  pgQuery(
    'INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpfulness) VALUES ($1, $2, $3, $4, $5, 0, 0)',
    pg1Params
  )
    .then(() => {
      let pg2Params = [];
      let paramaterized = [];
      if (parsedPhotos.length > 0) {
        parsedPhotos.forEach((value, i) => {
          // incremement value of each placeholder and insert currval()
          pg2Params.push(`${value}`);
          paramaterized.push(`(currval('answers_answer_id_seq'), $${i + 1})`);
        });
        pgQuery(
          `INSERT INTO answer_photos (answer_id, url) VALUES ${paramaterized.toString()}`,
          pg2Params
        )
          .then(() => {
            res.sendStatus(201);
          })
          .catch(err => {
            console.error(err);
            res.sendStatus(400);
          });
      } else {
        res.sendStatus(201);
      }
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

//  Updates a question to show it was found helpful.
router.put('/qa/question/:question_id/helpful', (req, res) => {
  let { question_id } = req.params;
  pgQuery(
    `UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = $1;`,
    [Number(question_id)]
  )
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

// PUT  Updates a question to show it was reported.
router.put('/qa/question/:question_id/report', (req, res) => {
  let { question_id } = req.params;
  pgQuery(
    `UPDATE questions SET reported = reported + 1 WHERE question_id = $1`,
    [Number(question_id)]
  )
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

// Updates an answer to show it was found helpful.
router.put('/qa/answer/:answer_id/helpful', (req, res) => {
  let { answer_id } = req.params;
  pgQuery(
    `UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = $1`,
    [Number(answer_id)]
  )
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

// Updates an answer to show it has been reported.
router.put('/qa/answer/:answer_id/report', (req, res) => {
  let { answer_id } = req.params;
  pgQuery(`UPDATE answers SET reported = reported + 1 WHERE answer_id = $1`, [
    Number(answer_id)
  ])
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

// loader.io verification
router.get(`/${process.env.LOADERIO}`, (req, res) => {
  res.send(`${process.env.LOADERIO}`);
});

module.exports = router;
