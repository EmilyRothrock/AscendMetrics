// the LOCAL strategy will be defined here using passport.
// the strategy will be exported and configered in the passportConfig.js file

passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('.../db/models/database');

const verifyCallback = (username, password, done) => {
    db.User.findOne(username)
        .then()
}

const strategy = new LocalStrategy();