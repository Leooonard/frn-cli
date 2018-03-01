import * as Execa from 'execa';

import showSpinner from './spinner';
import * as Log from './log';
import {
    importConfig,
    EConfigType
} from './configManager';
import {
    INpmDependencyConfig,
    IGitDependencyConfig
} from './configInterface';
import {
    readPackageJson
} from './writeConfigToPackageJson';

enum EError {
    installNpmDependencyFailed = 'install npm dependency failed',
    installGitDependencyFailed = 'install git dependency failed'
}

export default async function installDependencies(configType: EConfigType, isOverride: boolean) {
    const npmDependenciesSpinner = showSpinner('正在安装npm依赖');
    const packageJson = readPackageJson();

    const npmDependenciesConfig = importConfig<INpmDependencyConfig>(configType, 'npmDependencies');
    for (let i = 0; i < npmDependenciesConfig.length; i++) {
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
            if (!isDependencyExist(packageJson, dependencyName) || isOverride) {
                await Execa('npm', ['install', '--save', moduleName]);
                Log.debug(`安装npm依赖${dependencyName}成功`);
            } 
        } catch (e) {
            npmDependenciesSpinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error(`安装npm依赖${dependencyName}失败`);

            throw new Error(EError.installNpmDependencyFailed);
        }
    }

    npmDependenciesSpinner.hide();
    Log.info('安装npm依赖成功');

    const gitDependenciesSpinner = showSpinner('正在安装git依赖');

    const gitDependenciesConfig = importConfig<IGitDependencyConfig>(configType, 'gitDependencies');
    for (let i = 0; i < gitDependenciesConfig.length; i++) {
        const {
            dependencyName,
            gitUrl
        } = gitDependenciesConfig[i];

        try {
            if (!isDependencyExist(packageJson, dependencyName) || isOverride) {
                await Execa('npm', ['install', '--save', gitUrl]);
                Log.debug(`安装git依赖${dependencyName}成功`);
            }
        } catch (e) {
            gitDependenciesSpinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error(`安装git依赖${dependencyName}失败`);

            throw new Error(EError.installGitDependencyFailed);
        }
    }

    gitDependenciesSpinner.hide();
    Log.info('安装git依赖成功');
}

function isDependencyExist(packageJson: {[_: string]: any}, dependencyName: string) {
    return packageJson.dependencies && packageJson.dependencies[dependencyName] !== undefined;
}