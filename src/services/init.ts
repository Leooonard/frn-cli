import * as Execa from 'execa';
import * as Path from 'path';
import * as fs from 'fs';
import Chalk from 'chalk';
import {
    Spinner
} from 'cli-spinner'
import * as mkdirp from 'mkdirp';
import logError from '../util/logError';
import fileConfig from '../config/file';
import dirConfig from '../config/dir';
import {
    npmDependenciesConfig,
    gitDependenciesConfig
} from '../config/dependencies';
import devDependenciesConfig from '../config/devDependencies';

export default async function initProject(projectName: string) {
    console.log(process.cwd());
    await Execa('cd', [projectName]);
    console.log(process.cwd());
    
    return;
    await initCrnProject(projectName);
    copyFiles(projectName);
    mkdir(projectName);
    enterProject(projectName);
    installDependencies();
    installDevDependencies();

}

function createSpinner(text: string): Spinner {
    const spinner = new Spinner(`${text} %s`);
    spinner.setSpinnerString('|/-\\');
    return spinner;
}

async function initCrnProject(projectName: string) {
    const spinner = createSpinner('创建crn项目中...');

    try {
        spinner.start();
        await Execa('crn-cli', ['init', projectName]);
        spinner.stop(true);
    } catch (e) {
        spinner.stop(true);
        logError(e.message);
        process.exit(1);
    }
}

function copyFiles(projectName: string) {
    const spinner = createSpinner('拷贝文件中...');
    spinner.start();

    fileConfig.forEach((config) => {
        const {
            fileName,
            targetPath,
            sourcePath
        } = config;

        try {
            copyFile(Path.resolve('../config', sourcePath), Path.resolve(process.cwd(), projectName, targetPath));
            console.log(`拷贝${fileName}成功！`);
        } catch(e) {
            logError(e.message);
            process.exit(1);
        }
    });

    spinner.stop();
}

function copyFile(sourcePath: string, targetPath: string) {
    fs.writeFileSync(targetPath, fs.readFileSync(sourcePath, 'utf8'), 'utf8');
}

function mkdir(projectName: string) {
    const spinner = createSpinner('创建目录结构中...');
    spinner.start();

    dirConfig.forEach((config) => {
        const {
            directoryName,
            directoryBasePath
        } = config;

        try {
            mkdirp.sync(Path.resolve(process.cwd(), projectName, directoryBasePath, directoryName));
        } catch(e) {
            logError(e.message);
            process.exit(1);
        }
    });

    spinner.stop();
}

async function enterProject(projectName: string) {
    try {
        await Execa('cd', [projectName]);
    } catch(e) {
        logError(e.message);
        process.exit(1);
    }
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

        const spinner = createSpinner(`正在安装npm依赖${dependencyName}...`);
        try {
            spinner.start();
            await Execa('npm', ['install', '--save', moduleName]);
            spinner.stop(true);
        } catch(e) {
            spinner.stop(true);
            logError(e.message);
            process.exit(1);
        }
    }

    for (let i = 0 ; i < gitDependenciesConfig.length ; i++) {
        const {
            dependencyName,
            gitUrl
        } = gitDependenciesConfig[i];

        const spinner = createSpinner(`正在安装git依赖${dependencyName}...`);
        try {
            spinner.start();
            await Execa('npm', ['install', '--save', gitUrl]);
            spinner.stop(true);
        } catch(e) {
            spinner.stop(true);
            logError(e.message);
            process.exit(1);
        }
    }
}

async function installDevDependencies() {
    for (let i = 0 ; i < devDependenciesConfig.length ; i++) {
        const {
            dependencyName
        } = devDependenciesConfig[i];

        const spinner = createSpinner(`正在安装开发依赖${dependencyName}...`);
        try {
            spinner.start();
            await Execa('npm', ['install', '--save-dev', dependencyName]);
            spinner.stop();
        } catch(e) {
            spinner.stop();
            logError(e.message);
            process.exit(1);
        }
    }
}

function writeJestConfigToPackageJson() {

}