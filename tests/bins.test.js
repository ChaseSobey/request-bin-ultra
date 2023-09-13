const { Pool } = require("pg");
const PgPersistence = require("../lib/pg-persistence");
const config = require("../config");

const pool = new Pool({
  user: config.POSTGRES_USERNAME,
  host: config.POSTGRES_HOST,
  database: config.POSTGRES_DB,
  password: config.POSTGRES_PASSWORD,
  port: 5432,
});

describe("Postgres Bins Table Connection", () => {
  let pgPersistence;

  beforeAll(async () => {
    pgPersistence = new PgPersistence();
    await pgPersistence.createBin("asdasd");
  });

  afterAll(async () => {
    await pool.end();
  });

  test("can insert to Postgres DB", async () => {
    try {
      const binMade = await pgPersistence.createBin("asdasd");
      expect(binMade).toBe(true);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  });

  test("can get all bins", async () => {
    const returnedBins = await pgPersistence.getAllBins();
    expect(returnedBins).not.toBe(0);
  });
});
