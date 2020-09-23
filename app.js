const express = require('express');
const app = express();
const { blackScholesModel } = require('./services/pricing.js');

app.use(express.json());


// PRICING MODELS
app.get("/valuation/blackscholes", blackScholesModel);


app.listen(3000);
