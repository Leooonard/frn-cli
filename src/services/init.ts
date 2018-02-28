import * as Execa from 'execa';
import * as Path from 'path';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import Chalk from 'chalk';

import showSpinner from '../util/spinner';
import * as Log from '../util/log';
import {
    importConfig,
    EConfigType
} from '../util/configManager';
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
import createProject from '../util/createProject';
import copyFiles from '../util/copyFiles';
import mkdir from '../util/mkdir';
import writeConfigToPackageJson from '../util/writeConfigToPackageJson';

const TAOBAO_REGISTRY = 'https://registry.npm.taobao.org';

export default async function initProject(
    projectName: string, 
    isNpmProject: boolean,
    isUseTaobaoRegistry: boolean, 
    isVerbose: boolean, 
    isSilent: boolean,
    isExist: boolean,
    isRedux: boolean
) {
    // 设置log等级。
    Log.setLogLevel(getLogLevel(isVerbose, isSilent));

    // 设置npm源。
    let originalRegistry = '';
    if (isUseTaobaoRegistry) {
        originalRegistry = await getNpmRegistry();
        setNpmRegistry(TAOBAO_REGISTRY);
    }

    let configType: EConfigType;
    if (isNpmProject) {
        configType = EConfigType.node
    } else {
        configType = EConfigType.crn;
    }

    try {
        createProject(projectName, isExist, isNpmProject);
        enterProject(projectName);
        copyFiles(configType);
        mkdir(configType, isRedux);
        await installDependencies(configType);
        await installDevDependencies(configType);
        writeConfigToPackageJson(configType);

        if (isUseTaobaoRegistry) {
            await setNpmRegistry(originalRegistry);
        }

        Log.fatal('安装成功');
    } catch(e) {
        if (isUseTaobaoRegistry) {
            await setNpmRegistry(originalRegistry);
        }

        Log.fatal('安装失败');
    }
}

async function getNpmRegistry() {
    return Execa('npm', ['config', 'get', 'registry']).then((result) => {
        return result.stdout;
    });
}

async function setNpmRegistry(registry: string) {
    await Execa('npm', ['config', 'set', 'registry', registry]);
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

function enterProject(projectName: string) {
    process.chdir(Path.resolve(projectName));
}

async function installDependencies(configType: EConfigType) {
    const npmDependenciesSpinner = showSpinner('正在安装npm依赖');

    const npmDependenciesConfig = importConfig<INpmDependencyConfig>(configType, 'npmDependencies');
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

    const gitDependenciesConfig = importConfig<IGitDependencyConfig>(configType, 'gitDependencies');
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

async function installDevDependencies(configType: EConfigType) {
    const spinner = showSpinner('正在安装npm开发依赖');

    const devDependenciesConfig = importConfig<IDevDependencyConfig>(configType, 'devDependencies');
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