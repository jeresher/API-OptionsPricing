const express = require('express');
const app = express();
const { blackScholesModel } = require('./services/valuation.js');
const { longOptionPayoff } = require('./services/profit');

const PORT = 3000

app.use(express.json());

// PRICING MODELS
app.get("/valuation/blackscholes", blackScholesModel);

// PROFIT CALCULATIONS
app.get("/profit/long-option-payoff", longOptionPayoff);


app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
});
