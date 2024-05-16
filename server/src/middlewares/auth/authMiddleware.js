const crypto = require('crypto');
const passport = require('passport');
require('./localStrategy');
const db = require('../../db/models/database');

async function handleSignin(req, res, next) {
  // passport.authenticate('local', { failureRedirect: '/signin' })
  console.log('this is the signIN handler!'); // TODO: remove
  next();
}

async function handleSignup(req, res, next) {
  const { firstName, lastName, email, password } = req.body;
  const saltHash = genPassword(password); // Ensure genPassword returns an object with salt and hash
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  console.log(req.body); // TODO: remove
  try {
    const user = await db.User.create({
      email: email,
      passwordHash: hash,
      passwordSalt: salt,
      first: firstName,
      last: lastName
    });
    // Send the success response
    res.status(201).send('User registered');
    
    // Optionally call next() if you have subsequent middleware to run
    if (next) {
      next();
    }
  } catch (error) {
    console.error('Error registering user:', error);
    
    // Send the error response
    res.status(400).send('Error registering user');
  }
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
  // Key length can be adjusted as needed; 64 bytes is a common length
  const keyLength = 64;
  
  // Use crypto.scryptSync to derive a key from the password and salt
  const hash = crypto.scryptSync(password, salt, keyLength);
  
  // Return the hash as a hexadecimal string
  return hash.toString('hex');
}

module.exports = {
  handleSignin,
  handleSignup,
  genPassword,
  validatePassword
}