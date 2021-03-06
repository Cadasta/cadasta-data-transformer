﻿select * from question where id = 2235

select * from raw_data

alter table raw_data add column field_data_id int references field_data (id)

select * from question where name like '%geo%' 

where name = 'loan_officer'
select * from q_group
select * from section
select * from option
select * from type
select * from field_Data order by id
select * from question 
select * from quote_literal('')
SELECT * from type
select * from party
select * from parcel
select * from relationship
select * from respondent
select * from response where question_id = 3894
select * from raw_Data

select * from response where question_id IN (2864,
2873,
2874,
2875,
2876,
2877)

select * from parcel

SELECT id FROM type where name = $anystr$group$anystr$
SELECT id FROM type where name = $anystr$note$anystr$

SELECT slugs.*, row_number() OVER () as rownum from regexp_split_to_table('plot_address/swag/plot_address_street', '/') as slugs order by rownum desc limit 1
SELECT slugs.*, row_number() OVER () as rownum from regexp_split_to_table('plot_address/swag/plot_address_street', '/') as slugs order by rownum desc limit 1 offset 1

SELECT count(id) from question WHERE lower(name) = lower(' + pg.sanitize(slug) + ') and field_data_id = 7

INSERT INTO response (respondent_id, question_id, text) VALUES (48,(SELECT id from question where lower(name) = $anystr$plot_address_street$anystr$ AND field_data_id = 54),'Thorndyke Ave W')

truncate table field_data cascade;
truncate table party cascade;
truncate table parcel cascade;
truncate table relationship cascade;

