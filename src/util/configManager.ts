import * as fs from 'fs';
import * as Path from 'path';
import { 
	IRemoteConfigVersion
} from '../model/configVersion';

export enum EConfigType {
	crn = 'crn',
	node = 'node'
}

export function importConfig<T>(configType: EConfigType, configName: string): T {
	const configPath = getConfigPath(configType, configName);
	const configContent = fs.readFileSync(configPath, 'utf8');
	return JSON.parse(configContent) as T;
}

function getConfigPath(configType: EConfigType, configName: string) {
	return Path.resolve(__dirname, '../../config', configType, `${configName}.json`);
}

export function updateConfig(configType: EConfigType, configName: string, configContent: string) {
	const configPath = Path.resolve(__dirname, '../../config', configType, `${configName}.json`);
    fs.writeFileSync(configPath, configContent, 'utf8');
} 

export function updateConfigVersion(remoteConfigVersion: string) {
	const configVersionPath = Path.resolve(__dirname, '../../configVersion.json');
    fs.writeFileSync(configVersionPath, remoteConfigVersion, 'utf8');
}

export function getLocalConfigVersion(): IRemoteConfigVersion {
    const localConfigVersion = fs.readFileSync('../../configVersion.json', 'utf8');
    return JSON.parse(localConfigVersion);
}