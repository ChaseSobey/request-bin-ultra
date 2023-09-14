const { Pool } = require("pg");
const PgPersistence = require("../lib/pg-persistence");
const { dbQuery } = require("../lib/db-query");
const config = require("../config");

const pool = new Pool({
  user: config.POSTGRES_USERNAME,
  host: config.POSTGRES_HOST,
  database: config.POSTGRES_DB,
  password: config.POSTGRES_PASSWORD,
  port: 5432,
});

// Generates random uuid. Only for testing
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var uuid = (Math.random() * 16) | 0,
      v = c == "x" ? uuid : (uuid & 0x3) | 0x8;
    return uuid.toString(16);
  });
}

describe("Postgres Bins Table Connection", () => {
  let pgPersistence;
  let uuid;

  beforeAll(async () => {
    pgPersistence = new PgPersistence();
    uuid = uuidv4();

    // Insert new bin with path "my_bin_path" and random uuid
    const CREATE_BIN_WITH_UUID = `INSERT INTO bins (bin_path, id) VALUES ($1, $2)`;

    let result = await dbQuery(CREATE_BIN_WITH_UUID, "my_bin_path", uuid);
    return result.rowCount > 0;
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

  test("can delete bin", async () => {
    const deletedBin = await pgPersistence.deleteBin(uuid);
    expect(deletedBin).toBe(true);
  });
});
