"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_spinner_1 = require("cli-spinner");
const spinner = new cli_spinner_1.Spinner();
spinner.setSpinnerString('|/-\\');
function showSpinner(text) {
    spinner.stop();
    spinner.setSpinnerTitle(`${text}... %s`);
    spinner.start();
}
exports.showSpinner = showSpinner;
function hideSpinner() {
    spinner.stop();
    console.log('\n');
}
exports.hideSpinner = hideSpinner;
