const Joi = require("joi");

function longStraddle(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            longPutStrikePrice: Joi.number().required(),               // Strike price of the long put
            longPutPremiumPrice: Joi.number().required(),              // Premium price of the long put
            longCallStrikePrice: Joi.number().required(),              // Strike price of the long call
            longCallPremiumPrice: Joi.number().required(),             // Premium price of the long call
            underlyingPrice: Joi.number().required(),                  // Market price of the asset
            contractSize: Joi.number(),                                // Number of shares a contract represents (Default: 100)
            positionSizeEachOptionType: Joi.number()                          // Number of contracts being held (Default: 1)
        })

        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const longPutK = req.body.longPutStrikePrice
    const longPutI = req.body.longPutPremiumPrice
    const longCallK = req.body.longCallStrikePrice
    const longCallI = req.body.longCallPremiumPrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSizeEachOptionType || 1


    const initialPutCF = -(longPutI * cSize * pSize)
    const initialCallCF = -(longCallI * cSize * pSize)

    const putValue = () => {
        if (U > longPutK) return 0;
        else return (longPutK - U) * cSize * pSize;
    };
    const callValue = () => {
        if (U < longCallK) return 0;
        else return (U - longCallK) * cSize * pSize;
    };

    const putProfitLoss = putValue() + initialPutCF;
    const callProfitLoss = callValue() + initialCallCF;

    const putLeg = {
        direction: "long",
        type: "put",
        strike: longPutK,
        size: pSize,
        initialPrice: longPutI,
        initialCF: initialPutCF,
        value: putValue(),
        profitLoss: putProfitLoss
    }
    const callLeg = {
        direction: "long",
        type: "call",
        strike: longCallK,
        size: pSize,
        initialPrice: longCallI,
        initialCF: initialCallCF,
        value: callValue(),
        profitLoss: callProfitLoss
    }

    res.send({
        putLeg,
        callLeg,
        initialCF: initialPutCF + initialCallCF,
        value: putValue() + callValue(),
        profitLoss: putProfitLoss + callProfitLoss
    })
}

function longStrangle(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            longPutStrikePrice: Joi.number().required(),               // Strike price of the long put
            longPutPremiumPrice: Joi.number().required(),              // Premium price of the long put
            longCallStrikePrice: Joi.number().required(),              // Strike price of the long call
            longCallPremiumPrice: Joi.number().required(),             // Premium price of the long call
            underlyingPrice: Joi.number().required(),                  // Market price of the asset
            contractSize: Joi.number(),                                // Number of shares a contract represents (Default: 100)
            positionSizeEachOptionType: Joi.number()                          // Number of contracts being held (Default: 1)
        })

        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const longPutK = req.body.longPutStrikePrice
    const longPutI = req.body.longPutPremiumPrice
    const longCallK = req.body.longCallStrikePrice
    const longCallI = req.body.longCallPremiumPrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSizeEachOptionType || 1


    const initialPutCF = -(longPutI * cSize * pSize)
    const initialCallCF = -(longCallI * cSize * pSize)

    const putValue = () => {
        if (U > longPutK) return 0;
        else return (longPutK - U) * cSize * pSize;
    };
    const callValue = () => {
        if (U < longCallK) return 0;
        else return (U - longCallK) * cSize * pSize;
    };

    const putProfitLoss = putValue() + initialPutCF;
    const callProfitLoss = callValue() + initialCallCF;

    const putLeg = {
        direction: "long",
        type: "put",
        strike: longPutK,
        size: pSize,
        initialPrice: longPutI,
        initialCF: initialPutCF,
        value: putValue(),
        profitLoss: putProfitLoss
    }
    const callLeg = {
        direction: "long",
        type: "call",
        strike: longCallK,
        size: pSize,
        initialPrice: longCallI,
        initialCF: initialCallCF,
        value: callValue(),
        profitLoss: callProfitLoss
    }

    res.send({
        putLeg,
        callLeg,
        initialCF: initialPutCF + initialCallCF,
        value: putValue() + callValue(),
        profitLoss: putProfitLoss + callProfitLoss
    })
}

