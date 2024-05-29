const express = require('express');
const dashboardRouter = express.Router();

dashboardRouter.get('/name', (req, res) => {
    // TODO: get the stuff from the database
    console.log({first: first, last: last}); // TODO: remove
    res.send({first: first, last: last});
});

module.exports = dashboardRouterRouter;
