/**
 * CtripUtil 配置
 */
var env = require('./package.json').config.env
var envMap = {
    'FAT': 'fws',
    'LPT': 'lpt',
    'UAT': 'uat',
    'PROD':'prod'
}
module.exports = {
    'AppID': '100013393',
    'Env': envMap[env]
}