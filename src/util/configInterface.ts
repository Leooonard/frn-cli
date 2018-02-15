export type ICommitizenConfig = object;
export interface IDir {
	directoryName: string;
	directoryBasePath: string;
};
export type IDirConfig = IDir[];
export interface IFile {
	fileName: string;
	targetPath: string;
	sourcePath: string;
}
export type IFileConfig = IFile[];
export type IHuskyConfig = object;
export type IJestConfig = object;
export interface IDevDependency {
	dependencyName: string;
}
export type IDevDependencyConfig = IDevDependency[];
export interface INpmDependency {
	dependencyName: string;
	version: string;
}
export type INpmDependencyConfig = INpmDependency[];
export interface IGitDependency {
	dependencyName: string;
	gitUrl: string;
}
export type IGitDependencyConfig = IGitDependency[];
export type INpmScriptConfig = object;