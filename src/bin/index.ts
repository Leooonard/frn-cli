#!/usr/bin/env node

import Chalk from 'chalk';
import * as Execa from 'execa';
import * as Command from 'commander';
import * as Semver from 'semver';
import initProject from '../services/init';
import updateConfig from '../services/updateConfig';
import {
	getLowestSupportFrnCliVersion
} from '../model/frnCliVersion';

const version = '0.0.1';

main();

async function main() {
	await checkCrnCli();
	await checkLowestSupportFrnCliVersion();

	Command
	.version('0.0.1')
	.command('init <projectName>')
	.description('创建一个新的CRN项目')
	.option('-v, --verbose', '展示详细日志')
	.option('-q, --silent', '隐藏非关键日志')
	.action((projectName, options) => {
		initProject(projectName, !!options.verbose, !!options.silent);
	});

	Command
	.command('update-config')
	.description('更新本地frn-cli的配置文件')
	.action(() => {
		updateConfig();
	});

	Command.parse(process.argv);
}

async function checkCrnCli() {
	const crnCliUrl = 'http://crn.site.ctripcorp.com/';
	
	try {
		await Execa('which', ['crn-cli']);
	} catch(e) {
		console.log(`请先安装${Chalk.red('crn-cli')}，安装教程：${Chalk.blueBright.underline(crnCliUrl)}`);
		process.exit(1);
	}
}

async function checkLowestSupportFrnCliVersion() {
	const lowsetSupportFrnCliVersion = await getLowestSupportFrnCliVersion();
	if (Semver.gt(lowsetSupportFrnCliVersion, version)) {
		console.log(`您的frn-cli版本过旧，请使用以下命令进行升级：${Chalk.red.bold('npm uninstall -g frn-cli & npm i -g frn-cli')}`);
		process.exit(1);
	}
}

