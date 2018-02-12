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
const cli_spinner_1 = require("cli-spinner");
const mkdirp = require("mkdirp");
const logError_1 = require("../util/logError");
const file_1 = require("../config/file");
const dir_1 = require("../config/dir");
const dependencies_1 = require("../config/dependencies");
const devDependencies_1 = require("../config/devDependencies");
function initProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(process.cwd());
        yield Execa('cd', [projectName]);
        console.log(process.cwd());
        return;
        yield initCrnProject(projectName);
        copyFiles(projectName);
        mkdir(projectName);
        enterProject(projectName);
        installDependencies();
        installDevDependencies();
    });
}
exports.default = initProject;
function createSpinner(text) {
    const spinner = new cli_spinner_1.Spinner(`${text} %s`);
    spinner.setSpinnerString('|/-\\');
    return spinner;
}
function initCrnProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = createSpinner('创建crn项目中...');
        try {
            spinner.start();
            yield Execa('crn-cli', ['init', projectName]);
            spinner.stop(true);
        }
        catch (e) {
            spinner.stop(true);
            logError_1.default(e.message);
            process.exit(1);
        }
    });
}
function copyFiles(projectName) {
    const spinner = createSpinner('拷贝文件中...');
    spinner.start();
    file_1.default.forEach((config) => {
        const { fileName, targetPath, sourcePath } = config;
        try {
            copyFile(Path.resolve('../config', sourcePath), Path.resolve(process.cwd(), projectName, targetPath));
            console.log(`拷贝${fileName}成功！`);
        }
        catch (e) {
            logError_1.default(e.message);
            process.exit(1);
        }
    });
    spinner.stop();
}
function copyFile(sourcePath, targetPath) {
    fs.writeFileSync(targetPath, fs.readFileSync(sourcePath, 'utf8'), 'utf8');
}
function mkdir(projectName) {
    const spinner = createSpinner('创建目录结构中...');
    spinner.start();
    dir_1.default.forEach((config) => {
        const { directoryName, directoryBasePath } = config;
        try {
            mkdirp.sync(Path.resolve(process.cwd(), projectName, directoryBasePath, directoryName));
        }
        catch (e) {
            logError_1.default(e.message);
            process.exit(1);
        }
    });
    spinner.stop();
}
function enterProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Execa('cd', [projectName]);
        }
        catch (e) {
            logError_1.default(e.message);
            process.exit(1);
        }
    });
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
            const spinner = createSpinner(`正在安装npm依赖${dependencyName}...`);
            try {
                spinner.start();
                yield Execa('npm', ['install', '--save', moduleName]);
                spinner.stop(true);
            }
            catch (e) {
                spinner.stop(true);
                logError_1.default(e.message);
                process.exit(1);
            }
        }
        for (let i = 0; i < dependencies_1.gitDependenciesConfig.length; i++) {
            const { dependencyName, gitUrl } = dependencies_1.gitDependenciesConfig[i];
            const spinner = createSpinner(`正在安装git依赖${dependencyName}...`);
            try {
                spinner.start();
                yield Execa('npm', ['install', '--save', gitUrl]);
                spinner.stop(true);
            }
            catch (e) {
                spinner.stop(true);
                logError_1.default(e.message);
                process.exit(1);
            }
        }
    });
}
function installDevDependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < devDependencies_1.default.length; i++) {
            const { dependencyName } = devDependencies_1.default[i];
            const spinner = createSpinner(`正在安装开发依赖${dependencyName}...`);
            try {
                spinner.start();
                yield Execa('npm', ['install', '--save-dev', dependencyName]);
                spinner.stop();
            }
            catch (e) {
                spinner.stop();
                logError_1.default(e.message);
                process.exit(1);
            }
        }
    });
}
function writeJestConfigToPackageJson() {
}
