
const mongoose = require("mongoose");
//changed the connection to a promise (why?)
//I wanted to be able to call the DB first in the server before starting the server using await
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..','..', '.env') });
const DB = () => {
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGO_URL)
        .then(() => {
          console.log("Database connected");
          resolve();
        })
        .catch((err) => {
          console.error(" Failed to create database");
          reject(err); 
        });
    });
  };

module.exports = { DB };
