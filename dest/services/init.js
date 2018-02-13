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
const fs = require("fs");
const mkdirp = require("mkdirp");
const spinner_1 = require("../util/spinner");
const logError_1 = require("../util/logError");
const file_1 = require("../config/file");
const dir_1 = require("../config/dir");
const dependencies_1 = require("../config/dependencies");
const devDependencies_1 = require("../config/devDependencies");
const jest_1 = require("../config/jest");
const npmScript_1 = require("../config/npmScript");
const husky_1 = require("../config/husky");
const commitizen_1 = require("../config/commitizen");
function initProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield initCrnProject(projectName);
        enterProject(projectName);
        copyFiles();
        mkdir();
        yield installDependencies();
        yield installDevDependencies();
        writeConfigToPackageJson();
        console.log('安装成功！');
    });
}
exports.default = initProject;
function initCrnProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        spinner_1.showSpinner('创建crn项目中');
        try {
            yield Execa('crn-cli', ['init', projectName]);
            spinner_1.hideSpinner();
        }
        catch (e) {
            spinner_1.hideSpinner();
            logError_1.default(e);
            process.exit(1);
        }
    });
}
function enterProject(projectName) {
    process.chdir(Path.resolve(`./${projectName}`));
}
function copyFiles() {
    spinner_1.showSpinner('拷贝文件中');
    file_1.default.forEach((config) => {
        const { fileName, targetPath, sourcePath } = config;
        try {
            copyFile(Path.resolve(__dirname, '../config', sourcePath), Path.resolve(process.cwd(), targetPath));
            console.log(`拷贝${fileName}成功！`);
        }
        catch (e) {
            spinner_1.hideSpinner();
            logError_1.default(e);
            process.exit(1);
        }
    });
    spinner_1.hideSpinner();
}
function copyFile(sourcePath, targetPath) {
    fs.writeFileSync(targetPath, fs.readFileSync(sourcePath, 'utf8'), 'utf8');
}
function mkdir() {
    spinner_1.showSpinner('创建目录结构中');
    dir_1.default.forEach((config) => {
        const { directoryName, directoryBasePath } = config;
        try {
            mkdirp.sync(Path.resolve(process.cwd(), directoryBasePath, directoryName));
        }
        catch (e) {
            spinner_1.hideSpinner();
            logError_1.default(e);
            process.exit(1);
        }
    });
    spinner_1.hideSpinner();
}
function installDependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < dependencies_1.npmDependenciesConfig.length; i++) {
            const { dependencyName, version } = dependencies_1.npmDependenciesConfig[i];
            let moduleName = '';
            if (!version) {
                moduleName = dependencyName;
            }
            else {
                moduleName = `${dependencyName}@${version}`;
            }
            spinner_1.showSpinner(`正在安装npm依赖${dependencyName}`);
            try {
                yield Execa('npm', ['install', '--save', moduleName]);
                spinner_1.hideSpinner();
            }
            catch (e) {
                spinner_1.hideSpinner();
                logError_1.default(e);
                process.exit(1);
            }
        }
        for (let i = 0; i < dependencies_1.gitDependenciesConfig.length; i++) {
            const { dependencyName, gitUrl } = dependencies_1.gitDependenciesConfig[i];
            spinner_1.showSpinner(`正在安装git依赖${dependencyName}`);
            try {
                yield Execa('npm', ['install', '--save', gitUrl]);
                spinner_1.hideSpinner();
            }
            catch (e) {
                spinner_1.hideSpinner();
                logError_1.default(e);
                process.exit(1);
            }
        }
    });
}
function installDevDependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < devDependencies_1.default.length; i++) {
            const { dependencyName } = devDependencies_1.default[i];
            spinner_1.showSpinner(`正在安装开发依赖${dependencyName}`);
            try {
                yield Execa('npm', ['install', '--save-dev', dependencyName]);
                spinner_1.hideSpinner();
            }
            catch (e) {
                spinner_1.hideSpinner();
                logError_1.default(e);
                process.exit(1);
            }
        }
    });
}
function writeConfigToPackageJson() {
    spinner_1.showSpinner(`正在写入配置`);
    writeJestConfigToPackageJson();
    writeNpmScriptConfigToPackageJson();
    writeHuskyConfigToPackageJson();
    writeCommitizenConfigToPackageJson();
    spinner_1.hideSpinner();
}
function writeJestConfigToPackageJson() {
    try {
        const packageJson = readPackageJson();
        packageJson.jest = jest_1.default;
        writePackageJson(packageJson);
    }
    catch (e) {
        logError_1.default(e);
        process.exit(1);
    }
}
function writeNpmScriptConfigToPackageJson() {
    try {
        const packageJson = readPackageJson();
        packageJson.scripts = Object.assign(packageJson.scripts, npmScript_1.default);
        writePackageJson(packageJson);
    }
    catch (e) {
        logError_1.default(e);
        process.exit(1);
    }
}
function writeHuskyConfigToPackageJson() {
    try {
        const packageJson = readPackageJson();
        packageJson.scripts = Object.assign(packageJson.scripts, husky_1.default);
        writePackageJson(packageJson);
    }
    catch (e) {
        logError_1.default(e);
        process.exit(1);
    }
}
function writeCommitizenConfigToPackageJson() {
    try {
        const packageJson = readPackageJson();
        packageJson.config = commitizen_1.default;
        writePackageJson(packageJson);
    }
    catch (e) {
        logError_1.default(e);
        process.exit(1);
    }
}
function readPackageJson() {
    const packageJsonPath = getPackageJsonPath();
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
}
function writePackageJson(packageJson) {
    const packageJsonPath = getPackageJsonPath();
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson), 'utf8');
}
function getPackageJsonPath() {
    return Path.resolve(process.cwd(), 'package.json');
}
