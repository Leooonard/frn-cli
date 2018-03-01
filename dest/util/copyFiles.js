"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const fs = require("fs");
const spinner_1 = require("./spinner");
const Log = require("./log");
const configManager_1 = require("./configManager");
const fileExist_1 = require("./fileExist");
var EError;
(function (EError) {
    EError["copyFileFailed"] = "copy file failed";
})(EError || (EError = {}));
function copyFiles(configType, isOverride) {
    const spinner = spinner_1.default('拷贝文件中');
    const fileConfig = configManager_1.importConfig(configType, 'file');
    fileConfig.forEach((config) => {
        const { fileName, targetPath, sourcePath } = config;
        try {
            const realSourcePath = Path.resolve(__dirname, '../config', sourcePath);
            const realTargetPath = Path.resolve(targetPath);
            if (fileExist_1.default(realTargetPath)) {
                Log.debug(`${fileName}文件已存在`);
                if (isOverride) {
                    copyFile(realSourcePath, realTargetPath);
                    Log.debug(`覆写${fileName}成功！`);
                }
                else {
                    Log.debug(`跳过${fileName}`);
                }
            }
            else {
                copyFile(realSourcePath, realTargetPath);
                Log.debug(`拷贝${fileName}成功！`);
            }
        }
        catch (e) {
            spinner.hide();
            const err = e;
            Log.error(err.message);
            Log.error(err.stack);
            Log.error(`拷贝${fileName}失败！`);
            throw new Error(EError.copyFileFailed);
        }
    });
    spinner.hide();
    Log.info('拷贝文件成功');
}
exports.default = copyFiles;
function copyFile(sourcePath, targetPath) {
    fs.writeFileSync(targetPath, fs.readFileSync(sourcePath, 'utf8'), 'utf8');
}
