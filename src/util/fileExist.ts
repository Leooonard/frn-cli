import * as fs from 'fs';

export default function isFileExist(filePath: string): boolean {
    return fs.existsSync(filePath);
}