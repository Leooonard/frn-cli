import * as fs from 'fs';
import * as Path from 'path';

export default function importConfig<T>(configName: string): T {
	const configPath = Path.resolve(__dirname, '../../config', `${configName}.json`);
	const configContent = fs.readFileSync(configPath, 'utf8');
	return JSON.parse(configContent) as T;
}