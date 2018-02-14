import Axios from 'axios';
import Config from './config';
import * as URL from 'url';

export async function getFrnCliVersion(): Promise<string> {
    const response = await Axios.get<string>(URL.resolve(Config.host, 'frn_cli_version'));

    const SUCCESS_HTTP_CODE = 200;
    if (response.status !== SUCCESS_HTTP_CODE) {
        throw new Error(`请求失败，http code: ${response.status}`);
    }

    return response.data;
}

export async function getLowestSupportFrnCliVersion(): Promise<string> {
    const response = await Axios.get<string>(URL.resolve(Config.host, 'lowest_frn_cli_version'));

    const SUCCESS_HTTP_CODE = 200;
    if (response.status !== SUCCESS_HTTP_CODE) {
        throw new Error(`请求失败，http code: ${response.status}`);
    }

    return response.data;
}