const express = require('express');
const authRouter = express.Router();
const auth = require('../middlewares/authMiddleware');

authRouter.post('/signin', auth.handleSignin);
authRouter.post('/signup', auth.handleSignup);

authRouter.post('/signout', auth.handleSignout);

authRouter.get('/authCheck', (req, res) => {
  const isAuth = req.isAuthenticated();
  res.send(isAuth);
});

module.exports = authRouter;
