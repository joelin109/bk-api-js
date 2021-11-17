const httpUtil = require('../dao/httpUtil');

const CommonService = {


    connectDataBase: async function (req, res) {

        console.log(req.body)

        const result = await DB.test();
        httpUtil.Response.commonFormat(res, result);

    },
};

module.exports = CommonService;