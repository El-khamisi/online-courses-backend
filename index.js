const express = require('express');
const mongoose = require('mongoose');


//Config
const { PORT, NODE_ENV} = require('./src/config/env.js');

const port =   PORT|| 8080;

// const seeder = require('./src/models/seeder.model')





//Create Application
// const app = express();

const {superAdmin} = require('./src/config/seeder');
superAdmin();

const endpoints = require('./src/index.routes');
endpoints(app);

if(NODE_ENV == 'dev'){
  app.listen(process.argv[2], () => {
    console.log(`Development connected successfully ON PORT-${process.argv[2]}`);
  });  
}else{
  app.listen(port, () => {
    console.log(`Production connected successfully ON port-${port}`);
  });
}

