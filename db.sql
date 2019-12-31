CREATE TABLE Questions (
 question_id BIGSERIAL,
 product_id INTEGER,
 question_body VARCHAR,
 question_date TIME WITH TIME ZONE,
 asker_name VARCHAR,
 question_helpfulness VARCHAR,
 reported INTEGER
);


ALTER TABLE Questions ADD CONSTRAINT Questions_pkey PRIMARY KEY (question_id);

CREATE TABLE Answers (
 answer_id BIGSERIAL,
 question_id INTEGER,
 body VARCHAR,
 date TIME WITH TIME ZONE,
 answerer_name VARCHAR,
 helpfulness INTEGER,
 photos VARCHAR
);


ALTER TABLE Answers ADD CONSTRAINT Answers_pkey PRIMARY KEY (answer_id);

ALTER TABLE Answers ADD CONSTRAINT Answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES Questions(question_id);