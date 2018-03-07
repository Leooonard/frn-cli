import * as Path from 'path';
import * as fs from 'fs';

import * as mkdirp from 'mkdirp';
import * as Execa from 'execa';
import Chalk from 'chalk';
import * as Inquirer from 'inquirer';
import * as rimraf from 'rimraf';

import showSpinner from '../util/spinner';
import * as Log from '../util/log';
import isFileExist from '../util/fileExist';
import { 
	EConfigType 
} from './configManager';

export enum EError {
	projectNotExist = 'project not exist',
	invalidProject = 'project not contain package.json',
	projectAlreadyExist = 'project already exist',
	removeExistProjectFailed = 'remove exist project failed',
	createNpmProjectFailed = 'create npm project failed',
	crnCliNotExist = 'crn-cli not exist',
	createCrnProjectFailed = 'create crn project failed'
}

/**
 * 创建新项目。
 * projectName 项目名
 * shouldExist 目标项目是否已存在
 * configType 项目配置类型
 */
export default async function createProject(projectName: string, shouldExist: boolean, configType: EConfigType) {
	if (shouldExist) {
		if (!isProjectExist(projectName)) {
			Log.error('目录不存在');
			throw new Error(EError.projectNotExist);
		} else if (!isValidProject(projectName)) {
			Log.error('目录中不包含package.json');
			throw new Error(EError.invalidProject);
		} else {
			return;
		}
	} else {
		if (isProjectExist(projectName)) {
			// 询问用户是否希望覆盖
			const isOverride = await Inquirer.prompt([
				{
					type: 'confirm',
					name: 'override',
					message: `目录${projectName}已存在，是否删除？(y/N)`
				}
			]).then(answers => answers.override);

			if (isOverride) {
				removeExistProject(projectName);
			} else {
				throw new Error(EError.projectAlreadyExist);
			}
		}

		if (configType !== EConfigType.crn) {
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

function isValidProject(projectName: string): boolean {
	const packageJsonPath = Path.resolve(projectName, 'package.json');
	return isFileExist(packageJsonPath);
}

function removeExistProject(projectName: string) {
	const projectPath = Path.resolve(projectName);
	try {
		rimraf.sync(projectPath);
	} catch (e) {
		const err: Error = e;
		Log.error(err.message);
		Log.error(err.stack);
		Log.error('删除目录失败，请尝试手动删除该目录');
		
		throw new Error(EError.removeExistProjectFailed);
	}
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