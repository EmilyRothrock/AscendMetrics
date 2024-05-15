passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../../db/models/database');
const auth = require('./authMiddleware');

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};

const verifyCallback = (username, password, done) => {
    db.User.findOne({ username: username })
        .then((user) => {
            if (!user) { return done(null, false); }
            const isValid = auth.validatePassword(password, user.passwordHash, user.passwordSalt);
            if(isValid) { return done(null, user) } 
            else { return done(null, false); }
        })
        .catch((err) => { done(err); 
        });
};

// final set-up
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