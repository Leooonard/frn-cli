"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function isFileExist(filePath) {
    return fs.existsSync(filePath);
}
exports.default = isFileExist;
