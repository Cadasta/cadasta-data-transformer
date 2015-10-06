var survey = {};

survey.form = {
    metadata: {
        "name": "CJF-minimun",
        "title": "Cadasta CJF Minimum",
        "sms_keyword": "CJF-minimum-1",
        "default_language": "default",
        "version": "201509282054",
        "id_string": "CJF-minimum-1",
        "type": "survey",
        "children": [
            {
                "type": "start",
                "name": "start"
            },
            {
                "type": "end",
                "name": "end"
            },
            {
                "type": "today",
                "name": "today"
            },
            {
                "type": "deviceid",
                "name": "deviceid"
            },
            {
                "type": "note",
                "name": "title",
                "label": "Cadasta CJF Minimum – September 2015"
            },
            {
                "label": "Name of Surveyor",
                "type": "select one",
                "children": [
                    {
                        "name": "katechapman",
                        "label": "Kate Chapman"
                    },
                    {
                        "name": "frankpichel",
                        "label": "Frank Pichel"
                    },
                    {
                        "name": "ryanwhitley",
                        "label": "Ryan Whitley"
                    },
                    {
                        "name": "danielbaah",
                        "label": "Daniel Baah"
                    },
                    {
                        "name": "toddslind",
                        "label": "Todd Slind"
                    },
                    {
                        "name": "nicholashallahan",
                        "label": "Nicholas Hallahan"
                    }
                ],
                "name": "surveyor"
            },
            {
                "control": {
                    "appearance": "field-list"
                },
                "label": "Name of Applicant",
                "type": "group",
                "children": [
                    {
                        "type": "text",
                        "name": "applicant_name_first",
                        "label": "Applicant First Name"
                    },
                    {
                        "type": "text",
                        "name": "applicant_name_middle",
                        "label": "Applicant Middle Name"
                    },
                    {
                        "type": "text",
                        "name": "applicant_name_last",
                        "label": "Applicant Last Name (Surname)"
                    }
                ],
                "name": "applicant_name"
            },
            {
                "type": "geopoint",
                "name": "geo_location",
                "label": "Location of Parcel"
            },
            {
                "type": "date",
                "name": "date_land_possession",
                "label": "Date of Land Possession"
            },
            {
                "label": "How did you acquire the land?",
                "type": "select one",
                "children": [
                    {
                        "name": "freehold",
                        "label": "Freehold"
                    },
                    {
                        "name": "lease",
                        "label": "Lease"
                    },
                    {
                        "name": "inheritance",
                        "label": "Inheritance"
                    },
                    {
                        "name": "gift",
                        "label": "Gift"
                    },
                    {
                        "name": "other",
                        "label": "Other"
                    }
                ],
                "name": "means_of_acquire"
            },
            {
                "label": "What is the Social Tenure Type?",
                "type": "select one",
                "children": [
                    {
                        "name": "allodial",
                        "label": "Allodial Ownder"
                    },
                    {
                        "name": "freehold",
                        "label": "Freehold"
                    },
                    {
                        "name": "common_law_freehold",
                        "label": "Common Law Freehold"
                    },
                    {
                        "name": "lease",
                        "label": "Leasehold Interest"
                    },
                    {
                        "name": "contractual",
                        "label": "Contractual / Share Cropping / Customary Tenure Agreement"
                    }
                ],
                "name": "tenure_type"
            },
            {
                "control": {
                    "bodyless": true
                },
                "type": "group",
                "children": [
                    {
                        "bind": {
                            "readonly": "true()",
                            "calculate": "concat('uuid:', uuid())"
                        },
                        "type": "calculate",
                        "name": "instanceID"
                    }
                ],
                "name": "meta"
            }
        ]
    },
    results: [
        {
            "_notes": [],
            "applicant_name/applicant_name_first": "Dan",
            "_bamboo_dataset_id": "",
            "_tags": [],
            "surveyor": "ryanwhitley",
            "_xform_id_string": "CJF-minimum-Monday",
            "_geolocation": [
                -16.501603,
                -68.139085
            ],
            "_duration": 1737,
            "meta/instanceID": "uuid:6cd8f057-8e37-484c-934f-05a8d0be34c9",
            "end": "2015-09-28T16:28:23.000-07:00",
            "date_land_possession": "2015-05-19",
            "applicant_name/applicant_name_last": "Baah",
            "start": "2015-09-28T15:59:26.000-07:00",
            "geo_location": "-16.501603 -68.139085 0 0",
            "_attachments": [],
            "applicant_name/applicant_name_middle": "Nana",
            "_status": "submitted_via_web",
            "today": "2015-09-28",
            "_uuid": "6cd8f057-8e37-484c-934f-05a8d0be34c9",
            "means_of_acquire": "freehold",
            "_submitted_by": "nhallahan",
            "formhub/uuid": "ccb51769d2874fce9bf3729c18c1a5d6",
            "_submission_time": "2015-09-28T23:28:27",
            "_version": "201509282054",
            "tenure_type": "allodial",
            "deviceid": "enketo.org:rRFxqMTT3EzpjWv6",
            "_id": 3737535
        }
    ]

};
module.exports = survey;