#!/usr/bin/env node

import Chalk from 'chalk';
import * as Execa from 'execa';
import * as Command from 'commander';
import initProject from '../services/init';
import test from '../services/test';

main();

async function main() {
	await checkCrnCli();

	Command
	.version('0.0.1')
	.command('init <projectName>')
	.description('创建一个新的CRN项目')
	.action((projectName) => {
		initProject(projectName);
	})

	Command
	.command('test')
	.description('内部测试用')
	.option('-v, --verbose', '展示详细信息')
	.option('-q, --silent', '隐藏非关键日志')
	.action((options) => {
		test(!!options.verbose, !!options.silent);
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

