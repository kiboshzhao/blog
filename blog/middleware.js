const Cookies = require('cookies')
const co = require('co')
let db = require('./db/mysql');
let sql = require('./db/sql');
module.exports = function(req, res, next) {
    co(function* () {
        req.cookies = new Cookies(req, res);
        req.userInfo = {};
        if (req.cookies.get('userInfo')) {
            try {
                req.userInfo = JSON.parse(req.cookies.get('userInfo'));
                let username = req.userInfo.username
                function sreplace(username, sql) {
                    if (!username) {
                        return sql;
                    }
                    sql = sql.replace('mingzi', username)
                    return sql;
                }
                let sqlAdmin = sreplace(username, sql.admin);
                let result = yield db.cb(sqlAdmin);
                for (let a of result) {
                    req.userInfo.isAdmin = Boolean(a.isAdmin)
                }
            } catch (err) {
            }
            next();
        } else {
            next();
        }
    })
}