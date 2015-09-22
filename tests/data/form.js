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
    results: [{
        "_notes": [],
        "deviceid": "enketo.org:rRFxqMTT3EzpjWv6",
        "plot_address/plot_address_street": "University Ave",
        "loan": "no",
        "applicant_name/applicant_name_first": "Thurmond",
        "applicant_marital_status": "single",
        "_tags": [],
        "plot_description": "Under the bridge",
        "applicant_name/applicant_name_postfix": "jr",
        "surveyor": "danielbaah",
        "_xform_id_string": "Basic-survey-prototype7",
        "meta/instanceID": "uuid:7cabdc90-6c7e-4e3d-8687-b52b608d3fc7",
        "_duration": 126.0,
        "plot_number": 3,
        "applicant_name/geo_location": "40.588342 -73.724739 0 0",
        "end": "2015-08-27T09:47:29.000-07:00",
        "date_land_possession": "2015-08-03",
        "applicant_phone_alt": "no phonenumber property in enketo",
        "applicant_dob": "2015-04-05",
        "applicant_name/applicant_name_last": "Thomas",
        "start": "2015-08-27T09:45:23.000-07:00",
        "_attachments": [],
        "seller_address/seller_address_city": "Syracuse",
        "_status": "submitted_via_web",
        "today": "2015-08-27",
        "seller_address/seller_address_number": "2718",
        "plot_address/plot_address_number": "2398",
        "seller_name/seller_name_first": "Mike",
        "_bamboo_dataset_id": "",
        "_uuid": "7cabdc90-6c7e-4e3d-8687-b52b608d3fc7",
        "applicant_phone": "no phonenumber property in enketo",
        "means_of_acquire": "lease",
        "seller_name/seller_name_postfix": "sr",
        "_submitted_by": "nhallahan",
        "applicant_name/applicant_name_prefix": "dr",
        "applicant_name/applicant_name_middle": "Edward",
        "seller_name/seller_name_last": "McDonald",
        "formhub/uuid": "d427376135c742c995a94a9d18df6614",
        "_submission_time": "2015-08-27T16:47:29",
        "seller_name/seller_name_prefix": "mr",
        "_version": "201507162126",
        "_geolocation": {"type":"Point","coordinates":[
            -73.724739,40.588342
        ]},
        "seller_address/seller_address_street": "Oriental Drive",
        "plot_address/plot_address_city": "Long Island",
        "proprietorship": "freehold",
        "_id": 3348588
    },{
        "_notes": [],
        "deviceid": "enketo.org:rRFxqMTT3EzpjWv6",
        "plot_address/plot_address_street": "Locust Ave",
        "loan": "no",
        "applicant_name/applicant_name_first": "Magic",
        "applicant_marital_status": "single",
        "_tags": [],
        "plot_description": "cul de sac",
        "applicant_name/applicant_name_postfix": "jr",
        "surveyor": "mikejones",
        "_xform_id_string": "Basic-survey-prototype7",
        "meta/instanceID": "uuid:7cabdc90-6c7e-4esd-8687-b52b608d3fc7",
        "_duration": 126.0,
        "plot_number": 3,
        "applicant_name/geo_location": "40.588342 -73.724739 0 0",
        "end": "2015-08-27T09:47:29.000-07:00",
        "date_land_possession": "2015-08-03",
        "applicant_phone_alt": "no phonenumber property in enketo",
        "applicant_dob": "2015-04-05",
        "applicant_name/applicant_name_last": "Johnson",
        "start": "2015-08-27T09:45:23.000-07:00",
        "_attachments": [],
        "seller_address/seller_address_city": "Long Island",
        "_status": "submitted_via_web",
        "today": "2015-08-27",
        "seller_address/seller_address_number": "2718",
        "plot_address/plot_address_number": "2398",
        "seller_name/seller_name_first": "Mike",
        "_bamboo_dataset_id": "",
        "_uuid": "7cabdc90-6c7e-4e3d-8687-b52b608d3fc7",
        "applicant_phone": "no phonenumber property in enketo",
        "means_of_acquire": "lease",
        "seller_name/seller_name_postfix": "sr",
        "_submitted_by": "nhallahan",
        "applicant_name/applicant_name_prefix": "dr",
        "applicant_name/applicant_name_middle": "Eddie",
        "seller_name/seller_name_last": "Jackson",
        "formhub/uuid": "d427376135c742c995a94a9d18df6614",
        "_submission_time": "2015-08-27T16:47:29",
        "seller_name/seller_name_prefix": "mr",
        "_version": "201507162126",
        "_geolocation": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -115.1619529724121,
                        36.12914030501672
                    ],
                    [
                        -115.16255378723143,
                        36.127823126586215
                    ],
                    [
                        -115.1630687713623,
                        36.12823908005751
                    ],
                    [
                        -115.16435623168945,
                        36.12366347063968
                    ],
                    [
                        -115.16399145126343,
                        36.123524811645325
                    ],
                    [
                        -115.16354084014893,
                        36.12264085479911
                    ],
                    [
                        -115.1551830768585,
                        36.1224501961352
                    ],
                    [
                        -115.15529036521912,
                        36.12686989156732
                    ],
                    [
                        -115.15517234802246,
                        36.12896699332822
                    ],
                    [
                        -115.15661001205444,
                        36.12931361632251
                    ],
                    [
                        -115.1619529724121,
                        36.12929628520917
                    ],
                    [
                        -115.1619529724121,
                        36.12914030501672
                    ]
                ]
            ]
        },
        "seller_address/seller_address_street": "Oregon Lane",
        "plot_address/plot_address_city": "Long Island",
        "proprietorship": "lease",
        "_id": 3348588
    }, {
        "_notes": [],
        "deviceid": "enketo.org:rRFxqMTT3EzpjWv6",
        "plot_address/plot_address_street": "Condo Ave",
        "loan": "no",
        "applicant_name/applicant_name_first": "Nerlans",
        "applicant_marital_status": "single",
        "_tags": [],
        "plot_description": "Condo",
        "applicant_name/applicant_name_postfix": "jr",
        "surveyor": "danielbaah",
        "_xform_id_string": "Basic-survey-prototype8",
        "meta/instanceID": "uuid:0ff4bc9e-fdad-44fe-9899-c5ccc41aa966",
        "_duration": 122.0,
        "applicant_name/applicant_name_last": "Noel",
        "applicant_name/geo_location": "39.95255 -75.157534 0 0",
        "end": "2015-08-27T10:07:41.000-07:00",
        "date_land_possession": "2015-08-03",
        "applicant_phone_alt": "no phonenumber property in enketo",
        "applicant_dob": "2015-02-08",
        "plot_number": 6672,
        "start": "2015-08-27T10:05:39.000-07:00",
        "_attachments": [],
        "seller_address/seller_address_city": "St Louis",
        "_status": "submitted_via_web",
        "today": "2015-08-27",
        "seller_address/seller_address_number": "231",
        "plot_address/plot_address_number": "29182",
        "seller_name/seller_name_first": "Mark",
        "_bamboo_dataset_id": "",
        "_uuid": "0ff4bc9e-fdad-44fe-9899-c5ccc41aa966",
        "applicant_phone": "no phonenumber property in enketo",
        "means_of_acquire": "other",
        "seller_name/seller_name_postfix": "iii",
        "_submitted_by": "nhallahan",
        "applicant_name/applicant_name_prefix": "mr",
        "seller_name/seller_name_last": "McGwire",
        "formhub/uuid": "7fae4c356bb84d5792b96808a3cbc866",
        "_submission_time": "2015-08-27T17:07:40",
        "seller_name/seller_name_prefix": "mr",
        "_version": "201508271705",
        "_geolocation": {
            "type": "LineString",
            "coordinates": [
                [
                    -121.81640624999999,
                    48.004625021133904
                ],
                [
                    -121.1572265625,
                    46.17983040759436
                ],
                [
                    -120.52001953124999,
                    46.22545288226939
                ],
                [
                    -119.88281249999999,
                    47.100044694025215
                ],
                [
                    -119.4873046875,
                    47.08508535995384
                ],
                [
                    -119.35546875000001,
                    46.27103747280261
                ],
                [
                    -118.125,
                    46.30140615437332
                ],
                [
                    -117.53173828125,
                    48.19538740833338
                ],
                [
                    -118.10302734374999,
                    48.19538740833338
                ],
                [
                    -118.63037109375,
                    46.875213396722685
                ],
                [
                    -119.15771484375,
                    47.65058757118734
                ],
                [
                    -120.21240234375001,
                    47.66538735632654
                ],
                [
                    -120.73974609374999,
                    46.9502622421856
                ],
                [
                    -121.46484375,
                    48.38544219115486
                ]
            ]
        },
        "seller_address/seller_address_street": "Roids Drive",
        "plot_address/plot_address_city": "Philadelphia",
        "proprietorship": "occupy",
        "_id": 3348844
    },{
        "_notes": [],
        "deviceid": "enketo.org:rRFxqMTT3EzpjWv6",
        "plot_address/plot_address_street": "Condo Ave",
        "loan": "no",
        "applicant_name/applicant_name_first": "Deangelo",
        "applicant_marital_status": "single",
        "_tags": [],
        "plot_description": "Condo",
        "applicant_name/applicant_name_postfix": "jr",
        "surveyor": "danielbaah",
        "_xform_id_string": "Basic-survey-prototype8",
        "meta/instanceID": "uuid:0ff4bc9e-fdad-44fe-9899-c5ccc41aa966",
        "_duration": 122.0,
        "applicant_name/applicant_name_last": "Russell",
        "applicant_name/geo_location": "39.95255 -75.157534 0 0",
        "end": "2015-08-27T10:07:41.000-07:00",
        "date_land_possession": "2015-08-03",
        "applicant_phone_alt": "no phonenumber property in enketo",
        "applicant_dob": "2015-02-08",
        "plot_number": 6672,
        "start": "2015-08-27T10:05:39.000-07:00",
        "_attachments": [],
        "seller_address/seller_address_city": "St Louis",
        "_status": "submitted_via_web",
        "today": "2015-08-27",
        "seller_address/seller_address_number": "231",
        "plot_address/plot_address_number": "29182",
        "seller_name/seller_name_first": "Mark",
        "_bamboo_dataset_id": "",
        "_uuid": "0ff4bc9e-fdad-44fe-9899-c5ccc41aa966",
        "applicant_phone": "no phonenumber property in enketo",
        "means_of_acquire": "other",
        "seller_name/seller_name_postfix": "iii",
        "_submitted_by": "nhallahan",
        "applicant_name/applicant_name_prefix": "mr",
        "seller_name/seller_name_last": "McGwire",
        "formhub/uuid": "7fae4c356bb84d5792b96808a3cbc866",
        "_submission_time": "2015-08-27T17:07:40",
        "seller_name/seller_name_prefix": "mr",
        "_version": "201508271705",
        "_geolocation": {
            "type": "LineString",
            "coordinates": [
                [
                    -122.33278512954712,
                    47.5920121547815
                ],
                [
                    -122.33330011367798,
                    47.59082550551166
                ],
                [
                    -122.3314118385315,
                    47.59110046322524
                ]
            ]
        },
        "seller_address/seller_address_street": "Jersey Shore Drive",
        "plot_address/plot_address_city": "New Jersey",
        "proprietorship": "informal_occupy",
        "_id": 3348844
    }
    ]

};
module.exports = survey;