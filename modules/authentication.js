require('./database.js');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const saltRounds = 15;
const express = require('express');
const app = express();
const expireTime = 1 * 60 * 60 * 1000;

//returns an onject that shows if username and email are duplicated
async function checkDuplicateUser(username, email) {
    var searchUsername = await userCollection.findOne({ username: username });
    var searchEmail = await userCollection.findOne({ email: email });
    var result = { usernameDuplicate: !(searchUsername == null), emailDuplicate: !(searchEmail == null) };
    return result;
}

async function signupSubmit(req, res) {
    //get the information from the form
    var {username, email, password, confirmPassword} = req.body;

    //store the info in session in case user gets redirected to sign up again so info doesn't have to be reentered
    req.session.tempInfo = { username: username, email: email, password: password, confirmPassword: confirmPassword };

    //Checks that the password is confirmed
    if (password !== confirmPassword) {
        res.redirect('/signup?error=0');
        return;
    }

    //validation using joi
    const schema = Joi.object(
        {
            username: Joi.string().alphanum().min(4).max(20).required(),
            email: Joi.string().email({tlds: {allow: false}}).required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required()
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
    const defaultPicLink = "https://res.cloudinary.com/dkcuo4wib/image/upload/v1716262777/profilePics/default.png";

    //store info in session
    req.session.authenticated = true;
    req.session.username = username;
    req.session.email = email;
    req.session.picId = defaultPicLink;
    app.locals.picId = defaultPicLink;
    //get rid of the temp information
    req.session.tempInfo = undefined;
    req.session.cookie.maxAge = expireTime;

    //insert user in mongo database
    await userCollection.insertOne({ username: username, email: email, password: hashedPassword, picId: defaultPicLink });
    console.log("Inserted user");

    //redirect to home page
    res.redirect("/");
} 

async function loginSubmit (req,res) {
    var { email, password } = req.body;

    //store the info in session in case user gets redirected to sign up again so info doesn't have to be reentered
    req.session.tempInfo = { email: email, password: password };

    const schema = Joi.string().email({tlds: {allow: false}}).required();
    const validationResult = schema.validate(email);
    if (validationResult.error != null) {
        //if email format is invalid
        res.redirect("/login?error=0")
        return;
    }

    const result = await userCollection.find({ email: email }).project({ email: 1, username: 1, password: 1, checklist: 1, picId: 1, _id: 1,  }).toArray();

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
        req.session.checklist = result[0].checklist;
        req.session.picId = result[0].picId;
        app.locals.picId = result[0].picId;
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
}

global.loginSubmit = loginSubmit;
global.signupSubmit = signupSubmit;
