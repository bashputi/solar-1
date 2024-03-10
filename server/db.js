const {Pool} = require("pg");
const { database } = require("pg/lib/defaults");

const pool = new Pool({
  user: "postgres",
  password: "123pailamatabiri",
  host: "localhost",
  port: 4000,
  database: "authdb"
  })

module.exports = pool;