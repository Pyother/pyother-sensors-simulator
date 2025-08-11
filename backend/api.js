// 
const express = require('express');
const path = require('path');
const config = require('./src/configuration/options.json');
const materials = require('./src/configuration/materials.json');
const calcDistance = require('./src/calculations/calcDistance');

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
   const { position, direction, sensor, inputObjects } = req.body;
   console.log('Calculating distance with data:', JSON.stringify({ position, direction, sensor, inputObjects }, null, 2));
   res.json(calcDistance({ position, direction, sensor, inputObjects }));
});

module.exports = router;
