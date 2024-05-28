const MongoClient = require("mongodb").MongoClient;
require('dotenv').config();
const MongoStore = require('connect-mongo');


//secret info stored in env
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const atlasURI = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/`

//mongodb set up
global.database = new MongoClient(`${atlasURI}/?retryWrites=true`);
global.mongoStore = MongoStore.create({
    mongoUrl: `${atlasURI}${mongodb_database}`,
    crypto: {
        secret: mongodb_session_secret
    }
});

global.userCollection = database.db(mongodb_database).collection('users');
