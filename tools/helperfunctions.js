const { erf } = require('mathjs');

const helperfunctions = {

    cdf: (x, mean, standardDeviation) => {
        if (mean == null) mean = 0;
        if (standardDeviation == null) standardDeviation = 1;
        
        return (1 - erf((mean - x ) / (Math.sqrt(2) * standardDeviation))) / 2
    }

}

module.exports = helperfunctions