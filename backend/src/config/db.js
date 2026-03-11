const {Pool} = require("pg");

const pool = new Pool({
    host: "localhost",
    user:"postgres",
    password:"Postgres123!",
    database:"flowboard",
    port:5432,
});

module.exports = pool

