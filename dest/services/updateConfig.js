"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const configVersion_1 = require("../model/configVersion");
const Log = require("../util/log");
const spinner_1 = require("../util/spinner");
const fs = require("fs");
const Path = require("path");
const chalk_1 = require("chalk");
function updateConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = spinner_1.default('更新配置文件中');
        const remoteConfigVersion = yield configVersion_1.getRemoteConfigVersion();
        if (!canUpdateConfig(remoteConfigVersion)) {
            spinner.hide();
            Log.error(chalk_1.default.red('本地配置文件和服务器配置文件不匹配，请重新安装frn-cli！'));
            process.exit(1);
        }
        if (!needUpdateConfig(remoteConfigVersion)) {
            return;
        }
        const updateConfigList = getUpdateConfigList(remoteConfigVersion);
        for (let i = 0; i < updateConfigList.length; i++) {
            const configName = updateConfigList[i];
            yield updateConfigItem(configName);
        }
        updateConfigVersion(JSON.stringify(remoteConfigVersion));
        spinner.hide();
        Log.fatal('更新成功！');
    });
}
exports.default = updateConfig;
function canUpdateConfig(remoteConfigVersion) {
    const localConfigVersion = getLocalConfigVersion();
    if (Object.keys(localConfigVersion).length !== Object.keys(remoteConfigVersion).length) {
        return false;
    }
    return Object.keys(localConfigVersion).every((configName) => {
        return remoteConfigVersion[configName] !== undefined;
    });
}
function needUpdateConfig(remoteConfigVersion) {
    const localConfigVersion = getLocalConfigVersion();
    return Object.keys(localConfigVersion).some((configName) => {
        const localVersion = localConfigVersion[configName];
        const remoteVersion = remoteConfigVersion[configName];
        return remoteVersion > localVersion;
    });
}
function getLocalConfigVersion() {
    const localConfigVersion = fs.readFileSync('../../configVersion.json', 'utf8');
    return JSON.parse(localConfigVersion);
}
function getUpdateConfigList(remoteConfigVersion) {
    const localConfigVersion = getLocalConfigVersion();
    return Object.keys(localConfigVersion).filter((configName) => {
        const localVersion = localConfigVersion[configName];
        const remoteVersion = remoteConfigVersion[configName];
        return remoteVersion > localVersion;
    });
}
function updateConfigItem(configName) {
    return __awaiter(this, void 0, void 0, function* () {
        const remoteConfig = yield configVersion_1.getRemoteConfig(configName);
        writeRemoteConfig(configName, remoteConfig);
    });
}
function writeRemoteConfig(configName, remoteConfig) {
    const configPath = Path.resolve(__dirname, '../../config', `${configName}.json`);
    fs.writeFileSync(configPath, remoteConfig, 'utf8');
}
function updateConfigVersion(remoteConfigVersion) {
    const configVersionPath = Path.resolve(__dirname, '../../configVersion.json');
    fs.writeFileSync(configVersionPath, remoteConfigVersion, 'utf8');
}
