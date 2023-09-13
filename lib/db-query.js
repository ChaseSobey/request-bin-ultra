const { Client } = require("pg");
const config = require("../config");

const logQuery = (statement, parameters) => {
  let timeStamp = new Date();
  let formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

module.exports = {
  async dbQuery(statement, ...parameters) {
    const client = new Client({
      user: config.POSTGRES_USERNAME,
      host: config.POSTGRES_HOST,
      database: config.POSTGRES_DB,
      password: config.POSTGRES_PASSWORD,
      port: 5432,
    });

    await client.connect();
    logQuery(statement, parameters);
    let result = await client.query(statement, parameters);
    await client.end();

    return result;
  },
};
