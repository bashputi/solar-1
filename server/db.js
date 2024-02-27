const {Pool} = require("pg");
const { database } = require("pg/lib/defaults");

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 4000,
    password: '123pailamatabiri',
    database: "authdb"
});

module.exports = pool;