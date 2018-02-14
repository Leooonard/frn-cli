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
const Semver = require("semver");
const init_1 = require("../services/init");
const updateConfig_1 = require("../services/updateConfig");
const frnCliVersion_1 = require("../model/frnCliVersion");
const version = '0.0.1';
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkCrnCli();
        yield checkLowestSupportFrnCliVersion();
        Command
            .version('0.0.1')
            .command('init <projectName>')
            .description('创建一个新的CRN项目')
            .option('-v, --verbose', '展示详细日志')
            .option('-q, --silent', '隐藏非关键日志')
            .action((projectName, options) => {
            init_1.default(projectName, !!options.verbose, !!options.silent);
        });
        Command
            .command('check-update')
            .description('检查本地frn-cli是否为最新版本')
            .action(() => {
            updateConfig_1.default();
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
function checkLowestSupportFrnCliVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const lowsetSupportFrnCliVersion = yield frnCliVersion_1.getLowestSupportFrnCliVersion();
        if (Semver.gt(lowsetSupportFrnCliVersion, version)) {
            console.log(`您的frn-cli版本过旧，请使用以下命令进行升级：${chalk_1.default.red.bold('npm uninstall -g frn-cli & npm i -g frn-cli')}`);
            process.exit(1);
        }
    });
}
