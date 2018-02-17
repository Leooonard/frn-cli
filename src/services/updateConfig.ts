import {
    getRemoteConfigVersion,
    getRemoteConfig
} from '../model/configVersion';
import * as Log from '../util/log';
import showSpinner from '../util/spinner';
import * as fs from 'fs';
import * as Path from 'path';
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

    const updateConfigList = getUpdateConfigList(remoteConfigVersion);

    for (let i = 0 ; i < updateConfigList.length ; i++) {
        const configName = updateConfigList[i];
        await updateConfigItem(configName);
    }

    updateConfigVersion(JSON.stringify(remoteConfigVersion));

    spinner.hide();
    Log.fatal('更新成功！');
}

function canUpdateConfig(remoteConfigVersion: {[_: string]: number}): boolean {
    const localConfigVersion = getLocalConfigVersion();
    if (Object.keys(localConfigVersion).length !== Object.keys(remoteConfigVersion).length) {
        return false;
    }

    return Object.keys(localConfigVersion).every((configName) => {
        return remoteConfigVersion[configName] !== undefined;
    });    
}

function needUpdateConfig(remoteConfigVersion: {[_: string]: number}): boolean {
    const localConfigVersion = getLocalConfigVersion();
    return Object.keys(localConfigVersion).some((configName) => {
        const localVersion = localConfigVersion[configName];
        const remoteVersion = remoteConfigVersion[configName];

        return remoteVersion > localVersion;
    });
}

function getLocalConfigVersion(): {[_: string]: number} {
    const localConfigVersion = fs.readFileSync('../../configVersion.json', 'utf8');
    return JSON.parse(localConfigVersion);
}

function getUpdateConfigList(remoteConfigVersion: {[_: string]: number}): string[] {
    const localConfigVersion = getLocalConfigVersion();
    return Object.keys(localConfigVersion).filter((configName) => {
        const localVersion = localConfigVersion[configName];
        const remoteVersion = remoteConfigVersion[configName];

        return remoteVersion > localVersion;
    });
}

async function updateConfigItem(configName: string) {
    const remoteConfig = await getRemoteConfig(configName);
    writeRemoteConfig(configName, remoteConfig);
}

function writeRemoteConfig(configName: string, remoteConfig: string) {
    const configPath = Path.resolve(__dirname, '../../config', `${configName}.json`);
    fs.writeFileSync(configPath, remoteConfig, 'utf8');
}

function updateConfigVersion(remoteConfigVersion: string) {
    const configVersionPath = Path.resolve(__dirname, '../../configVersion.json');
    fs.writeFileSync(configVersionPath, remoteConfigVersion, 'utf8');
}