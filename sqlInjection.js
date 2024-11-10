const { pool } = require('./db');

let sqlInjectionEnabled = false;

function toggleSQLInjection(enabled) {
   sqlInjectionEnabled = enabled;
}

async function handleLogin(req, res) {
   const { username, password } = req.body;

   if (sqlInjectionEnabled) {
      const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
      try {
         const result = await pool.query(query);
         if (result.rows.length > 0) {
            const usernames = result.rows.map(row => row.username).join(', ');
            res.send(`<script>alert("Login successful: ${usernames}");</script>`);
         } else {
            res.send(`<script>alert("Login failed");</script>`);
         }
      } catch (err) {
         console.error("Database error:", err);
         res.send(`<script>alert("Database error occurred");</script>`);
      }
   } else {
      const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
      try {
         const result = await pool.query(query, [username, password]);
         if (result.rows.length > 0) {
            res.send(`<script>alert("Login successful: ${result.rows[0].username}");</script>`);
         } else {
            res.send(`<script>alert("Login failed");</script>`);
         }
      } catch (err) {
         console.error("Database error:", err);
         res.send(`<script>alert("Database error occurred");</script>`);
      }
   }
}

module.exports = { toggleSQLInjection, handleLogin };