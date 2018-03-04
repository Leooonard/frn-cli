import * as Path from 'path';
import * as rimraf from 'rimraf';

import showSpinner from './spinner';
import * as Log from './log';
import {
	EConfigType
} from './configManager';

export default function postInit(configType: EConfigType) {
    const postInitSpinner = showSpinner('post init中');
    const targetPath = Path.resolve('node_modules', '@types', 'node');

    if (configType === EConfigType.crn) {
        rimraf.sync(targetPath);
    }

    postInitSpinner.hide();
    Log.info('post init成功');
}
