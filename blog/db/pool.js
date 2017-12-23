let mysql = require('mysql');
class sql {
  cb(sql) {
    let blog = 'blog';
    let connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      port: '',
      database: blog,
    });

    return new Promise((resolve, reject) => {
      connection.query(sql, function (err, results, fields) {
        if (err) {
          reject(err);
        }
        if (results) {
          resolve(results);
        }
      })
    })
  }
}
module.exports = new sql()