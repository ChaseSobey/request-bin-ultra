const { Pool } = require("pg");
const config = require("../config");
const { dbQuery } = require("../lib/db-query");

const pool = new Pool({
  user: config.POSTGRES_USERNAME,
  host: config.POSTGRES_HOST,
  database: config.POSTGRES_DB,
  password: config.POSTGRES_PASSWORD,
  port: 5432,
});

describe("Postgres Bins Table Connection", () => {
  let client;
  beforeAll(async () => {
    client = await pool.connect();
  });

  afterAll(async () => {
    if (client) await client.release();

    await pool.end();
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
