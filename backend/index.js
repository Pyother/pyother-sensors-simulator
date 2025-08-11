const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5002;

// Import routera
const apiRouter = require('./api');

app.use(cors());
app.use(express.json()); 

// Obsługa endpointów API
app.use('/api', apiRouter);

// Obsługa plików statycznych (SPA frontend, np. Vue/React build)
/*app.use(express.static(path.join(__dirname, 'frontend/dist')));*/

// Obsługa wszystkich innych ścieżek (żeby SPA działało po odświeżeniu strony)
/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});*/

// Uruchomienie serwera
function startServer() {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

startServer();
