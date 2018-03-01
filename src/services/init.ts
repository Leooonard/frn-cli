import * as Execa from 'execa';
import * as Path from 'path';

import * as Log from '../util/log';
import {
    EConfigType
} from '../util/configManager';
import createProject from '../util/createProject';
import copyFiles from '../util/copyFiles';
import mkdir from '../util/mkdir';
import writeConfigToPackageJson from '../util/writeConfigToPackageJson';
import installDependencies from '../util/installDependencies';
import installDevDependencies from '../util/installDevDependencies';

const TAOBAO_REGISTRY = 'https://registry.npm.taobao.org';

export default async function initProject(
    projectName: string, 
    isNpmProject: boolean,
    isUseTaobaoRegistry: boolean, 
    isVerbose: boolean, 
    isSilent: boolean,
    isExist: boolean,
    isRedux: boolean,
    isOverride: boolean
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
        await createProject(projectName, isExist, isNpmProject);
        enterProject(projectName);
        copyFiles(configType, isOverride);
        mkdir(configType, isRedux);
        await installDependencies(configType, isOverride);
        await installDevDependencies(configType, isOverride);
        writeConfigToPackageJson(configType, isOverride);

        Log.fatal('安装成功');
    } catch(e) {
        Log.fatal('安装失败');
    } finally {
        if (isUseTaobaoRegistry) {
            await setNpmRegistry(originalRegistry);
        }
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