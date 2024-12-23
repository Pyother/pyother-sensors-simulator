const path = require('path');
const express = require('express');

function api (app) {

   app.use(express.static(path.join(__dirname, '../frontend/dist')));

   app.get('/', (req, res) => { 
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
   });
   
}

module.exports = api;