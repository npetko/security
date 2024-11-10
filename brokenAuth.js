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

   if (brokenAuthEnabled) {
      const isAuthenticated = username === 'admin' && password === 'password123';
      if (isAuthenticated) {
         return res.send(`<script>alert("Login successful!");</script>`);
      } else {
         return res.redirect('/');
      }
   } else {
      if (isLockedOut) {
         return res.send(`
            <script>
               alert("Account locked due to too many failed attempts. Please refresh the page to try again.");
               setTimeout(() => {
                  window.location.href = "/";
               }, 5000);
            </script>
         `);
      }

      const isAuthenticated = username === 'admin' && password === 'password123';

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
