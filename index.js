const express = require('express');
const mongoose = require('mongoose');


//Config
const {DBURI, DBURI_remote, PORT, NODE_ENV} = require('./src/config/env.js');

const port =   PORT|| 8080;

// const seeder = require('./src/models/seeder.model')


if(NODE_ENV == 'dev'){
  mongoose.connect(DBURI)
  .then(() => {
    console.log('connected to database successfully');
  })
  .catch(() => {
    console.log("can't connect to database");
  });
}else{
  mongoose.connect(DBURI_remote)
  .then(() => {
    console.log('connected to database successfully');
  })
  .catch(() => {
    console.log("can't connect to database");
  });
}


//Create Application
const app = express();

const {superAdmin} = require('./src/config/seeder');
superAdmin();

const endpoints = require('./src/index.routes');
endpoints(app);

if(NODE_ENV == 'dev'){
  app.listen(process.argv[2], () => {
    console.log(`Production connected successfully ON PORT-${process.argv[2]}`);
  });  
}else{
  app.listen(port, () => {
    console.log(`connected successfully ON port-${port}`);
  });
}

