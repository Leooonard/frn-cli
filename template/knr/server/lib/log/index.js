const CtripUtil = require('ctriputil')
process.on('uncaughtException',  (err) => {
    //打印出错误
    // console.log(err);
    //打印出错误的调用栈方便调试
    // console.log(err.stack)

    console.error('catch error: ', err, ' err.stack: ', err.stack)
    CtripUtil.clogging.error(JSON.stringify(err),{
        err: err,
        stack: err && err.stack,
    }, 'exception clog')

})

// //log工具
const logUtil = require('./log_util')

let logging = async (ctx, next) => {
        //响应开始时间
        const start = new Date();
        //响应间隔时间
        let ms;
        try {
          //开始进入到下一个中间件
          await next();

          ms = new Date() - start;
          //记录响应日志
          logUtil.logResponse(ctx, ms);

        } catch (error) {

          ms = new Date() - start;
          //记录异常日志
          logUtil.logError(ctx, error, ms);
        }
      }


// logger
module.exports = logging