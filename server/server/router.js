const router = require('express').Router();
const dateformat = require('dateformat');
const { pgquery } = require('./models.js');
const getQueryParser = require('./parsers/getQueryParsers.js');

let currentDate = () => {
  return dateformat('isoDate');
};

router.get('/qa/:product_id', (req, res) => {
  let product_id = req.params.product_id;
  let offset = req.query.page || 'null';
  let limit = req.query.count || 'null';
  let columns =
    'q.question_id, q.question_body, q.question_date, q.asker_name, q.question_helpfulness, q.reported, a.answer_id, a.body, a.date_written, a.answerer_name, a.helpfulness, asph.id, asph.url';
  pgquery(
    `SELECT ${columns}
      FROM (
          SELECT *
          FROM questions
          WHERE product_id = ${product_id}
      ) AS q
      LEFT JOIN answers AS a ON q.question_id = a.question_id AND q.reported = 0
      LEFT JOIN answer_photos AS asph ON a.answer_id = asph.answer_id OFFSET ${offset} LIMIT ${limit}`
  )
    .then(result => {
      let parsed = getQueryParser.getProducts(result.rows, product_id);
      res.status(200);
      res.send(parsed);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

router.get('/qa/:question_id/answers', (req, res) => {
  let { question_id } = req.params;
  let { page = 'NULL', count = 'NULL' } = req.query;
  const columns =
    'a.answer_id, a.body, a.date_written, a.answerer_name, a.helpfulness, asph.id, asph.url';
  pgquery(
    `SELECT ${columns} 
        FROM answers AS a 
    LEFT JOIN answer_photos AS asph ON a.answer_id = asph.answer_id 
    WHERE question_id = ${question_id} LIMIT ${count} OFFSET ${page}`
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

// POST /qa/:product_id Adds a question for the given product
router.post('/qa/:product_id', (req, res) => {
  let { product_id } = req.params;
  let { body = 'NULL', name = 'NULL', email = 'NULL' } = req.query;
  pgquery(
    `INSERT INTO questions 
  (product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) 
  VALUES 
  ('${product_id}', '${body}', '${currentDate()}', '${name}', '${email}', 0, '0')`
  )
    .then(() => {
      res.sendStatus(201);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});

// POST /qa/:question_id/answers Adds an answer for the given question
router.post('/qa/:question_id/answers', (req, res) => {
  let { question_id } = req.params;
  let { body, name, email, photos } = req.query;
  let parsedPhotos = JSON.parse(photos);
  let photoString = parsedPhotos
    .map(value => {
      return `(currval('answers_answer_id_seq'), '${value}')`;
    })
    .toString();
  console.log(photoString);

  pgquery(`
  START TRANSACTION;
    INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpfulness)
      VALUES ('${question_id}', '${body}', '${currentDate()}', '${name}', '${email}',0,0);
    INSERT INTO answer_photos (answer_id, url) VALUES ${photoString};
    SELECT * FROM answers, answer_photos WHERE answers.answer_id = currval('answers_answer_id_seq') AND answer_photos.answer_id = currval('answers_answer_id_seq');
  COMMIT;`)
    .then(result => {
      res.status(201);
      res.send(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});
// params:product_id, BODY PARAMS {body,name, email,photos[text]}, responds 201 CREATED

// PUT /qa/question/:question_id/helpful Updates a question to show it was found helpful.
// params:question_id, responds 204 NO CONTENT

// PUT /qa/question/:question_id/report  Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.
// params:question_id responds 204 NO CONTENT

// PUT /qa/answer/:answer_id/helpful Updates an answer to show it was found helpful.
// params: answer_id responds 204 NO CONTENT

// PUT /qa/answer/:answer_id/report  Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request.
// params: answer_id responds 204 CONTENT

module.exports = router;
