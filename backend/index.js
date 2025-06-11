const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5003;

const apiRouter = require('./api');

app.use(cors());
app.use(express.json()); 

app.use('/api', apiRouter);

/*app.use(express.static(path.join(__dirname, 'frontend/dist')));*/

/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});*/

function startServer() {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

startServer();
