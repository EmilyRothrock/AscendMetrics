const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const app = express();
const port = 3000;
const config = require('./config/config.json').development; // TODO: make this adapt to environment
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./db/models/database');

// Global middlewares that run on every request
// TODO: move to config? CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only your frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 204 // For legacy browser support
};
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json());

const myStore = new SequelizeStore({
  db: db.sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // Check for expired sessions every 15 minutes
  expiration: 24 * 60 * 60 * 1000,  // Sessions expire after 24 hours
});

app.use(session({
  secret: config.secret,
  store: myStore,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: 'auto' } // Use secure cookies in production
}));

myStore.sync(); // Ensure the session table is created

app.use(passport.initialize());
app.use(passport.session());

// Routes: ties in all router modules from routes directory
const authRouter = require('./routes/auth');
app.use('/', authRouter)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
