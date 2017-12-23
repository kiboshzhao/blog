const express = require('express');
const router = express.Router();
const co = require('co');
let db = require('../db/mysql');
let sql = require('../db/sql');
router.get('/',(req,res)=>{
    co(function* () {
        let category = req.query.category || '';
        let page = Number(req.query.page || 1);
        let limit = 3;
        function lreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('x', params.x)
            sql = sql.replace('y', params.y)
            sql = sql.replace('user', 'content')
            return sql;
        }
        function ireplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('key', params.x)
            sql = sql.replace('value', params.y)
            sql = sql.replace('fenlei', category)
            return sql;
        }
        function sreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('index', params)
            return sql;
        }
        let contents = '';
        let rs = '';
        let gory = '';
        let count = '';
        let pages = '';
        let num = '';
        let coun = '';
        if (category){
            let sqlcount = sreplace(category, sql.count4);
            let value = yield db.cb(sqlcount);
            for (let obj of value) {
                for (let key in obj) {
                    count = obj[key]
                }
            }
            pages = Math.ceil(count / limit);
            page = Math.min(page, pages);
            page = Math.max(page, 1);
            let x = (page - 1) * limit;
            let y = limit
            let params = {
                x: x,
                y: y
            }
            let sqlLt = ireplace(params, sql.limit2);
                contents = yield db.cb(sqlLt)
            for (gory of contents){
                let id = gory.category
                let commentId = gory.id;
                let sqlcount2 = sreplace(commentId,sql.count5)
                let sqlSelect = sreplace(id, sql.select2);
                let cou = yield db.cb(sqlcount2)
                for (let obj of cou) {
                    for (let key in obj) {
                        coun = obj[key]
                    }
                }
                gory.comment = coun;
                let result = yield db.cb(sqlSelect)
                       for (rs of result) {
                        gory.name = rs.name
                }
            }
        }else{
            let value = yield db.cb(sql.count3)
            for (let obj of value) {
                for (let key in obj) {
                    count = obj[key]
                }
            }
            pages = Math.ceil(count / limit);
            page = Math.min(page, pages);
            page = Math.max(page, 1);
            let x = (page - 1) * limit;
            let y = limit
            let params = {
                x: x,
                y: y
            }
            let sqlLimit = lreplace(params, sql.limit);
                contents = yield db.cb(sqlLimit)
            for (gory of contents){
                let id = gory.category
                let commentId = gory.id;
                let sqlcount2 = sreplace(commentId,sql.count5)
                let sqlSelect = sreplace(id, sql.select2);
                let cou = yield db.cb(sqlcount2)
                for (let obj of cou) {
                    for (let key in obj) {
                        coun = obj[key]
                    }
                }
                gory.comment = coun;
                let result = yield db.cb(sqlSelect)
                       for (rs of result) {
                        gory.name = rs.name
                }
            }
        }
        let categories = yield db.cb(sql.all2)
        res.render('main/index_1', {
            userInfo: req.userInfo,
            contents: contents,
            rs : rs,
            count : count,
            page : page,
            pages : pages,
            limit : limit,
            page : page,
            rou : 'content',
            categories : categories,
            category : category
        });
    })
});
router.get('/view',(req,res)=>{
    co(function*(){
    let contentId = req.query.contentId || '';
    function sreplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('index', params)
        return sql;
    }
    let sqlSelect = sreplace(contentId, sql.select3);
    let sqlUpdate = sreplace(contentId, sql.update5);
    let contents = yield db.cb(sqlSelect);
    for (gory of contents){
        let commentId = gory.id;
        let sqlcount2 = sreplace(commentId,sql.count5)
        let cou = yield db.cb(sqlcount2)
        for (let obj of cou) {
            for (let key in obj) {
                coun = obj[key]
            }
        }
        gory.comment = coun;
    }
    let categories = yield db.cb(sql.all2)
        yield db.cb(sqlUpdate)
    let result = '';
    let category = '';
        for (result of contents){
            category = result.category
        }
    res.render('main/view', {
        userInfo: req.userInfo,
        contents: contents,
        categories : categories,
        category : category
    });
    })
})
module.exports = router;