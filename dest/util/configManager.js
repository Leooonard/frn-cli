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
function updateConfig(configType, configName, configContent) {
    const configPath = Path.resolve(__dirname, '../../config', configType, `${configName}.json`);
    fs.writeFileSync(configPath, configContent, 'utf8');
}
exports.updateConfig = updateConfig;
function updateConfigVersion(remoteConfigVersion) {
    const configVersionPath = Path.resolve(__dirname, '../../configVersion.json');
    fs.writeFileSync(configVersionPath, remoteConfigVersion, 'utf8');
}
exports.updateConfigVersion = updateConfigVersion;
function getLocalConfigVersion() {
    const localConfigVersion = fs.readFileSync('../../configVersion.json', 'utf8');
    return JSON.parse(localConfigVersion);
}
exports.getLocalConfigVersion = getLocalConfigVersion;
