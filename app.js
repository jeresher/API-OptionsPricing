const express = require('express');
const app = express();
const { 
    blackScholesModel, 
    coxRossRubinsteinModel, 
    jarrowRuddModel,
    leisenReimerModel 
} = require('./services/valuation.js');
const { optionPayoff, multiLegPayoff } = require('./services/profit');
const { 
    longCall, 
    longPut,
    coveredCall,
    nakedCall,
    nakedPut
} = require('./services/strategies');
const {
    bearPutSpread,
    bullCallSpread,
    bullPutSpread,
    bearCallSpread
} = require('./services/spreads');


const PORT = 3000

app.use(express.json());

// PRICING MODELS
app.get("/valuation/black-scholes-model", blackScholesModel);
app.get("/valuation/crr-model", coxRossRubinsteinModel);
app.get("/valuation/jarrow-rudd-model", jarrowRuddModel);
app.get("/valuation/leisen-reimer-model", leisenReimerModel);

// PROFIT CALCULATIONS
app.get("/profit/option-payoff", optionPayoff);                       // OPTION PAYOFF: Calculate the profit & loss of a long or short position in a call or put option.
app.get("/profit/multi-leg-payoff", multiLegPayoff);                  // MULTI-LEG PAYOFF: Calculate the total profit & loss of a multi-leg strategy.

// BASIC OPTION STRATEGIES
app.get("/strategy/long-call", longCall);
app.get("/strategy/long-put", longPut);
app.get("/strategy/covered-call", coveredCall);
app.get("/strategy/naked-call", nakedCall);
app.get("/strategy/naked-put", nakedPut);

