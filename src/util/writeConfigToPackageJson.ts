import * as Path from 'path';
import * as fs from 'fs';

import showSpinner from '../util/spinner';
import * as Log from '../util/log';
import {
    EConfigType,
    importConfig
} from './configManager';
import {
    IJestConfig,
    INpmScriptConfig,
    IHuskyConfig,
    ICommitizenConfig
} from './configInterface';

export default function writeConfigToPackageJson(configType: EConfigType, isOverride: boolean) {
    const spinner = showSpinner('正在写入配置');

    try {
        writeJestConfigToPackageJson(configType, isOverride);
        writeNpmScriptConfigToPackageJson(configType);
        writeHuskyConfigToPackageJson(configType);
        writeCommitizenConfigToPackageJson(configType, isOverride);
    } catch (e) {
        spinner.hide();

        const err: Error = e;
        Log.error(err.message);
        Log.error(err.stack);
        Log.error('写入配置失败');

        throw new Error(e);
    }

    spinner.hide();
    Log.info('写入配置成功');
}

function writeJestConfigToPackageJson(configType: EConfigType, isOverride: boolean) {
    const packageJson = readPackageJson();
    if (!isConfigExist(packageJson, 'jest') || isOverride) {
        packageJson.jest = importConfig<IJestConfig>(configType, 'jest');
    }
    writePackageJson(packageJson);
}

function writeNpmScriptConfigToPackageJson(configType: EConfigType) {
    const packageJson = readPackageJson();
    const npmScriptConfig = importConfig<INpmScriptConfig>(configType, 'npmScript');
    packageJson.scripts = Object.assign(packageJson.scripts, npmScriptConfig);
    writePackageJson(packageJson);
}

function writeHuskyConfigToPackageJson(configType: EConfigType) {
    const packageJson = readPackageJson();
    const huskyConfig = importConfig<IHuskyConfig>(configType, 'husky');
    packageJson.scripts = Object.assign(packageJson.scripts, huskyConfig);
    writePackageJson(packageJson);
}

function writeCommitizenConfigToPackageJson(configType: EConfigType, isOverride: boolean) {
    const packageJson = readPackageJson();
    if (!isConfigExist(packageJson, 'config') || isOverride) {
        packageJson.config = importConfig<ICommitizenConfig>(configType, 'commitizen');
    }
    writePackageJson(packageJson);
}

function isConfigExist(packageJson: {[_: string]: any}, configName: string): boolean {
    return packageJson[configName] !== undefined;
}

export function readPackageJson() {
    const packageJsonPath = getPackageJsonPath();
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
}

function writePackageJson(packageJson: object) {
    const packageJsonPath = getPackageJsonPath();
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4), 'utf8');
}

function getPackageJsonPath() {
    return Path.resolve('package.json');
}