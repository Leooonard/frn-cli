import * as Execa from 'execa';

import showSpinner from './spinner';
import * as Log from './log';
import {
    importConfig,
    EConfigType
} from './configManager';
import {
    IDevDependencyConfig
} from './configInterface';
import {
    readPackageJson
} from './writeConfigToPackageJson';

enum EError {
    installDevDependencyFailed = 'install devDependency failed'
}

export default async function installDevDependencies(configType: EConfigType, isOverride: boolean) {
    const spinner = showSpinner('正在安装npm开发依赖');
    const packageJson = readPackageJson();

    const devDependenciesConfig = importConfig<IDevDependencyConfig>(configType, 'devDependencies');
    for (let i = 0; i < devDependenciesConfig.length; i++) {
        const {
            dependencyName
        } = devDependenciesConfig[i];

        try {
            if (!isDevDependencyExist(packageJson, dependencyName) || isOverride) {
                await Execa('npm', ['install', '--save-dev', dependencyName]);
                Log.debug(`安装npm开发依赖${dependencyName}成功`);
            }
        } catch (e) {
            spinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error(`安装npm开发依赖${dependencyName}失败`);

            throw new Error(EError.installDevDependencyFailed);
        }
    }

    spinner.hide();
    Log.info('安装npm开发依赖成功');
}

function isDevDependencyExist(packageJson: { [_: string]: any }, dependencyName: string) {
    return packageJson.devDependencies && packageJson.devDependencies[dependencyName] !== undefined;
}