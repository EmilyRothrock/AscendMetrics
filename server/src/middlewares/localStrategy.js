const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/models/database');
const { genPassword, validatePassword } = require('./authUtils');

const verifyCallback = (email, password, done) => {
  db.User.findOne({ where: { email: email }})
    .then((user) => {
      if (!user) { return done(null, false); }
      const isValid = validatePassword(password, user.passwordHash, user.passwordSalt);
      if (isValid) { return done(null, user); } 
      else { return done(null, false); }
    })
    .catch((err) => { done(err); });
};

passport.serializeUser((user, done) => {
    process.nextTick(() => { return done(null, user.id); });
  });
  
passport.deserializeUser((userId, done) => {
    process.nextTick(() => {
        db.User.findByPk(userId)
        .then((user) => { done(null, user); })
        .catch((err) => { done(err); });
    });
});

const customFields = {
  usernameField: 'email',
  passwordField: 'password'
};

const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

