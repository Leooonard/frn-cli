import Chalk from 'chalk';

export default function logError(errorMessage: string) {
    Chalk.red.bold(errorMessage);
}