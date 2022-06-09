'use strict';

const app = require("./app");
const port = 4000;

// Tell app to listen on port 4000
const server = app.listen(port, (err) => {
  if (err) {
    throw err;
  }

  console.log('Server started on port 4000');
});

const close = () => {
    server.close();
}

module.exports = close;
