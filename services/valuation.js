const Joi = require('joi');
const { pow, log, sqrt, exp, max } = require('mathjs');
const { cdf } = require('../tools/helperfunctions');


function blackScholesModel(req, res) {

    function validateRequest(request) {

        const schema = Joi.object({
            optionType: Joi.string().valid("call", "put").required(),
            stockPrice: Joi.number().required(),
            strikePrice: Joi.number().required(),
            riskFreeInterestRate: Joi.number().required(),
            timeToMaturity: Joi.number().required(),
            volatility: Joi.number().required()
        })
    
        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const type = req.body.optionType
    const S = req.body.stockPrice
    const K = req.body.strikePrice
    const r = req.body.riskFreeInterestRate
    const t = req.body.timeToMaturity
    const v = req.body.volatility

    const d1 = (log(S/K)+(r+(pow(v, 2)/2)*t))/(v*sqrt(t));
    const d2 = d1-(v*sqrt(t));

    const c = S*cdf(d1)-K*exp(-r*t)*cdf(d2);
    const p = K*exp(-r*t)*cdf(-d2)-S*cdf(-d1);

    if (type === "call") res.send(String(c));
    if (type === "put") res.send(String(p));
}

function getUnderlyingPriceTree({optionType, isEuro, undPrice, vol, strike, timeDays, intRate, yield, steps, upMove, downMove, upProb, downProb}) {

    var tree = [[undPrice]];

    for (let i=1; i <= steps; i++) {
        var step = [];
        var previousStep = tree[i-1];

        step.push(previousStep[0] * upMove);

        for (let i=0; i < previousStep.length; i++) {
            step.push(previousStep[i] * downMove)
        }

        tree.push(step);
    }

    return tree;
}

function getOptionPriceTree(underlyingPriceTree, {stepDiscount, optionType, isEuro, undPrice, vol, strike, timeDays, intRate, yield, steps, upMove, downMove, upProb, downProb}) {
    
    var tree = [];
    
    // Last step in Option Price Tree
    const lastStep = underlyingPriceTree[underlyingPriceTree.length-1];
    var nodes = [];

    for (let i=0; i < lastStep.length; i++) {
        const price = lastStep[i];
        
        if (optionType === "call") nodes.push(max(0, price-strike));
        if (optionType === "put") nodes.push(max(0, strike-price));
    }

    tree.push(nodes);

    // Remaining steps in Option Price Tree
    for (let i=0; i < underlyingPriceTree.length - 1; i++) {
        const step = tree[i];
        const undTreeStep = underlyingPriceTree[underlyingPriceTree.length-2-i]
        var nodes = [];

        for (let i=0; i < step.length-1; i++) {
            const upPrice = step[i];
            const downPrice = step[i+1];
            const undPrice = undTreeStep[i];

            const expectedValue = (upPrice * upProb + downPrice * downProb) * stepDiscount;
            const intrinsicValue = () => {
                if (optionType === "call") return undPrice - strike;
                if (optionType === "put") return strike - undPrice;
            }

            const price = isEuro ? expectedValue : max(expectedValue, intrinsicValue())
            
            nodes.push(price);
        }

        tree.push(nodes);
    }

    return tree.reverse();
}

function coxRossRubinsteinModel(req, res) {

    function validateRequest(request) {

        const schema = Joi.object({
            optionType: Joi.string().valid("call", "put").required(),                
            isEuro: Joi.boolean().required(),                                 // Whether the option is American or European
            undPrice: Joi.number().required(),                                // The underlying price of the option
            vol: Joi.number().required(),                                     // Volatilty
            strike: Joi.number().required(),                                  // The option's strike price
            timeDays: Joi.number().required(),                                // Time to expiration as number of days
            intRate: Joi.number().required(),                                 // The risk-free interest rate
            yield: Joi.number().required(),                                   // Continuous dividend yield (stocks) or foreign rate (currency)
            steps: Joi.number().required(),                                   // Number of steps in the binomial tree
            upMove: Joi.number().required(),                                  // The size of the up move in the binomial tree
            downMove: Joi.number().required(),                                // The size of the down move in the binomial tree
            upProb: Joi.number().required(),                                  // The probability of the up move in the binomial tree
            downProb: Joi.number().required()                                 // The probability of the down move in the binomial tree
        })
    
        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const {optionType, isEuro, undPrice, vol, strike, timeDays, intRate, yield, steps} = req.body
    
    const timePct = timeDays/365;
    const stepPct = timePct/steps;
    const stepDiscount = exp((-intRate)*stepPct);

    const upMove = exp(vol*sqrt(stepPct));
    const downMove = 1/upMove;
    const upProb = (exp((intRate-yield)*stepPct)-downMove)/(upMove-downMove);
    const downProb = 1-upProb;

    const underlyingPriceTree = getUnderlyingPriceTree({optionType, isEuro, undPrice, vol, strike, timeDays, intRate, yield, steps, upMove, downMove, upProb, downProb})

    const optionPriceTree = getOptionPriceTree(underlyingPriceTree, {stepDiscount, optionType, isEuro, undPrice, vol, strike, timeDays, intRate, yield, steps, upMove, downMove, upProb, downProb});

    res.send(optionPriceTree)
}

module.exports = {
    blackScholesModel,
    coxRossRubinsteinModel
}