function shortStraddle(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            shortPutStrikePrice: Joi.number().required(),               // Strike price of the short put
            shortPutPremiumPrice: Joi.number().required(),              // Premium price of the short put
            shortCallStrikePrice: Joi.number().required(),              // Strike price of the short call
            shortCallPremiumPrice: Joi.number().required(),             // Premium price of the short call
            underlyingPrice: Joi.number().required(),                   // Market price of the asset
            contractSize: Joi.number(),                                 // Number of shares a contract represents (Default: 100)
            positionSizeEachOptionType: Joi.number()                    // Number of contracts being held per Option Type (Default: 1)
        })

        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const shortPutK = req.body.shortPutStrikePrice
    const shortPutI = req.body.shortPutPremiumPrice
    const shortCallK = req.body.shortCallStrikePrice
    const shortCallI = req.body.shortCallPremiumPrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSizeEachOptionType || 1


    const initialPutCF = shortPutI * cSize * pSize
    const initialCallCF = shortCallI * cSize * pSize

    const putValue = () => {
        if (U > shortPutK) return 0;
        else return -((shortPutK - U) * cSize * pSize);
    };
    const callValue = () => {
        if (U < shortCallK) return 0;
        else return -((U - shortCallK) * cSize * pSize);
    };

    const putProfitLoss = putValue() + initialPutCF;
    const callProfitLoss = callValue() + initialCallCF;

    const putLeg = {
        direction: "short",
        type: "put",
        strike: shortPutK,
        size: pSize,
        initialPrice: shortPutI,
        initialCF: initialPutCF,
        value: putValue(),
        profitLoss: putProfitLoss
    }
    const callLeg = {
        direction: "short",
        type: "call",
        strike: shortCallK,
        size: pSize,
        initialPrice: shortCallI,
        initialCF: initialCallCF,
        value: callValue(),
        profitLoss: callProfitLoss
    }

    res.send({
        putLeg,
        callLeg,
        initialCF: initialPutCF + initialCallCF,
        value: putValue() + callValue(),
        profitLoss: putProfitLoss + callProfitLoss
    })
}

function shortStrangle(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            shortPutStrikePrice: Joi.number().required(),               // Strike price of the short put
            shortPutPremiumPrice: Joi.number().required(),              // Premium price of the short put
            shortCallStrikePrice: Joi.number().required(),              // Strike price of the short call
            shortCallPremiumPrice: Joi.number().required(),             // Premium price of the short call
            underlyingPrice: Joi.number().required(),                   // Market price of the asset
            contractSize: Joi.number(),                                 // Number of shares a contract represents (Default: 100)
            positionSizeEachOptionType: Joi.number()                    // Number of contracts being held per Option Type (Default: 1)
        })

        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const shortPutK = req.body.shortPutStrikePrice
    const shortPutI = req.body.shortPutPremiumPrice
    const shortCallK = req.body.shortCallStrikePrice
    const shortCallI = req.body.shortCallPremiumPrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSizeEachOptionType || 1


    const initialPutCF = shortPutI * cSize * pSize
    const initialCallCF = shortCallI * cSize * pSize

    const putValue = () => {
        if (U > shortPutK) return 0;
        else return -((shortPutK - U) * cSize * pSize);
    };
    const callValue = () => {
        if (U < shortCallK) return 0;
        else return -((U - shortCallK) * cSize * pSize);
    };

    const putProfitLoss = putValue() + initialPutCF;
    const callProfitLoss = callValue() + initialCallCF;

    const putLeg = {
        direction: "short",
        type: "put",
        strike: shortPutK,
        size: pSize,
        initialPrice: shortPutI,
        initialCF: initialPutCF,
        value: putValue(),
        profitLoss: putProfitLoss
    }
    const callLeg = {
        direction: "short",
        type: "call",
        strike: shortCallK,
        size: pSize,
        initialPrice: shortCallI,
        initialCF: initialCallCF,
        value: callValue(),
        profitLoss: callProfitLoss
    }

    res.send({
        putLeg,
        callLeg,
        initialCF: initialPutCF + initialCallCF,
        value: putValue() + callValue(),
        profitLoss: putProfitLoss + callProfitLoss
    })
}

