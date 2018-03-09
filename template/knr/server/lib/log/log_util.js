const CtripUtil = require('ctriputil')
const log4js = require('log4js')

// 是否dev环境
let dev = process.env.NODE_ENV !== 'production'
// console.log('dev:::: ', process.env.NODE_ENV)

//配置文件
log4js.configure({
	appenders: {
		errorLogger: { type: 'file', filename: './logs/error.log' },
		resLogger: { type: 'console' }
	},
	categories: {
		cheese: { appenders: ['resLogger','errorLogger'], level: 'error' },
		default: { appenders: ['resLogger'], level: 'trace' } // ,, 'cheeseLogs'
	}
})

var logUtil = {}

// 日志配置categories type
var errorLogger = log4js.getLogger('cheese')
var resLogger = log4js.getLogger('default')

//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
	    console.log(' logError |||||||||||||  ')
        errorLogger.error(formatError(ctx, error, resTime))
    }
};

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
    	console.log(' logResponse ---------- ')
	    // errorLogger.info(formatRes(ctx, resTime));
	    // 单纯输出console，不写文件
	    resLogger.info(formatRes(ctx, resTime))
    }
};

//格式化响应日志
var formatRes = function (ctx, resTime) {
    var logText = new String();

    //响应日志开始
	if (dev)
    logText += "\n" + "*************** response log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
	if (dev)
    logText += "*************** response log end ***************" + "\n";
	
	// 记录clog
	CtripUtil.clogging.info(logText);
    
    return logText;

}

//格式化错误日志
var formatError = function (ctx, err, resTime) {
    var logText = new String();

    //错误信息开始
	if (dev)
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
	if (dev)
    logText += "*************** error log end ***************" + "\n";
	
	// 记录clog
	CtripUtil.clogging.error(JSON.stringify(logText),{
		err: err,
		stack: err && err.stack,
	}, 'exception clog')
	
    return logText;
};

//格式化请求日志
var formatReqLog = function (req, resTime) {

    var logText = new String();

    var method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    //开始时间
    var startTime;
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
        // startTime = req.query.requestStartTime;
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
        // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\n";

    return logText;
}

module.exports = logUtil