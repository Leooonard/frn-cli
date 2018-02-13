import {
    Spinner
} from 'cli-spinner'

const spinner = new Spinner();
spinner.setSpinnerString('|/-\\');

export function showSpinner(text: string) {
    spinner.stop();
    spinner.setSpinnerTitle(`${text}... %s`);
    spinner.start();
}

export function hideSpinner() {
    spinner.stop();
    console.log('\n');
}