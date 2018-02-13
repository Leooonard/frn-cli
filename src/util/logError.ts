import Chalk from 'chalk';

export default function logError(e: Error) {
    console.log('\n', Chalk.red.bold(e.message));
    console.log('\n', Chalk.red(e.stack || ''));
}