const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5002;

const apiRouter = require('./api');

app.use(cors());
app.use(express.json()); 

app.use('/api', apiRouter);

function startServer() {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

startServer();
