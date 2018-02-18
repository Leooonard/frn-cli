import * as Execa from 'execa';
import * as Path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import Chalk from 'chalk';

import showSpinner from '../util/spinner';
import * as Log from '../util/log';
import importConfig from '../util/importConfig';
import {
    ICommitizenConfig,
    IDirConfig,
    IFileConfig,
    IHuskyConfig,
    IJestConfig,
    IDevDependencyConfig,
    INpmDependencyConfig,
    IGitDependencyConfig,
    INpmScriptConfig
} from '../util/configInterface';

export default async function initProject(projectName: string, isNodeProject: boolean, isVerbose: boolean, isSilent: boolean) {
    Log.setLogLevel(getLogLevel(isVerbose, isSilent));

    if (isNodeProject) {
        await initNodeProject(projectName);
    } else {
        await checkCrnCli();
        await initCrnProject(projectName);
    }
    enterProject(projectName);
    copyFiles();
    mkdir();
    await installDependencies();
    await installDevDependencies();
    writeConfigToPackageJson();

    Log.fatal('安装成功');
}

function getLogLevel(isVerbose: boolean, isSilent: boolean): Log.ELogLevel {
    if (isVerbose) {
        return Log.ELogLevel.verbose;
    } else if (isSilent) {
        return Log.ELogLevel.silent;
    } else {
        return Log.ELogLevel.default;
    }
}

async function checkCrnCli() {
	const crnCliUrl = 'http://crn.site.ctripcorp.com/';
	
	try {
		await Execa('which', ['crn-cli']);
	} catch(e) {
		console.log(`请先安装${Chalk.red('crn-cli')}，安装教程：${Chalk.blueBright.underline(crnCliUrl)}`);
		process.exit(1);
	}
}

async function initCrnProject(projectName: string) {
    const spinner = showSpinner('创建crn项目中');

    try {
        await Execa('crn-cli', ['init', projectName]);
        spinner.hide();
        Log.info('创建crn项目成功');
    } catch (e) {
        spinner.hide();

        const err: Error = e;
        Log.error(err.message);
        Log.error(err.stack);

        process.exit(1);
    }
}

async function initNodeProject(projectName: string) {
    const spinner = showSpinner('创建nodejs项目中');

    try {
        mkdirp.sync(Path.resolve(projectName));

        process.chdir(Path.resolve(projectName));
        await Execa('npm', ['init', '--yes']);
        process.chdir(Path.resolve('../'));

        spinner.hide();
        Log.info('创建nodejs项目成功');
    } catch(e) {
        spinner.hide();;

        const err: Error = e;
        Log.error(err.message);
        Log.error(err.stack);

        process.exit(1);
    }
}

function enterProject(projectName: string) {
    process.chdir(Path.resolve(`./${projectName}`));
}

function copyFiles() {
    const spinner = showSpinner('拷贝文件中');

    const fileConfig = importConfig<IFileConfig>('file');
    fileConfig.forEach((config) => {
        const {
            fileName,
            targetPath,
            sourcePath
        } = config;

        try {
            copyFile(Path.resolve(__dirname, '../config', sourcePath), Path.resolve(process.cwd(), targetPath));
            Log.debug(`拷贝${fileName}成功！`);
        } catch(e) {
            spinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack);

            process.exit(1);
        }
    });

    spinner.hide();
    Log.info('拷贝文件成功');
}

function copyFile(sourcePath: string, targetPath: string) {
    fs.writeFileSync(targetPath, fs.readFileSync(sourcePath, 'utf8'), 'utf8');
}

function mkdir() {
    const spinner = showSpinner('创建目录结构中');

    const dirConfig = importConfig<IDirConfig>('dir');
    dirConfig.forEach((config) => {
        const {
            directoryName,
            directoryBasePath
        } = config;

        try {
            mkdirp.sync(Path.resolve(process.cwd(), directoryBasePath, directoryName));
        } catch(e) {
            spinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack);

            process.exit(1);
        }
    });

    spinner.hide();
    Log.info('创建目录结构成功');
}

async function installDependencies() {
    const npmDependenciesSpinner = showSpinner('正在安装npm依赖');

    const npmDependenciesConfig = importConfig<INpmDependencyConfig>('npmDependencies');
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

        try {
            await Execa('npm', ['install', '--save', moduleName]);
            Log.debug(`安装npm依赖${dependencyName}成功`);
        } catch(e) {
            npmDependenciesSpinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack);

            process.exit(1);
        }
    }

    npmDependenciesSpinner.hide();
    Log.info('安装npm依赖成功');

    const gitDependenciesSpinner = showSpinner('正在安装git依赖');

    const gitDependenciesConfig = importConfig<IGitDependencyConfig>('gitDependencies');
    for (let i = 0 ; i < gitDependenciesConfig.length ; i++) {
        const {
            dependencyName,
            gitUrl
        } = gitDependenciesConfig[i];

        try {
            await Execa('npm', ['install', '--save', gitUrl]);
            Log.debug(`安装git依赖${dependencyName}成功`);
        } catch(e) {
            gitDependenciesSpinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack);

            process.exit(1);
        }
    }

    gitDependenciesSpinner.hide();
    Log.info('安装git依赖成功');
}

async function installDevDependencies() {
    const spinner = showSpinner('正在安装npm开发依赖');

    const devDependenciesConfig = importConfig<IDevDependencyConfig>('devDependencies');
    for (let i = 0 ; i < devDependenciesConfig.length ; i++) {
        const {
            dependencyName
        } = devDependenciesConfig[i];

        try {
            await Execa('npm', ['install', '--save-dev', dependencyName]);
            Log.debug(`安装npm开发依赖${dependencyName}成功`);
        } catch(e) {
            spinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack)

            process.exit(1);
        }
    }

    spinner.hide();
    Log.info('安装npm开发依赖成功');
}

function writeConfigToPackageJson() {
    const spinner = showSpinner('正在写入配置');

    try {
        writeJestConfigToPackageJson();
        writeNpmScriptConfigToPackageJson();
        writeHuskyConfigToPackageJson();
        writeCommitizenConfigToPackageJson();
    } catch(e) {
        spinner.hide();

        const err: Error = e;
        Log.error(err.message);
        Log.error(err.stack);

        process.exit(1);
    }

    spinner.hide();
    Log.info('写入配置成功');
}

function writeJestConfigToPackageJson() {
    const packageJson = readPackageJson();
    const jestConfig = importConfig<IJestConfig>('jest');
    packageJson.jest = jestConfig;
    writePackageJson(packageJson);
}

function writeNpmScriptConfigToPackageJson() {
    const packageJson = readPackageJson();
    const npmScriptConfig = importConfig<INpmScriptConfig>('npmScript');
    packageJson.scripts = Object.assign(packageJson.scripts, npmScriptConfig);
    writePackageJson(packageJson);
}

function writeHuskyConfigToPackageJson() {
    const packageJson = readPackageJson();
    const huskyConfig = importConfig<IHuskyConfig>('husky');
    packageJson.scripts = Object.assign(packageJson.scripts, huskyConfig);
    writePackageJson(packageJson);
}

function writeCommitizenConfigToPackageJson() {
    const packageJson = readPackageJson();
    packageJson.config = importConfig<ICommitizenConfig>('commitizen');
    writePackageJson(packageJson);
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