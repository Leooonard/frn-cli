#!/usr/bin/env node

import * as Command from 'commander';
import initProject from '../services/init';

const version = '1.0.0';

main();

async function main() {
	await checkLowestSupportFrnCliVersion();

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
		initProject(
			projectName, 
			!!options.npm, 
			!!options.taobao, 
			!!options.verbose, 
			!!options.silent,
			!!options.exist,
			!!options.redux,
			!!options.override
		);
	});

	// Command
	// .command('update-config')
	// .description('更新本地frn-cli的配置文件')
	// .action(() => {
	// 	updateConfig();
	// });

	Command.parse(process.argv);
}

async function checkLowestSupportFrnCliVersion() {
	// TODO 完成版本号服务后放开该函数。
	return;

	// const lowsetSupportFrnCliVersion = await getLowestSupportFrnCliVersion();
	// if (Semver.gt(lowsetSupportFrnCliVersion, version)) {
	// 	console.log(`您的frn-cli版本过旧，请使用以下命令进行升级：${Chalk.red.bold('npm uninstall -g frn-cli & npm i -g frn-cli')}`);
	// 	process.exit(1);
	// }
}

