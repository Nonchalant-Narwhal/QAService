SELECT * FROM questions
    NATURAL JOIN answers 
    ON product_id=5 AND reported=0
    INNER JOIN answer_photos ON answers.answer_id=answer_photos.answer_id
        OFFSET 0 LIMIT null
        
        
         SELECT * FROM questions INNER JOIN answers ON answers.question_id=questions.question_id INNER JOIN answer_photos ON answer_photos.answer_id=answers.answer_id WHERE questions.question_id = 7 OFFSET 0 LIMIT 5;
         
         
         
         SELECT * FROM questions INNER JOIN answers ON product_id=${product_id} AND questions.reported=0 INNER JOIN answer_photos ON answer_photos.answer_id=answers.answer_id OFFSET ${offset} LIMIT ${limit};
         SELECT * FROM questions INNER JOIN answers ON product_id=3 AND questions.reported=0 INNER JOIN answer_photos ON answer_photos.answer_id=answers.answer_id OFFSET NULL LIMIT 7;
         
         SELECT * FROM questions WHERE product_id=3 INNER JOIN answers ON questions.question_id=answers.question_id LIMIT 100
         
         SELECT * FROM questions, answers, answer_photos WHERE questions.product_id=3
         
         
         SELECT * FROM questions, answers, answer_photos WHERE questions.product_id = 3 
            AND questions.question_id = answers.question_id AND answers.answer_id = answer_photos.answer_id
         
         select A.colx, A.coly, A.colz, B.colx, B.colw, c.cold 
from A inner join B on A.ID=B.A_ID 
     inner join C on C.A_ID=A.ID
     
     
     SELECT * FROM table_1 FULL JOIN table_2 ON table_1.id = table_2.id;
     
     SELECT * FROM answers FULL OUTER JOIN answer_photos ON answers.answer_id = answer_photos.answer_id  (SELECT * FROM questions WHERE questions.question_id = 5)

SELECT *
FROM (
    SELECT *
    FROM questions
    WHERE product_id = 4
) AS questions
OUTER JOIN answers ON questions.question_id = answers.question_id
OUTER JOIN answer_photos ON answers.answer_id = answer_photos.answer_id

SELECT *
FROM (
    SELECT *
    FROM questions
    WHERE product_id = 4
) AS questions
LEFT JOIN answers ON questions.question_id = answers.question_id
LEFT JOIN answer_photos ON answers.answer_id = answer_photos.answer_id



INSERT INTO answers_photos (answer_id, url) VALUES (
    (INSERT INTO answers 
    (question_id, body, date_written, answerer_name, answerer_email, reported, helpfulness) 
    VALUES 
    ('16', 'very long time. Very veryVERY  long', '2020-01-07', 'ianianian', 'eeeeman22',0,0) 
    RETURNING answer_id), 'http://www.ilikebigqueries')
    
    
    with rows as (
INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpfulness) 
VALUES ('16', 'very long time. Very veryVERY  long', '2020-01-07', 'ianianian', 'eeeeman22',0,0) 
RETURNING answer_id
)
INSERT INTO answer_photos (answer_id, url)
SELECT answer_id, 'http://www.ilikebigqueries'
FROM rows

    

INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpfulness) 
    VALUES ('16', 'very long time. Very veryVERY  long', '2020-01-07', 'ianianian', 'eeeeman22',0,0);
INSERT INTO answer_photos (answer_id, url) VALUES (currval('answers_answer_id_seq'), 'http://www.ilikebigqueries');
INSERT INTO answer_photos (answer_id, url) VALUES (currval('answers_answer_id_seq'), 'http://www.ilikebigqueries'), (currval('answers_answer_id_seq'), 'http://www.ilikeasdoijasdijasbigqueries'), (currval('answers_answer_id_seq'), 'http://www.ilreallyoiasjdoijes');

    
    
START TRANSACTION;
	INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpfulness)
	VALUES ('2177', '"went down to georgia"', '2020-01-09', '"demonman"', '"demoname"',0,0);
	INSERT INTO answer_photos (answer_id, url) VALUES (currval('answers_answer_id_seq'), 'demophoto1'),(currval('answers_answer_id_seq'), 'demophoto2'),(currval('answers_answer_id_seq'), 'demophoto3');
COMMIT;








select id as style_id, name, original_price, sale_price, default_style as "default?",
(
  select array_to_json(array_agg(row_to_json(p)))
  from (
    select url, thumbnail_url
    from photos
    where style_id=styles.id
    order by id asc
  ) p
) as photos,
(
  select array_to_json(array_agg(row_to_json(sk)))
  from (
    select size, quantity
    from skus
    where style_id=styles.id
    order by id asc
  ) sk
) as skus
from (SELECT * FROM styles WHERE product_id = $1) as styles 


SELECT q.question_id, q.question_body, q.question_date, q.asker_name, q.question_helpfulness, q.reported, a.answer_id, a.body, a.date_written, a.answerer_name, a.helpfulness,
(
SELECT array_to_json(array_agg(row_to_json(p)))
FROM(
    SELECT id, url 
    FROM answer_photos
    WHERE answer_id = answers.answer_id
    ) p
) AS photos
FROM questions AS q, 