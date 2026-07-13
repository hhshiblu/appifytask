const { createPool } = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  timezone: "+00:00",
};

let pool = null;

const connectDatabase = async () => {
  try {
    if (!pool) {
      pool = createPool(dbConfig);
      const testConn = await pool.getConnection();
      console.log("Connected to MySQL database ");
      testConn.release();
    }
    return pool;
  } catch (error) {
    console.log(error)
    throw new Error(`Failed to connect to MySQL: ${error.message}`);
  }
};

module.exports = { connectDatabase };
