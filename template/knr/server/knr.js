const Koa = require('koa');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const logging = require('./lib/log')

module.exports = function (port, router) {

    const app = new Koa(); //实例化Koa2

    /**
     *  设置页面状态码
     */
    app.use(async (ctx, next) => {
        ctx.res.statusCode = 200;
        await next();
    });

    app.use(compress({threshold: 2048})); //压缩比

    app.use(bodyParser());  //解析表单数据 Form Data

    // 记录响应时间, 代码错误等
    app.use(async (ctx, next) => {
	    await logging(ctx, next);
    })
	
    app.use(router.routes());   //执行路由

    /**
     * 监听端口启动服务
     */
    app.listen(port, (err) => {
        if (err) {
            throw err;
        }
        console.log(`> KNR Ready on http://localhost:${port}`);
    });
};