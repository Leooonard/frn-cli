import {
    Spinner
} from 'cli-spinner';

export default function showSpinner(text: string) {
    const spinner = new Spinner(`${text}... %s`);
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    return {
        hide() {
            spinner.stop(true);
        }
    };
}