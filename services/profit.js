const Joi = require("joi");
const { max } = require('mathjs');


function optionPayoff(req, res) {

    function validateRequest(request) {

        const schema = Joi.object({
            optionType: Joi.string().valid("call", "put").required(),
            initialPrice: Joi.number().required(),                     // Initial price of the option
            strikePrice: Joi.number().required(),                      // Strike price of the option
            underlyingPrice: Joi.number().required(),                  // Projected price of the option
            contractSize: Joi.number(),                                // Number of shares a contract represents (Default: 100)
            positionSize: Joi.number()                                 // Number of contracts being held (Default: 1)
        })
    
        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const type = req.body.optionType
    const I = req.body.initialPrice
    const K = req.body.strikePrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSize || 1


    const c = {
        ProfitLossPerShare: max(U-K, 0) - I,
        ProfitLossTotal: (max(U-K, 0) - I) * cSize * pSize
    }
    const p = {
        ProfitLossPerShare: max(K-U, 0) - I,
        ProfitLossTotal: (max(K-U, 0) - I) * cSize * pSize
    }

    if (type === "call") res.send(c);
    if (type === "put") res.send(p);
}

function shortPayoff(req, res) {

    function validateRequest(request) {

        const schema = Joi.object({
            optionType: Joi.string().valid("call", "put").required(),
            initialPrice: Joi.number().required(),
            strikePrice: Joi.number().required(),
            underlyingPrice: Joi.number().required()
        })
    
        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const type = req.body.optionType
    const I = req.body.initialPrice
    const K = req.body.strikePrice
    const U = req.body.underlyingPrice

}

module.exports = {
    optionPayoff
}