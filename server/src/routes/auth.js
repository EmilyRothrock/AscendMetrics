const express = require('express');
const authRouter = express.Router();
const auth = require('../middlewares/authMiddleware');

authRouter.post('/signin', auth.handleSignin);
authRouter.post('/signup', auth.handleSignup);

authRouter.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) { return res.status(500).send('Error logging out'); }
    req.session.destroy((err) => {
      if (err) { return res.status(500).send('Error destroying session'); }
      res.sendStatus(204); // 204 No Content
    });
  });
});

authRouter.get('/authCheck', (req, res) => {
  const isAuth = req.isAuthenticated();
  console.log(isAuth); // TODO: remove
  res.send(isAuth);
});

module.exports = authRouter;
