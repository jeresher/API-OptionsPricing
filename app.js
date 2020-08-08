const express = require('express');
const app = express();
const blackScholes = require('./models/blackScholes.js');

app.use(express.json());

app.get("/valuation/blackscholes", (req, res) => {
    const value = blackScholes(req.body, res);
    res.send(value);
})

app.listen(3000);
