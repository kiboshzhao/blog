let mysql = require('mysql');
class sql {
  cb(sql) {
    let blog = 'blog';
    let pool = mysql.createPool({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      port: '',
      database: blog,
    });

    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err);
        } else {
          connection.query(sql, function (err, results, fields) {
            if (err) {
              console.log('查询数据失败');
            } else {
              resolve(results);
              pool.end()  ;
            }
          })
        }
      })
    })
  }
}
module.exports = new sql()
