select * from question where id = 2235

truncate table field_data cascade;
truncate table party cascade;
select * from q_group
select * from section
select * from option
select * from type
select * from field_Data
select * from quote_literal('')
SELECT * from type
select * from party
select * from respondent

SELECT id FROM type where name = $anystr$group$anystr$
SELECT id FROM type where name = $anystr$note$anystr$

SELECT slugs.*, row_number() OVER () as rownum from regexp_split_to_table('plot_address/swag/plot_address_street', '/') as slugs order by rownum desc limit 1
SELECT slugs.*, row_number() OVER () as rownum from regexp_split_to_table('plot_address/swag/plot_address_street', '/') as slugs order by rownum desc limit 1 offset 1

SELECT count(id) from question WHERE lower(name) = lower(' + pg.sanitize(slug) + ') and field_data_id = 7