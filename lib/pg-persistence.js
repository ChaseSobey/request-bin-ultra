const { dbQuery } = require("./db-query");

module.exports = class PgPersistence {
  constructor() {}

  // RETURNS all bins.
  // No known fail clause.
  async getAllBins() {
    const GET_BINS = "SELECT * FROM bins";

    let result = await dbQuery(GET_BINS);
    return result.rows;
  }

  // Create a new bin with a specified bin path.
  // Returns `true` on successful insertion, `false` otherwise.
  async createBin(binPath) {
    const CREATE_BIN = `INSERT INTO bins (bin_path) VALUES ($1)`;

    let result = await dbQuery(CREATE_BIN, binPath);
    return result.rowCount > 0;
  }
};
