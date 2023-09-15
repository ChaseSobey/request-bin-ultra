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

app.use((_, res, next) => {
  res.locals.store = new PgPersistence();
  next();
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
app.get("/", async (_, res) => {
  let store = res.locals.store;
  let allBins = await store.getAllBins();
  res.render("homepage", { allBins });
});

//Delete all requests in a bin
app.post("/deleteReqs/bin/:bin_path", async (req, res) => {
  let store = res.locals.store;
  let binPath = req.params.bin_path;
  let stringIds = await store.getMongoIdsByBinPath(binPath);

  await mongo.deleteObjects("test", "requests_collection", stringIds);
  await store.clearBin(binPath);

  res.redirect(`/bin/${binPath}`);
});

//Delete a bin and all requests
app.post("/deleteBin/bin/:bin_path", async (req, res) => {
  let store = res.locals.store;
  let binPath = req.params.bin_path;
  let stringIds = await store.getMongoIdsByBinPath(binPath);

  await mongo.deleteObjects("test", "requests_collection", stringIds);
  await store.deleteBin(binPath);

  res.redirect("/");
});

//Route to get all requests to a bin
app.get("/bin/:bin_path", async (req, res) => {
  const hostname = req.get("host");
  let store = res.locals.store;
  const binPath = req.params.bin_path;

  let mongoIds = await store.getMongoIdsByBinPath(binPath);

  const allRequests = await mongo.getObjectsById(
    "test",
    "requests_collection",
    mongoIds
  );

  res.render("bin", { binPath, allRequests, hostname });
});

//Route to store all http requests to a bin
app.all("/bin/:bin_path", async (req, res) => {
  let store = res.locals.store;
  let { headers, body, url, method } = { req };

  let binPath = req.params.bin_path;
  let newRequest = {
    headers,
    body,
    url,
    method,
  };

  let mongoId = await mongo.insertOne(
    "test",
    "requests_collection",
    newRequest
  );

  await store.createRequest(binPath, mongoId, method, url);
  res.sendStatus(200);
});

app.listen(port, host, () => {
  console.log(`Server is running on port: ${port} of ${host}`);
});
