const { Pool } = require("pg");

const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({ path: `${__dirname}/../.env.${ENV}` });

const config = {};

if (!process.env.DATABASE_URL && !process.env.PGDATABASE) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
} else {
  config.database = process.env.PGDATABASE;
}

if (ENV === "production") {
  console.log(`Connected to database at ${process.env.DATABASE_URL}`);
} else if (process.env.PGDATABASE) {
  console.log(`Connected to ${process.env.PGDATABASE}`);
}

console.log(`Environment: ${ENV}`);

module.exports = new Pool(config);
