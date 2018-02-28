import * as Path from 'path';
import * as fs from 'fs';

import showSpinner from './spinner';
import * as Log from './log';
import {
    importConfig,
    EConfigType
} from './configManager';
import {
    IFileConfig
} from './configInterface';

enum EError {
    copyFileFailed = 'copy file failed'
}

export default function copyFiles(configType: EConfigType) {
    const spinner = showSpinner('拷贝文件中');

    const fileConfig = importConfig<IFileConfig>(configType, 'file');
    fileConfig.forEach((config) => {
        const {
            fileName,
            targetPath,
            sourcePath
        } = config;

        try {
            copyFile(Path.resolve(__dirname, '../config', sourcePath), Path.resolve(targetPath));
            Log.debug(`拷贝${fileName}成功！`);
        } catch (e) {
            spinner.hide();

            const err: Error = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error(`拷贝${fileName}失败！`);

            throw new Error(EError.copyFileFailed);
        }
    });

    spinner.hide();
    Log.info('拷贝文件成功');
}

function copyFile(sourcePath: string, targetPath: string) {
    fs.writeFileSync(targetPath, fs.readFileSync(sourcePath, 'utf8'), 'utf8');
}