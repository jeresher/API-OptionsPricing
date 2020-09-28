const Joi = require("joi");

function bearPutSpread(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            shortPutStrikePrice: Joi.number().required(),              // Strike price of the short put
            shortPutPremiumPrice: Joi.number().required(),             // Premium price of the short put
            longPutStrikePrice: Joi.number().required(),               // Strike price of the long put
            longPutPremiumPrice: Joi.number().required(),              // Premium price of the long put
            underlyingPrice: Joi.number().required(),                  // Market price of the asset
            contractSize: Joi.number(),                                // Number of shares a contract represents (Default: 100)
            positionSizeEachDirection: Joi.number()                    // Number of contracts being held (Default: 1)
        })

        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const shortK = req.body.shortPutStrikePrice
    const shortI = req.body.shortPutPremiumPrice
    const longK = req.body.longPutStrikePrice
    const longI = req.body.longPutPremiumPrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSizeEachDirection || 1


    const initialShortCF = shortI * cSize * pSize
    const initialLongCF = -(longI * cSize * pSize)

    const shortValue = () => {
        if (U >= shortK) return 0;
        else return -((shortK - U) * cSize * pSize);
    };
    const longValue = () => {
        if (U >= longK) return 0;
        else return (longK - U) * cSize * pSize;
    };

    const shortProfitLoss = shortValue() + initialShortCF;
    const longProfitLoss = longValue() + initialLongCF;

    const shortLeg = {
        direction: "short",
        type: "put",
        strike: shortK,
        size: pSize,
        initialPrice: shortI,
        initialCF: initialShortCF,
        value: shortValue(),
        profitLoss: shortProfitLoss
    }
    const longLeg = {
        direction: "long",
        type: "put",
        strike: longK,
        size: pSize,
        initialPrice: longI,
        initialCF: initialLongCF,
        value: longValue(),
        profitLoss: longProfitLoss
    }

    res.send({
        shortLeg,
        longLeg,
        initialCF: initialShortCF + initialLongCF,
        value: shortValue() + longValue(),
        profitLoss: shortProfitLoss + longProfitLoss
    })
}

function bullCallSpread(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            shortCallStrikePrice: Joi.number().required(),             // Strike price of the short call
            shortCallPremiumPrice: Joi.number().required(),            // Premium price of the short call
            longCallStrikePrice: Joi.number().required(),              // Strike price of the long call
            longCallPremiumPrice: Joi.number().required(),             // Premium price of the long call
            underlyingPrice: Joi.number().required(),                  // Market price of the asset
            contractSize: Joi.number(),                                // Number of shares a contract represents (Default: 100)
            positionSizeEachDirection: Joi.number()                    // Number of contracts being held (Default: 1)
        })

        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const shortK = req.body.shortCallStrikePrice
    const shortI = req.body.shortCallPremiumPrice
    const longK = req.body.longCallStrikePrice
    const longI = req.body.longCallPremiumPrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSizeEachDirection || 1


    const initialShortCF = shortI * cSize * pSize
    const initialLongCF = -(longI * cSize * pSize)

    const shortValue = () => {
        if (U <= shortK) return 0;
        else return -((U - shortK) * cSize * pSize);
    };
    const longValue = () => {
        if (U <= longK) return 0;
        else return (U - longK) * cSize * pSize;
    };

    const shortProfitLoss = shortValue() + initialShortCF;
    const longProfitLoss = longValue() + initialLongCF;

    const shortLeg = {
        direction: "short",
        type: "call",
        strike: shortK,
        size: pSize,
        initialPrice: shortI,
        initialCF: initialShortCF,
        value: shortValue(),
        profitLoss: shortProfitLoss
    }
    const longLeg = {
        direction: "long",
        type: "call",
        strike: longK,
        size: pSize,
        initialPrice: longI,
        initialCF: initialLongCF,
        value: longValue(),
        profitLoss: longProfitLoss
    }

    res.send({
        longLeg,
        shortLeg,
        initialCF: initialShortCF + initialLongCF,
        value: shortValue() + longValue(),
        profitLoss: shortProfitLoss + longProfitLoss
    })
}

function bullPutSpread(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            shortPutStrikePrice: Joi.number().required(),              // Strike price of the short put
            shortPutPremiumPrice: Joi.number().required(),             // Premium price of the short put
            longPutStrikePrice: Joi.number().required(),               // Strike price of the long put
            longPutPremiumPrice: Joi.number().required(),              // Premium price of the long put
            underlyingPrice: Joi.number().required(),                  // Market price of the asset
            contractSize: Joi.number(),                                // Number of shares a contract represents (Default: 100)
            positionSizeEachDirection: Joi.number()                    // Number of contracts being held (Default: 1)
        })

        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const shortK = req.body.shortPutStrikePrice
    const shortI = req.body.shortPutPremiumPrice
    const longK = req.body.longPutStrikePrice
    const longI = req.body.longPutPremiumPrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSizeEachDirection || 1


    const initialShortCF = shortI * cSize * pSize
    const initialLongCF = -(longI * cSize * pSize)

    const shortValue = () => {
        if (U >= shortK) return 0;
        else return -((shortK - U) * cSize * pSize);
    };
    const longValue = () => {
        if (U >= longK) return 0;
        else return (longK - U) * cSize * pSize;
    };

    const shortProfitLoss = shortValue() + initialShortCF;
    const longProfitLoss = longValue() + initialLongCF;

    const shortLeg = {
        direction: "short",
        type: "put",
        strike: shortK,
        size: pSize,
        initialPrice: shortI,
        initialCF: initialShortCF,
        value: shortValue(),
        profitLoss: shortProfitLoss
    }
    const longLeg = {
        direction: "long",
        type: "put",
        strike: longK,
        size: pSize,
        initialPrice: longI,
        initialCF: initialLongCF,
        value: longValue(),
        profitLoss: longProfitLoss
    }

    res.send({
        shortLeg,
        longLeg,
        initialCF: initialShortCF + initialLongCF,
        value: shortValue() + longValue(),
        profitLoss: shortProfitLoss + longProfitLoss
    })
}




module.exports = {
    bearPutSpread,
    bullCallSpread,
    bullPutSpread
}