const express = require('express');
const router = express.Router();
const co = require('co');
const xl = require('excel4node');
const urlencode = require('urlencode');
let db = require('../db/mysql');
let sql = require('../db/sql');
router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.send('对不起，只有管理员才能进入')
        return
    }
    next();
})
router.get('/', (req, res) => {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
})
router.get('/user', (req, res) => {
    co(function* () {
        let page = Number(req.query.page || 1);
        let limit = 4;
        let value = yield db.cb(sql.count)
        let count = '';
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
        function lreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('x', params.x)
            sql = sql.replace('y', params.y)
            return sql;
        }
        let sqlLimit = lreplace(params, sql.limit);
        let users = yield db.cb(sqlLimit)
        res.render('admin/user_index', {
            userInfo: req.userInfo,
            users: users,
            count: count,
            pages: pages,
            limit: limit,
            page: page,
            rou : 'user'
        });
    })
})
router.get('/user/setAdmin',(req,res)=>{
    co(function*(){
    let userId = req.query.id || '';
    function sreplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('index', params)
        return sql;
    }
    let sqlSelect = sreplace(userId, sql.select4);
    function ureplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('biaoshi', params)
        return sql;
    }
    let sqlUpdate = ureplace(userId, sql.update3);
    let result = yield db.cb(sqlSelect)
        for (let rs of result){
            if(rs.isAdmin == 0){
                yield db.cb(sqlUpdate)
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/user'
                });
            }else{
                 res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '该用户已经是管理员',
                    url: '/admin/user'
                });
            }
        }
    })  
})
router.get('/user/removeAdmin',(req,res)=>{
    co(function*(){
    let userId = req.query.id || '';
    function sreplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('index', params)
        return sql;
    }
    let sqlSelect = sreplace(userId, sql.select4);
    function ureplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('biaoshi', params)
        return sql;
    }
    let sqlUpdate = ureplace(userId, sql.update4);
    let result = yield db.cb(sqlSelect)
        for (let rs of result){
            if(!rs.isAdmin == 0){
                yield db.cb(sqlUpdate)
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/user'
                });
            }else{
                 res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '该用户不是管理员',
                    url: '/admin/user'
                });
            }
        }
    })  
})
router.get('/user/userRemove',(req,res)=>{
    let userId = req.query.id || '';
    function dreplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('biaoshi', params)
        return sql;
    }
    let sqlDelete = dreplace(userId, sql.delete3);
        db.cb(sqlDelete).then((rs)=>{
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '删除成功',
                url: '/admin/user'
            });
        }).catch((err)=>{
            return err
        })
})
router.get('/category', (req, res) => {
    co(function* () {
        let page = Number(req.query.page || 1);
        let limit = 4;
        let value = yield db.cb(sql.count2)
        let count = '';
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
        function lreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('x', params.x)
            sql = sql.replace('y', params.y)
            sql = sql.replace('user', 'category')
            return sql;
        }
        let sqlLimit = lreplace(params, sql.limit);
        let categories = yield db.cb(sqlLimit)
        res.render('admin/category_index', {
            userInfo: req.userInfo,
            categories: categories,
            count: count,
            pages: pages,
            limit: limit,
            page: page,
            rou : 'category'
        });
    })
})
router.get('/category/edit', (req, res) => {
    co(function* () {
        let id = req.query.id || '';
        function sreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('user', 'category')
            sql = sql.replace('username', 'id')
            sql = sql.replace('mingzi', id)
            return sql;
        }
        let sqlSelect = sreplace(id, sql.select);
        let result = yield db.cb(sqlSelect)
        let category = ''
        for (category of result) { }
        if (!result.length) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })
})
router.post('/category/edit', (req, res) => {
    co(function* () {
        let id = req.query.id || '';
        let name = req.body.name || '';
        function sreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('user', 'category')
            sql = sql.replace('username', 'id')
            sql = sql.replace('mingzi', id)
            return sql;
        }
        let sqlSelect = sreplace(id, sql.select);
        function mreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('user', 'category')
            sql = sql.replace('username', 'name')
            sql = sql.replace('mingzi', name)
            return sql;
        }
        let select = mreplace(name, sql.select);
        let params = {
            id: id,
            name: name
        }
        function greplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('mingzi', params.name)
            sql = sql.replace('biaoshi', params.id)
            return sql;
        }
        let sqlUpdate = greplace(params, sql.update);
        if (name == '') {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类信息不能为空'
            });
        } else {
            let result = yield db.cb(sqlSelect)
            let category = '';
            for (category of result) { }
            if (!result.length) {
                res.render('admin/error', {
                    userInfo: req.userInfo,
                    message: '分类信息不存在'
                });
            } else {
                if (name == category.name) {
                    res.render('admin/success', {
                        userInfo: req.userInfo,
                        message: '修改成功',
                        url: '/admin/category'
                    });
                } else {
                    let value = yield db.cb(select)
                    if (value.length) {
                        res.render('admin/error', {
                            userInfo: req.userInfo,
                            message: '已经存在同名分类'
                        });
                    } else {
                        yield db.cb(sqlUpdate)
                        res.render('admin/success', {
                            userInfo: req.userInfo,
                            message: '修改成功',
                            url: '/admin/category'
                        });

                    }
                }
            }
        }
    })

})
router.get('/category/add', (req, res) => {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
})
router.post('/category/add', (req, res) => {
    let name = req.body.name;
    if (name == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '名称不能为空'
        });
        return
    }
    let params = {
        name: name,
        user: 'category'
    }
    function areplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('mingzi', params.name)
        sql = sql.replace('user', params.user)
        return sql;
    }
    let sqlSelect = areplace(params, sql.select);
    function breplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('value', params.name)
        return sql;
    }
    let sqlInsert = breplace(params, sql.insert2);
    db.cb(sqlSelect).then((result) => {
        if (result.length) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '分类已经存在了'
            });
            return
        } else {
            db.cb(sqlInsert).then((value) => {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '分类保存成功',
                    url: '/admin/category'
                });
            }).catch((err) => {
                return err
            })
        }
    }).catch((err) => {
        return err
    })
})
router.get('/category/delete', (req, res) => {
    let id = req.query.id || '';
    function dreplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('biaoshi', id)
        return sql;
    }
    let sqlDelete = dreplace(id, sql.delete);
    db.cb(sqlDelete).then((rs)=>{
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });  
    })

})
router.get('/content', (req, res) => {
    co(function* () {
        let page = Number(req.query.page || 1);
        let limit = 3;
        let value = yield db.cb(sql.count3)
        let count = '';
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
        function lreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('x', params.x)
            sql = sql.replace('y', params.y)
            sql = sql.replace('user', 'content')
            return sql;
        }
        let sqlLimit = lreplace(params, sql.limit);
        function sreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('index', params)
            return sql;
        }
        let contents = yield db.cb(sqlLimit)
        let category = '';
        let rs = '';
        for (category of contents){
            let id = category.category
            let sqlSelect = sreplace(id, sql.select2);
            let result = yield db.cb(sqlSelect)
                   for (rs of result) {
                    category.name = rs.name
            }
        }
        res.render('admin/content_index', {
            userInfo: req.userInfo,
            contents: contents,
            rs : rs,
            count : count,
            pages : pages,
            limit : limit,
            page : page,
            rou : 'content'
        });
    })
})
router.get('/content/add', (req, res) => {
    db.cb(sql.all2).then((categories) => {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        });
    }).catch((err) => {
        return err;
    })
})
router.post('/content/add', (req, res) => {
    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        }); return
    }
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        }); return
    }

    let params = {
        category: req.body.category,
        title: req.body.title,
        brief: req.body.description,
        content: req.body.content,
        auther : req.userInfo.username
    }
    function ireplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('value1', params.category)
        sql = sql.replace('value2', params.title)
        sql = sql.replace('value3', params.brief)
        sql = sql.replace('value4', params.content)
        sql = sql.replace('value5', params.auther)
        return sql;
    }
    let sqlInsert = ireplace(params, sql.insert3);
    console.log(sqlInsert)
    db.cb(sqlInsert).then((rs) => {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        });
    }).catch((err) => {
        return err
    })
})
router.get('/content/edit', (req, res) => {
    co(function* () {
        let id = req.query.id || '';
        function sreplace(params, sql) {
            if (!params) {
                return sql;
            }
            sql = sql.replace('index', params)
            return sql;
        }
        let sqlSelect = sreplace(id, sql.select3);
        let result= yield db.cb(sqlSelect)
        let content = '';
        for ( content of result){}
        let categories = yield db.cb(sql.all2)
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                message: '指定内容不存在'
            });
        }
        res.render('admin/content_edit', {
            userInfo: req.userInfo,
            content: content,
            categories : categories
        });
    })
})
router.post('/content/edit', (req, res) => {
    let id = req.query.id || '';
    if (req.body.category == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        }); return
    }
    if (req.body.title == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        }); return
    }
    if (req.body.brief == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容简介不能为空'
        }); return
    }
    if (req.body.content == '') {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容不能为空'
        }); return
    }
    let params = {
        category: req.body.category,
        title: req.body.title,
        brief: req.body.description,
        content: req.body.content,
        auther : req.userInfo.username,
        id : id
    }
    function ureplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('fenlei', params.category)
        sql = sql.replace('biaoti', params.title)
        sql = sql.replace('jianjie', params.brief)
        sql = sql.replace('neirong', params.content)
        sql = sql.replace('zuozhe', params.auther)
        sql = sql.replace('biaoshi', id)
        return sql;
    }
    let sqlUpdate = ureplace(params, sql.update2);
 
        db.cb(sqlUpdate).then((rs)=>{
            res.render('admin/success', {
                userInfo: req.userInfo,
                message: '提交成功',
                url: '/admin/content'
            });
        }).catch((err)=>{
            return err
        })
})
router.get('/content/delete', (req, res) => {
    let id = req.query.id || '';
    function dreplace(params, sql) {
        if (!params) {
            return sql;
        }
        sql = sql.replace('biaoshi', id)
        return sql;
    }
    let sqlDelete = dreplace(id, sql.delete2);
    db.cb(sqlDelete).then((rs)=>{
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });  
    })

})
router.get('/content/export',(req,res)=>{
    co(function*(){
        let result = yield db.cb(sql.all3)
        let array = new Array()
        let titleArray = ['id','分类','标题','简介','内容','发布时间','作者','阅读量']
        array.push(titleArray)
        for (let data of result){
         arr = [];  
            for (let key in data){
                arr.push(data[key])
            }
            array.push(arr)
        }
        let wb = new xl.Workbook();//创建excel主题
        let ws = wb.addWorksheet('文章信息');//创建一个工作簿
        
        //创建通用样式
        let style = wb.createStyle({
            font: {
                //color: '#FF0800',
                size: 11,
                name: '微软雅黑'
            },
            border: {// §18.8.4 border (Border)
                left: {
                    style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                    color: '#000000' // HTML style hex value
                },
                right: {
                    style: 'thin',
                    color: '#000000'
                },
                top: {
                    style: 'thin',
                    color: '#000000'
                },
                bottom: {
                    style: 'thin',
                    color: '#000000'
                }
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center'
            }
 
        });
        ///标题加粗样式
        let boldStyle = wb.createStyle({
            font: {
                size: 11,
                name: '微软雅黑',
                bold: true
            }
        });

        array.forEach((row, i) => {
            row.forEach((col, j) => {
                ws.cell(i+1,j+1).string(array[i][j].toString()).style(style);
                ws.row(i + 1).setHeight(30); 
                if (i === 1) {
                    if (j < 3) {
                        ws.column(j + 1).setWidth(21);
                    } else {
                        ws.column(j + 1).setWidth(50);
                    }
                    ws.cell((i + 1), (j + 1)).style(style).style(boldStyle);//追加加粗样式
                } else {
                    ws.cell((i + 1), (j + 1)).style(style);
                }
            })
        })
         let buffer = yield wb.writeToBuffer()
         let fileName = urlencode('文章信息.xlsx');
         try{
             res.setHeader('Content-Type', 'application/vnd.openxmlformats');
             res.setHeader('Content-Disposition', "attachment; filename*=UTF-8''"+fileName);
             res.end(buffer, 'binary');
         } catch (error){
             logger.error('/api/template error',typeof error === "object" ? JSON.stringify(error) : error);
             res.fail(-1, error);
         }
    })
 })
module.exports = router;