"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Path = require("path");
function importConfig(configName) {
    const configPath = Path.resolve(__dirname, '../../config', `${configName}.json`);
    const configContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configContent);
}
exports.default = importConfig;
