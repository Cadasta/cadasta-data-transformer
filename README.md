# cadasta-data-transformer

The Cadasta Data Transformer contains much of the business logic that will go into interpreting incoming datasets and extracting Parcels, Relationships and People/Groups for insertion into the Cadasta API and DB.

***OVERVIEW***

The data-transformer is a Node.js module that contains routes and controllers that accept incoming .json files (that have been pre-formatted into a known format by the Ingestion Engine). This module will also contain a plethora of logic - it needs to make decisions about how the incoming data gets mapped to the Cadasta schema.

Time will be devoted to creating the optimal structure that all incoming data must be mapped to (A.K.A the Common JSON Format - CJF). This JavaScript object model
must account for data updates, deletes, understand geometry and unlimited numbers of unstructured properties.

After mapping decisions are made, the data transformer will need to make requests to the appropriate Cadasta APIs to ensure that the data is saved into the Cadasta DB in the correct manner.

***Installation***

1) install node packages

```npm install```

2) cd into the location of this directory

3) clone [pyxform](https://github.com/XLSForm/pyxform)

```git clone https://github.com/XLSForm/pyxform.git```

4) install python packages

```sudo pip install -r requirements.txt```