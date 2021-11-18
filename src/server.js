const express = require('express');
const cookieParser = require('cookie-parser');
require('./server/dao/util.dao.msql');
const router = require('./server/route/index');
const autoUser = require('./server/middleware/request').autoUser;
let app = express();
const app_port = process.env.PORT || 5003;


/* app.use(session({
    //store: new RedisStore(Config.redis),
    key: Config.session.key,
    secret: Config.session.secret,
    cookie: Config.session.cookie,
    resave: Config.session.resave,
    saveUninitialized: Config.session.saveUninitialized
})); */


app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/', express.static(__dirname + '/www'));


/* Adding CORS support */
app.all('*', function (req, res, next) {
    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        res.send();
    } else {
        next();
    }
});


app.use(autoUser);
app.use('/', router);
app.listen(app_port, function () {

    console.log('Express server listening on port ' + app_port);
});

