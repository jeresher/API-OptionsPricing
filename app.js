const express = require('express');
const app = express();
const { blackScholesModel } = require('./services/valuation.js');
const { optionPayoff } = require('./services/profit');

app.use(express.json());


// PRICING MODELS
app.get("/valuation/blackscholes", blackScholesModel);

// PROFIT CALCULATIONS
app.get("/profit/option-payoff", optionPayoff);

app.listen(3000);
