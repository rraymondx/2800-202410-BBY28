//required modules
require(__dirname + "/modules/utils.js");
require(__dirname + "/modules/authentication.js");
require(__dirname + "/modules/database.js");
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const url = require('url');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const bodyParser = require('body-parser');

//number used for encrypting passwords
const saltRounds = 15;

//port address
const port = process.env.PORT || 3000;
const app = express();



//allows parsing of url encoded body
app.use(express.urlencoded({ extended: false }));
//parse json bodies
app.use(bodyParser.json());

//setup for ejs
app.set('view engine', 'ejs');

const cloudinary = require('cloudinary');
const axios = require('axios');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_CLOUD_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET
});


//session creation
app.use(session({
    secret: process.env.NODE_SESSION_SECRET,
    store: mongoStore,
    saveUninitialized: false,
    resave: true
}
));


//nodemailer setup
//transporter is going to be an object that is able to send mail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        type: "OAuth2",
        user: "disasternotresetpass@gmail.com",
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        accessUrl: "https://accounts.google.com/o/oauth2/token"
        // accessToken: process.env.OAUTH_ACCESS_TOKEN
    },
});


//Check if conncetion works
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("nodemailer is ready");
    }
});

//returns true if a user exists based on a filter
async function userExists(filterName, filterValue) {
    let filter = {};
    filter[filterName] = filterValue;
    var searchUser = await userCollection.findOne(filter);
    return !(searchUser == null);
}

//Code to check if the session is validated
function isValidSession(req) {
    if (req.session.authenticated) {
        return true;
    }
    return false;
}


function sessionValidation(req, res, next) {
    if (isValidSession(req)) {
        next();
    }
    else {
        res.redirect('/landing');
    }
}