SELECT * FROM cd_import_form_json 
($anystr${"name":"Basic-survey-prototype7","title":"Basic Cadasta Survey Prototype 7","sms_keyword":"Basic-survey-prototype7","default_language":"default","version":"201507162126","id_string":"Basic-survey-prototype7","type":"survey","children":[{"type":"start","name":"start"},{"type":"end","name":"end"},{"type":"today","name":"today"},{"type":"deviceid","name":"deviceid"},{"type":"note","name":"title","label":"Basic Cadasta Survey Prototype – July 2015"},{"type":"note","name":"project_id","label":"1"},{"label":"Name of Surveyor","type":"select one","children":[{"name":"katechapman","label":"Kate Chapman"},{"name":"frankpichel","label":"Frank Pichel"},{"name":"ryanwhitley","label":"Ryan Whitley"},{"name":"danielbaah","label":"Daniel Baah"},{"name":"toddslind","label":"Todd Slind"},{"name":"nicholashallahan","label":"Nicholas Hallahan"}],"name":"surveyor"},{"control":{"appearance":"field-list"},"label":"Name of Applicant","type":"group","children":[{"label":"Applicant Name Prefix","type":"select one","children":[{"name":"dr","label":"Dr."},{"name":"mr","label":"Mr."},{"name":"mrs","label":"Mrs."},{"name":"ms","label":"Ms."}],"name":"applicant_name_prefix"},{"type":"text","name":"applicant_name_first","label":"Applicant First Name"},{"type":"text","name":"applicant_name_middle","label":"Applicant Middle Name"},{"type":"text","name":"applicant_name_last","label":"Applicant Last Name (Surname)"},{"label":"Applicant Name Postfix","type":"select one","children":[{"name":"jr","label":"Jr."},{"name":"sr","label":"Sr."},{"name":"iii","label":"III"}],"name":"applicant_name_postfix"},{"type":"geopoint","name":"geo_location","label":"Location of Parcel"}],"name":"applicant_name"},{"type":"phonenumber","name":"applicant_phone","label":"Applicant Phone Number"},{"type":"phonenumber","name":"applicant_phone_alt","label":"Applicant Phone Number (Alternative)"},{"type":"date","name":"applicant_dob","label":"Applicant Date of Birth"},{"label":"Applicant Marital Status","type":"select one","children":[{"name":"single","label":"Single"},{"name":"married","label":"Married"},{"name":"divorced","label":"Divorced"},{"name":"widowed","label":"Widowed"},{"name":"separated","label":"Separated"}],"name":"applicant_marital_status"},{"control":{"appearance":"field-list"},"name":"applicant_spouse_name","bind":{"relevant":"selected(${applicant_marital_status}, 'married')"},"label":"Name of Applicant's Spouse","type":"group","children":[{"label":"Applicant Name Prefix","type":"select one","children":[{"name":"dr","label":"Dr."},{"name":"mr","label":"Mr."},{"name":"mrs","label":"Mrs."},{"name":"ms","label":"Ms."}],"name":"applicant_name_prefix"},{"type":"text","name":"applicant_name_first","label":"Applicant First Name"},{"type":"text","name":"applicant_name_middle","label":"Applicant Middle Name"},{"type":"text","name":"applicant_name_last","label":"Applicant Last Name (Surname)"},{"label":"Applicant Name Postfix","type":"select one","children":[{"name":"jr","label":"Jr."},{"name":"sr","label":"Sr."},{"name":"iii","label":"III"}],"name":"applicant_name_postfix"}]},{"label":"Is the land financed by a loan or mortgage?","type":"select one","children":[{"name":"yes","label":"Yes"},{"name":"no","label":"No"}],"name":"loan"},{"bind":{"relevant":"selected(${loan}, 'yes')"},"label":"Loan Group","type":"group","children":[{"type":"text","name":"loan_bank_name","label":"Name of Bank with Loan"},{"type":"text","name":"loan_bank_branch","label":"Name of Bank Branch"},{"control":{"appearance":"field-list"},"label":"Name of Loan Officer","type":"group","children":[{"label":"Loan Officer Name Prefix","type":"select one","children":[{"name":"dr","label":"Dr."},{"name":"mr","label":"Mr."},{"name":"mrs","label":"Mrs."},{"name":"ms","label":"Ms."}],"name":"loan_officer_name_prefix"},{"type":"text","name":"loan_officer_name_first","label":"Loan Officer First Name"},{"type":"text","name":"loan_officer_name_middle","label":"Loan Officer Middle Name"},{"type":"text","name":"loan_officer_name_last","label":"Loan Officer Last Name (Surname)"},{"label":"Loan Officer Name Postfix","type":"select one","children":[{"name":"jr","label":"Jr."},{"name":"sr","label":"Sr."},{"name":"iii","label":"III"}],"name":"loan_officer_name_postfix"}],"name":"loan_officer"}],"name":"loan_group"},{"type":"integer","name":"plot_number","label":"Plot / Property Number"},{"type":"text","name":"plot_description","label":"Description of Property Location"},{"control":{"appearance":"field-list"},"label":"Address","type":"group","children":[{"type":"text","name":"plot_address_number","label":"Address (House) Number"},{"type":"text","name":"plot_address_street","label":"Street Name"},{"type":"text","name":"plot_address_city","label":"City / Town / Village"}],"name":"plot_address"},{"type":"date","name":"date_land_possession","label":"Date of Land Possession"},{"control":{"appearance":"field-list"},"label":"Name of Property Seller","type":"group","children":[{"label":"Property Seller Name Prefix","type":"select one","children":[{"name":"dr","label":"Dr."},{"name":"mr","label":"Mr."},{"name":"mrs","label":"Mrs."},{"name":"ms","label":"Ms."}],"name":"seller_name_prefix"},{"type":"text","name":"seller_name_first","label":"Property Seller First Name"},{"type":"text","name":"seller_name_middle","label":"Property Seller Middle Name"},{"type":"text","name":"seller_name_last","label":"Property Seller Last Name (Surname)"},{"label":"Property Seller Name Postfix","type":"select one","children":[{"name":"jr","label":"Jr."},{"name":"sr","label":"Sr."},{"name":"iii","label":"III"}],"name":"seller_name_postfix"}],"name":"seller_name"},{"control":{"appearance":"field-list"},"label":"Property Seller Address","type":"group","children":[{"type":"text","name":"seller_address_number","label":"Address (House) Number"},{"type":"text","name":"seller_address_street","label":"Street Name"},{"type":"text","name":"seller_address_city","label":"City / Town / Village"}],"name":"seller_address"},{"label":"How did you acquire the land?","type":"select one","children":[{"name":"freehold","label":"Freehold"},{"name":"lease","label":"Lease"},{"name":"inheritance","label":"Inheritance"},{"name":"gift","label":"Gift"},{"name":"other","label":"Other"}],"name":"means_of_acquire"},{"label":"How is the proprietorship held?","type":"select one","children":[{"name":"allodial","label":"Allodial Ownder"},{"name":"freehold","label":"Freehold"},{"name":"common_law_freehold","label":"Common Law Freehold"},{"name":"lease","label":"Leasehold Interest"},{"name":"contractual","label":"Contractual / Share Cropping / Customary Tenure Agreement"},{"name":"unknown","label":"Unknown"}],"name":"proprietorship"},{"control":{"bodyless":true},"type":"group","children":[{"bind":{"readonly":"true()","calculate":"concat('uuid:', uuid())"},"type":"calculate","name":"instanceID"}],"name":"meta"}]}$anystr$)


SELECT * FROM cd_import_data_json(73,