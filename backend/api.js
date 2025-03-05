const config = require('./src/configuration/options.json');
const path = require('path');
const express = require('express');

function api (app) {

   app.use(express.static(path.join(__dirname, '../frontend/dist')));

   app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
   });
   
   // * Configuration:
   app.get('/api/config', (req, res) => {
      res.json(config);
   });

}

module.exports = api;