// static paths for routing files
app.use('/js', express.static(__dirname + '/scripts'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/html', express.static(__dirname + '/public/html'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/audio', express.static(__dirname + '/public/audio'));


// root
app.use('/', (req, res, next) => {
    var currUrl = url.parse(req.url).pathname;
    app.locals.picId = req.session.picId;
    app.locals.authenticated = req.session.authenticated;
    if (currUrl == '/') {
        app.locals.cssFile = 'index.css'
        next();
        return;
    } else {
        const parts = currUrl.split('/');
        const lastPart = parts[parts.length - 1];
        app.locals.cssFile = lastPart + '.css';
        if (parts[1] == "disasterList") {
            app.locals.disasterName = lastPart;
        } else {
            app.locals.disasterName = undefined;
        }
        // app.locals.cssFile =  cssFiles[req.url];
    }
    next();
});


//home page
app.get('/', sessionValidation, (req, res) => {
        res.render("home");
});

//landing page
app.get('/landing', (req, res) => {
    res.render('landing');
});

//signup page
app.get('/signup', (req, res) => {
    //If an error happens an error code is sent through query
    var errorCode = req.query.error;
    //An array with String of error codes
    var errorStrings = ["Passwords don't match", 'Invalid Username', "Invalid Email", "Invalid Password", "Something went wrong", "Username and Email already exist", "Email already exists", "Username already exists"];
    //stores the temp information
    var tempInfo = req.session.tempInfo;
    res.render("signup", { error: errorStrings[errorCode], tempInfo: tempInfo });
});


//submit signup and store user in database
app.post('/signupSubmit', signupSubmit);


//login page
app.get('/login', (req, res) => {
    var errorCode = req.query.error;
    var errorStrings = ["Email format invalid", "Email does not exist <a href='/signup'>Sign Up?</a>", "Password is incorrect"];
    res.render('login', { error: errorStrings[errorCode], tempInfo: req.session.tempInfo });
});


//signup submit, searches for matching emails and pass
app.post('/loginSubmit', loginSubmit);

// Profile page
app.get('/profile', sessionValidation, async (req, res) => {
    const user = await userCollection.findOne({ email: req.session.email });
    res.render('profile', { user: user });
});

// Profile update
app.post('/profileSubmit', sessionValidation, upload.single('picture'), async (req, res) => {
    const { username, email, city, changed } = req.body;

    if (!username || !email) {
        res.redirect('/profile');
        return;
    }
    let update = {};
    if (changed == 'true') {
        let buf64 = req.file.buffer.toString('base64');
        stream = await cloudinary.uploader.upload("data:image/png;base64," + buf64, function (result) { 
            console.log(result);
            update = { $set: { username: username, email: email, city: city, picId: result.url} };
            req.session.picId = result.url;
            app.locals.picId = result.url;
        }, { folder: 'profilePics' });
        
    } else {
        update = { $set: { username: username, email: email, city: city } };
    }

    const filter = { email: req.session.email };

    await userCollection.updateOne(filter, update);

    // Update session info
    req.session.username = username;
    req.session.email = email;

    res.redirect('/profile');
});

//smartAI chat page
app.get('/smartAI', sessionValidation, (req, res) => {
    // used for sending server variable to client side
    app.locals.open_ai_key = process.env.OPEN_AI_KEY;
    res.render('smartAI');
});


//A page that holds the list of disasters
app.use('/disasterList', sessionValidation);
app.get('/disasterList', (req, res) => {
    res.render("disasterList");
});

//A page for displaying specific disaster information
app.use('/disasterList/:disasterName', sessionValidation);
app.get('/disasterList/:disasterName', (req, res) => {
    const disasterName = req.params.disasterName;
    res.render("disasters/" + disasterName);
});


//A catch-all checklist for disasters
app.use('/checklist', sessionValidation);
app.get('/checklist', async (req, res) => {
    const savedChecklist = req.session.checklist;
    res.render("checklist", {savedChecklist: savedChecklist});
});

//Save checklist data
app.post('/checklistSave', sessionValidation, async (req, res) => {
    const checklistData  = req.body;
    let array = [];
    for (let i = 0; i < 10; i++) {
        if ('item' + i in checklistData) {
            array[i] = true;
        } else {
            array[i] = false;
        }
    }
    req.session.checklist = array;
    await userCollection.updateOne({email: req.session.email}, {$set: {checklist: array}});
    res.redirect('/checklist');
});


//forgot password page
app.get('/forgot-password', (req, res) => {
    var errorCode = req.query.error;
    var errorString = ["Email format invalid", "The Email does not exist"]
    res.render('forgotPassword', { error: errorString[errorCode] });
});


//forgot password submit
app.post('/forgotPasswordSubmit', async (req, res) => {
    var email = req.body.email;

    const schema = Joi.string().email().required();
    const validationResult = schema.validate(email);
    if (validationResult.error != null) {
        //if email format is invalid
        res.redirect("/login?error=0")
        return;
    }

    if (!(await userExists('email', email))) {
        res.redirect('/forgot-password?error=1');
        return;
    }

    var resetPassId = crypto.randomBytes(20).toString('hex');
    var idExpireTime = Date.now() + 3600000; //1 hour expire time
    await userCollection.updateOne({ email: email }, { $set: { resetPassId: resetPassId, resetPassIdExpireTime: idExpireTime } });

    var message = {
        from: "disasternotresetpass@gmail.com",
        to: email,
        subject: "Reset your password",
        // text: "pls work pls",
        //need to change this link when deploying
        html: `<p>follow this link to reset your password: <a href='https://two800-202410-bby28.onrender.com/reset-password?id=${resetPassId}'>Link</a></p>`
    }

    var info = await transporter.sendMail(message);
    console.log(info);
    res.redirect('/login');
});


//reset password page
app.get('/reset-password', async (req, res) => {
    var id = req.query.id;
    if (!id) {
        res.send('no id for reset password');
        return;
    }
    const result = await userCollection.findOne({ resetPassId: id });
    if (result == null) {
        res.send('user does not exist');
        return;
    }
    const expireTime = result.resetPassIdExpireTime;
    if (expireTime < Date.now) {
        res.send('link expired');
    }
    console.log(expireTime);
    res.render('resetPassword', { user: result.username });
});


//reset password submit
app.post('/resetPasswordSubmit', async (req, res) => {
    var { username, newPassword, confirmPassword } = req.body;
    //Checks that the password is confirmed
    if (newPassword !== confirmPassword) {
        res.send('passwords arent equal');
        return;
    }
    //validation using joi
    const schema = Joi.string().max(20).required();
    const validationResult = schema.validate(newPassword);
    if (validationResult.error != null) {
        res.send('bad password format');
        return;
    }
    var hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await userCollection.updateOne({ username: username }, { $set: { password: hashedPassword } });
    // redirect to login page
    res.redirect('/login');
});

app.get('/volunteer', sessionValidation, (req, res) => {
    const volunteers = [
        {
            image: '/img/search.jpg',
            info: 'Search And Rescue Volunteer.',
            summary: 'Help locate and rescue people who are lost or in distress.',
            link: 'https://bcsara.com/volunteer/'
        },
        {
            image: '/img/StJohns.jpg',
            info: 'Volunteer with St. John Ambulance.',
            summary: 'Provide first aid and healthcare services in your community.',
            link: 'https://sja.ca/en/community-services'
        },
        {
            image: '/img/disrel.jpg',
            info: 'Join Canadian Disaster Relief.',
            summary: 'Assist communities affected by natural disasters.',
            link: 'https://www.samaritanspurse.ca/getinvolved/canadian-disaster-relief/'
        }
    ];

    res.render('volunteer', { volunteers });
});


app.get('/contacts', (req, res) => {
    res.render('contacts');
});



app.post('/predictDamage', async (req, res) => {
    const { disaster } = req.body;
    try {
        const user = await userCollection.findOne({ email: req.session.email });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const city = user.city;
        const apiKey = process.env.OPEN_AI_KEY;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: `You are an expert in predicting exact damage in events of ${disaster}. Only answer with aproximate numbers. Predict casualties as well. don't use first person. Always mention that the city of the user is same as what they picked in profile. If asked to give city of undifined give the result for the province of British Columbia, Canada.` },

                    { role: "user", content: `Tell me the potential ${disaster} damage for the city of ${city}.` }
                ],
                max_tokens: 300,
                temperature: 0.2,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        res.json({ prediction: response.data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error predicting flood damage');
    }
});


//logout page, destroys session and returns to home page
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

//404 page
app.get('*', (req, res) => {
    res.status(404);
    res.render("404");
    //res.send("Page Not Found - 404");
});

//localhost set up
app.listen(port, () => {
    console.log(`Node.js Application listening at ${port}`);
});
