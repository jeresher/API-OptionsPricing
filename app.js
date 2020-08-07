const express = require('express');
const Joi = require('joi');
const app = express();
const blackScholes = require('./models/blackScholes.js');

app.use(express.json());

app.get("/valuation/blackscholes/:type", (req, res) => {
    const test = blackScholes(req.body, req.params.type);
    res.send(test);
})

app.listen(3000);
