"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const config_1 = require("./config");
const URL = require("url");
function getFrnCliVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(URL.resolve(config_1.default.host, 'frn_cli_version'));
        const SUCCESS_HTTP_CODE = 200;
        if (response.status !== SUCCESS_HTTP_CODE) {
            throw new Error(`请求失败，http code: ${response.status}`);
        }
        return response.data;
    });
}
exports.getFrnCliVersion = getFrnCliVersion;
function getLowestSupportFrnCliVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(URL.resolve(config_1.default.host, 'lowest_frn_cli_version'));
        const SUCCESS_HTTP_CODE = 200;
        if (response.status !== SUCCESS_HTTP_CODE) {
            throw new Error(`请求失败，http code: ${response.status}`);
        }
        return response.data;
    });
}
exports.getLowestSupportFrnCliVersion = getLowestSupportFrnCliVersion;
