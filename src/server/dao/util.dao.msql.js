module.exports = Config = require('../_config');

module.exports = DB = {
    pool: false,
    debug: false,
    getPool: function () { //获取连接池
        if (!this.pool) {
            this.pool = require('mysql').createPool({
                //connectionLimit: Config.db.connectionLimit, //important
                host: Config.db.host,
                user: Config.db.user,
                password: Config.db.password,
                database: Config.db.database
            });
            this.debug = Config.debug
        }
        return this.pool;
    },

    execSql: async function (sql, sqlParam) {

        try {
            const conn = await new Promise((resolve, reject) => {
                this.getPool().getConnection((ex, conn) => {
                    if (ex) { reject(ex); } else { resolve(conn); }
                });
            });


            try {
                const qResult = await new Promise((resolve, reject) => {
                    conn.query(sql, sqlParam, (err, result) => {
                        if (err) { reject(err); } else { resolve(result); }
                    });
                });

                return { data: qResult, status: true };

            } finally {
                if (conn) conn.release();
            }



        } catch (err) {
            return { error: err, status: false };

        }

    },

    test: async function () { //执行测试SQL

        const that = this;
        const rs = await that.execSql("show tables");
        let _message = "database connect test is ok. \nshow tables:\n";

        if (rs.status) {
            let tables = [];
            for (var i = 0; i < rs.data.length; i++) {
                var obj = rs.data[i];
                for (var key in obj) {
                    tables.push(obj[key]);
                }
            }
            console.log(_message);
            return tables;
            
        } else {
            _message = "database connect test is failed. \nError:\n" + JSON.stringify(rs.error);
            console.log(_message);
            return rs.error;
        }
    }

}

