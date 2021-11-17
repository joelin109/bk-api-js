let UserService = {};

UserService.doGetUserId = function (token, callback) {
    if (StringUtil.isEmpty(token)) {
        return callback({ msg: 'token_not_null' });
    }
    var sql = "select user_id from t_login where delete_by is null and token=? order by create_at desc limit 1";
    DB.exec({
        sql: sql,
        param: [token],
        callback: function (result) {
            if (result.error) {
                return callback({ msg: "system_error" });
            }
            if (result.data && result.data.length) {
                callback(null, { user_id: result.data[0].user_id })
            } else {
                callback({ msg: "no_login" });
            }
        }
    });
}

UserService.doGetUserByToken = function (token) {
    return new Promise((resolve, reject) => {
        if (StringUtil.isEmpty(token)) {
            return reject(['token_not_null', null]);
        }
        var sql = "select u.* from t_login l,t_user u where l.user_id=u.id and l.token=? order by l.create_at desc limit 1";
        DB.exec({
            sql: sql,
            param: [token],
            callback: function (result) {
                if (result.error) {
                    return resolve(["system_error", null]);
                }
                if (result.data && result.data.length) {
                    result.data[0].password = null;
                    resolve([null, result.data[0]])
                } else {
                    resolve(["no_login", null]);
                }
            }
        });
    })

}


module.exports = UserService;