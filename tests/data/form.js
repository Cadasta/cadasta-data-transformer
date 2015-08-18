var survey = {};

survey.form = {
    metadata: {
        "name": "Basic-survey-prototype7",
        "title": "Basic Cadasta Survey Prototype 7",
        "sms_keyword": "Basic-survey-prototype7",
        "default_language": "default",
        "version": "201507162126",
        "id_string": "Basic-survey-prototype7",
        "type": "survey",
        "children": [{"type": "start", "name": "start"}, {"type": "end", "name": "end"}, {
            "type": "today",
            "name": "today"
        }, {"type": "deviceid", "name": "deviceid"}, {
            "type": "note",
            "name": "title",
            "label": "Basic Cadasta Survey Prototype – July 2015"
        }, {"type": "note", "name": "project_id", "label": "1"}, {
            "label": "Name of Surveyor",
            "type": "select one",
            "children": [{"name": "katechapman", "label": "Kate Chapman"}, {
                "name": "frankpichel",
                "label": "Frank Pichel"
            }, {"name": "ryanwhitley", "label": "Ryan Whitley"}, {
                "name": "danielbaah",
                "label": "Daniel Baah"
            }, {"name": "toddslind", "label": "Todd Slind"}, {
                "name": "nicholashallahan",
                "label": "Nicholas Hallahan"
            }],
            "name": "surveyor"
        }, {
            "control": {"appearance": "field-list"},
            "label": "Name of Applicant",
            "type": "group",
            "children": [{
                "label": "Applicant Name Prefix",
                "type": "select one",
                "children": [{"name": "dr", "label": "Dr."}, {"name": "mr", "label": "Mr."}, {
                    "name": "mrs",
                    "label": "Mrs."
                }, {"name": "ms", "label": "Ms."}],
                "name": "applicant_name_prefix"
            }, {"type": "text", "name": "applicant_name_first", "label": "Applicant First Name"}, {
                "type": "text",
                "name": "applicant_name_middle",
                "label": "Applicant Middle Name"
            }, {
                "type": "text",
                "name": "applicant_name_last",
                "label": "Applicant Last Name (Surname)"
            }, {
                "label": "Applicant Name Postfix",
                "type": "select one",
                "children": [{"name": "jr", "label": "Jr."}, {"name": "sr", "label": "Sr."}, {
                    "name": "iii",
                    "label": "III"
                }],
                "name": "applicant_name_postfix"
            }, {"type": "geopoint", "name": "geo_location", "label": "Location of Parcel"}],
            "name": "applicant_name"
        }, {"type": "phonenumber", "name": "applicant_phone", "label": "Applicant Phone Number"}, {
            "type": "phonenumber",
            "name": "applicant_phone_alt",
            "label": "Applicant Phone Number (Alternative)"
        }, {
            "type": "date",
            "name": "applicant_dob",
            "label": "Applicant Date of Birth"
        }, {
            "label": "Applicant Marital Status",
            "type": "select one",
            "children": [{"name": "single", "label": "Single"}, {
                "name": "married",
                "label": "Married"
            }, {"name": "divorced", "label": "Divorced"}, {"name": "widowed", "label": "Widowed"}, {
                "name": "separated",
                "label": "Separated"
            }],
            "name": "applicant_marital_status"
        }, {
            "control": {"appearance": "field-list"},
            "name": "applicant_spouse_name",
            "bind": {"relevant": "selected(${applicant_marital_status}, 'married')"},
            "label": "Name of Applicant's Spouse",
            "type": "group",
            "children": [{
                "label": "Applicant Name Prefix",
                "type": "select one",
                "children": [{"name": "dr", "label": "Dr."}, {"name": "mr", "label": "Mr."}, {
                    "name": "mrs",
                    "label": "Mrs."
                }, {"name": "ms", "label": "Ms."}],
                "name": "applicant_name_prefix"
            }, {"type": "text", "name": "applicant_name_first", "label": "Applicant First Name"}, {
                "type": "text",
                "name": "applicant_name_middle",
                "label": "Applicant Middle Name"
            }, {
                "type": "text",
                "name": "applicant_name_last",
                "label": "Applicant Last Name (Surname)"
            }, {
                "label": "Applicant Name Postfix",
                "type": "select one",
                "children": [{"name": "jr", "label": "Jr."}, {"name": "sr", "label": "Sr."}, {
                    "name": "iii",
                    "label": "III"
                }],
                "name": "applicant_name_postfix"
            }]
        }, {
            "label": "Is the land financed by a loan or mortgage?",
            "type": "select one",
            "children": [{"name": "yes", "label": "Yes"}, {"name": "no", "label": "No"}],
            "name": "loan"
        }, {
            "bind": {"relevant": "selected(${loan}, 'yes')"},
            "label": "Loan Group",
            "type": "group",
            "children": [{"type": "text", "name": "loan_bank_name", "label": "Name of Bank with Loan"}, {
                "type": "text",
                "name": "loan_bank_branch",
                "label": "Name of Bank Branch"
            }, {
                "control": {"appearance": "field-list"},
                "label": "Name of Loan Officer",
                "type": "group",
                "children": [{
                    "label": "Loan Officer Name Prefix",
                    "type": "select one",
                    "children": [{"name": "dr", "label": "Dr."}, {"name": "mr", "label": "Mr."}, {
                        "name": "mrs",
                        "label": "Mrs."
                    }, {"name": "ms", "label": "Ms."}],
                    "name": "loan_officer_name_prefix"
                }, {"type": "text", "name": "loan_officer_name_first", "label": "Loan Officer First Name"}, {
                    "type": "text",
                    "name": "loan_officer_name_middle",
                    "label": "Loan Officer Middle Name"
                }, {
                    "type": "text",
                    "name": "loan_officer_name_last",
                    "label": "Loan Officer Last Name (Surname)"
                }, {
                    "label": "Loan Officer Name Postfix",
                    "type": "select one",
                    "children": [{"name": "jr", "label": "Jr."}, {"name": "sr", "label": "Sr."}, {
                        "name": "iii",
                        "label": "III"
                    }],
                    "name": "loan_officer_name_postfix"
                }],
                "name": "loan_officer"
            }],
            "name": "loan_group"
        }, {"type": "integer", "name": "plot_number", "label": "Plot / Property Number"}, {
            "type": "text",
            "name": "plot_description",
            "label": "Description of Property Location"
        }, {
            "control": {"appearance": "field-list"},
            "label": "Address",
            "type": "group",
            "children": [{
                "type": "text",
                "name": "plot_address_number",
                "label": "Address (House) Number"
            }, {"type": "text", "name": "plot_address_street", "label": "Street Name"}, {
                "type": "text",
                "name": "plot_address_city",
                "label": "City / Town / Village"
            }],
            "name": "plot_address"
        }, {
            "type": "date",
            "name": "date_land_possession",
            "label": "Date of Land Possession"
        }, {
            "control": {"appearance": "field-list"},
            "label": "Name of Property Seller",
            "type": "group",
            "children": [{
                "label": "Property Seller Name Prefix",
                "type": "select one",
                "children": [{"name": "dr", "label": "Dr."}, {"name": "mr", "label": "Mr."}, {
                    "name": "mrs",
                    "label": "Mrs."
                }, {"name": "ms", "label": "Ms."}],
                "name": "seller_name_prefix"
            }, {"type": "text", "name": "seller_name_first", "label": "Property Seller First Name"}, {
                "type": "text",
                "name": "seller_name_middle",
                "label": "Property Seller Middle Name"
            }, {
                "type": "text",
                "name": "seller_name_last",
                "label": "Property Seller Last Name (Surname)"
            }, {
                "label": "Property Seller Name Postfix",
                "type": "select one",
                "children": [{"name": "jr", "label": "Jr."}, {"name": "sr", "label": "Sr."}, {
                    "name": "iii",
                    "label": "III"
                }],
                "name": "seller_name_postfix"
            }],
            "name": "seller_name"
        }, {
            "control": {"appearance": "field-list"},
            "label": "Property Seller Address",
            "type": "group",
            "children": [{
                "type": "text",
                "name": "seller_address_number",
                "label": "Address (House) Number"
            }, {"type": "text", "name": "seller_address_street", "label": "Street Name"}, {
                "type": "text",
                "name": "seller_address_city",
                "label": "City / Town / Village"
            }],
            "name": "seller_address"
        }, {
            "label": "How did you acquire the land?",
            "type": "select one",
            "children": [{"name": "freehold", "label": "Freehold"}, {
                "name": "lease",
                "label": "Lease"
            }, {"name": "inheritance", "label": "Inheritance"}, {"name": "gift", "label": "Gift"}, {
                "name": "other",
                "label": "Other"
            }],
            "name": "means_of_acquire"
        }, {
            "label": "How is the proprietorship held?",
            "type": "select one",
            "children": [{"name": "allodial", "label": "Allodial Ownder"}, {
                "name": "freehold",
                "label": "Freehold"
            }, {"name": "common_law_freehold", "label": "Common Law Freehold"}, {
                "name": "lease",
                "label": "Leasehold Interest"
            }, {
                "name": "contractual",
                "label": "Contractual / Share Cropping / Customary Tenure Agreement"
            }, {"name": "unknown", "label": "Unknown"}],
            "name": "proprietorship"
        }, {
            "control": {"bodyless": true},
            "type": "group",
            "children": [{
                "bind": {"readonly": "true()", "calculate": "concat('uuid:', uuid())"},
                "type": "calculate",
                "name": "instanceID"
            }],
            "name": "meta"
        }]
    },
    results: [{"_notes": [], "deviceid": "enketo.org:rRFxqMTT3EzpjWv6", "plot_address/plot_address_street": "El Camino Real", "loan": "no", "applicant_name/applicant_name_first": "Oprah", "applicant_marital_status": "widowed", "_tags": [], "plot_description": "Beach House", "surveyor": "ryanwhitley", "_xform_id_string": "Basic-survey-prototype7", "meta/instanceID": "uuid:55c7e09b-289e-43a4-bfae-808c784d8e64", "_duration": 264.0, "plot_number": 12443, "applicant_name/geo_location": "34.41484 -119.698062 0 0", "end": "2015-08-13T10:03:43.000-07:00", "date_land_possession": "2015-07-27", "applicant_phone_alt": "no phonenumber property in enketo", "applicant_dob": "2014-08-06", "applicant_name/applicant_name_last": "Winfrey", "start": "2015-08-13T09:59:19.000-07:00", "_attachments": [], "seller_address/seller_address_city": "Oakland", "_status": "submitted_via_web", "today": "2015-08-13", "seller_address/seller_address_number": "82991", "plot_address/plot_address_number": "14339", "seller_name/seller_name_first": "Julio", "_bamboo_dataset_id": "", "_uuid": "55c7e09b-289e-43a4-bfae-808c784d8e64", "applicant_phone": "no phonenumber property in enketo", "means_of_acquire": "freehold", "seller_name/seller_name_postfix": "jr", "_submitted_by": "nhallahan", "applicant_name/applicant_name_prefix": "dr", "seller_name/seller_name_last": "Perez", "formhub/uuid": "d427376135c742c995a94a9d18df6614", "_submission_time": "2015-08-13T17:03:40", "seller_name/seller_name_prefix": "mr", "_version": "201507162126", "_geolocation": [34.41484, -119.698062], "seller_address/seller_address_street": "Warrior ave", "plot_address/plot_address_city": "Santa Barbara", "proprietorship": "allodial", "_id": 3117574}, {"_notes": [], "applicant_spouse_name/applicant_name_last": "Jackson", "loan_group/loan_officer/loan_officer_name_prefix": "dr", "applicant_spouse_name/applicant_name_postfix": "jr", "loan_group/loan_officer/loan_officer_name_last": "O'Guin", "loan": "yes", "applicant_name/applicant_name_first": "Nick", "_bamboo_dataset_id": "", "_tags": [], "plot_description": "New house on the hill", "applicant_name/applicant_name_postfix": "sr", "surveyor": "nicholashallahan", "loan_group/loan_bank_name": "US Bank", "meta/instanceID": "uuid:762e46fb-8f0e-408b-9f07-7c62cb1ca087", "seller_address/seller_address_number": "13443", "_duration": 207.0, "plot_number": 1223, "applicant_name/geo_location": "47.626413 -122.31894 -0.5 0", "end": "2015-08-12T16:38:12.000-07:00", "date_land_possession": "2015-01-13", "applicant_phone_alt": "no phonenumber property in enketo", "applicant_dob": "2014-11-09", "loan_group/loan_officer/loan_officer_name_postfix": "sr", "plot_address/plot_address_street": "238232 50th ave se", "applicant_name/applicant_name_last": "Smith", "start": "2015-08-12T16:34:45.000-07:00", "_attachments": [], "applicant_name/applicant_name_middle": "Jr", "_status": "submitted_via_web", "today": "2015-08-12", "plot_address/plot_address_city": "Everett", "plot_address/plot_address_number": "823237", "_xform_id_string": "Basic-survey-prototype7", "seller_name/seller_name_first": "Michael", "loan_group/loan_officer/loan_officer_name_first": "Ian", "applicant_marital_status": "married", "_uuid": "762e46fb-8f0e-408b-9f07-7c62cb1ca087", "applicant_phone": "no phonenumber property in enketo", "means_of_acquire": "freehold", "applicant_spouse_name/applicant_name_middle": "Marion", "_submitted_by": "nhallahan", "applicant_name/applicant_name_prefix": "mrs", "seller_address/seller_address_city": "Northfield", "applicant_spouse_name/applicant_name_prefix": "dr", "seller_name/seller_name_last": "Oliwakandi", "formhub/uuid": "d427376135c742c995a94a9d18df6614", "seller_name/seller_name_postfix": "jr", "applicant_spouse_name/applicant_name_first": "Michael", "loan_group/loan_bank_branch": "JP Chase Bank", "_submission_time": "2015-08-12T23:38:13", "seller_name/seller_name_prefix": "mrs", "_version": "201507162126", "_geolocation": [47.626413, -122.31894], "seller_address/seller_address_street": "Homedrive", "deviceid": "enketo.org:rRFxqMTT3EzpjWv6", "proprietorship": "freehold", "_id": 3108806}, {"_notes": [], "applicant_spouse_name/applicant_name_last": "Hoag", "plot_address/plot_address_street": "50th ave SE", "deviceid": "enketo.org:rRFxqMTT3EzpjWv6", "applicant_name/applicant_name_first": "Daniel", "_bamboo_dataset_id": "", "_tags": [], "plot_description": "House", "applicant_name/applicant_name_postfix": "jr", "surveyor": "katechapman", "_xform_id_string": "Basic-survey-prototype7", "meta/instanceID": "uuid:a4e9fdc9-ec53-42fc-81b6-90b52ba152b2", "_duration": 143.0, "plot_number": 14316, "applicant_name/geo_location": "47.867583 -122.164306 0 0", "end": "2015-08-11T11:01:16.000-07:00", "date_land_possession": "2015-01-04", "applicant_phone_alt": "no phonenumber property in enketo", "applicant_dob": "2008-01-08", "applicant_name/applicant_name_last": "Baah", "start": "2015-08-11T10:58:53.000-07:00", "_attachments": [], "applicant_name/applicant_name_middle": "Nana", "_status": "submitted_via_web", "today": "2015-08-11", "plot_address/plot_address_city": "Everett", "plot_address/plot_address_number": "14316", "seller_name/seller_name_first": "Geno", "applicant_marital_status": "married", "_uuid": "a4e9fdc9-ec53-42fc-81b6-90b52ba152b2", "applicant_phone": "no phonenumber property in enketo", "means_of_acquire": "inheritance", "applicant_spouse_name/applicant_name_middle": "N", "_submitted_by": "nhallahan", "applicant_name/applicant_name_prefix": "dr", "seller_address/seller_address_city": "New Jersey", "applicant_spouse_name/applicant_name_prefix": "mrs", "seller_name/seller_name_last": "Smith", "formhub/uuid": "d427376135c742c995a94a9d18df6614", "seller_name/seller_name_postfix": "sr", "applicant_spouse_name/applicant_name_first": "Daniela", "_submission_time": "2015-08-11T18:01:13", "seller_name/seller_name_prefix": "dr", "_version": "201507162126", "_geolocation": [47.867583, -122.164306], "seller_address/seller_address_street": "Sucker Drive", "seller_address/seller_address_number": "2998", "proprietorship": "common_law_freehold", "_id": 3094351}, {"_notes": [], "plot_address/plot_address_street": "Thorndyke Ave W", "loan_group/loan_officer/loan_officer_name_last": "Martin", "loan": "yes", "applicant_name/applicant_name_first": "Sarah", "applicant_marital_status": "separated", "_tags": [], "plot_description": "Condo", "applicant_name/applicant_name_postfix": "sr", "surveyor": "danielbaah", "loan_group/loan_bank_name": "JP Morgan Chase", "meta/instanceID": "uuid:a4156b1c-f46e-4680-9447-66843be162d5", "_duration": 251.0, "applicant_name/applicant_name_last": "Bindman", "applicant_name/geo_location": "47.670367 -122.387855 0 0", "end": "2015-07-16T14:31:16.000-07:00", "date_land_possession": "2015-04-28", "applicant_phone_alt": "no phonenumber property in enketo", "applicant_dob": "2015-06-10", "loan_group/loan_officer/loan_officer_name_postfix": "sr", "plot_number": 2501, "start": "2015-07-16T14:27:05.000-07:00", "_attachments": [], "_status": "submitted_via_web", "today": "2015-07-16", "deviceid": "enketo.org:rRFxqMTT3EzpjWv6", "plot_address/plot_address_number": "2501", "_xform_id_string": "Basic-survey-prototype7", "loan_group/loan_officer/loan_officer_name_prefix": "mr", "loan_group/loan_officer/loan_officer_name_first": "Steve", "_bamboo_dataset_id": "", "_uuid": "a4156b1c-f46e-4680-9447-66843be162d5", "applicant_phone": "no phonenumber property in enketo", "means_of_acquire": "lease", "_submitted_by": "nhallahan", "applicant_name/applicant_name_prefix": "dr", "seller_name/seller_name_last": "Sam", "formhub/uuid": "d427376135c742c995a94a9d18df6614", "seller_name/seller_name_first": "Michael", "loan_group/loan_bank_branch": "Chase Bank", "_submission_time": "2015-07-16T21:31:18", "seller_name/seller_name_prefix": "mr", "_version": "201507162126", "_geolocation": [47.670367, -122.387855], "plot_address/plot_address_city": "Seattle", "proprietorship": "allodial", "_id": 2892616}]

};
module.exports = survey;