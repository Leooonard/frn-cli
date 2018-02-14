import * as Log4js from 'log4js';
import * as ReadLine from 'readline';

export enum ELogLevel {
    default = 'default',
    verbose = 'verbose',
    silent = 'silent'
}

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
export function setLogLevel(logLevel: ELogLevel) {
    logger = Log4js.getLogger(logLevel);
}

export function info(message: any, ...args: any[]) {
    clearLine();
    logger.info(message, ...args);
}

export function debug(message: any, ...args: any[]) {
    clearLine();    
    logger.debug(message, ...args);
}

export function error(message: any, ...args: any[]) {
    clearLine();    
    logger.error(message, ...args);
}

export function fatal(message: any, ...args: any[]) {
    clearLine();    
    logger.fatal(message, ...args);
}

function clearLine() {
    ReadLine.clearLine(process.stdout, 0);
    ReadLine.cursorTo(process.stdout, 0);
}