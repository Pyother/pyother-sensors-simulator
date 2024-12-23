const express = require('express')
const app = express()
const port = 5000
const api = require('./api')

function startServer () {
    api(app);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
}

startServer();
