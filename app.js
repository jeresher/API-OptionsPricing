const express = require('express');
const app = express();
const { blackScholesModel } = require('./services/valuation.js');
const { optionPayoff, multiLegPayoff } = require('./services/profit');

const PORT = 3000

app.use(express.json());

// PRICING MODELS
app.get("/valuation/blackscholes", blackScholesModel);

// PROFIT CALCULATIONS
app.get("/profit/option-payoff", optionPayoff);                       // OPTION PAYOFF: Calculate the profit & loss of a long or short position in a call or put option.
app.get("/profit/multi-leg-payoff", multiLegPayoff);                  // MULTI-LEG PAYOFF: Calculate the total profit & loss of a multi-leg strategy.

// OPTION STRATEGIES Straddles, Spreads, Condors, Butterflies


app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`)
});


// TEMPORARY ...

/*
    
    OPTION PAYOFF BODY FORMAT
    
    {
        "optionType": "call",
        "direction": "long",
        "initialPrice": 2.35,
        "strikePrice": 45,
        "underlyingPrice": 49,
        "contractSize": 100,
        "positionSize": 5
    }
    
*/

/*
    
    MULTI PAYOFF BODY FORMAT
    
    [
        {
            "optionType": "call",
            "direction": "long",
            "initialPrice": 2.35,
            "strikePrice": 45,
            "underlyingPrice": 49,
            "contractSize": 100,
            "positionSize": 5
        },
        {
            ...
        }
    ]
    
*/