// SPREAD OPTION STRATEGIES
app.get("/spread/bear-put-spread", bearPutSpread);
app.get("/spread/bull-call-spread", bullCallSpread);
app.get("/spread/bull-put-spread", bullPutSpread);
app.get("/spread/bear-call-spread", bearCallSpread);


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

    RESPONSE

    {
        "profitLossPerShare": 1.65,
        "profitLossTotal": 825
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

    RESPONSE

    {
        "contracts": [
            {
                "information": {
                    "optionType": "call",
                    "direction": "long",
                    "initialPrice": 2.35,
                    "strikePrice": 45,
                    "underlyingPrice": 49,
                    "contractSize": 100,
                    "positionSize": 5
                },
                "profitLossPerShare": 1.65,
                "profitLossTotal": 825
            },
            {
                "information": {
                    "optionType": "call",
                    "direction": "long",
                    "initialPrice": 2.35,
                    "strikePrice": 45,
                    "underlyingPrice": 49,
                    "contractSize": 100,
                    "positionSize": 5
                },
                "profitLossPerShare": 1.65,
                "profitLossTotal": 825
            }
        ],
        "totalProfitLossPerShare": 3.3,
        "totalProfitLoss": 1650
    }
    
*/

/*
    
    CRR MODEL / JARROW RUDD BODY FORMAT
    
    {
        "optionType": "call",
        "isEuro": false,
        "undPrice": 100,
        "vol": 0.35,
        "strike": 100,
        "timeDays": 21,
        "intRate": 0.02,
        "yield": 0.03,
        "steps": 7
    }

    RESPONSE

    {
        "information": {
            "optionType": "call",
            "isEuro": false,
            "undPrice": 100,
            "vol": 0.35,
            "strike": 100,
            "timeDays": 21,
            "intRate": 0.02,
            "yield": 0.03,
            "steps": 7
        },
        "underlyingPriceTree": [
            [
                100
            ],
            [
                103.22396808442001,
                96.8767252952499
            ],
            [
                106.5518758709336,
                100,
                93.85099903931311
            ],
            [
                109.98707434236331,
                103.22396808442001,
                96.8767252952499,
                90.91977452616298
            ],
            [
                113.5330225161484,
                106.55187587093359,
                100,
                93.85099903931311,
                88.0801002067715
            ],
            [
                117.19329092734641,
                109.9870743423633,
                103.22396808442,
                96.8767252952499,
                90.91977452616298,
                85.32911671709486
            ],
            [
                120.97156522392554,
                113.5330225161484,
                106.55187587093359,
                99.99999999999999,
                93.85099903931311,
                88.0801002067715,
                82.66405399888315
            ],
            [
                124.87164987796822,
                117.1932909273464,
                109.9870743423633,
                103.22396808442,
                96.87672529524988,
                90.91977452616298,
                85.32911671709486,
                80.08222851041506
            ]
        ],
        "optionPriceTree": [
            [
                3.4417669411954943
            ],
            [
                5.10793732695288,
                1.8370879489440888
            ],
            [
                7.3437689070713175,
                2.9547789646019806,
                0.7604939612711269
            ],
            [
                10.177846977005306,
                4.614765687724386,
                1.3559023280169042,
                0.18690808380931126
            ],
            [
                13.533022516148407,
                6.94754525761415,
                2.3680134151143797,
                0.3809068188388547,
                0
            ],
            [
                17.19329092734641,
                9.9870743423633,
                4.020408437018362,
                0.776263935089939,
                0,
                0
            ],
            [
                20.971565223925538,
                13.533022516148407,
                6.551875870933586,
                1.5819766596938898,
                0,
                0,
                0
            ],
            [
                24.871649877968224,
                17.193290927346396,
                9.9870743423633,
                3.223968084419994,
                0,
                0,
                0,
                0
            ]
        ],
        "optionPrice": 3.4417669411954943
    }
    
*/

/*
    
    COVERED CALL BODY FORMAT
    
    {
        "stockPurchasePrice": 50,
        "stockExpirationPrice": 55,
        "optionPremium": 4,
        "strikePrice": 55,
        "contractSize": 100, 
        "positionSize": 1
    }

    RESPONSE

    {
        "information": {
            "stockPurchasePrice": 50,
            "stockExpirationPrice": 55,
            "optionPremium": 4,
            "strikePrice": 55,
            "contractSize": 100,
            "positionSize": 1
        },
        "breakEvenPoint": 46,
        "maxProfitPoint": 55,
        "profitLossPerShare": 9,
        "profitLossTotal": 900
    }
    
*/

/*

    BEAR PUT SPREAD BODY FORMAT

    {
        "shortPutStrikePrice": 45,
        "shortPutPremiumPrice": 1.87,
        "longPutStrikePrice": 50,
        "longPutPremiumPrice": 4.49,
        "underlyingPrice": 42,
        "contractSize": 100, 
        "positionSizeEachDirection": 1
    }

    RESPONSE

    {
        "shortLeg": {
            "direction": "short",
            "type": "put",
            "strike": 45,
            "size": 1,
            "initialPrice": 1.87,
            "initialCF": 187,
            "value": -300,
            "profitLoss": -113
        },
        "longLeg": {
            "direction": "long",
            "type": "put",
            "strike": 50,
            "size": 1,
            "initialPrice": 4.49,
            "initialCF": -449,
            "value": 800,
            "profitLoss": 351
        },
        "initialCF": -262,
        "value": 500,
        "profitLoss": 238
    }
*/

/* 

    BULL CALL SPREAD FORMAT 

    {
        "longCallStrikePrice": 45,
        "longCallPremiumPrice": 4.38,
        "shortCallStrikePrice": 50,
        "shortCallPremiumPrice": 2.02,
        "underlyingPrice": 52,
        "contractSize": 100, 
        "positionSizeEachDirection": 1
    }

    RESPONSE

    {
        "longLeg": {
            "direction": "long",
            "type": "call",
            "strike": 45,
            "size": 1,
            "initialPrice": 4.38,
            "initialCF": -438,
            "value": 700,
            "profitLoss": 262
        },
        "shortLeg": {
            "direction": "short",
            "type": "call",
            "strike": 50,
            "size": 1,
            "initialPrice": 2.02,
            "initialCF": 202,
            "value": -200,
            "profitLoss": 2
        },
        "initialCF": -236,
        "value": 500,
        "profitLoss": 264
    }

*/

/*

    BULL PUT SPREAD FORMAT

    {
        "shortPutStrikePrice": 50,
        "shortPutPremiumPrice": 4.49,
        "longPutStrikePrice": 45,
        "longPutPremiumPrice": 1.87,
        "underlyingPrice": 52,
        "contractSize": 100, 
        "positionSizeEachDirection": 1
    }

    RESPONSE 

    {
        "shortLeg": {
            "direction": "short",
            "type": "put",
            "strike": 50,
            "size": 1,
            "initialPrice": 4.49,
            "initialCF": 449,
            "value": 0,
            "profitLoss": 449
        },
        "longLeg": {
            "direction": "long",
            "type": "put",
            "strike": 45,
            "size": 1,
            "initialPrice": 1.87,
            "initialCF": -187,
            "value": 0,
            "profitLoss": -187
        },
        "initialCF": 262,
        "value": 0,
        "profitLoss": 262
    }

*/