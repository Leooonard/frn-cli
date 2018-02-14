"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Log4js = require("log4js");
const ReadLine = require("readline");
var ELogLevel;
(function (ELogLevel) {
    ELogLevel["default"] = "default";
    ELogLevel["verbose"] = "verbose";
    ELogLevel["silent"] = "silent";
})(ELogLevel = exports.ELogLevel || (exports.ELogLevel = {}));
Log4js.configure({
    appenders: {
        'out': {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%[[%p] frn-cli: %m%]'
            }
        }
    },
    categories: {
        default: {
            appenders: ['out'],
            level: 'INFO'
        },
        verbose: {
            appenders: ['out'],
            level: 'DEBUG'
        },
        silent: {
            appenders: ['out'],
            level: 'ERROR'
        }
    }
});
let logger = Log4js.getLogger();
function setLogLevel(logLevel) {
    logger = Log4js.getLogger(logLevel);
}
exports.setLogLevel = setLogLevel;
function info(message, ...args) {
    clearLine();
    logger.info(message, ...args);
}
exports.info = info;
function debug(message, ...args) {
    clearLine();
    logger.debug(message, ...args);
}
exports.debug = debug;
function error(message, ...args) {
    clearLine();
    logger.error(message, ...args);
}
exports.error = error;
function fatal(message, ...args) {
    clearLine();
    logger.fatal(message, ...args);
}
exports.fatal = fatal;
function clearLine() {
    ReadLine.clearLine(process.stdout, 0);
    ReadLine.cursorTo(process.stdout, 0);
}
