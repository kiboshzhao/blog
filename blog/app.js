const express = require('express');
const swig = require('swig');
const bodyParser = require('body-parser')
let middle = require('./middleware')
let app = express();
app.use('/public',express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
swig.setDefaults({ cache: false });
app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');
app.use(middle);
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));
app.listen(8080);
module.exports = app;

