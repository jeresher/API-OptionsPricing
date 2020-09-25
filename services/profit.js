const Joi = require("joi");
const { max } = require('mathjs');


function optionPayoff(req, res) {

    function validateRequest(request) {

        const schema = Joi.object({
            optionType: Joi.string().valid("call", "put").required(),
            direction: Joi.string().valid("long", "short"),            // The direction, long or short, of the option (Default: long)
            initialPrice: Joi.number().required(),                     // Initial price, or premium, of the option
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
    const direction = req.body.direction || "long"
    const I = req.body.initialPrice
    const K = req.body.strikePrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSize || 1

    const c = {
        profitLossPerShare: (direction === "long") ? 
            max(U-K, 0) - I : 
            (max(U-K, 0) - I) * -1 
        ,
        profitLossTotal: (direction === "long") ? 
            (max(U-K, 0) - I) * cSize * pSize :
            ((max(U-K, 0) - I) * cSize * pSize) * -1
    }
    const p = {
        profitLossPerShare: (direction === "long") ? 
            max(K-U, 0) - I :
            (max(K-U, 0) - I) * -1
        ,
        profitLossTotal: (direction === "long") ?
            (max(K-U, 0) - I) * cSize * pSize :
            ((max(K-U, 0) - I) * cSize * pSize) * -1
    }

    if (type === "call") res.send(c);
    if (type === "put") res.send(p);
}

function multiLegPayoff(req, res) {

    function validateRequest(request) {

        const individualLegSchema = Joi.object({
            optionType: Joi.string().valid("call", "put").required(),
            direction: Joi.string().valid("long", "short"),            // The direction, long or short, of the option (Default: long)
            initialPrice: Joi.number().required(),                     // Initial price, or premium, of the option
            strikePrice: Joi.number().required(),                      // Strike price of the option
            underlyingPrice: Joi.number().required(),                  // Projected price of the option
            contractSize: Joi.number(),                                // Number of shares a contract represents (Default: 100)
            positionSize: Joi.number()                                 // Number of contracts being held (Default: 1)
        })

        const schema = Joi.array().items(individualLegSchema)
    
        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const options = req.body;

    var totalProfitLossPerShare = 0;
    var totalProfitLoss = 0;
    var contracts = [];

    options.forEach(option => {
        const type = option.optionType
        const direction = option.direction || "long"
        const I = option.initialPrice
        const K = option.strikePrice
        const U = option.underlyingPrice
        const cSize = option.contractSize || 100
        const pSize = option.positionSize || 1

        const c = {
            information: option,
            profitLossPerShare: (direction === "long") ? 
                max(U-K, 0) - I : 
                (max(U-K, 0) - I) * -1 
            ,
            profitLossTotal: (direction === "long") ? 
                (max(U-K, 0) - I) * cSize * pSize :
                ((max(U-K, 0) - I) * cSize * pSize) * -1
        }
        const p = {
            information: option,
            profitLossPerShare: (direction === "long") ? 
                max(K-U, 0) - I :
                (max(K-U, 0) - I) * -1
            ,
            profitLossTotal: (direction === "long") ?
                (max(K-U, 0) - I) * cSize * pSize :
                ((max(K-U, 0) - I) * cSize * pSize) * -1
        }

        if (type==="call") {
            totalProfitLossPerShare += c.profitLossPerShare
            totalProfitLoss += c.profitLossTotal
            contracts.push(c)
        } else {
            totalProfitLossPerShare += p.profitLossPerShare
            totalProfitLoss += p.profitLossTotal
            contracts.push(p)
        }
    })

    res.send({contracts, totalProfitLossPerShare, totalProfitLoss});
}

module.exports = {
    optionPayoff,
    multiLegPayoff
}