import * as Path from 'path';
import * as mkdirp from 'mkdirp';

import showSpinner from '../util/spinner';
import * as Log from '../util/log';
import { 
    EConfigType,
    importConfig
} from './configManager';
import {
    IDirConfig
} from './configInterface';

enum EProjectType {
    redux = 'redux',
    react = 'react',
    npm = 'npm'
}

enum EError {
    mkdirFailed = 'mkdir failed'
}

export default function mkdir(configType: EConfigType, isReduxProject = false) {
    if (configType === EConfigType.crn) {
        mkdirCrn(isReduxProject)
    } else {
        mkdirCommon(configType);
    }
}

function mkdirCrn(isReduxProject: boolean) {
    let projectType = getProjectType(isReduxProject);

    const spinner = showSpinner('创建CRN项目目录结构中');

    const dirConfig = importConfig<IDirConfig>(EConfigType.crn, 'dir');
    dirConfig.filter((config) => {
        const {
            supportProjectTypeList
        } = config;

        return isSupportProjectType(projectType, supportProjectTypeList);
    }).forEach((config) => {
        const {
            directoryName,
            directoryBasePath
        } = config;

        try {
            mkdirp.sync(Path.resolve(directoryBasePath, directoryName));
        } catch (e) {
            spinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error('创建CRN项目目录结构失败');

            throw new Error(EError.mkdirFailed);
        }
    });

    spinner.hide();
    Log.info('创建CRN项目目录结构成功');
}

function getProjectType(isReduxProject: boolean): EProjectType {
    if (isReduxProject) {
        return EProjectType.redux;
    } else {
        return EProjectType.react;
    }
}

function isSupportProjectType(projectType: EProjectType, supportProjectTypeList: string[]): boolean {
    // 如果支持列表为空，说明支持任意项目类型。
    if (supportProjectTypeList.length === 0) {
        return true;
    }

    return supportProjectTypeList.indexOf(projectType) > -1;
}

function mkdirCommon(configType: EConfigType) {
    const spinner = showSpinner(`创建${configType}项目目录结构中`);

    const dirConfig = importConfig<IDirConfig>(configType, 'dir');
    dirConfig.forEach((config) => {
        const {
            directoryName,
            directoryBasePath
        } = config;

        try {
            mkdirp.sync(Path.resolve(directoryBasePath, directoryName));
        } catch (e) {
            spinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error(`创建${configType}项目目录结构失败`);

            throw new Error(EError.mkdirFailed);
        }
    });

    spinner.hide();
    Log.info(`创建${configType}项目目录结构成功`);
}