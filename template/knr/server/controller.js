const Router = require('koa-router');

module.exports = function (next_app) {

    // const router = new Router({
    //     prefix: '/flight_float' //路由前缀
    // });
    const router = new Router(); //创建Koa2路由实例
    const handle = next_app.getRequestHandler(); //Next获取页面参数

    const prefix = '';
    const routerObj = [{
        url: '/coupon', path: '/demo'
    }];

    // 健康检查页面
    router.get(prefix + '/slbhealthcheck.html', async(ctx)=> {
        ctx.status = 200;
    });

    routerObj.forEach((routerItem) => {
        router.get((prefix + routerItem.url), async(ctx, next)=> {
            await next_app.render(ctx.req, ctx.res, routerItem.path, ctx.query);
            ctx.respond = false
        });
    });

    // router.get('/coupon', async(ctx, next)=> {
    //     await next_app.render(ctx.req, ctx.res, '/flight_float/coupon', ctx.query);
    //     ctx.respond = false
    // });

    // router.get('/insurance', async(ctx, next)=> {
    //     await next_app.render(ctx.req, ctx.res, '/flight_float/insurance', ctx.query);
    //     ctx.respond = false
    // });

    // router.get('/intlVipRoom', async(ctx, next)=> {
    //     await next_app.render(ctx.req, ctx.res, '/flight_float/intlVipRoom', ctx.query);
    //     ctx.respond = false
    // });

    /**
     * 获取Next底层文件路由，用于满足交互等功能
     */

    // router.get(prefix + '/_next/*', async ctx => {
    //     if (process.env.NODE_ENV === 'production') {
    //         req.url = req.url.replace(prefix, '');
    //         handle(req, res);
    //         ctx.respond = false
    //     } else {
    //         await handle(ctx.req, ctx.res);
    //         ctx.respond = false
    //     }
    // });

    router.get('*', async ctx => {
        ctx.req.url = ctx.req.url.replace(prefix, '');
        // handle(req, res);
        await handle(ctx.req, ctx.res);
        ctx.respond = false
    });

    return router;
};