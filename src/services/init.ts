import * as Execa from 'execa';
import * as Path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import {
    showSpinner,
    hideSpinner
} from '../util/spinner';
import logError from '../util/logError';
import fileConfig from '../config/file';
import dirConfig from '../config/dir';
import {
    npmDependenciesConfig,
    gitDependenciesConfig
} from '../config/dependencies';
import devDependenciesConfig from '../config/devDependencies';
import jestConfig from '../config/jest';
import npmScriptConfig from '../config/npmScript';
import huskyConfig from '../config/husky';
import commitizenConfig from '../config/commitizen';

export default async function initProject(projectName: string) {
    await initCrnProject(projectName);
    enterProject(projectName);
    copyFiles();
    mkdir();
    await installDependencies();
    await installDevDependencies();
    writeConfigToPackageJson();

    console.log('安装成功！');
}

async function initCrnProject(projectName: string) {
    showSpinner('创建crn项目中');

    try {
        await Execa('crn-cli', ['init', projectName]);
        hideSpinner();
    } catch (e) {
        hideSpinner();
        logError(e);
        process.exit(1);
    }
}

function enterProject(projectName: string) {
    process.chdir(Path.resolve(`./${projectName}`));
}

function copyFiles() {
    showSpinner('拷贝文件中');

    fileConfig.forEach((config) => {
        const {
            fileName,
            targetPath,
            sourcePath
        } = config;

        try {
            copyFile(Path.resolve(__dirname, '../config', sourcePath), Path.resolve(process.cwd(), targetPath));
            console.log(`拷贝${fileName}成功！`);
        } catch(e) {
            hideSpinner();
            logError(e);
            process.exit(1);
        }
    });

    hideSpinner();
}

function copyFile(sourcePath: string, targetPath: string) {
    fs.writeFileSync(targetPath, fs.readFileSync(sourcePath, 'utf8'), 'utf8');
}

function mkdir() {
    showSpinner('创建目录结构中');

    dirConfig.forEach((config) => {
        const {
            directoryName,
            directoryBasePath
        } = config;

        try {
            mkdirp.sync(Path.resolve(process.cwd(), directoryBasePath, directoryName));
        } catch(e) {
            hideSpinner();
            logError(e);
            process.exit(1);
        }
    });

    hideSpinner();
}

async function installDependencies() {
    for (let i = 0 ; i < npmDependenciesConfig.length ; i++) {
        const {
            dependencyName,
            version
        } = npmDependenciesConfig[i];

        let moduleName = '';
        if (!version) {
            moduleName = dependencyName;
        } else {
            moduleName = `${dependencyName}@${version}`;
        }

        showSpinner(`正在安装npm依赖${dependencyName}`);

        try {
            await Execa('npm', ['install', '--save', moduleName]);
            hideSpinner();
        } catch(e) {
            hideSpinner();
            logError(e);
            process.exit(1);
        }
    }

    for (let i = 0 ; i < gitDependenciesConfig.length ; i++) {
        const {
            dependencyName,
            gitUrl
        } = gitDependenciesConfig[i];

        showSpinner(`正在安装git依赖${dependencyName}`);

        try {
            await Execa('npm', ['install', '--save', gitUrl]);
            hideSpinner();
        } catch(e) {
            hideSpinner();
            logError(e);
            process.exit(1);
        }
    }
}

async function installDevDependencies() {
    for (let i = 0 ; i < devDependenciesConfig.length ; i++) {
        const {
            dependencyName
        } = devDependenciesConfig[i];

        showSpinner(`正在安装开发依赖${dependencyName}`);

        try {
            await Execa('npm', ['install', '--save-dev', dependencyName]);
            hideSpinner();
        } catch(e) {
            hideSpinner();
            logError(e);
            process.exit(1);
        }
    }
}

function writeConfigToPackageJson() {
    showSpinner(`正在写入配置`);

    writeJestConfigToPackageJson();
    writeNpmScriptConfigToPackageJson();
    writeHuskyConfigToPackageJson();
    writeCommitizenConfigToPackageJson();

    hideSpinner();
}

function writeJestConfigToPackageJson() {
    try {
        const packageJson = readPackageJson();
        packageJson.jest = jestConfig;
        writePackageJson(packageJson);
    } catch(e) {
        logError(e);
        process.exit(1);
    }
    
}

function writeNpmScriptConfigToPackageJson() {
    try {
        const packageJson = readPackageJson();
        packageJson.scripts = Object.assign(packageJson.scripts, npmScriptConfig);
        writePackageJson(packageJson);
    } catch(e) {
        logError(e);
        process.exit(1);
    }
}

function writeHuskyConfigToPackageJson() {
    try {
        const packageJson = readPackageJson();
        packageJson.scripts = Object.assign(packageJson.scripts, huskyConfig);
        writePackageJson(packageJson);
    } catch(e) {
        logError(e);
        process.exit(1);
    }
}

function writeCommitizenConfigToPackageJson() {
    try {
        const packageJson = readPackageJson();
        packageJson.config = commitizenConfig;
        writePackageJson(packageJson);
    } catch (e) {
        logError(e);
        process.exit(1);
    }
}

function readPackageJson() {
    const packageJsonPath = getPackageJsonPath();
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
}

function writePackageJson(packageJson: object) {
    const packageJsonPath = getPackageJsonPath();
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson), 'utf8');
}

function getPackageJsonPath() {
    return Path.resolve(process.cwd(), 'package.json');
}