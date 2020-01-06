const router = require('express').Router();
const { getQuery } = require('./models.js');

// GET /qa/:product_id Retrieves a list of questions for a particular product. This list does not include any reported questions.
router.get('/qa/:product_id', (req, res) => {
  // run getQuery and respond with list of objects
  let product_id = req.params.product_id;
  (async () => {
    const result = await getQuery(
      `SELECT * FROM questions WHERE product_id=${product_id}`
    );
    await res.send(result);
  })();
});

// params: product_id, page, count

// GET /qa/:question_id/answers Returns answers for a given question. This list does not include any reported answers.
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
