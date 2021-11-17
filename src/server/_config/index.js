var run_model = 'local';
var Config;

if (run_model == 'local') {

    Config = {

        PG_Conn_URI: process.env.DATABASE_URL || "postgres://postgres:123456@localhost:5432/de_web",

        db: {
            connectionLimit: 100, //important
            host: 'localhost',
            port: "3306",
            user: 'root',
            password: 'joelin502',
            database: 'de_web',
            debug: false
        },
        redis: {
            host: '192.168.1.150',
            port: 6379,
            order_time_expire: 2 * 24 * 3600, // Session的有效期为30天 60 * 60 * 24 * 30
        },
        cookie: {
            max_age: 2 * 24 * 3600 * 1000, // ms
        },
        session: {
            secret: 'bstcine.com',
            resave: true,
            saveUninitialized: true,
        },

    }

}


module.exports = Config;

