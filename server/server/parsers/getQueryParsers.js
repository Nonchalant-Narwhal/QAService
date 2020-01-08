module.exports = {
  /*
  GET QUESTIONS PARSER
  */
  getProducts: (rows, prodId) => {
    let parsed = {
      product_id: prodId,
      results: []
    };
    //   iterate over rows
    let questions = {};
    for (let i = 0; i < rows.length; i++) {
      let loc = rows[i];
      // add photos and answers props if the question doesn't exist, and question itself
      if (!questions.hasOwnProperty(loc.question_id)) {
        questions[loc.question_id] = {};
        // copy questions to that prop on questions obj
        questions[loc.question_id].question_id = loc.question_id;
        questions[loc.question_id].question_body = loc.question_body;
        questions[loc.question_id].question_date = loc.question_date;
        questions[loc.question_id].asker_name = loc.asker_name;
        questions[loc.question_id].question_helpfulness =
          loc.question_helpfulness;
        questions[loc.question_id].reported = loc.reported;
        questions[loc.question_id].answers = {};
      }
      // write answers to that k in obj
      if (loc.answer_id !== null) {
        let answer = {
          id: loc.answer_id,
          body: loc.body,
          date: loc.date_written,
          answerer_name: loc.answerer_name,
          helpfulness: loc.helpfulness,
          photos: []
        };
        questions[loc.question_id].answers[loc.answer_id] = answer;
        if (loc.url !== null) {
          questions[loc.question_id].answers[loc.answer_id].photos.push({
            id: loc.id,
            url: loc.url
          });
        }
      }
    }
    for (let question in questions) {
      parsed.results.push(questions[question]);
    }
    // return rows;
    return parsed;
  },
  /*
  GET ANSWERS PARSER
  */
  getAnswers: (rows, question_id, page, count) => {
    let parsed = {
      question: question_id,
      page: page,
      count: count,
      results: []
    };
    let answers = {};
    for (let row in rows) {
      if (!answers.hasOwnProperty(rows[row].answer_id)) {
        answers[rows[row].answer_id] = {
          answer_id: rows[row].answer_id,
          body: rows[row].body,
          date: rows[row].date_written,
          answerer_name: rows[row].answerer_name,
          helpfulness: rows[row].helpfulness,
          photos: []
        };
      }
      if (rows[row].id !== null) {
        answers[rows[row].answer_id].photos.push({
          id: rows[row].id,
          url: rows[row].url
        });
      }
    }
    for (let answer in answers) {
      parsed.results.push(answers[answer]);
    }
    return parsed;
  }
};
