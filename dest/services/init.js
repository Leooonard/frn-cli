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
const Log = require("../util/log");
const file_1 = require("../config/file");
const dir_1 = require("../config/dir");
const dependencies_1 = require("../config/dependencies");
const devDependencies_1 = require("../config/devDependencies");
const jest_1 = require("../config/jest");
const npmScript_1 = require("../config/npmScript");
const husky_1 = require("../config/husky");
const commitizen_1 = require("../config/commitizen");
function initProject(projectName, isVerbose, isSilent) {
    return __awaiter(this, void 0, void 0, function* () {
        Log.setLogLevel(getLogLevel(isVerbose, isSilent));
        yield initCrnProject(projectName);
        enterProject(projectName);
        copyFiles();
        mkdir();
        yield installDependencies();
        yield installDevDependencies();
        writeConfigToPackageJson();
        Log.fatal('安装成功');
    });
}
exports.default = initProject;
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
function initCrnProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = spinner_1.default('创建crn项目中');
        try {
            yield Execa('crn-cli', ['init', projectName]);
            spinner.hide();
            Log.info('创建crn项目成功');
        }
        catch (e) {
            spinner.hide();
            const err = e;
            Log.error(err.message);
            Log.error(err.stack);
            process.exit(1);
        }
    });
}
function enterProject(projectName) {
    process.chdir(Path.resolve(`./${projectName}`));
}
function copyFiles() {
    const spinner = spinner_1.default('拷贝文件中');
    file_1.default.forEach((config) => {
        const { fileName, targetPath, sourcePath } = config;
        try {
            copyFile(Path.resolve(__dirname, '../config', sourcePath), Path.resolve(process.cwd(), targetPath));
            Log.debug(`拷贝${fileName}成功！`);
        }
        catch (e) {
            spinner.hide();
            const err = e;
            Log.error(err.message);
            Log.error(err.stack);
            process.exit(1);
        }
    });
    spinner.hide();
    Log.info('拷贝文件成功');
}
function copyFile(sourcePath, targetPath) {
    fs.writeFileSync(targetPath, fs.readFileSync(sourcePath, 'utf8'), 'utf8');
}
function mkdir() {
    const spinner = spinner_1.default('创建目录结构中');
    dir_1.default.forEach((config) => {
        const { directoryName, directoryBasePath } = config;
        try {
            mkdirp.sync(Path.resolve(process.cwd(), directoryBasePath, directoryName));
        }
        catch (e) {
            spinner.hide();
            const err = e;
            Log.error(err.message);
            Log.error(err.stack);
            process.exit(1);
        }
    });
    spinner.hide();
    Log.info('创建目录结构成功');
}
function installDependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        const npmDependenciesSpinner = spinner_1.default('正在安装npm依赖');
        for (let i = 0; i < dependencies_1.npmDependenciesConfig.length; i++) {
            const { dependencyName, version } = dependencies_1.npmDependenciesConfig[i];
            let moduleName = '';
            if (!version) {
                moduleName = dependencyName;
            }
            else {
                moduleName = `${dependencyName}@${version}`;
            }
            try {
                yield Execa('npm', ['install', '--save', moduleName]);
                Log.debug(`安装npm依赖${dependencyName}成功`);
            }
            catch (e) {
                npmDependenciesSpinner.hide();
                const err = e;
                Log.error(err.message);
                Log.error(err.stack);
                process.exit(1);
            }
        }
        npmDependenciesSpinner.hide();
        Log.info('安装npm依赖成功');
        const gitDependenciesSpinner = spinner_1.default('正在安装git依赖');
        for (let i = 0; i < dependencies_1.gitDependenciesConfig.length; i++) {
            const { dependencyName, gitUrl } = dependencies_1.gitDependenciesConfig[i];
            try {
                yield Execa('npm', ['install', '--save', gitUrl]);
                Log.debug(`安装git依赖${dependencyName}成功`);
            }
            catch (e) {
                gitDependenciesSpinner.hide();
                const err = e;
                Log.error(err.message);
                Log.error(err.stack);
                process.exit(1);
            }
        }
        gitDependenciesSpinner.hide();
        Log.info('安装git依赖成功');
    });
}
function installDevDependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = spinner_1.default('正在安装npm开发依赖');
        for (let i = 0; i < devDependencies_1.default.length; i++) {
            const { dependencyName } = devDependencies_1.default[i];
            try {
                yield Execa('npm', ['install', '--save-dev', dependencyName]);
                Log.debug(`安装npm开发依赖${dependencyName}成功`);
            }
            catch (e) {
                spinner.hide();
                const err = e;
                Log.error(err.message);
                Log.error(err.stack);
                process.exit(1);
            }
        }
        spinner.hide();
        Log.info('安装npm开发依赖成功');
    });
}
function writeConfigToPackageJson() {
    const spinner = spinner_1.default('正在写入配置');
    try {
        writeJestConfigToPackageJson();
        writeNpmScriptConfigToPackageJson();
        writeHuskyConfigToPackageJson();
        writeCommitizenConfigToPackageJson();
    }
    catch (e) {
        spinner.hide();
        const err = e;
        Log.error(err.message);
        Log.error(err.stack);
        process.exit(1);
    }
    spinner.hide();
    Log.info('写入配置成功');
}
function writeJestConfigToPackageJson() {
    const packageJson = readPackageJson();
    packageJson.jest = jest_1.default;
    writePackageJson(packageJson);
}
function writeNpmScriptConfigToPackageJson() {
    const packageJson = readPackageJson();
    packageJson.scripts = Object.assign(packageJson.scripts, npmScript_1.default);
    writePackageJson(packageJson);
}
function writeHuskyConfigToPackageJson() {
    const packageJson = readPackageJson();
    packageJson.scripts = Object.assign(packageJson.scripts, husky_1.default);
    writePackageJson(packageJson);
}
function writeCommitizenConfigToPackageJson() {
    const packageJson = readPackageJson();
    packageJson.config = commitizen_1.default;
    writePackageJson(packageJson);
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
