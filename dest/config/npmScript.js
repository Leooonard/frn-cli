"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    "test": "jest --coverage",
    "lint": "tslint -c tslint.json 'src/**/*.ts' || true",
    "tsdiagnosis": "tsc --noEmit || true",
    "check": "npm run lint && npm run tsdiagnosis"
};
