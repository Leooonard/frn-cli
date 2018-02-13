import {
    Spinner
} from 'cli-spinner';
import * as Logger from '../util/log';
import { log } from 'util';

const spinner = new Spinner();
spinner
.setSpinnerString('|/-\\')
.setSpinnerTitle('安装依赖中... %s');

export default function(isVerbose: boolean, isSilent: boolean) {
    const logLevel = getLogLevel(isVerbose, isSilent);
    console.log(logLevel);
    Logger.setLogLevel(logLevel);    

    Logger.debug('debug');
    Logger.info('info');
    Logger.error('error');
    Logger.fatal('fatal');
}

function getLogLevel(isVerbose: boolean, isSilent: boolean): Logger.ELogLevel {
    if (isVerbose) {
        return Logger.ELogLevel.verbose;
    } else if (isSilent) {
        return Logger.ELogLevel.silent;
    } else {
        return Logger.ELogLevel.default;
    }
}