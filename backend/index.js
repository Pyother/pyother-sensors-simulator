const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const api = require('./api');

app.use(cors());

function startServer () {
    api(app);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
}

startServer();
