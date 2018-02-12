#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Execa = require("execa");
const Command = require("commander");
const init_1 = require("../services/init");
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkCrnCli();
        Command
            .version('0.0.1')
            .command('init <projectName>')
            .description('创建一个新的CRN项目')
            .action((projectName) => {
            init_1.default(projectName);
        });
        Command.parse(process.argv);
    });
}
function checkCrnCli() {
    return __awaiter(this, void 0, void 0, function* () {
        const crnCliUrl = 'http://crn.site.ctripcorp.com/';
        try {
            yield Execa('which', ['crn-cli']);
        }
        catch (e) {
            console.log(`请先安装${chalk_1.default.red('crn-cli')}，安装教程：${chalk_1.default.blueBright.underline(crnCliUrl)}`);
            process.exit(1);
        }
    });
}
