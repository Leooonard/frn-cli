"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Path = require("path");
var EConfigType;
(function (EConfigType) {
    EConfigType["crn"] = "crn";
    EConfigType["node"] = "node";
})(EConfigType = exports.EConfigType || (exports.EConfigType = {}));
function importConfig(configType, configName) {
    const configPath = getConfigPath(configType, configName);
    const configContent = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(configContent);
}
exports.importConfig = importConfig;
function getConfigPath(configType, configName) {
    return Path.resolve(__dirname, '../../config', configType, `${configName}.json`);
}
