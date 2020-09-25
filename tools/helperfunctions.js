const { erf, max } = require('mathjs');

const helperfunctions = {

    cdf: (x, mean, standardDeviation) => {
        if (mean == null) mean = 0;
        if (standardDeviation == null) standardDeviation = 1;
        
        return (1 - erf((mean - x ) / (Math.sqrt(2) * standardDeviation))) / 2
    },

    getUnderlyingPriceTree: ({undPrice, steps, upMove, downMove}) => {

        var tree = [[undPrice]];
    
        for (let i=1; i <= steps; i++) {
            var step = [];
            var previousStep = tree[i-1];
    
            step.push(previousStep[0] * upMove);
    
            for (let i=0; i < previousStep.length; i++) {
                step.push(previousStep[i] * downMove)
            }
    
            tree.push(step);
        }
    
        return tree;
    },

    getOptionPriceTree: (underlyingPriceTree, {stepDiscount, optionType, isEuro, strike, upProb, downProb}) => {
    
        var tree = [];
        
        // Last step in Option Price Tree
        const lastStep = underlyingPriceTree[underlyingPriceTree.length-1];
        var nodes = [];
    
        for (let i=0; i < lastStep.length; i++) {
            const price = lastStep[i];
            
            if (optionType === "call") nodes.push(max(0, price-strike));
            if (optionType === "put") nodes.push(max(0, strike-price));
        }
    
        tree.push(nodes);
    
        // Remaining steps in Option Price Tree
        for (let i=0; i < underlyingPriceTree.length - 1; i++) {
            const step = tree[i];
            const undTreeStep = underlyingPriceTree[underlyingPriceTree.length-2-i]
            var nodes = [];
    
            for (let i=0; i < step.length-1; i++) {
                const upPrice = step[i];
                const downPrice = step[i+1];
                const undPrice = undTreeStep[i];
    
                const expectedValue = (upPrice * upProb + downPrice * downProb) * stepDiscount;
                const intrinsicValue = () => {
                    if (optionType === "call") return undPrice - strike;
                    if (optionType === "put") return strike - undPrice;
                }
    
                const price = isEuro ? expectedValue : max(expectedValue, intrinsicValue())
                
                nodes.push(price);
            }
    
            tree.push(nodes);
        }
    
        return tree.reverse();
    }

}

module.exports = helperfunctions