const config = require('./config')
const express = require('express');
const morgan = require('morgan');

const app = express();
const port = config.PORT;
const host = config.HOST;

app.set('views', './views');
app.set('view engine', 'pug');
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  //DB query to get all bins
  let allBins = ['bin 1', 'bin 2', 'bin 3'];
  res.render('homepage', {allBins})
})

app.get('/bin/:bin_id', (req, res) => {
  const binId = req.params.bin_id;
  
  //DB query to get all requests with bin id 
  let allRequests = ['request 1', 'request 2', 'request 3'];

  res.render('bin', {binId, allRequests})
})

app.listen(port, host, () => {
  console.log(`Server is running on port: ${port} of ${host}`);
});