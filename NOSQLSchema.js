// there will be two collections, Questions and Answers

// Question collection will be key/value pair with key as product_id
Questions = {
  1: [QuestionDocument, QuestionDocument],
  2: [QuestionDocument, QuestionDocument],
  3: [QuestionDocument, QuestionDocument],
  4: [QuestionDocument, QuestionDocument]
};
// value will be a mongodb array, QuestionDocuments will be inserted via .push()

QuestionDocument = {
  question_id: number,
  product_id: number,
  question_body: "string",
  question_date: "string",
  asker_name: "string",
  question_helpfulness: number,
  reported: number
};

// Answer collection will be key value pair with key as question_id
Answers = {
  1: [AnswerDocument, AnswerDocument],
  2: [AnswerDocument, AnswerDocument],
  3: [AnswerDocument, AnswerDocument],
  4: [AnswerDocument, AnswerDocument]
};
// value will be a mongodb array, AnswerDocuments will be inserted via .push()
AnswerDocument = {
  answer_id: number,
  body: "string",
  date: "string",
  answerer_name: "string",
  helpfulness: number,
  photos: [{ id: num, url: "string" }]
};
