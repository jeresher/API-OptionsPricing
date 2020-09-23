const Joi = require("joi");
const { max } = require('mathjs');


function optionPayoff(req, res) {

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

    const c = max(U-K, 0) - I;
    const p = max(K-U, 0) - I;

    if (type === "call") res.send(String(c));
    if (type === "put") res.send(String(p));
}

module.exports = {
    optionPayoff
}