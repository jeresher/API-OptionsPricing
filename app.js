const express = require('express');
const app = express();
const blackScholes = require('./models/blackScholes.js');

app.use(express.json());

app.get("/valuation/blackscholes", blackScholes);


app.listen(3000);
