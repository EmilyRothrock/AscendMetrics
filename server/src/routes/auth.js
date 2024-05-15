// here will define all the callbacks and routing associated with user authentication
// routes include: sign-in, sign-up, forgot password, password reset
// other functionality include: session setting

app.post('/register', async (req, res) => {
  const { email, password, first, last } = req.body;
  const hash = crypto.scryptSync(password, 'salt', 64).toString('hex');

  try {
      const user = await User.create({
          email,
          passwordHash: hash,
          first,
          last
      });
      res.status(201).send('User registered');
  } catch (error) {
      res.status(400).send('Error registering user');
  }
});

// Login route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));