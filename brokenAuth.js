const { pool } = require('./db');

let brokenAuthEnabled = false;
let failedAttempts = 0;
let isLockedOut = false;

function toggleBrokenAuth(enabled) {
   brokenAuthEnabled = enabled;
   failedAttempts = 0;
   isLockedOut = false;
}

async function handleBrokenAuth(req, res) {
   const { username, password } = req.body;

   const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
   const result = await pool.query(query, [username, password]);
   const isAuthenticated = result.rows[0];

   if (brokenAuthEnabled) {
      if (isAuthenticated) {
         return res.send(`<script>alert("Login successful!");</script>`);
      } else {
         return res.redirect('/');
      }
   } else {
      if (isLockedOut) {
         return res.send(`
            <script>
               alert("Account locked due to too many failed attempts. Please change your password and try again.");
               setTimeout(() => {
                  window.location.href = "/";
               }, 5000);
            </script>
         `);
      }

      if (isAuthenticated) {
         failedAttempts = 0;
         isLockedOut = false;
         return res.send(`<script>alert("Login successful!");</script>`);
      } else {
         failedAttempts++;
         if (failedAttempts >= 3) {
            isLockedOut = true;
            return res.send(`
               <script>
                  alert("Login failed. Please try again.");
                  setTimeout(() => {
                     window.location.href = "/";
                  }, 5000);
               </script>
            `);
         }
         return res.send(`
            <script>
               alert("Login failed. Please try again.");
               setTimeout(() => {
                  window.location.href = "/";
               }, 5000);
            </script>
         `);
      }
   }
}

module.exports = { toggleBrokenAuth, handleBrokenAuth };
