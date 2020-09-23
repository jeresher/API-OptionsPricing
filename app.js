const express = require('express');
const app = express();
const { blackScholesModel } = require('./services/valuation.js');
const { optionPayoff } = require('./services/profit');

const PORT = 3000

app.use(express.json());

// PRICING MODELS
app.get("/valuation/blackscholes", blackScholesModel);

// PROFIT CALCULATIONS
app.get("/profit/option-payoff", optionPayoff);             // Calculate the profit & loss of a long or short option.


app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
});
