"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
function logError(errorMessage) {
    chalk_1.default.red.bold(errorMessage);
}
exports.default = logError;
