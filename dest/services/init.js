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
const chalk_1 = require("chalk");
const spinner_1 = require("../util/spinner");
const Log = require("../util/log");
const importConfig_1 = require("../util/importConfig");
const TAOBAO_REGISTRY = 'https://registry.npm.taobao.org';
function initProject(projectName, isNodeProject, isUseTaobaoRegistry, isVerbose, isSilent) {
    return __awaiter(this, void 0, void 0, function* () {
        let originalRegistry = '';
        if (isUseTaobaoRegistry) {
            originalRegistry = yield getNpmRegistry();
            setNpmRegistry(TAOBAO_REGISTRY);
        }
        try {
            Log.setLogLevel(getLogLevel(isVerbose, isSilent));
            let configType;
            if (isNodeProject) {
                configType = importConfig_1.EConfigType.node;
            }
            else {
                configType = importConfig_1.EConfigType.crn;
            }
            if (isNodeProject) {
                yield initNodeProject(projectName);
            }
            else {
                yield checkCrnCli();
                yield initCrnProject(projectName);
            }
            enterProject(projectName);
            copyFiles(configType);
            mkdir(configType);
            yield installDependencies(configType);
            yield installDevDependencies(configType);
            writeConfigToPackageJson(configType);
            if (isUseTaobaoRegistry) {
                yield setNpmRegistry(originalRegistry);
            }
            Log.fatal('安装成功');
        }
        catch (e) {
            if (isUseTaobaoRegistry) {
                yield setNpmRegistry(originalRegistry);
            }
            const err = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.fatal('安装失败');
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
function checkCrnCli() {
    return __awaiter(this, void 0, void 0, function* () {
        const crnCliUrl = 'http://crn.site.ctripcorp.com/';
        try {
            yield Execa('which', ['crn-cli']);
        }
        catch (e) {
            console.log(`请先安装${chalk_1.default.red('crn-cli')}，安装教程：${chalk_1.default.blueBright.underline(crnCliUrl)}`);
            process.exit(1);
        }
    });
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
function initNodeProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = spinner_1.default('创建nodejs项目中');
        try {
            mkdirp.sync(Path.resolve(projectName));
            process.chdir(Path.resolve(projectName));
            yield Execa('npm', ['init', '--yes']);
            process.chdir(Path.resolve('../'));
            spinner.hide();
            Log.info('创建nodejs项目成功');
        }
        catch (e) {
            spinner.hide();
            ;
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
function copyFiles(configType) {
    const spinner = spinner_1.default('拷贝文件中');
    const fileConfig = importConfig_1.default(configType, 'file');
    fileConfig.forEach((config) => {
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
function mkdir(configType) {
    const spinner = spinner_1.default('创建目录结构中');
    const dirConfig = importConfig_1.default(configType, 'dir');
    dirConfig.forEach((config) => {
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
function installDependencies(configType) {
    return __awaiter(this, void 0, void 0, function* () {
        const npmDependenciesSpinner = spinner_1.default('正在安装npm依赖');
        const npmDependenciesConfig = importConfig_1.default(configType, 'npmDependencies');
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
        const gitDependenciesConfig = importConfig_1.default(configType, 'gitDependencies');
        for (let i = 0; i < gitDependenciesConfig.length; i++) {
            const { dependencyName, gitUrl } = gitDependenciesConfig[i];
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
function installDevDependencies(configType) {
    return __awaiter(this, void 0, void 0, function* () {
        const spinner = spinner_1.default('正在安装npm开发依赖');
        const devDependenciesConfig = importConfig_1.default(configType, 'devDependencies');
        for (let i = 0; i < devDependenciesConfig.length; i++) {
            const { dependencyName } = devDependenciesConfig[i];
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
function writeConfigToPackageJson(configType) {
    const spinner = spinner_1.default('正在写入配置');
    try {
        writeJestConfigToPackageJson(configType);
        writeNpmScriptConfigToPackageJson(configType);
        writeHuskyConfigToPackageJson(configType);
        writeCommitizenConfigToPackageJson(configType);
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
function writeJestConfigToPackageJson(configType) {
    const packageJson = readPackageJson();
    const jestConfig = importConfig_1.default(configType, 'jest');
    packageJson.jest = jestConfig;
    writePackageJson(packageJson);
}
function writeNpmScriptConfigToPackageJson(configType) {
    const packageJson = readPackageJson();
    const npmScriptConfig = importConfig_1.default(configType, 'npmScript');
    packageJson.scripts = Object.assign(packageJson.scripts, npmScriptConfig);
    writePackageJson(packageJson);
}
function writeHuskyConfigToPackageJson(configType) {
    const packageJson = readPackageJson();
    const huskyConfig = importConfig_1.default(configType, 'husky');
    packageJson.scripts = Object.assign(packageJson.scripts, huskyConfig);
    writePackageJson(packageJson);
}
function writeCommitizenConfigToPackageJson(configType) {
    const packageJson = readPackageJson();
    packageJson.config = importConfig_1.default(configType, 'commitizen');
    writePackageJson(packageJson);
}
function readPackageJson() {
    const packageJsonPath = getPackageJsonPath();
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
}
function writePackageJson(packageJson) {
    const packageJsonPath = getPackageJsonPath();
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4), 'utf8');
}
function getPackageJsonPath() {
    return Path.resolve(process.cwd(), 'package.json');
}
