const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { toggleSQLInjection, handleLogin } = require('./sqlInjection');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/toggle', (req, res) => {
   const { sqlInjection } = req.body;
   toggleSQLInjection(!!sqlInjection);
   res.redirect('/');
});

app.post('/login', handleLogin);

app.listen(3000, () => {
   console.log('Server running on http://localhost:3000');
});