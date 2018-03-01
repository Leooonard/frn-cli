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
    EError["installDevDependencyFailed"] = "install devDependency failed";
})(EError || (EError = {}));
function installDevDependencies(configType, isOverride) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = spinner_1.default('正在安装npm开发依赖');
        const packageJson = writeConfigToPackageJson_1.readPackageJson();
        const devDependenciesConfig = configManager_1.importConfig(configType, 'devDependencies');
        for (let i = 0; i < devDependenciesConfig.length; i++) {
            const { dependencyName } = devDependenciesConfig[i];
            try {
                if (!isDevDependencyExist(packageJson, dependencyName) || isOverride) {
                    yield Execa('npm', ['install', '--save-dev', dependencyName]);
                    Log.debug(`安装npm开发依赖${dependencyName}成功`);
                }
            }
            catch (e) {
                spinner.hide();
                const err = e;
                Log.error(err.message);
                Log.error(err.stack);
                Log.error(`安装npm开发依赖${dependencyName}失败`);
                throw new Error(EError.installDevDependencyFailed);
            }
        }
        spinner.hide();
        Log.info('安装npm开发依赖成功');
    });
}
exports.default = installDevDependencies;
function isDevDependencyExist(packageJson, dependencyName) {
    return packageJson.devDependencies && packageJson.devDependencies[dependencyName] !== undefined;
}
