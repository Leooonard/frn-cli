import {
    getRemoteConfigVersion,
    getRemoteConfig,

    IRemoteConfigVersion
} from '../model/configVersion';
import {
    updateConfig as writeConfig,
    updateConfigVersion,
    getLocalConfigVersion,
    EConfigType
} from '../util/configManager';
import * as Log from '../util/log';
import showSpinner from '../util/spinner';
import Chalk from 'chalk';

export default async function updateConfig() {
    const spinner = showSpinner('更新配置文件中');
    const remoteConfigVersion = await getRemoteConfigVersion();
    if (!canUpdateConfig(remoteConfigVersion)) {
        spinner.hide();
        Log.error(Chalk.red('本地配置文件和服务器配置文件不匹配，请重新安装frn-cli！'));
        process.exit(1);
    }
    
    if (!needUpdateConfig(remoteConfigVersion)) {
        return;
    }

    const updateConfigVersionList = getUpdateConfigList(remoteConfigVersion);
    const updateConfigVersionNameList = Object.keys(updateConfigVersionList);

    for (let i = 0 ; i < updateConfigVersionNameList.length ; i++) {
        const updateConfigVersionName = updateConfigVersionNameList[i];
        const updateConfigList = updateConfigVersionList[updateConfigVersionName];

        for (let j = 0 ; j < updateConfigList.length ; j++) {
            const configName = updateConfigList[j];
            await updateConfigItem(updateConfigVersionName as EConfigType, configName);
        }
    }
    
    updateConfigVersion(JSON.stringify(remoteConfigVersion));

    spinner.hide();
    Log.fatal('更新成功！');
}

function canUpdateConfig(remoteConfigVersion: IRemoteConfigVersion): boolean {
    const localConfigVersion = getLocalConfigVersion();

    if (Object.keys(localConfigVersion).length !== Object.keys(remoteConfigVersion).length) {
        return false;
    }

    return Object.keys(localConfigVersion).every((configVersionName) => {
        const localConfigVersionItem = localConfigVersion[configVersionName];
        const remoteConfigVersionItem = remoteConfigVersion[configVersionName];

        if (!remoteConfigVersionItem) {
            return false;
        }

        if (Object.keys(localConfigVersionItem).length !== Object.keys(remoteConfigVersionItem).length) {
            return false;
        }

        return Object.keys(localConfigVersionItem).every((configName) => {
            return remoteConfigVersionItem[configName] !== undefined;
        });
    });    
}

function needUpdateConfig(remoteConfigVersion: IRemoteConfigVersion): boolean {
    const localConfigVersion = getLocalConfigVersion();

    return Object.keys(localConfigVersion).some((configVersionName) => {
        const localConfigVersionItem = localConfigVersion[configVersionName];
        const remoteConfigVersionItem = remoteConfigVersion[configVersionName];

        return Object.keys(localConfigVersionItem).some((configName) => {
            const localVersion = localConfigVersionItem[configName];
            const remoteVersion = remoteConfigVersionItem[configName];
    
            return remoteVersion > localVersion;
        });
    });
}

function getUpdateConfigList(remoteConfigVersion: IRemoteConfigVersion): {[_: string]: string[]} {
    const localConfigVersion = getLocalConfigVersion();
    const updateConfigVersionList: {[_: string]: string[]} = {};

    Object.keys(localConfigVersion).forEach((configVersionName) => {
        const localConfigVersionItem = localConfigVersion[configVersionName];
        const remoteConfigVersionItem = remoteConfigVersion[configVersionName];

        const updateConfigList = Object.keys(localConfigVersionItem).filter((configName) => {
            const localVersion = localConfigVersionItem[configName];
            const remoteVersion = remoteConfigVersionItem[configName];
    
            return remoteVersion > localVersion;
        });

        updateConfigVersionList[configVersionName] = updateConfigList;
    });

    return updateConfigVersionList;
}

async function updateConfigItem(configType: EConfigType, configName: string) {
    const remoteConfig = await getRemoteConfig(configType, configName);
    writeConfig(configType, configName, remoteConfig);
}
