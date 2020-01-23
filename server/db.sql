CREATE TABLE Questions (
 question_id BIGSERIAL,
 product_id INTEGER,
 question_body VARCHAR,
 question_date VARCHAR,
 asker_name VARCHAR,
 asker_email VARCHAR,
 reported INTEGER,
 question_helpfulness VARCHAR
);


ALTER TABLE Questions ADD CONSTRAINT Questions_pkey PRIMARY KEY (question_id);

CREATE TABLE Answers (
 answer_id BIGSERIAL,
 question_id INTEGER,
 body VARCHAR,
 date_written VARCHAR,
 answerer_name VARCHAR,
 answerer_email VARCHAR,
 reported INTEGER,
 helpfulness INTEGER
);

ALTER TABLE Answers ADD CONSTRAINT Answers_pkey PRIMARY KEY (answer_id);

ALTER TABLE Answers ADD CONSTRAINT Answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES Questions(question_id);



CREATE TABLE Answer_Photos (
    id BIGSERIAL,
    answer_id INTEGER,
    url VARCHAR
);

ALTER TABLE Answer_Photos ADD CONSTRAINT Answer_Photos_pkey PRIMARY KEY (id);

ALTER TABLE Answer_Photos ADD CONSTRAINT answer_id_fkey FOREIGN KEY (answer_id) REFERENCES Answers(answer_id);