// NOTE: See https://www.mongodb.com/docs/manual/tutorial/insert-documents/
// for MONGO-DB api

const { MongoClient } = require('mongodb');
const config = require('../config.js');


//Insert a single value
async function insertOne(dbName, collectionName, jsonObj) {
  const uri = config.ATLAS_URI;
  const client = new MongoClient(uri);
  try {
    conn = await client.connect();
    await conn.db(dbName).collection(collectionName).insertOne(jsonObj);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

//Insert multiple values
async function insertMany(dbName, collectionName, jsonObjArr) {
  const uri = config.ATLAS_URI;
  const client = new MongoClient(uri);
  try {
    conn = await client.connect();
    await conn.db(dbName).collection(collectionName).insertMany(jsonObjArr);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}


//Find a value
//SEE https://www.mongodb.com/docs/manual/reference/method/db.collection.find/

async function findDbObj(dbName, collectionName, objSearchValues) {
  const uri = config.ATLAS_URI;
  const client = new MongoClient(uri);
  let foundValues;
  try {
    conn = await client.connect();
    foundValues = await conn.db(dbName).collection(collectionName).find(objSearchValues).toArray();
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
  if (foundValues.length === 1) { return foundValues[0]};
  return foundValues;
}

//Delete all values that meet the specified criteria
// SEE https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/

async function deleteObjects(dbName, collectionName, jsonDeletionCriteria) {
  const uri = config.ATLAS_URI;
  const client = new MongoClient(uri);
  try {
    conn = await client.connect();
    await conn.db(dbName).collection(collectionName).deleteMany(jsonDeletionCriteria);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};



module.exports = {
  insertOne,
  insertMany,
  findDbObj,
  deleteObjects,
};

