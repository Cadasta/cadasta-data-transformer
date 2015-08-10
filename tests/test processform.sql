select * from question;
truncate table survey cascade
select * from q_group
select * from section
select * from option
select * from type
select * from survey
select * from quote_literal('')
SELECT * from type

SELECT id FROM type where name = $anystr$group$anystr$
SELECT id FROM type where name = $anystr$note$anystr$

select * from question where survey_id = 149
select * from type where id = 8

SELECT * FROM cd_create_survey('test')

INSERT INTO q_group (survey_id,name,label,parent_id) VALUES (178,$anystr$applicant_name$anystr$,$anystr$Name of Applicant$anystr$,null) RETURNING id
INSERT INTO question (survey_id, type_id, name, label) values (215,8,$anystr$applicant_marital_status$anystr$,$anystr$Applicant Marital Status$anystr$) RETURNING id
INSERT INTO option (question_id, name, label) VALUES (3608,$anystr$katechapman$anystr$,$anystr$Kate Chapman$anystr$)