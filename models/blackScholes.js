const Joi = require('joi');
const { pow, log, sqrt, exp } = require('mathjs');
const { cdf } = require('../tools/helperfunctions');


function blackScholesModel(req, res) {

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