function ironCondor(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            longPutStrikePrice: Joi.number().required(),
            longPutPremiumPrice: Joi.number().required(),
            shortPutStrikePrice: Joi.number().required(),               // Strike price of the short put
            shortPutPremiumPrice: Joi.number().required(),              // Premium price of the short put
            shortCallStrikePrice: Joi.number().required(),              // Strike price of the short call
            shortCallPremiumPrice: Joi.number().required(),             // Premium price of the short call
            longCallStrikePrice: Joi.number().required(),
            longCallPremiumPrice: Joi.number().required(),
            underlyingPrice: Joi.number().required(),                   // Market price of the asset
            contractSize: Joi.number(),                                 // Number of shares a contract represents (Default: 100)
            positionSizeEachOptionType: Joi.number()                    // Number of contracts being held per Option Type (Default: 1)
        })

        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const longPutK = req.body.longPutStrikePrice
    const longPutI = req.body.longPutPremiumPrice
    const shortPutK = req.body.shortPutStrikePrice
    const shortPutI = req.body.shortPutPremiumPrice
    const shortCallK = req.body.shortCallStrikePrice
    const shortCallI = req.body.shortCallPremiumPrice
    const longCallK = req.body.longCallStrikePrice
    const longCallI = req.body.longCallPremiumPrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSizeEachOptionType || 1


    const initialLongPutCF = -(longPutI * cSize * pSize);
    const initialShortPutCF = shortPutI * cSize * pSize;
    const initialShortCallCF = shortCallI * cSize * pSize;
    const initialLongCallCF = -(longCallI * cSize * pSize);

    const longPutValue = () => {
        if (U > longPutK) return 0;
        else return (longPutK - U) * cSize * pSize;
    };
    const shortPutValue = () => {
        if (U > shortPutK) return 0;
        else return -((shortPutK - U) * cSize * pSize);
    };
    const shortCallValue = () => {
        if (U < shortCallK) return 0;
        else return -((U - shortCallK) * cSize * pSize);
    };
    const longCallValue = () => {
        if (U < longCallK) return 0;
        else return (U - longCallK) * cSize * pSize;
    };

    const longPutProfitLoss = longPutValue() + initialLongPutCF;
    const shortPutProfitLoss = shortPutValue() + initialShortPutCF;
    const shortCallProfitLoss = shortCallValue() + initialShortCallCF;
    const longCallProfitLoss = longCallValue() + initialLongCallCF;

    const longPutLeg = {
        direction: "long",
        type: "put",
        strike: longPutK,
        size: pSize,
        initialPrice: longPutI,
        initialCF: initialLongPutCF,
        value: longPutValue(),
        profitLoss: longPutProfitLoss
    }
    const shortPutLeg = {
        direction: "short",
        type: "put",
        strike: shortPutK,
        size: pSize,
        initialPrice: shortPutI,
        initialCF: initialShortPutCF,
        value: shortPutValue(),
        profitLoss: shortPutProfitLoss
    }
    const shortCallLeg = {
        direction: "short",
        type: "call",
        strike: shortCallK,
        size: pSize,
        initialPrice: shortCallI,
        initialCF: initialShortCallCF,
        value: shortCallValue(),
        profitLoss: shortCallProfitLoss
    }
    const longCallLeg = {
        direction: "long",
        type: "call",
        strike: longCallK,
        size: pSize,
        initialPrice: longCallI,
        initialCF: initialLongCallCF,
        value: longCallValue(),
        profitLoss: longCallProfitLoss
    }

    res.send({
        longPutLeg,
        shortPutLeg,
        shortCallLeg,
        longCallLeg,
        initialCF: initialLongPutCF + initialShortPutCF + initialShortCallCF + initialLongCallCF,
        value: longPutValue() + shortPutValue() + shortCallValue() + longCallValue(),
        profitLoss: longPutProfitLoss + shortPutProfitLoss + shortCallProfitLoss + longCallProfitLoss
    })
}

