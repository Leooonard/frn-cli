"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_spinner_1 = require("cli-spinner");
const Logger = require("../util/log");
const spinner = new cli_spinner_1.Spinner();
spinner
    .setSpinnerString('|/-\\')
    .setSpinnerTitle('安装依赖中... %s');
function default_1(isVerbose, isSilent) {
    const logLevel = getLogLevel(isVerbose, isSilent);
    console.log(logLevel);
    Logger.setLogLevel(logLevel);
    Logger.debug('debug');
    Logger.info('info');
    Logger.error('error');
    Logger.fatal('fatal');
}
exports.default = default_1;
