// 
const express = require('express');
const path = require('path');
const config = require('./src/configuration/options.json');
const materials = require('./src/configuration/materials.json');
const calculate = require('./src/calculations');

const router = express.Router();

// * Test
router.get('/test', (req, res) => {
   res.json({ message: 'API is working!' });
});

// * Configuration
router.get('/config', (req, res) => {
   res.json(config);
});

// * Materials
router.get('/materials', (req, res) => {
   res.json(materials);
});

// * Distance calculation
router.post('/calc/distance', (req, res) => {
   const { position, direction, angleStep, sensor, inputObjects } = req.body;
   
   const result = calculate({
      calculationType: 'distance',
      sensor: sensor,
      coords: {
         position: position,
         direction: direction,
         angleStep: angleStep
      },
      environment: inputObjects
   });
   
   res.json(result);
});

module.exports = router;
