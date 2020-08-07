const { pow, log, sqrt, exp } = require('mathjs');
const { cdf } = require('../tools/helperfunctions');



function blackScholesModel(body, type) {
    /*
    const S = body.stockPrice
    const K = body.strikePrice
    const r = body.riskFreeInterestRate
    const t = body.timeToMaturity
    const v = body.volatility
    */
   const S = 10
   const K = 10
   const v = .30
   const r = .04
   const t = 1

    const d1 = (log(S/K)+(r+(pow(v, 2)/2)*t))/(v*sqrt(t));
    const d2 = d1-(v*sqrt(t));

    const c = S*cdf(d1)-K*exp(-r*t)*cdf(d2);
    const p = K*exp(-r*t)*cdf(-d2)-S*cdf(-d1);

    return body;
}

module.exports = blackScholesModel