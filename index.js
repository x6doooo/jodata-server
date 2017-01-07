/**
 * Created by dx.yang on 2016/12/3.
 */

const env = process.env.NODE_ENV;

const fs = require('fs');
const toml = require('toml');

const configFile = fs.readFileSync(`./conf/conf.${env}.toml`, 'utf-8');
const config = toml.parse(configFile);

const mongoModule = require('jodata-common/lib/mongo');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./controller/router');

const app = new Koa();
app.use(async (ctx, next) => {
    let start = new Date();
    console.log(ctx.request.path, 'start');
    await next();
    let end = new Date();
    console.log('[' + ctx.res.statusCode + ']', ctx.method, ctx.path, end - start + 'ms');

});
app.use(bodyParser());


// init
(async () => {
    let db = await mongoModule.init(config.mongo.addr);
    global.mongo = db;

    await router.bind(app);

    const port = config.server.port;
    console.log('koa server is running at', port);
    app.listen(port);
})();
