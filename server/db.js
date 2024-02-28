const {Pool} = require("pg");
const { database } = require("pg/lib/defaults");

const pool = new Pool({
    host: "localhost",
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

module.exports = pool;