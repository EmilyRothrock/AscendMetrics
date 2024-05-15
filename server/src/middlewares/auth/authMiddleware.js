crypto = require('crypto');
passport = require('passport');
localStrategy = require('./localStrategy');

function handleSignin(req, res, next) {
  console.log('this is the signIN handler!');
  next();
  // passport.authenticate('local', { failureRedirect: '/signin' }),
  //   function(req, res) {
  //       res.redirect('/');
}

function handleSignup(req, res, next) {
  console.log('this is the signUP handler!');
  next();
  // async (req, res) => {
  //   const { email, password, first, last } = req.body;
  //   const saltHash = genPassword(password);
  //   const salt = saltHash.salt;
  //   const hash = saltHash.hash;
  
  //   try {
  //       const user = await db.User.create({
  //           email: email,
  //           passwordHash: hash,
  //           passwordSalt: salt,
  //           firstName: first,
  //           lastName: last
  //       });
  //       res.status(201).send('User registered');
  //   } catch (error) {
  //       res.status(400).send('Error registering user');
  //   }
  //   db.User.sync();
  //   res.redirect('/signin');
  // }
}

// Helper Functions for Authentication

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = myHashify(password, salt);
  return { hash: genHash, salt: salt };
}

function validatePassword(password, hash, salt) {
  var hashVerify = myHashify(password, salt);
  return hash === hashVerify;
}

function myHashify(password, salt) {
  return crypto.scrypt(password, salt, 64).toString('hex');
}

module.exports = {
  handleSignin,
  handleSignup,
  genPassword,
  validatePassword
}