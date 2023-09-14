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

  // Delete a bin and its requests.
  // Returns `true` if a bin is deleted, false otherwise.
  async deleteBin(binId) {
    const DELETE_REQUESTS = `DELETE FROM requests WHERE bin_id = $1`;
    const DELETE_BIN = `DELETE FROM bins WHERE id = $1`;

    await dbQuery(DELETE_REQUESTS, binId);
    let deletedBin = await dbQuery(DELETE_BIN, binId);

    return deletedBin.rowCount > 0;
  }

  // Create a new request with specified bin id, mongo id, http method,
  // and path.
  // Returns `true` on successful insertion, `false` otherwise.
  async createRequest(binId, mongoId, method, path) {
    const CREATE_REQUEST = `INSERT INTO requests (bin_id, mongo_id, http_method, http_path) VALUES ($1, $2, $3, $4)`;

    let result = await dbQuery(CREATE_REQUEST, binId, mongoId, method, path);
    return result.rowCount > 0;
  }

  // Returns array of mongoIds of all requests with specified bin id.
  // No known false clauses.
  async getMongoIdsByBinId(binId) {
    const GET_REQUESTS = `SELECT mongo_id FROM requests WHERE bin_id = $1`;

    let result = await dbQuery(GET_REQUESTS, binId);
    return result.rows;
  }
};
