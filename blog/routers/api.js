const express = require('express');
const router = express.Router();
const co = require('co');
let db = require('../db/mysql');
let sql = require('../db/sql');
let responseData = {
    code: 0,
    message: ''
}

router.post('/user/register', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let repassword = req.body.repassword
    if (!username) {
        responseData.code = 1
        responseData.message = '用户名不能为空'
        return res.json(responseData);
    }
    if (!password) {
        responseData.code = 2
        responseData.message = '密码不能为空'
        return res.json(responseData);
    }
    if (!repassword) {
        responseData.code = 3
        responseData.message = '重复密码不能为空'
        return res.json(responseData);
    }
    if (password != repassword) {
        responseData.code = 4
        responseData.message = '两次输入的密码不一致'
        return res.json(responseData);
    }
    let params = {
        username: username,
        password: password,
        repassword: repassword
    }
    function ireplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('value1', params.username)
        sql = sql.replace('value2', params.password)
        sql = sql.replace('value3', params.repassword)
        return sql;
    }
    function sreplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('mingzi', params.username)
        return sql;
    }
    let sqlSelect = sreplace(params, sql.select);
    let a = 0;
    co(function* () {
        let rst = yield db.cb(sqlSelect);
        if (rst.length) {
            responseData.message = '此用户名已被注册'
        } else {
            a = a + 1;
        }
        if (a === 0) {
            return res.json(responseData);
        }
        let sqlInsert = ireplace(params, sql.insert);
        db.cb(sqlInsert).then((result) => {
            responseData.message = '用户注册成功'
            return res.json(responseData);
        }).catch((err) => {
            responseData.code = 6
            responseData.message = err
            return res.json(responseData);
        })
    })
});
router.post('/user/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (!username) {
        responseData.message = '用户名不能为空'
        responseData.code = 1
        return res.json(responseData)
    }
    if (!password) {
        responseData.message = '密码不能为空'
        responseData.code = 2
        return res.json(responseData)
    }
    let params = {
        username: username,
        password: password
    }
    function creplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('xingming', params.username)
        sql = sql.replace('mima', params.password)
        return sql;
    }
    let sqlCheck = creplace(params, sql.check);
    function sreplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('mingzi', params.username)
        return sql;
    }
    let sqlSelect = sreplace(params, sql.select);
    let a = 0;
    co(function* () {
        let rst = yield db.cb(sqlCheck);
        if (rst.length) {
            responseData.message = '登陆成功'
            responseData.code = 0
            for (let userInfo of rst) {
                responseData.userInfo = {
                    _id: userInfo.id,
                    username: userInfo.username
                }
            }
            req.cookies.set('userInfo', JSON.stringify({
                _id: responseData.userInfo._id,
                username: responseData.userInfo.username
            }));
            return res.json(responseData)
        } else {
            co(function* () {
                let val = yield db.cb(sqlSelect);
                if (val.length) {
                    responseData.message = "密码错误"
                    responseData.code = -2
                    return res.json(responseData)
                } else {
                    responseData.message = "用户名错误"
                    responseData.code = -1
                    return res.json(responseData)
                }
            })
        }
    })
})
router.get('/user/logout',(req,res)=>{
    req.cookies.set('userInfo', null);
        res.json(responseData)
})
router.post('/comment/post',(req,res)=>{
    co(function*(){
    let contentId = req.body.contentid || '';
    let postData = {
        comment : req.body.content,
        username : req.userInfo.username,
        date : new Date()
       
        }
        function sreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('index', params)
            return sql;
        }
        let sqlSelect = sreplace(contentId, sql.select5);
        function ireplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('leixing', params.category)
            sql = sql.replace('pinglun', params.comment)
            sql = sql.replace('mingzi', params.username)
            return sql;
        }
        let result = yield db.cb(sqlSelect)
            result.push(postData)
        
        let params = {
            category : contentId,
            comment : req.body.content,
            username : req.userInfo.username
        }
        let sqlInsert = ireplace(params, sql.insert4);
             yield db.cb(sqlInsert)
            responseData.message = '评论成功'
            responseData.data = result
            res.json(responseData)
    })
})
router.get('/comment',(req,res)=>{
    let contentId = req.query.contentid || '';
    function sreplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('index', params)
        return sql;
    }
    let sqlSelect = sreplace(contentId, sql.select5);
        db.cb(sqlSelect).then((result)=>{
            responseData.data = result
            res.json(responseData)
        }).catch((err)=>{
            return err
        })
})
module.exports = router;