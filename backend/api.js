// * Node modules: 
const path = require('path');
const express = require('express');

// * JSON files:
const config = require('./src/configuration/options.json');
const materials = require('./src/configuration/materials.json');

// * Functions:
const calcDistance = require('./src/services/calculations/calcDistance');

function api (app) {

   app.use(express.static(path.join(__dirname, '../frontend/dist')));
   app.use(express.json());

   app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
   });
   
   // * Configuration:
   app.get('/api/config', (req, res) => {
      res.json(config);
   });

   // * Materials:
   app.get('/api/materials', (req, res) => {
      res.json(materials);
   });

   // * Distance calculation:
   app.post('/api/calc/distance', (req, res) => {
      const { position, direction, sensor, inputObject } = req.body;
      res.send(calcDistance({ position, direction, sensor, inputObject }));
   });

}

module.exports = api;