const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const app = express();
const port = 3000;
const config = require('./config/config.json').development; // TODO: make this adapt to environment

// the express server is created here and configured according to the constituant modules

// route any requests to the appropriate callbacks
// user sign-in, sign-up, sign-out, password reset, session setting and deleting
// data requests, submissions, modifications, and calculations

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only your frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 204 // For legacy browser support
};

app.use(cors(corsOptions)); // Enable CORS for all routes

// Global middlewares that run on every request
app.use(express.json());
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
// tie in all router modules from routes folder
const authRouter = require('./routes/auth');
app.use('/', authRouter)

app.use((req,res,next) => {
  console.log(req);
  next();
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
