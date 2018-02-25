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
const configManager_1 = require("../util/configManager");
const Log = require("../util/log");
const spinner_1 = require("../util/spinner");
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
        const updateConfigVersionList = getUpdateConfigList(remoteConfigVersion);
        const updateConfigVersionNameList = Object.keys(updateConfigVersionList);
        for (let i = 0; i < updateConfigVersionNameList.length; i++) {
            const updateConfigVersionName = updateConfigVersionNameList[i];
            const updateConfigList = updateConfigVersionList[updateConfigVersionName];
            for (let j = 0; j < updateConfigList.length; j++) {
                const configName = updateConfigList[j];
                yield updateConfigItem(updateConfigVersionName, configName);
            }
        }
        configManager_1.updateConfigVersion(JSON.stringify(remoteConfigVersion));
        spinner.hide();
        Log.fatal('更新成功！');
    });
}
exports.default = updateConfig;
function canUpdateConfig(remoteConfigVersion) {
    const localConfigVersion = configManager_1.getLocalConfigVersion();
    if (Object.keys(localConfigVersion).length !== Object.keys(remoteConfigVersion).length) {
        return false;
    }
    return Object.keys(localConfigVersion).every((configVersionName) => {
        const localConfigVersionItem = localConfigVersion[configVersionName];
        const remoteConfigVersionItem = remoteConfigVersion[configVersionName];
        if (!remoteConfigVersionItem) {
            return false;
        }
        if (Object.keys(localConfigVersionItem).length !== Object.keys(remoteConfigVersionItem).length) {
            return false;
        }
        return Object.keys(localConfigVersionItem).every((configName) => {
            return remoteConfigVersionItem[configName] !== undefined;
        });
    });
}
function needUpdateConfig(remoteConfigVersion) {
    const localConfigVersion = configManager_1.getLocalConfigVersion();
    return Object.keys(localConfigVersion).some((configVersionName) => {
        const localConfigVersionItem = localConfigVersion[configVersionName];
        const remoteConfigVersionItem = remoteConfigVersion[configVersionName];
        return Object.keys(localConfigVersionItem).some((configName) => {
            const localVersion = localConfigVersionItem[configName];
            const remoteVersion = remoteConfigVersionItem[configName];
            return remoteVersion > localVersion;
        });
    });
}
function getUpdateConfigList(remoteConfigVersion) {
    const localConfigVersion = configManager_1.getLocalConfigVersion();
    const updateConfigVersionList = {};
    Object.keys(localConfigVersion).forEach((configVersionName) => {
        const localConfigVersionItem = localConfigVersion[configVersionName];
        const remoteConfigVersionItem = remoteConfigVersion[configVersionName];
        const updateConfigList = Object.keys(localConfigVersionItem).filter((configName) => {
            const localVersion = localConfigVersionItem[configName];
            const remoteVersion = remoteConfigVersionItem[configName];
            return remoteVersion > localVersion;
        });
        updateConfigVersionList[configVersionName] = updateConfigList;
    });
    return updateConfigVersionList;
}
function updateConfigItem(configType, configName) {
    return __awaiter(this, void 0, void 0, function* () {
        const remoteConfig = yield configVersion_1.getRemoteConfig(configType, configName);
        configManager_1.updateConfig(configType, configName, remoteConfig);
    });
}
