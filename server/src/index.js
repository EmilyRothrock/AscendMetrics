const express = require('express');
const app = express();
const port = 3000;

// Middlewares
app.use(express.json());

// Routes
// uncomment this line and one below when ready
// app.use('/api/someroute', require('./routes/someroute'));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
