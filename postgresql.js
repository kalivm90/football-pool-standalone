const { Pool } = require("pg");
require("dotenv").config();

const DB_URL = process.env.DB_URL;
const DB_DATABASE = process.env.DB_DATABASE;

const pool = new Pool({
  connectionString: DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function query(query, callback = null) {
  try {
    const client = await pool.connect();
    console.log("Connected");
    console.log("Running query");
    await client.query(query);
    console.log("Table 'football_pool' created successfully");
    client.release();
  } catch (error) {
    console.error("ERROR: ", error);
  } finally {
    pool.end();
  }
}

main().catch((e) => console.error("ERROR: ", e));
async function main() {
  const q = `
    CREATE TABLE IF NOT EXISTS football_pool (
      id SERIAL PRIMARY KEY,
      user_name VARCHAR(100) NOT NULL,
      score INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await query(q);
}

// pool.query("SELECT NOW()", (err, res) => {
//   if (err) {
//     console.error("Connection error:", err.stack);
//   } else {
//     console.log("Connected successfully! Current time:", res.rows[0].now);
//   }
//   pool.end(); // Close the connection after the test query
// });
