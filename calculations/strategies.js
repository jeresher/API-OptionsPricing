const Joi = require("joi");
const { max, min } = require("mathjs");


function longCall(req, res) {
    
    function validateRequest(request) {
        
        const schema = Joi.object({
            initialPrice: Joi.number().required(),                     // Initial price, or premium, of the option
            strikePrice: Joi.number().required(),                      // Strike price of the option
            underlyingPrice: Joi.number().required(),                  // Market price of the option
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

    const I = req.body.initialPrice
    const K = req.body.strikePrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSize || 1

    res.send({
        information: req.body,
        profitLossPerShare: max(U-K) - I,
        profitLossTotal: (max(U-K) - I) * cSize * pSize
    })
}

function longPut(req, res) {
    
    function validateRequest(request) {
        
        const schema = Joi.object({
            initialPrice: Joi.number().required(),                     // Initial price, or premium, of the option
            strikePrice: Joi.number().required(),                      // Strike price of the option
            underlyingPrice: Joi.number().required(),                  // Market price of the option
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

    const I = req.body.initialPrice
    const K = req.body.strikePrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSize || 1

    res.send({
        information: req.body,
        profitLossPerShare: max(K-U, 0) - I,
        profitLossTotal: (max(K-U, 0) - I) * cSize * pSize
    })
}

function coveredCall(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            stockPurchasePrice: Joi.number().required(),               // Initial price of the stock
            stockExpirationPrice: Joi.number().required(),             // Stock price at expiration
            optionPremium: Joi.number().required(),                    // Initial price, or premium, of the option
            strikePrice: Joi.number().required(),                      // Strike price of the option
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

    const { stockPurchasePrice, stockExpirationPrice, optionPremium, strikePrice, contractSize, positionSize} = req.body;

    res.send({
        information: req.body,
        breakEvenPoint: stockPurchasePrice - optionPremium,
        maxProfitPoint: strikePrice,
        profitLossPerShare: min(strikePrice - stockPurchasePrice, stockExpirationPrice - stockPurchasePrice) + optionPremium,
        profitLossTotal: (min(strikePrice - stockPurchasePrice, stockExpirationPrice - stockPurchasePrice) + optionPremium) * contractSize * positionSize
    })
}

function nakedCall(req, res) {
    
    function validateRequest(request) {
        
        const schema = Joi.object({
            initialPrice: Joi.number().required(),                     // Initial price, or premium, of the option
            strikePrice: Joi.number().required(),                      // Strike price of the option
            underlyingPrice: Joi.number().required(),                  // Market price of the option
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

    const I = req.body.initialPrice
    const K = req.body.strikePrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSize || 1

    res.send({
        information: req.body,
        profitLossPerShare: (max(U-K, 0) - I) * -1,
        profitLossTotal: ((max(U-K, 0) - I) * cSize * pSize) * -1
    })
}

function nakedPut(req, res) {
    
    function validateRequest(request) {
        
        const schema = Joi.object({
            initialPrice: Joi.number().required(),                     // Initial price, or premium, of the option
            strikePrice: Joi.number().required(),                      // Strike price of the option
            underlyingPrice: Joi.number().required(),                  // Market price of the option
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

    const I = req.body.initialPrice
    const K = req.body.strikePrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSize || 1

    res.send({
        information: req.body,
        profitLossPerShare: (max(K-U, 0) - I) * -1,
        profitLossTotal: ((max(K-U, 0) - I) * cSize * pSize) * -1
    })
}

module.exports = {
    longCall,
    longPut,
    coveredCall,
    nakedCall,
    nakedPut
}