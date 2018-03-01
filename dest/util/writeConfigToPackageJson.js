"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const fs = require("fs");
const spinner_1 = require("../util/spinner");
const Log = require("../util/log");
const configManager_1 = require("./configManager");
function writeConfigToPackageJson(configType, isOverride) {
    const spinner = spinner_1.default('正在写入配置');
    try {
        writeJestConfigToPackageJson(configType, isOverride);
        writeNpmScriptConfigToPackageJson(configType);
        writeHuskyConfigToPackageJson(configType);
        writeCommitizenConfigToPackageJson(configType, isOverride);
    }
    catch (e) {
        spinner.hide();
        const err = e;
        Log.error(err.message);
        Log.error(err.stack);
        Log.error('写入配置失败');
        throw new Error(e);
    }
    spinner.hide();
    Log.info('写入配置成功');
}
exports.default = writeConfigToPackageJson;
function writeJestConfigToPackageJson(configType, isOverride) {
    const packageJson = readPackageJson();
    if (!isConfigExist(packageJson, 'jest') || isOverride) {
        packageJson.jest = configManager_1.importConfig(configType, 'jest');
    }
    writePackageJson(packageJson);
}
function writeNpmScriptConfigToPackageJson(configType) {
    const packageJson = readPackageJson();
    const npmScriptConfig = configManager_1.importConfig(configType, 'npmScript');
    packageJson.scripts = Object.assign(packageJson.scripts, npmScriptConfig);
    writePackageJson(packageJson);
}
function writeHuskyConfigToPackageJson(configType) {
    const packageJson = readPackageJson();
    const huskyConfig = configManager_1.importConfig(configType, 'husky');
    packageJson.scripts = Object.assign(packageJson.scripts, huskyConfig);
    writePackageJson(packageJson);
}
function writeCommitizenConfigToPackageJson(configType, isOverride) {
    const packageJson = readPackageJson();
    if (!isConfigExist(packageJson, 'config') || isOverride) {
        packageJson.config = configManager_1.importConfig(configType, 'commitizen');
    }
    writePackageJson(packageJson);
}
function isConfigExist(packageJson, configName) {
    return packageJson[configName] !== undefined;
}
function readPackageJson() {
    const packageJsonPath = getPackageJsonPath();
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
}
exports.readPackageJson = readPackageJson;
function writePackageJson(packageJson) {
    const packageJsonPath = getPackageJsonPath();
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4), 'utf8');
}
function getPackageJsonPath() {
    return Path.resolve('package.json');
}
