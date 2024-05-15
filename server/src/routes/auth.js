// create and export authentication routes
// signin, singup, forgot password, password reset, etc.
// create routes by tieing middleware together

const express = require('express');
const authRouter = express.Router();
const auth = require ('../middlewares/auth/authMiddleware');

authRouter.post('/signin', auth.handleSignin);

authRouter.post('/signup', auth.handleSignup);

module.exports = authRouter;