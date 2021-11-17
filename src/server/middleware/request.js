const cookieCache = require('./../dao/util.dao.cache').cookieCache;
const HttpUtil = require('./../dao/httpUtil');
const UserService = require('./../service/userService');

/**
 * 全局中间件，实现 token => user
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.autoUser = async (req, res, next) => {
    req.user = null;
    const _request = HttpUtil.parseRequest(req);
    const token = _request.token;

    console.log(`token ---> ${token}`);
    if (token) {
        let data = await cookieCache.get(token);
        // console.log(`data ---> ${JSON.stringify(data)}`)
        if (data) {
            req.user = data.user;
            req.tokenData = data;
            cookieCache.refresh(token);

        } else {
            let [err, user] = await UserService.doGetUserByToken(token);
            if (!err) {
                console.log(`token [${token}] redis 中过期，从 mysql 中获取 user_id ${user.id}`);
                cookieCache.set(token, { user });
                req.user = user;
            }
        }

    }

    next();

};


/**
 * 登录认证
 * @param req
 * @param res
 * @param next
 */
exports.requireUser = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        if (req.url.indexOf('/api/') === 0) {
            resUtil.error(res, 'no_login'); // error_code 兼容之前版本
        } else {
            res.redirect('/login?go=' + encodeURIComponent(req.url));
        }
    }
};
