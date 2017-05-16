
// History decaying rate per step.
// This percentage of history data remain after a step.
exports.R = 0.99;

// Number of events needed for a condition statistics (a hypo) to be mature.
// After crossing this maturity border, hypo begins to being rewarded and/or
// punished, and to put into competition with other hypos for survival and
// mate.
exports.MATURITY = 10;
