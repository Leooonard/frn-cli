const next = require('next');
const server = require('./server/knr');
const controller = require('./server/controller.js');

const port = parseInt(process.env.PORT, 10) || 8080; //默认为8080端口, 不然发布报错
const dev = process.env.NODE_ENV !== 'production';  //默认为False，当不适用Koa2时，置为True则Next会启动本地服务用于调试
const devDir = './webapp/src'; //dev默认执行目录
const prodDir = './webapp/dest'; // prod默认执行目录
const next_app = next({dev, dir: dev ? devDir : prodDir}); //创建Next实例

/**
 * Next启动需先执行prepare()
 */
next_app.prepare()
    .then(() => {
        const router = controller(next_app);    //设定Koa2路由规则
        server(port, router);   //启动Koa2服务
    });
