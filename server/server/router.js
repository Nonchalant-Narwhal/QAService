const router = require('express').Router();
const { getQuery } = require('./models.js');
const queryParser = require('./queryparsers.js');

// GET /qa/:product_id Retrieves a list of questions for a particular product. This list does not include any reported questions.
router.get('/qa/:product_id', (req, res) => {
  let product_id = req.params.product_id;
  let offset = req.query.page || 'null';
  let limit = req.query.count || 'null';
  console.log('LIMIT', limit);
  getQuery(
    `SELECT *
      FROM (
          SELECT *
          FROM questions
          WHERE product_id = ${product_id}
      ) AS q
      LEFT JOIN answers AS a ON q.question_id = a.question_id
      LEFT JOIN answer_photos AS asph ON a.answer_id = asph.answer_id OFFSET ${offset} LIMIT ${limit}`
  )
    .then(result => {
      let parsed = queryParser.getProducts(result.rows, product_id);
      res.send(parsed);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});
// params: product_id, page, count

// GET /qa/:question_id/answers Returns answers for a given question. This list does not include any reported answers.
router.get('/qa/:question_id/answers', (req, res) => {
  let { question_id } = req.params;
  let { page = 'NULL', count = 'NULL' } = req.query;
  const columns = 'answer_id, body, date, answerer_name, helpfulness';
  getQuery(
    `SELECT ${columns} FROM answers WHERE question_id = ${question_id} LIMIT ${count} OFFSET ${page}`
  )
    .then(result => {
      let parsed = queryParser.getAnswers(result.rows, question_id);
      res.send(parsed);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(400);
    });
});
// params: product_id, page, count

// POST /qa/:product_id Adds a question for the given product
// params:product_id, BODY PARAMS {body,name, email}, responds 201 CREATED

// POST /qa/:question_id/answers Adds an answer for the given question
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
