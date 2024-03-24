const {Pool} = require("pg");
const { database } = require("pg/lib/defaults");



const pool = new Pool({
  connectionString: process.env.POSTGRES_URL ,
  })

module.exports = pool;