passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../../db/models/database');
const { genPassword, validatePassword } = require('./utils');

const verifyCallback = (email, password, done) => {
    console.log('trying to find user!');
    db.User.findOne({ where: { email: email }})
        .then((user) => {
            console.log('found user!');
            console.log(user);
            if (!user) { return done(null, false); }
            const isValid = validatePassword(password, user.passwordHash, user.passwordSalt);
            if(isValid) { return done(null, user); } 
            else { return done(null, false); }
        })
        .catch((err) => { done(err); });
};

// final set-up
const customFields = {
    usernameField: 'email',
    passwordField: 'password'
};
const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

// TODO: understand this...
passport.serializeUser(function(user, done) {
    process.nextTick(function() { return done(null, user.id); });
});
  
passport.deserializeUser(function(userId, done) {
    process.nextTick(function() {
        db.User.findbyPk(userId)
        .then((user)=>{done(null,user);})
        .catch((err)=>{done(err);})
    });
});