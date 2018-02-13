"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log4js = require("log4js");
var ELogLevel;
(function (ELogLevel) {
    ELogLevel["default"] = "INFO";
    ELogLevel["verbose"] = "DEBUG";
    ELogLevel["silent"] = "ERROR";
})(ELogLevel = exports.ELogLevel || (exports.ELogLevel = {}));
Log4js.configure({
    appenders: {
        'out': {
            type: 'stdout'
        }
    },
    categories: {
        default: {
            appenders: ['out'],
            level: ELogLevel.default
        },
        verbose: {
            appenders: ['out'],
            level: ELogLevel.default
        },
        silent: {
            appenders: ['out'],
            level: ELogLevel.silent
        }
    }
});
let logger = Log4js.getLogger();
function setLogLevel(logLevel) {
    logger = Log4js.getLogger(logLevel);
}
exports.setLogLevel = setLogLevel;
function info(message, ...args) {
    logger.info(message, ...args);
}
exports.info = info;
function debug(message, ...args) {
    logger.debug(message, ...args);
}
exports.debug = debug;
function error(message, ...args) {
    logger.error(message, ...args);
}
exports.error = error;
function fatal(message, ...args) {
    logger.fatal(message, ...args);
}
exports.fatal = fatal;
