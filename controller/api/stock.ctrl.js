/**
 * Created by dx.yang on 2016/12/6.
 */


const mongoService = require('../../service/mongo');
const DataProcessing = require('../../service/DataProcessing');
const algorithmModule = require('../../module/algorithm');


let apis = [{
    path: '/stock/data',
    method: 'get',
    handler: async (ctx) => {
        let name = ctx.query.name;
        let data = await mongoService.find(name, {
            sort: {
                ts: 1
            }
        });
        data = DataProcessing.format(data);
        ctx.body = data;
    }
}, {
    path: '/stock/algorithm',
    method: 'post',
    handler: async (ctx) => {
        let body = ctx.request.body;
        let algorithm = body.algorithm;
        let stock = body.stock;
        let condition = body.condition;
        ctx.body = await algorithmModule[algorithm](stock, condition);
    }

}];


module.exports = apis;