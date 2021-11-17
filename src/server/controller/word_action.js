const httpUtil = require('../dao/httpUtil');
const wordLogic = require('../service/wordService');

const WordAction = {

    getWordList: async function (req, res) {

        console.log(req.body)
        let param = httpUtil.parseRequest(req);

        let filter = param.data;
        const result = await wordLogic.wordList(filter);

        httpUtil.Response.listFormat(res, result);
        // res.status(200).send(result);

    },

    getWordDetail: async function (req, res) {

        console.log(req.body)
        let param = httpUtil.parseRequest(req);

        const { error, data } = await wordLogic.wordDetail(param.data.wort, param.data.id);

        console.log(data);
        if (data?.length > 1)
            httpUtil.Response.listFormat(res, data, null, null, data?.length);
        else
            httpUtil.Response.detailFormat(res, data[0]);
        //res.status(200).send(result);

    },

    updateWord: async function (req, res) {

        console.log(req.body)
        let param = httpUtil.parseRequest(req);

        const result = await wordLogic.wordUpdate(param.data);
        httpUtil.Response.detailFormat(res, result.data[0]);

    },

    removeWord: async function (req, res) {

        console.log(req.body)
        let param = httpUtil.parseRequest(req);

        const result = await wordLogic.deleteWord(param.data);
        httpUtil.Response.detailFormat(res, result);
        //res.status(200).send(result);

    },
};

module.exports = WordAction;



