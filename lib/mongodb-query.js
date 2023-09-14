// NOTE: See https://www.mongodb.com/docs/manual/tutorial/insert-documents/
// for MONGO-DB api

const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config.js");

async function setupClient() {
  const uri = config.ATLAS_URI;
  const client = new MongoClient(uri);
  let conn;
  try {
    conn = await client.connect();
  } catch (e) {
    console.error(e);
  } finally {
    return conn;
  }
}

//Insert a single value
// SEE https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/
async function insertOne(dbName, collectionName, jsonObj) {
  let conn = await setupClient();
  let insertedObjInfo = await conn
    .db(dbName)
    .collection(collectionName)
    .insertOne(jsonObj);
  conn.close();
  return insertedObjInfo.insertedId.toString();
}

//Insert multiple values
// SEE https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/
async function insertMany(dbName, collectionName, jsonObjArr) {
  let conn = await setupClient();
  await conn.db(dbName).collection(collectionName).insertMany(jsonObjArr);
  conn.close();
}

//Find a value
//SEE https://www.mongodb.com/docs/manual/reference/method/db.collection.find/

async function findDbObj(dbName, collectionName, objSearchValues) {
  let conn = await setupClient();
  foundValues = await conn
    .db(dbName)
    .collection(collectionName)
    .find(objSearchValues)
    .toArray();
  conn.close();

  if (foundValues.length === 1) {
    return foundValues[0];
  }
  return foundValues;
}

//Delete all values that meet the specified criteria
// SEE https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/

async function deleteObjects(dbName, collectionName, stringIdsArr) {
  let conn = await setupClient();
  let mongoIdObjsArr = stringIdsArr.map((stringId) => _stringToObjectId(stringId));
  await conn
    .db(dbName)
    .collection(collectionName)
    .deleteMany({ _id: { $in: mongoIdObjsArr } });
  conn.close();
}

function mongoIdToString(ObjectIdObj) {
  return ObjectIdObj.toString();
}

async function getObjectsById(dbName, collectionName, stringIdsArr) {
  const mongoIds = stringIdsArr.map((stringId) => _stringToObjectId(stringId));
  const mongoObjs = await findDbObj(dbName, collectionName, { _id: { $in: mongoIds } })
  return mongoObjs;
}

function _stringToObjectId(stringId) {
  return new ObjectId(stringId);
}

module.exports = {
  insertOne,
  insertMany,
  findDbObj,
  deleteObjects,
  getObjectsById,
  mongoIdToString,
  ObjectId,
};
