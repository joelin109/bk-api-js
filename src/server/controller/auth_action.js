const httpUtil = require('../dao/httpRequestUtil');

const AuthAction = {


    doSignin: async function (req, res) {

        console.log(req.body)

        const result = await DB.test();
        httpUtil.Response.commonFormat(res, result);

    },


    /**
     * 注册
     */
    doSignup: async function (req, res) {

        console.log(req.body)

        const result = await DB.test();
        httpUtil.Response.commonFormat(res, result);

    },


    /**
     * 发送验证码(手机、邮箱)
     */
    doSendVerificationCode: function (req, res) {
    },


    /**
     * 检验验证码(手机、邮箱)
     */
    doCheckVerificationCode: function (req, res) {
    },

    
    /**
     * 检验验证码(手机、邮箱)
     */
    doResetPassword: function (req, res) {
    },


};

module.exports = AuthAction;