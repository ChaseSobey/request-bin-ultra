const config = require('./config')
const express = require('express');
const app = express();
const port = config.PORT;
const host = config.HOST;










app.listen(port, host, () => {
  console.log(`Server is running on port: ${port} of ${host}`);
});