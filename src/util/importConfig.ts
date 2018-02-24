import * as fs from 'fs';
import * as Path from 'path';

export enum EConfigType {
	crn = 'crn',
	node = 'node'
}

export default function importConfig<T>(configType: EConfigType, configName: string): T {
	const configPath = getConfigPath(configType, configName);
	const configContent = fs.readFileSync(configPath, 'utf8');
	return JSON.parse(configContent) as T;
}

function getConfigPath(configType: EConfigType, configName: string) {
	return Path.resolve(__dirname, '../../config', configType, `${configName}.json`);
}