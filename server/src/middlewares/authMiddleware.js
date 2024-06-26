const { genPassword } = require('./authUtils');
const passport = require('passport');
require('./localStrategy');
const db = require('../db/database');

/**
 * Handle user sign-in using Passport local strategy.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async function handleSignin(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials', severity: 'error' });
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      return res.status(200).json({ message: 'Successfully signed in', severity: 'success' });
    });
  })(req, res, next);
}

/**
 * Handle user sign-up by creating a new user in the database.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async function handleSignup(req, res, next) {
  const { firstName, lastName, email, password } = req.body;
  const saltHash = genPassword(password); // Ensure genPassword returns an object with salt and hash
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  try {
    const user = await db.User.create({
      email: email,
      passwordHash: hash,
      passwordSalt: salt,
      first: firstName,
      last: lastName
    });

    res.status(201).send({ message: 'User registered', severity: 'success' });
    if (next) { next(); }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).send({ message: 'Error registering user', severity: 'error' });
  }
}

/**
 * Handle user sign-out by logging out and destroying the session.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
async function handleSignout(req, res, next) {
  req.logout((err) => {
    if (err) { return res.status(500).send('Error logging out'); }
    req.session.destroy((err) => {
      if (err) { return res.status(500).send('Error destroying session'); }
      res.sendStatus(204); // 204 No Content
    });
  });
}

module.exports = {
  handleSignin,
  handleSignup,
  handleSignout
};
