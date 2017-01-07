/**
 * Created by dx.yang on 2016/12/3.
 */

const mongoService = require('../../service/mongo');
const mongoDB = require('mongodb');


const apis = [{
    path: '/mongo/listCollections',
    method: 'get',
    handler: async (ctx) => {
        ctx.body = await mongo.listCollections().toArray();
    }
}, {
    path: '/mongo/find',
    method: 'post',
    handler: async (ctx) => {
        let body = ctx.request.body;
        let collection = body.collection;
        let data = body.data;
        ctx.body = await mongoService.find(collection, data);
    }
}, {
    path: '/mongo/insert',
    method: 'post',
    handler: async (ctx) => {
        let data = ctx.request.body;
        let collectionName = data.collection;
        let newOne = data.data;
        if (!Array.isArray(newOne)) {
            newOne = [newOne];
        }
        ctx.body = await mongoService.insert(collectionName, newOne);
    }
}, {
    path: '/mongo/update',
    method: 'post',
    handler: async (ctx) => {
        let data = ctx.request.body;
        let collectionName = data.collection;
        let condition = data.condition;
        let updateData = data.data;
        ctx.body = await mongoService.update(collectionName, condition, updateData);
    }
}, {
    path: '/mongo/remove',
    method: 'post',
    handler: async (ctx) => {
        let data = ctx.request.body;
        let collectionName = data.collection;
        let condition = data.condition;
        if (condition._id) {
            condition._id = new mongoDB.ObjectID(condition._id);
        }
        ctx.body = await mongoService.remove(collectionName, condition);
    }
}, {
    path: '/mongo/exec',
    method: 'post',
    handler: async (ctx) => {
        let data = ctx.request.body;
        try {
            let result = await mongoService.exec(data.funcStr, data.params);
            ctx.body = result;
        } catch(e) {
            ctx.throw(400, e.message);
        }
    }
}];

module.exports = apis;
