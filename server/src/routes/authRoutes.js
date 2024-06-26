const express = require('express');
const authRouter = express.Router();
const { handleSignin, handleSignup, handleSignout } = require('../middlewares/authMiddleware');

authRouter.post('/signin', handleSignin);
authRouter.post('/signup', handleSignup);

authRouter.post('/signout', handleSignout);

authRouter.get('/check', (req, res) => {
  const isAuth = req.isAuthenticated();
  res.send(isAuth);
});

module.exports = authRouter;
