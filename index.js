
//required modules
require("./utils.js");
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const MongoClient = require("mongodb").MongoClient;
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

//the atlas URI
const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/`

//mongodb set up
var database = new MongoClient(`${atlasURI}/?retryWrites=true`);
var mongoStore = MongoStore.create({
	mongoUrl: `${atlasURI}${mongodb_database}`,
	crypto: {
		secret: mongodb_session_secret
	}
});

//session creation
app.use(session({ 
    secret: node_session_secret,
	store: mongoStore,
	saveUninitialized: false, 
	resave: true
}
));

//refrence to the the user collection in mongodb database
const userCollection = database.db(mongodb_database).collection('users');

//returns true if a user exists based on a filter
async function userExists(filterName, filterValue) {
    let filter = {};
    filter[filterName] = filterValue;
    var searchUser = await userCollection.findOne(filter);
    return !(searchUser == null);
}

//returns an onject that shows if username and email are duplicated
async function checkDuplicateUser(username, email){
    var searchUsername = await userCollection.findOne({username: username});
    var searchEmail = await userCollection.findOne({email: email});
    var result = {usernameDuplicate: !(searchUsername == null), emailDuplicate: !(searchEmail == null)};
    return result;
}

//paths for files
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/html', express.static(__dirname + '/public/html'));
app.use('/img', express.static(__dirname + '/public/img'));

//home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/index.html'));
});

//signup page
app.get('/signup', (req, res) => {
    //If an error happens an error code is sent through query
    var errorCode = req.query.error;
    //An array with String of error codes
    var errorStrings = ["Passwords don't match", 'Invalid Username', "Invalid Email", "Invalid Password", "Something went wrong", "Username and Email already exist", "Email already exists", "Username already exists"];
    //stores the temp information
    var tempInfo = req.session.tempInfo;
    res.render("signup", {error: errorStrings[errorCode], tempInfo: tempInfo});
});

//submit signup and store user in database
app.post('/signupSubmit', async (req, res) => {
    //get the information from the form
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    //store the info in session in case user gets redirected to sign up again so info doesn't have to be reentered
    req.session.tempInfo = {username: username, email: email, password: password, confirmPassword: confirmPassword};
    
    //Checks that the password is confirmed
    if (password !== confirmPassword) {
        res.redirect('/signup?error=0');
        return;
    }

    //validation using joi
    const schema = Joi.object(
        {
            username: Joi.string().alphanum().max(20).required(),
            email: Joi.string().email().required(),
            password: Joi.string().max(20).required()
        });
    const validationResult = schema.validate({ username, email, password });
    if (validationResult.error != null) {
        let errorLabel = validationResult.error.details[0].context.label;
        if (errorLabel == 'username') {
            //if username is wrong format
            res.redirect('/signup?error=1');
        } else if (errorLabel == 'email') {
            //if email is in wrong format
            res.redirect('/signup?error=2');
        } else if (errorLabel == 'password') {
            //if password has wrong format
            res.redirect('/signup?error=3');
        } else {
            //if somehow something else in joi throws an error
            res.redirect('/signup?error=4');
        }
        return;
    }

    //checks for duplicate users
    var duplicate = await checkDuplicateUser(username, email);
    if (duplicate.emailDuplicate || duplicate.usernameDuplicate) {
        if (duplicate.emailDuplicate && duplicate.usernameDuplicate) {
            //if both username and email are duplicate
            res.redirect('/signup?error=5');
        } else if (duplicate.emailDuplicate) {
            //if only email is duplicate
            res.redirect('/signup?error=6');
        } else {
            //if only username is duplicate
            res.redirect('/signup?error=7');
        }
        return;
    }

    //hashing password
    var hashedPassword = await bcrypt.hash(password, saltRounds);

    //store info in session
    req.session.authenticated = true;
    req.session.username = username;
    req.session.email = email;
    //get rid of the temp information
    req.session.tempInfo = undefined;
    req.session.cookie.maxAge = expireTime;

    //insert user in mongo database
    await userCollection.insertOne({ username: username, email: email, password: hashedPassword });
    console.log("Inserted user");

    //redirect to home page
    res.redirect("/");
});

//login page
app.get('/login', (req, res) => {
    var errorCode = req.query.error;
    var errorStrings = ["Email format invalid", "Email does not exist <a href='/signup'>Sign Up?</a>", "Password is incorrect"];
    res.render('login', {error: errorStrings[errorCode], tempInfo: req.session.tempInfo});
});

//signup submit, searches for matching emails and pass
app.post('/loginSubmit', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    //store the info in session in case user gets redirected to sign up again so info doesn't have to be reentered
    req.session.tempInfo = {email: email, password: password};
    
    const schema = Joi.string().email().required();
    const validationResult = schema.validate(email);
    if (validationResult.error != null) {
        //if email format is invalid
        res.redirect("/login?error=0")
        return;
    }

    const result = await userCollection.find({ email: email }).project({ email: 1, username: 1, password: 1, _id: 1 }).toArray();

    console.log(result);

    if (result.length != 1) {
        console.log("email is wrong");
        //if the email is not found in database
        res.redirect("/login?error=1");
        return;
    }

    if (await bcrypt.compare(password, result[0].password)) {
        console.log("correct password");
        req.session.authenticated = true;
        req.session.username = result[0].username;
        req.session.email = result[0].email;
        //get rid of the temp information
        req.session.tempInfo = undefined;
        req.session.cookie.maxAge = expireTime;

        res.redirect('/');
        return;
    } else {
        console.log("Invalid email/password combination");
        //if email is correct but password isn't
        res.redirect("/login?error=2");
        return;
    }
});

//page containing links to all disaster pages
app.get('/disasterInfo', (req, res) => {

});

//tsunami info page
app.get('/tsunami', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/tsunami.html'));
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

//forgot password page
app.get('/forgot-password', (req, res) => {
    res.render('forgotPassword');
});

//reset password page
app.post('/reset-password', (req, res) => {
    res.render('resetPassword');
});

//reset password submit
app.post('/resetPasswordSubmit', (req, res) => {
    // todo: Implement the logic to reset the password for the given email
    
    // redirect to login page
    res.redirect('/login');
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
