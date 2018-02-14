import {
    Spinner
} from 'cli-spinner';
import * as Logger from '../util/log';

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

