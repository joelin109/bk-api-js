module.exports = SessionUtil = {

    load:function(req){ //加载session
        var session = req.session;
        session.lastVisitAt=new Date();
        session.lastVisitUrl=req.url+(req.url.query?('?'+req.url.query):'');
        session.count = session.count || 0;
        session.count++;
        console.log('sessionId='+session.id+', userId='+SessionUtil.getUserId(req)+', session='+JSON.stringify(session));
        return session;
    },
    getUserObj: function (req) { //获取用户对象
        if(!req.session.userSession){
            return {"id":0,"login":""};
        }
        return req.session.userSession;
    },
    getSessionId:function(req){ //获取session id
        return req.session?req.session.id:"";
    },
    saveUserObj: function (req, user) { //保存对象
        req.session.userSession=user;
    },
    saveImageCode: function (req, imgcode) { //保存图片验证码
        req.session.imgcode=imgcode;
    },
    getImageCode: function (req) { //获取图片验证码
        return req.session.imgcode;
    },
    saveMobileCode: function (req, mobilecode) { //保存手机验证码
        req.session.mobilecode=mobilecode;
    },
    getMobileCode: function (req) { //获取手机验证码
        return req.session.mobilecode;
    },
    /**
     * 清Session
     * 所有存在Session中的数据，登出必须清除
     */
    clearSession: function (req,callback) {//清除session
        // if (req && req.session) {
        // if (req.session.userSession) {
        //     delete req.session.userSession
        // }
        // if (req.session.menuAccess) {
        //     delete req.session.menuAccess
        // }
        // if (req.session.wechat_redirect) {
        //     delete req.session.wechat_redirect
        // }
        req.session.destroy(function () {
            callback && callback()
        })
        // }
    },
    getUserId: function (req) { //获取用户 id
        return this.getUserObj(req).id;
    },
    getIp: function (req) { //获取ip
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    },
    getUserAgent: function (req) { //获取浏览器
        return req.headers['user-agent'];
    },
    getReferer: function (req) { //获取上一个来源网址
        return req.headers['Referer'];
    }
};