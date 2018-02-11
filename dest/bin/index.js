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
const Execa = require("execa");
const chalk_1 = require("chalk");
const Path = require("path");
const fs = require("fs");
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Execa('which', ['crn-cli']);
        }
        catch (err) {
            const crnCliUrl = 'http://www.baidu.com';
            console.log(`请先安装${chalk_1.default.red('crn-cli')}，安装教程：${chalk_1.default.blueBright.underline(crnCliUrl)}`);
            process.exit(1);
        }
        yield installCrnProject();
        yield installConfigFiles();
    });
}
function installCrnProject(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Execa('crn-cli', ['init', projectName]);
        }
        catch (e) {
            process.exit(1);
        }
    });
}
function installConfigAndFile(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield installFile(projectName);
            yield installConfig(projectName);
        }
        catch (e) {
            process.exit(1);
        }
    });
}
function installFile(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectPath = Path.resolve(projectName);
        const fileJson = readJson('../template/file.json');
        fileJson.forEach((file) => {
            const { fileName, path } = file;
            const targetFile = fs.readFileSync(Path.resolve('../template', path), 'utf8');
            const targetFilePath = Path.resolve(projectPath, fileName);
            copyJsonFile(targetFile, targetFilePath);
        });
    });
}
function installConfig(projectName) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
function readJson(path) {
    const jsonString = fs.readFileSync(path, 'utf8');
    return JSON.parse(jsonString);
}
function copyJsonFile(content, destPath) {
    fs.writeFileSync(destPath, JSON.stringify(content), 'utf8');
}
