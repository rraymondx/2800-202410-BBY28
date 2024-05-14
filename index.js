
//required modules
require("./utils.js");
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const path = require('path');
// const saltRounds = 15;

//number used for encrypting passwords
const saltRounds = 15;

//port address
const port = process.env.PORT || 3000;

const app = express();

//expire time for session (1 hour)
const expireTime = 1 * 60 * 60 * 1000;

//secret info stored in env
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

//allows parsing body
app.use(express.urlencoded({extended: false}));

//setup for ejs
app.set('view engine', 'ejs');

//mongodb set up
// var mongoStore = MongoStore.create({
// 	mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
// 	crypto: {
// 		secret: mongodb_session_secret
// 	}
// })

//session creation
// app.use(session({ 
//     secret: node_session_secret,
// 	store: mongoStore,
// 	saveUninitialized: false, 
// 	resave: true
// }
// ));

//paths for files
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/html', express.static(__dirname + '/public/html'));
app.use('/img', express.static(__dirname + '/public/img'));

//home page
app.get('/home', (req, res) => {
    res.render("home");
});

//signup page
app.get('/signup', (req, res) => {
    res.send("Sign Up Page");
});

//submit signup and store user in database
app.post('/signupSubmit', async (req, res) => {
    res.send("signup submit");
});

//login page
app.get('/login', (req, res) => {
    res.send("login page");
});

//signup submit, searches for matching emails and pass
app.post('/loginSubmit', async (req, res) => {
    res.send('login submit');
});

//page containing links to all disaster pages
app.get('/disasterInfo', (req, res) => {

});

//tsunami info page
app.get('/tsunami', (req, res) => {
    res.render("tsunami");
    //res.sendFile(path.join(__dirname, '/public/html/tsunami.html'));
});

//avalanche info page
app.get('/avalanche', (req, res) => {

});

//wildfire info page
app.get('/wildfire', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/wildfire.html'));
});

//earthquake info page
app.get('/earthquake', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/earthquake.html'));
});

//flood info page
app.get('/flood', (req, res) => {

});

//smartAI chat page
app.get('/smartAI', (req, res) => {

});

app.get('/disasterList', (req, res) => {
    res.render("disasterList");
});

//logout page, destroys session and returns to home page
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

//404 page
app.get('*', (req, res) => {
    res.status(404);
    res.send("Page Not Found - 404");
});

//allows use of photos stored in public
app.use(express.static(__dirname + "/public"));

//localhost set up
app.listen(port, () => {
    console.log(`Node.js Application listening at ${port}`);
});
