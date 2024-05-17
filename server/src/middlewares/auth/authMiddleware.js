const { genPassword, validatePassword } = require('./utils');
const passport = require('passport');
require('./localStrategy');
const db = require('../../db/models/database');

async function handleSignin(req, res, next) {
  console.log('this is the signIN handler!'); // TODO: remove
  console.log(req.body);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err); // Handle error
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials', severity: 'error' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err); // Handle error
      }
      return res.status(200).json({ message: 'Successfully signed in', severity: 'success' });
    });
  })(req, res, next);
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
    res.status(201).send({ message: 'User registered', severity: 'success'}); // severity is used in MUI's alert component in the client
    
    // Optionally call next() if you have subsequent middleware to run
    if (next) {
      next();
    }
  } catch (error) {
    console.error('Error registering user:', error);
    // Send the error response
    res.status(400).send({message: 'Error registering user', severity: 'error'}); // severity is used in MUI's alert component in the client
  }
}

module.exports = {
  handleSignin,
  handleSignup
}