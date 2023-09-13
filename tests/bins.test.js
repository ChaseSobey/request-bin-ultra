const { Pool } = require("pg");
const config = require("../config");

const logQuery = (statement, parameters) => {
  let timeStamp = new Date();
  let formattedTimeStamp = timeStamp.toString().substring(4, 24);
  console.log(formattedTimeStamp, statement, parameters);
};

const pool = new Pool({
  user: config.POSTGRES_USERNAME,
  host: config.POSTGRES_HOST,
  database: config.POSTGRES_DB,
  password: config.POSTGRES_PASSWORD,
  port: 5432,
});

async function dbQuery(statement, ...parameters) {
  const client = await pool.connect();

  try {
    logQuery(statement, parameters);
    const result = await client.query(statement, parameters);
    return result;
  } finally {
    client.release();
  }
}

describe("Postgres Bins Table Connection", () => {
  beforeAll(() => {
    return pool.connect();
  });

  test("can connect to DB", async () => {
    const CREATE_BIN = `INSERT INTO bins (bin_path) VALUES ($1)`;

    try {
      const result = await dbQuery(CREATE_BIN, "asdasd");
      expect(result.rowCount).toBe(1);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  });
});
