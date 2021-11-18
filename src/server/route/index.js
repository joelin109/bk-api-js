/**
 * Created by joe on 11/3/17.
 */
const express = require('express');
const router = express.Router();
const config = require('../_config/apiConf');
const requireUser = require('../middleware/request').requireUser;
const CommonService = require('../service');
const UserAction = require('../controller/user_action');
const WordAction = require('../controller/word_action');

router.get(config.APIURL_DataBase_Connection_Testing, function (req, res) {

    CommonService.connectDataBase(req, res)

});


 router.post(config.APIURL_Content_Dictionary_List, requireUser, function (req, res) {

    WordAction.getWordList(req, res)

});  

router.post(config.APIURL_Content_Dictionary_Detail, function (req, res) {

    WordAction.getWordDetail(req, res)

}); 

router.post(config.APIURL_Content_Dictionary_Update, function (req, res) {

    WordAction.updateWord(req, res)

});


router.post(config.APIURL_Content_Dictionary_Remove, requireUser, function (req, res) {

    WordAction.removeWord(req, res)

});


module.exports = router;