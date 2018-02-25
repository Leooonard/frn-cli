import Axios from 'axios';
import Config from './config';
import * as URL from 'url';
import {
    EConfigType
} from '../util/configManager';

export interface IRemoteConfigVersion {
    [_: string]: {
        [_: string]: number
    }
}

export async function getRemoteConfigVersion(): Promise<IRemoteConfigVersion> {
    const response = await Axios.get<string>(URL.resolve(Config.host, 'frn_cli_version'));

    const SUCCESS_HTTP_CODE = 200;
    if (response.status !== SUCCESS_HTTP_CODE) {
        throw new Error(`请求失败，http code: ${response.status}`);
    }

    return JSON.parse(response.data);
}

export async function getRemoteConfig(configType: EConfigType, configName: string): Promise<string> {
	const response = await Axios.get<string>(URL.resolve(Config.host, `config/${configType}/${configName}.json`));

	const SUCCESS_HTTP_CODE = 200;
    if (response.status !== SUCCESS_HTTP_CODE) {
        throw new Error(`请求失败，http code: ${response.status}`);
    }

    return response.data;
}