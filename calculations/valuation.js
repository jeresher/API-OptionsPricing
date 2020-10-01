const Joi = require('joi');
const { pow, log, sqrt, exp, max, sign } = require('mathjs');
const { cdf, getUnderlyingPriceTree, getOptionPriceTree } = require('../tools/helperfunctions');


function blackScholesModel(req, res) {

    function validateRequest(request) {

        const schema = Joi.object({
            optionType: Joi.string().valid("call", "put").required(),
            stockPrice: Joi.number().required(), // undPrice
            strikePrice: Joi.number().required(), // strike
            riskFreeInterestRate: Joi.number().required(), // intRate
            timeToMaturity: Joi.number().required(), // timeYears(timeDays/365)
            volatility: Joi.number().required() // vol
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

    if (type === "call") res.send({information: req.body, optionPrice: String(c)});
    if (type === "put") res.send({information: req.body, optionPrice: String(p)});
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
            steps: Joi.number().required()                                    // Number of steps in the binomial tree
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

    const upMove = exp(vol*sqrt(stepPct));                                     // The size of the up move in the binomial tree
    const downMove = 1/upMove;                                                 // The size of the down move in the binomial tree
    const upProb = (exp((intRate-yield)*stepPct)-downMove)/(upMove-downMove);  // The probability of the up move in the binomial tree
    const downProb = 1-upProb;                                                 // The probability of the down move in the binomial tree

    const underlyingPriceTree = getUnderlyingPriceTree({undPrice, steps, upMove, downMove})

    const optionPriceTree = getOptionPriceTree(underlyingPriceTree, {stepDiscount, optionType, isEuro, strike, upProb, downProb});

    res.send({
        information: req.body, 
        underlyingPriceTree,
        optionPriceTree,
        optionPrice: optionPriceTree[0][0]
    })
}

function jarrowRuddModel(req, res) {
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
            steps: Joi.number().required()                                    // Number of steps in the binomial tree
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

    const upMove = exp((intRate-yield-pow(vol, 2)/2)*stepPct+vol*sqrt(stepPct));
    const downMove = exp((intRate-yield-pow(vol, 2)/2)*stepPct-vol*sqrt(stepPct));
    const upProb = 0.5;
    const downProb = 0.5;

    const underlyingPriceTree = getUnderlyingPriceTree({undPrice, steps, upMove, downMove});

    const optionPriceTree = getOptionPriceTree(underlyingPriceTree, {stepDiscount, optionType, isEuro, strike, upProb, downProb});

    res.send({
        information: req.body, 
        underlyingPriceTree,
        optionPriceTree,
        optionPrice: optionPriceTree[0][0]
    })
}

function leisenReimerModel(req, res) {
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
            steps: Joi.number().required()                                    // Number of steps in the binomial tree
        })
    
        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    } else if (req.body.steps % 2 === 0) {
        res.status(400).send(`"Steps" must be odd.`)
    }

    const {optionType, isEuro, undPrice, vol, strike, timeDays, intRate, yield, steps} = req.body
    
    const timePct = timeDays/365;
    const stepPct = timePct/steps;
    const stepDiscount = exp((-intRate)*stepPct);

    // black-scholes
    const d1 = (log(undPrice/strike)+timePct*(intRate-yield+(pow(vol, 2)/2))/(vol*sqrt(timePct)));
    const d2 = d1-(vol*sqrt(timePct));

    // peizer-pratt inversion
    const d1inversion = 0.5+sign(d1)/2*sqrt(1-exp(-(pow((d1/(steps+1/3+0.1/(steps+1))), 2)*(steps+1/6))));
    const d2inversion = 0.5+sign(d2)/2*sqrt(1-exp(-(pow((d2/(steps+1/3+0.1/(steps+1))), 2)*(steps+1/6))));

    const upMove = exp((intRate-yield)*stepPct)*(d1inversion/d2inversion)
    const downMove = exp((intRate-yield)*stepPct)*((1-d1inversion)/(1-d2inversion))
    const upProb = d2inversion;
    const downProb = 1-d2inversion;

    const underlyingPriceTree = getUnderlyingPriceTree({undPrice, steps, upMove, downMove})

    const optionPriceTree = getOptionPriceTree(underlyingPriceTree, {stepDiscount, optionType, isEuro, strike, upProb, downProb});

    res.send({
        information: req.body, 
        underlyingPriceTree,
        optionPriceTree,
        optionPrice: optionPriceTree[0][0]
    })
}

module.exports = {
    blackScholesModel,
    coxRossRubinsteinModel,
    jarrowRuddModel,
    leisenReimerModel
}