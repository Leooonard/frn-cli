"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
function logError(e) {
    console.log('\n', chalk_1.default.red.bold(e.message));
    console.log('\n', chalk_1.default.red(e.stack || ''));
}
exports.default = logError;
