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
const spinner_1 = require("./spinner");
const Log = require("./log");
const configManager_1 = require("./configManager");
const writeConfigToPackageJson_1 = require("./writeConfigToPackageJson");
var EError;
(function (EError) {
    EError["installNpmDependencyFailed"] = "install npm dependency failed";
    EError["installGitDependencyFailed"] = "install git dependency failed";
})(EError || (EError = {}));
function installDependencies(configType, isOverride) {
    return __awaiter(this, void 0, void 0, function* () {
        const npmDependenciesSpinner = spinner_1.default('正在安装npm依赖');
        const packageJson = writeConfigToPackageJson_1.readPackageJson();
        const npmDependenciesConfig = configManager_1.importConfig(configType, 'npmDependencies');
        for (let i = 0; i < npmDependenciesConfig.length; i++) {
            const { dependencyName, version } = npmDependenciesConfig[i];
            let moduleName = '';
            if (!version) {
                moduleName = dependencyName;
            }
            else {
                moduleName = `${dependencyName}@${version}`;
            }
            try {
                if (!isDependencyExist(packageJson, dependencyName) || isOverride) {
                    yield Execa('npm', ['install', '--save', moduleName]);
                    Log.debug(`安装npm依赖${dependencyName}成功`);
                }
            }
            catch (e) {
                npmDependenciesSpinner.hide();
                const err = e;
                Log.error(err.message);
                Log.error(err.stack);
                Log.error(`安装npm依赖${dependencyName}失败`);
                throw new Error(EError.installNpmDependencyFailed);
            }
        }
        npmDependenciesSpinner.hide();
        Log.info('安装npm依赖成功');
        const gitDependenciesSpinner = spinner_1.default('正在安装git依赖');
        const gitDependenciesConfig = configManager_1.importConfig(configType, 'gitDependencies');
        for (let i = 0; i < gitDependenciesConfig.length; i++) {
            const { dependencyName, gitUrl } = gitDependenciesConfig[i];
            try {
                if (!isDependencyExist(packageJson, dependencyName) || isOverride) {
                    yield Execa('npm', ['install', '--save', gitUrl]);
                    Log.debug(`安装git依赖${dependencyName}成功`);
                }
            }
            catch (e) {
                gitDependenciesSpinner.hide();
                const err = e;
                Log.error(err.message);
                Log.error(err.stack);
                Log.error(`安装git依赖${dependencyName}失败`);
                throw new Error(EError.installGitDependencyFailed);
            }
        }
        gitDependenciesSpinner.hide();
        Log.info('安装git依赖成功');
    });
}
exports.default = installDependencies;
function isDependencyExist(packageJson, dependencyName) {
    return packageJson.dependencies && packageJson.dependencies[dependencyName] !== undefined;
}
