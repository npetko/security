require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { toggleSQLInjection, handleLogin } = require('./sqlInjection');
const { toggleBrokenAuth, handleBrokenAuth } = require('./brokenAuth.js');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/toggle', (req, res) => {
   const { sqlInjection, brokenAuth } = req.body;
   toggleSQLInjection(!!sqlInjection);
   toggleBrokenAuth(!!brokenAuth)
   res.redirect('/');
});

app.post('/login', (req, res) => {
   handleLogin(req, res);
});

app.post('/auth', (req, res) => {
   handleBrokenAuth(req, res);
});

app.listen(3000, () => {
   console.log('Server running on http://localhost:3000');
});