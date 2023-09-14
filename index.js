const config = require("./config");
const express = require("express");
const morgan = require("morgan");
const crypto = require("crypto");
const mongo = require("./lib/mongodb-query");
const PgPersistence = require("./lib/pg-persistence");
const app = express();
const port = config.PORT;
const host = config.HOST;

app.set("views", "./views");
app.set("view engine", "pug");
app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.locals.store = new PgPersistence();
  next();
});

//Route to store all http requests to a bin
app.all("/bin/req/:bin_path", async (req, res) => {
  let store = res.locals.store;
  console.log(req.rawHeaders);
  console.log(req.method);
  console.log(req.url);
  console.log(req.body);
  let binPath = req.params.bin_path;
  //insert into mongo database
  //insert req.body into mongo database

  //mongoid is string type
  let mongoId = await mongo.insertOne(
    "request-bin-ultra",
    "requests",
    req.body
  );
  console.log("mongoid is :", mongoId);
  await store.createRequest(binPath, mongoId, req.method, req.url);
  res.sendStatus(200);
});

//Route to create new bin
app.post("/createBin", async (req, res) => {
  let binPath = crypto.randomBytes(10).toString("hex");
  //e.g. binPath is a string - e.g. 40a65c27d6c4a79e

  let store = res.locals.store;
  await store.createBin(binPath);
  res.redirect(`/bin/${binPath}`);
});

//Route to get all bins
app.get("/", async (req, res) => {
  console.log(req);
  let store = res.locals.store;
  let allBins = await store.getAllBins();
  res.render("homepage", { allBins });
});

//Route to get all requests to a bin
app.get("/bin/:bin_path", async (req, res) => {
  console.log("route hit");
  const hostname = req.get("host");
  let store = res.locals.store;
  const binPath = req.params.bin_path;

  //postgres query for mongo ids that have corresponding binPath
  let mongoIds = await store.getMongoIdsByBinPath(binPath);
  console.log("Mongoids is: ", mongoIds);

  //mongo query to get all requests with mongoIds
  let mongoIdObjs = mongoIds.map((mongoId) =>
    mongo.stringIdToMongoIdObject(mongoId.mongo_id)
  );
  console.log("mongoIdObjs: ", mongoIdObjs);

  let mongoObjs = [];
  mongoIdObjs.forEach((mongoId) =>
    mongoObjs.push(
      mongo.findDbObj("test", "requests_collection", { _id: mongoId })
    )
  );
  Promise.all(mongoObjs)
    .then((values) => {
      console.log("values are: ", values);
      return values;
    })
    .then((allRequests) => {
      console.log("allRequests is :", allRequests);
      res.render("bin", { binPath, allRequests, hostname });
    });
});

app.listen(port, host, () => {
  console.log(`Server is running on port: ${port} of ${host}`);
});
