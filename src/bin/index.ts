#!/usr/bin/env node

import * as Execa from 'execa';
import Chalk from 'chalk';
import * as Path from 'path';
import * as fs from 'fs';

main();

async function main() {
	try {
		await Execa('which', ['crn-cli']);
	} catch(err) {
		const crnCliUrl = 'http://www.baidu.com';
		console.log(`请先安装${Chalk.red('crn-cli')}，安装教程：${Chalk.blueBright.underline(crnCliUrl)}`);
		process.exit(1);
	}

	await installCrnProject();
	await installConfigFiles();
}

async function installCrnProject(projectName: string) {
	try {
		await Execa('crn-cli', ['init', projectName]);
	} catch(e) {
		process.exit(1);
	}
}

async function installConfigAndFile(projectName: string) {
	try {
		await installFile(projectName);
		await installConfig(projectName);
	} catch(e) {
		process.exit(1);
	}
}

async function installFile(projectName: string) {
	const projectPath = Path.resolve(projectName);
	const fileJson = readJson('../template/file.json');

	fileJson.forEach((file) => {
		const {
			fileName,
			path
		} = file;

		const targetFile = fs.readFileSync(Path.resolve('../template', path), 'utf8');
		const targetFilePath = Path.resolve(projectPath, fileName);
		copyJsonFile(targetFile, targetFilePath);
	});
}

async function installConfig(projectName: string) {

}

function readJson(path: string) {
	const jsonString = fs.readFileSync(path, 'utf8');
	return JSON.parse(jsonString);
}

function copyJsonFile(content: any, destPath: string) {
	fs.writeFileSync(destPath, JSON.stringify(content), 'utf8');
}