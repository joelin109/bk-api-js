let UserService = {};

UserService.doGetUserId = function (token, callback) {
  if (StringUtil.isEmpty(token)) {
    return callback({ msg: "token_not_null" });
  }
  var sql =
    "select user_id from t_login where delete_by is null and token=? order by create_at desc limit 1";
  DB.exec({
    sql: sql,
    param: [token],
    callback: function (result) {
      if (result.error) {
        return callback({ msg: "system_error" });
      }
      if (result.data && result.data.length) {
        callback(null, { user_id: result.data[0].user_id });
      } else {
        callback({ msg: "no_login" });
      }
    },
  });
};

UserService.doGetUserByToken = async function (token) {
  
   
    if (StringUtil.isEmpty(token)) {
      return ["token_not_null", null];
    }

    var sql =
      "select u.* from t_login l,t_user u where l.user_id=u.id and l.token=? order by l.create_at desc limit 1";
    const { error, data } = await DB.execSql(sql, [token]);
    if (error) {
      return resolve(["system_error", null]);
    }

    if (data && data.length) {
      data[0].password = null;
      return [null, data[0]];
    } else {
      return["no_login", null];
    }


};

module.exports = UserService;