function ironButterfly(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            longPutStrikePrice: Joi.number().required(),
            longPutPremiumPrice: Joi.number().required(),
            shortPutStrikePrice: Joi.number().required(),               // Strike price of the short put
            shortPutPremiumPrice: Joi.number().required(),              // Premium price of the short put
            shortCallStrikePrice: Joi.number().required(),              // Strike price of the short call
            shortCallPremiumPrice: Joi.number().required(),             // Premium price of the short call
            longCallStrikePrice: Joi.number().required(),
            longCallPremiumPrice: Joi.number().required(),
            underlyingPrice: Joi.number().required(),                   // Market price of the asset
            contractSize: Joi.number(),                                 // Number of shares a contract represents (Default: 100)
            positionSizeEachOptionType: Joi.number()                    // Number of contracts being held per Option Type (Default: 1)
        })

        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const longPutK = req.body.longPutStrikePrice
    const longPutI = req.body.longPutPremiumPrice
    const shortPutK = req.body.shortPutStrikePrice
    const shortPutI = req.body.shortPutPremiumPrice
    const shortCallK = req.body.shortCallStrikePrice
    const shortCallI = req.body.shortCallPremiumPrice
    const longCallK = req.body.longCallStrikePrice
    const longCallI = req.body.longCallPremiumPrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSizeEachOptionType || 1


    const initialLongPutCF = -(longPutI * cSize * pSize);
    const initialShortPutCF = shortPutI * cSize * pSize;
    const initialShortCallCF = shortCallI * cSize * pSize;
    const initialLongCallCF = -(longCallI * cSize * pSize);

    const longPutValue = () => {
        if (U > longPutK) return 0;
        else return (longPutK - U) * cSize * pSize;
    };
    const shortPutValue = () => {
        if (U > shortPutK) return 0;
        else return -((shortPutK - U) * cSize * pSize);
    };
    const shortCallValue = () => {
        if (U < shortCallK) return 0;
        else return -((U - shortCallK) * cSize * pSize);
    };
    const longCallValue = () => {
        if (U < longCallK) return 0;
        else return (U - longCallK) * cSize * pSize;
    };

    const longPutProfitLoss = longPutValue() + initialLongPutCF;
    const shortPutProfitLoss = shortPutValue() + initialShortPutCF;
    const shortCallProfitLoss = shortCallValue() + initialShortCallCF;
    const longCallProfitLoss = longCallValue() + initialLongCallCF;

    const longPutLeg = {
        direction: "long",
        type: "put",
        strike: longPutK,
        size: pSize,
        initialPrice: longPutI,
        initialCF: initialLongPutCF,
        value: longPutValue(),
        profitLoss: longPutProfitLoss
    }
    const shortPutLeg = {
        direction: "short",
        type: "put",
        strike: shortPutK,
        size: pSize,
        initialPrice: shortPutI,
        initialCF: initialShortPutCF,
        value: shortPutValue(),
        profitLoss: shortPutProfitLoss
    }
    const shortCallLeg = {
        direction: "short",
        type: "call",
        strike: shortCallK,
        size: pSize,
        initialPrice: shortCallI,
        initialCF: initialShortCallCF,
        value: shortCallValue(),
        profitLoss: shortCallProfitLoss
    }
    const longCallLeg = {
        direction: "long",
        type: "call",
        strike: longCallK,
        size: pSize,
        initialPrice: longCallI,
        initialCF: initialLongCallCF,
        value: longCallValue(),
        profitLoss: longCallProfitLoss
    }

    res.send({
        longPutLeg,
        shortPutLeg,
        shortCallLeg,
        longCallLeg,
        initialCF: initialLongPutCF + initialShortPutCF + initialShortCallCF + initialLongCallCF,
        value: longPutValue() + shortPutValue() + shortCallValue() + longCallValue(),
        profitLoss: longPutProfitLoss + shortPutProfitLoss + shortCallProfitLoss + longCallProfitLoss
    })
}

