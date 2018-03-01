"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const mkdirp = require("mkdirp");
const spinner_1 = require("../util/spinner");
const Log = require("../util/log");
const configManager_1 = require("./configManager");
var EProjectType;
(function (EProjectType) {
    EProjectType["redux"] = "redux";
    EProjectType["react"] = "react";
    EProjectType["npm"] = "npm";
})(EProjectType || (EProjectType = {}));
var EError;
(function (EError) {
    EError["mkdirFailed"] = "mkdir failed";
})(EError || (EError = {}));
function mkdir(configType, isReduxProject = false) {
    if (configType === configManager_1.EConfigType.crn) {
        mkdirCrn(isReduxProject);
    }
    else {
        mkdirNpm();
    }
}
exports.default = mkdir;
function mkdirCrn(isReduxProject) {
    let projectType = getProjectType(isReduxProject);
    const spinner = spinner_1.default('创建CRN项目目录结构中');
    const dirConfig = configManager_1.importConfig(configManager_1.EConfigType.crn, 'dir');
    dirConfig.filter((config) => {
        const { supportProjectTypeList } = config;
        return isSupportProjectType(projectType, supportProjectTypeList);
    }).forEach((config) => {
        const { directoryName, directoryBasePath } = config;
        try {
            mkdirp.sync(Path.resolve(directoryBasePath, directoryName));
        }
        catch (e) {
            spinner.hide();
            const err = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error('创建CRN项目目录结构失败');
            throw new Error(EError.mkdirFailed);
        }
    });
    spinner.hide();
    Log.info('创建CRN项目目录结构成功');
}
function getProjectType(isReduxProject) {
    if (isReduxProject) {
        return EProjectType.redux;
    }
    else {
        return EProjectType.react;
    }
}
function isSupportProjectType(projectType, supportProjectTypeList) {
    // 如果支持列表为空，说明支持任意项目类型。
    if (supportProjectTypeList.length === 0) {
        return true;
    }
    return supportProjectTypeList.indexOf(projectType) > -1;
}
function mkdirNpm() {
    const spinner = spinner_1.default('创建npm项目目录结构中');
    const dirConfig = configManager_1.importConfig(configManager_1.EConfigType.node, 'dir');
    dirConfig.forEach((config) => {
        const { directoryName, directoryBasePath } = config;
        try {
            mkdirp.sync(Path.resolve(directoryBasePath, directoryName));
        }
        catch (e) {
            spinner.hide();
            const err = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error('创建npm项目目录结构失败');
            throw new Error(EError.mkdirFailed);
        }
    });
    spinner.hide();
    Log.info('创建npm项目目录结构成功');
}
