module.exports = {
  /*
    NOT WRITING ANSWER ID FOR ANY ANSWERS OTHER THAN FIRST
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
        questions[loc.question_id].answers[loc.answer_id].photos.push(loc.url);
      }
    }
    for (let question in questions) {
      parsed.results.push(questions[question]);
    }
    // return rows;
    return parsed;
  },
  getAnswers: (rows, question_id) => {
    return rows;
  }
};
