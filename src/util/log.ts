import * as Log4js from 'log4js';

export enum ELogLevel {
    default = 'INFO',
    verbose = 'DEBUG',
    silent = 'ERROR'
}

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
export function setLogLevel(logLevel: ELogLevel) {
    logger = Log4js.getLogger(logLevel);
}

export function info(message: any, ...args: any[]) {
    logger.info(message, ...args);
}

export function debug(message: any, ...args: any[]) {
    logger.debug(message, ...args);
}

export function error(message: any, ...args: any[]) {
    logger.error(message, ...args);
}

export function fatal(message: any, ...args: any[]) {
    logger.fatal(message, ...args);
}