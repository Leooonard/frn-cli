"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const rimraf = require("rimraf");
const spinner_1 = require("./spinner");
const Log = require("./log");
const configManager_1 = require("./configManager");
function postInit(configType) {
    const postInitSpinner = spinner_1.default('post init中');
    const targetPath = Path.resolve('node_modules', '@types', 'node');
    if (configType === configManager_1.EConfigType.crn) {
        rimraf.sync(targetPath);
    }
    postInitSpinner.hide();
    Log.info('post init成功');
}
exports.default = postInit;
