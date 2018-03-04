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
const Command = require("commander");
const Semver = require("semver");
const init_1 = require("../services/init");
const frnCliVersion_1 = require("../model/frnCliVersion");
const version = '1.0.0';
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield checkLowestSupportFrnCliVersion();
        Command
            .description(`frn-cli是一个用于创建crn/普通nodejs项目的命令行工具，并自动为项目集成babel，commitizen，tslint，typescript，jest，es6-plato等代码质量工具，提高工程师的开发效率。`)
            .version(version);
        Command
            .command('init <projectName>')
            .description('创建一个新的CRN项目')
            .option('-n, --npm', '创建一个普通的npm package')
            .option('-e, --exist', '在已有项目中写入配置')
            .option('-A, --no-override', '在已有项目中写入配置时，不覆写已有配置')
            .option('-t, --taobao', '使用淘宝npm源安装依赖，这会加快依赖的安装速度')
            .option('-v, --verbose', '展示详细日志')
            .option('-q, --silent', '隐藏非关键日志')
            .option('-r, --redux', '创建redux项目，该选项只在创建CRN项目时有效')
            .action((projectName, options) => {
            init_1.default(projectName, !!options.npm, !!options.taobao, !!options.verbose, !!options.silent, !!options.exist, !!options.redux, !!options.override);
        });
        // Command
        // .command('update-config')
        // .description('更新本地frn-cli的配置文件')
        // .action(() => {
        // 	updateConfig();
        // });
        Command.parse(process.argv);
    });
}
function checkLowestSupportFrnCliVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO 完成版本号服务后放开该函数。
        return;
        const lowsetSupportFrnCliVersion = yield frnCliVersion_1.getLowestSupportFrnCliVersion();
        if (Semver.gt(lowsetSupportFrnCliVersion, version)) {
            console.log(`您的frn-cli版本过旧，请使用以下命令进行升级：${chalk_1.default.red.bold('npm uninstall -g frn-cli & npm i -g frn-cli')}`);
            process.exit(1);
        }
    });
}
