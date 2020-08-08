const Joi = require('joi');
const { pow, log, sqrt, exp } = require('mathjs');
const { cdf } = require('../tools/helperfunctions');


function blackScholesModel(request, res) {

    const data = validateRequest(request);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const type = request.optionType
    const S = request.stockPrice
    const K = request.strikePrice
    const r = request.riskFreeInterestRate
    const t = request.timeToMaturity
    const v = request.volatility

    const d1 = (log(S/K)+(r+(pow(v, 2)/2)*t))/(v*sqrt(t));
    const d2 = d1-(v*sqrt(t));

    const c = S*cdf(d1)-K*exp(-r*t)*cdf(d2);
    const p = K*exp(-r*t)*cdf(-d2)-S*cdf(-d1);

    if (type === "call") return String(c);
    if (type === "put") return String(p);
}


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

module.exports = blackScholesModel