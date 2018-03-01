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
const Execa = require("execa");
const Path = require("path");
const Log = require("../util/log");
const configManager_1 = require("../util/configManager");
const createProject_1 = require("../util/createProject");
const copyFiles_1 = require("../util/copyFiles");
const mkdir_1 = require("../util/mkdir");
const writeConfigToPackageJson_1 = require("../util/writeConfigToPackageJson");
const installDependencies_1 = require("../util/installDependencies");
const installDevDependencies_1 = require("../util/installDevDependencies");
const TAOBAO_REGISTRY = 'https://registry.npm.taobao.org';
function initProject(projectName, isNpmProject, isUseTaobaoRegistry, isVerbose, isSilent, isExist, isRedux, isOverride) {
    return __awaiter(this, void 0, void 0, function* () {
        // 设置log等级。
        Log.setLogLevel(getLogLevel(isVerbose, isSilent));
        // 设置npm源。
        let originalRegistry = '';
        if (isUseTaobaoRegistry) {
            originalRegistry = yield getNpmRegistry();
            setNpmRegistry(TAOBAO_REGISTRY);
        }
        let configType;
        if (isNpmProject) {
            configType = configManager_1.EConfigType.node;
        }
        else {
            configType = configManager_1.EConfigType.crn;
        }
        try {
            yield createProject_1.default(projectName, isExist, isNpmProject);
            enterProject(projectName);
            copyFiles_1.default(configType, isOverride);
            mkdir_1.default(configType, isRedux);
            yield installDependencies_1.default(configType, isOverride);
            yield installDevDependencies_1.default(configType, isOverride);
            writeConfigToPackageJson_1.default(configType, isOverride);
            Log.fatal('安装成功');
        }
        catch (e) {
            Log.fatal('安装失败');
        }
        finally {
            if (isUseTaobaoRegistry) {
                yield setNpmRegistry(originalRegistry);
            }
        }
    });
}
exports.default = initProject;
function getNpmRegistry() {
    return __awaiter(this, void 0, void 0, function* () {
        return Execa('npm', ['config', 'get', 'registry']).then((result) => {
            return result.stdout;
        });
    });
}
function setNpmRegistry(registry) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Execa('npm', ['config', 'set', 'registry', registry]);
    });
}
function getLogLevel(isVerbose, isSilent) {
    if (isVerbose) {
        return Log.ELogLevel.verbose;
    }
    else if (isSilent) {
        return Log.ELogLevel.silent;
    }
    else {
        return Log.ELogLevel.default;
    }
}
function enterProject(projectName) {
    process.chdir(Path.resolve(projectName));
}
