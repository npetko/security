const { users } = require('./database');

let sqlInjectionEnabled = false;

function toggleSQLInjection(enabled) {
   sqlInjectionEnabled = enabled;
}

function handleLogin(req, res) {
   const { username, password } = req.body;
   let user;

   if (sqlInjectionEnabled) {
      user = users.find(u => u.username === username && u.password === password);
   } else {
      user = users.find(u => u.username === username && u.password === password);
   }

   if (user) {
      res.send(`<script>alert("Login successful: ${user.username}");</script>`);
   } else {
      res.send(`<script>alert("Login failed");</script>`);
   }
}

module.exports = { toggleSQLInjection, handleLogin };