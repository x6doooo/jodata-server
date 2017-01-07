/**
 * Created by dx.yang on 2016/12/3.
 */

const KoaRouter = require('koa-router');
const path = require('path');
const fse = require('fs-extra');

const apiRouter = new KoaRouter({
    prefix: '/api'
});
const rs = [{
    path: './api',
    router: apiRouter
}];

function loadCtrls() {
    return new Promise((resolve, reject) => {

        let count = 0;
        rs.forEach((r) => {
            let p = path.join(__dirname, r.path);
            fse.walk(p)
                .on('data', (item) => {
                    let isNotFile = !item.stats.isFile;
                    if (isNotFile) {
                        return
                    }
                    let itemPath = path.parse(item.path);
                    let isJs = itemPath.ext === '.js';
                    let isCtrl = /\.ctrl$/.test(itemPath.name);
                    let isNotControllerFile = !isJs || !isCtrl;
                    if (isNotControllerFile) {
                        return;
                    }
                    let ctrls = require(item.path);
                    ctrls.forEach((c) => {
                        r.router[c.method](c.path, c.handler);
                    });
                })
                .on('end', () => {
                    count += 1;
                    if (count === rs.length) {
                        console.log('controller init!');
                        resolve();
                    }
                });
        });
    });
}


function bind(app) {
    return new Promise((resolve, reject) => {
        loadCtrls().then(function() {
            rs.forEach((r) => {
                app.use(r.router.routes());
            });
            resolve();
        });
    });
}

module.exports = {
    bind
};