function collar(req, res) {

    function validateRequest(request) {
        
        const schema = Joi.object({
            stockInitialPrice: Joi.number().required(),
            shareSize: Joi.number().required(),                         // Number of shares being held 
            longPutStrikePrice: Joi.number().required(),
            longPutPremiumPrice: Joi.number().required(),
            shortCallStrikePrice: Joi.number().required(),              // Strike price of the short call
            shortCallPremiumPrice: Joi.number().required(),             // Premium price of the short call
            underlyingPrice: Joi.number().required(),                   // Market price of the asset
            contractSize: Joi.number(),                                 // Number of shares a contract represents (Default: 100)
            positionSizeEachOptionType: Joi.number()                    // Number of contracts being held per Option Type (Default: 1)
        })

        return schema.validate(request);
    }

    const data = validateRequest(req.body);

    if (data.error) {
        res.status(400).send(data.error.details[0].message);
        return;
    }

    const stockI = req.body.stockInitialPrice
    const shareSize = req.body.shareSize
    const longPutK = req.body.longPutStrikePrice
    const longPutI = req.body.longPutPremiumPrice
    const shortCallK = req.body.shortCallStrikePrice
    const shortCallI = req.body.shortCallPremiumPrice
    const U = req.body.underlyingPrice
    const cSize = req.body.contractSize || 100
    const pSize = req.body.positionSizeEachOptionType || 1

    const initialStockCF = -(stockI * shareSize);
    const initialLongPutCF = -(longPutI * cSize * pSize);
    const initialShortCallCF = shortCallI * cSize * pSize;

    const stockValue = U * shareSize;
    const longPutValue = () => {
        if (U > longPutK) return 0;
        else return (longPutK - U) * cSize * pSize;
    };
    const shortCallValue = () => {
        if (U < shortCallK) return 0;
        else return -((U - shortCallK) * cSize * pSize);
    };

    const stockProfitLoss = stockValue + initialStockCF;
    const longPutProfitLoss = longPutValue() + initialLongPutCF;
    const shortCallProfitLoss = shortCallValue() + initialShortCallCF;

    const stockLeg = {
        direction: "long",
        type: "stock",
        size: shareSize,
        initialPrice: stockI,
        initialCF: initialStockCF,
        value: stockValue,
        profitLoss: stockProfitLoss
    }
    const longPutLeg = {
        direction: "long",
        type: "put",
        strike: longPutK,
        size: pSize,
        initialPrice: longPutI,
        initialCF: initialLongPutCF,
        value: longPutValue(),
        profitLoss: longPutProfitLoss
    }
    const shortCallLeg = {
        direction: "short",
        type: "call",
        strike: shortCallK,
        size: pSize,
        initialPrice: shortCallI,
        initialCF: initialShortCallCF,
        value: shortCallValue(),
        profitLoss: shortCallProfitLoss
    }

    res.send({
        stockLeg,
        longPutLeg,
        shortCallLeg,
        initialCF: initialStockCF + initialLongPutCF + initialShortCallCF,
        value: stockValue + longPutValue() + shortCallValue(),
        profitLoss: stockProfitLoss + longPutProfitLoss + shortCallProfitLoss
    })
}


module.exports = {
    longStraddle,
    longStrangle,
    shortStraddle,
    shortStrangle,
    ironCondor,
    ironButterfly,
    collar
}