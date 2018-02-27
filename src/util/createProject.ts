import * as Path from 'path';
import * as fs from 'fs';

import * as mkdirp from 'mkdirp';
import * as Execa from 'execa';
import Chalk from 'chalk';
import * as Inquirer from 'inquirer';

import showSpinner from '../util/spinner';
import * as Log from '../util/log';

export enum EError {
	projectNotExist = 'project not exist',
	createNpmProjectFailed = 'create npm project failed',
	crnCliNotExist = 'crn-cli not exist',
	createCrnProjectFailed = 'create crn project failed'
}

/**
 * projectName 项目名
 * shouldExist 目标项目是否已存在
 * isNpm 是否创建npm项目
 */
export default async function createProject(projectName: string, shouldExist: boolean, isNpm: boolean) {
	if (shouldExist) {
		if (!isProjectExist(projectName)) {
			throw new Error(EError.projectNotExist);
		} else {
			return;
		}
	} else {
		if (isProjectExist(projectName)) {
			// 询问用户是否希望覆盖
			Inquirer.prompt([
				{
					type: 'confirm',
					name: 'override',
					message: `目录${projectName}已存在，是否覆盖？(y/N)`
				}
			]).then();
		}

		if (isNpm) {
			await createNpmProject(projectName);
		} else {
			await checkCrnCliExist();
			await createCrnProject(projectName);
		}
	}
}

function isProjectExist(projectName: string): boolean {
	const projectPath = Path.resolve(projectName);
	return fs.existsSync(projectPath);
}

function overrideExistProject() {

}

async function createNpmProject(projectName: string) {
	const spinner = showSpinner('创建nodejs项目中');
	const projectPath = Path.resolve(projectName);

    try {
        mkdirp.sync(projectPath);
        process.chdir(projectPath);
        await Execa('npm', ['init', '--yes']);
        process.chdir(Path.resolve('../'));

        spinner.hide();
        Log.info('创建nodejs项目成功');
    } catch(e) {
        spinner.hide();;

        const err: Error = e;
        Log.error(err.message);
        Log.error(err.stack);
		Log.error('创建nodejs项目失败');

		throw new Error(EError.createNpmProjectFailed);
    }
}

async function checkCrnCliExist() {
	const crnCliUrl = 'http://crn.site.ctripcorp.com/';
	
	try {
		await Execa('which', ['crn-cli']);
	} catch(e) {
		Log.error(`请先安装${Chalk.red('crn-cli')}，安装教程：${Chalk.blueBright.underline(crnCliUrl)}`);
		throw new Error(EError.crnCliNotExist);
	}
}

async function createCrnProject(projectName: string) {
    const spinner = showSpinner('创建crn项目中');

    try {
        await Execa('crn-cli', ['init', projectName]);
        spinner.hide();
        Log.info('创建crn项目成功');
    } catch (e) {
        spinner.hide();

        const err: Error = e;
        Log.error(err.message);
        Log.error(err.stack);
		Log.error('创建crn项目失败');

		throw new Error(EError.createCrnProjectFailed);
    }
}