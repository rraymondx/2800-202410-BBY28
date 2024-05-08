
require("./utils.js");
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const path = require('path');
// const saltRounds = 15;

const port = process.env.PORT || 3000;

const app = express();

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/html', express.static(__dirname + '/public/html'));
app.use('/img', express.static(__dirname + '/public/img'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

app.get('/tsunami', (req, res) => {
    res.sendFile(__dirname + '/public/html/tsunami.html');
});

app.listen(port, () => {
    console.log(`Node.js Application listening at ${port}`);
});
