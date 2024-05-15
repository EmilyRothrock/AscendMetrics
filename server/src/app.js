const express = require('express');
const session = require('express-session');
const app = express();
const port = 5173;
const auth = require('./middlewares/auth/auth');
const config = require('./config/config.json').development; // TODO: make this adapt to environment

// the express server is created here and configured according to the constituant modules

// route any requests to the appropriate callbacks
// user sign-in, sign-up, sign-out, password reset, session setting and deleting
// data requests, submissions, modifications, and calculations

// Global middlewares that run on every request
app.use(express.json());
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));

// Routes
// TODO: reconfigure for all routes to be in route folder and compiled together into one index.js
// app.use(routes); 
app.route('/signin', auth.handleSignin);
app.route('/signup', auth.handleSignup);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
