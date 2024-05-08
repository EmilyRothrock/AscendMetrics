const express = require('express');
const app = express();
const port = 3000;

// Middlewares
app.use(express.json());

// Routes
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/', authRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
