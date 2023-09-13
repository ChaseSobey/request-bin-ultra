const config = require('./config')
const express = require('express');
const morgan = require('morgan');
const mongo = require('./lib/mongodb-query');
const app = express();
const port = config.PORT;
const host = config.HOST;

app.set('views', './views');
app.set('view engine', 'pug');
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/', (req, res) => {
  console.log(req.rawHeaders)
  console.log(req.method);
  console.log(req.url);
  console.log(req.body);
  mongo.insertOne(MONGO_DB_NAME, MONGO_DB_COLLECTION_NAME, req.body)
  res.sendStatus(200);
})

app.get('/', (req, res) => {
  //DB query to get all bins
  console.log(req);
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