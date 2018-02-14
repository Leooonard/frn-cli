"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_spinner_1 = require("cli-spinner");
function showSpinner(text) {
    const spinner = new cli_spinner_1.Spinner(`${text}... %s`);
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    return {
        hide() {
            spinner.stop(true);
        }
    };
}
exports.default = showSpinner;
