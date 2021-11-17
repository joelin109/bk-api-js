/**
 * Created by joe on 10/11/2021.
 */
let StringUtil = require('../util/util.fw.string');
//require('../dao/util.fw.dao.msql');

async function execSqlForRowsNList(paramObj, sqlParam) {
    // Usage example:
    let rs = {
        error: null,
        except_case: "",
        except_case_desc: "",
        max_page: -1,
        cur_page: paramObj.pageNum ? paramObj.pageNum : -1,
        total_rows: -1,
        cur_rows: 0,
        rows: null,
        sql: paramObj.sql
    };

    try {
        const execCount = DB.execSql(paramObj.sqlCount, sqlParam);
        const execList = DB.execSql(paramObj.sql, sqlParam);
        const test_allSettled = new Promise((resolve, reject) => setTimeout(reject, 1, new Error("test Promise.allSettled reject")));
        const [testP, total, list] = await Promise.allSettled([test_allSettled, execCount, execList])
         
        console.log(testP.status === 'rejected' ? testP.reason : testP.value);
        console.log(total.value?.error ? total.value?.error?.sqlMessage : total.value);
        console.log(list.value ? list.value : list);

        const totalResult = total.value.data;
        const listResult = list.value.data;
        rs.rows = listResult;
        rs.cur_rows = listResult.length;

        if (totalResult) {
            const _pageSize = paramObj.pageSize ? paramObj.pageSize : rs.cur_rows;
            rs.total_rows = totalResult[0].TotalCount;
            rs.max_page = Math.floor(rs.total_rows / _pageSize) + ((rs.total_rows % _pageSize) > 0 ? 1 : 0);
        }
        else{
            rs.except_case = "Catch total_rows failure... ";
            rs.except_case_desc = total.value?.error?.sqlMessage;
        }

        return rs

    }
    catch (error) {
        console.log(error)
        rs.error = error;
        return rs;
    }

}

const wordLogic = {

    _add: async function (wordObj) {

        let _word = {
            wort: wordObj.wort,
            WortSex: wordObj.WortSex ? wordObj.WortSex : "-",
            plural: wordObj.plural ? wordObj.plural : "",
            zh: wordObj.zh ? wordObj.zh : "",
            type: wordObj.type ? wordObj.type : "",
            level: wordObj.level ? wordObj.level : "C",
            is_recommend: wordObj.isrecommend ? wordObj.isrecommend : 0,
            create_date: StringUtil.getDateString(new Date(), 'YYYYMMDDHHmmss'),
            last_update_date: StringUtil.getDateString(new Date(), 'YYYYMMDDHHmmss')
        };

        const _sql = "INSERT INTO content_dictionary_de "
            + "( wort, wort_sex , plural, type, zh, level, is_recommend, is_regel, publish_status, create_date, last_update_date) "
            + "VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?)";
        const _sqlParam = [_word.wort, _word.WortSex, _word.plural,
        _word.type, _word.zh, _word.level, _word.is_recommend,
        _word.create_date, _word.last_update_date];

        const { error, data } = await DB.execSql(_sql, _sqlParam);
        const isSuccess = data?.affectedRows == 1 ? true : false;
        console.log(_word);
        console.log(isSuccess);
        return isSuccess



    },
    wordList: async function (query) {

        const _pageNum = query.page_num ? parseInt(query.page_num) : 1,
            _pageSize = query.page_size ? parseInt(query.page_size) : 50
        const _limitSQL = "LIMIT " + _pageSize + " OFFSET " + ((_pageNum - 1) * _pageSize);

        let _filterSQL = "WHERE type = ?";
        let _sqlParam = [query.type];
        if (typeof (query.type) !== "undefined" && typeof (query.WortSex) !== "undefined" && query.type == "n") {

            _filterSQL = "WHERE type = ? AND wort_sex = ?";
            _sqlParam = [query.type, query.WortSex];

        } else if (typeof (query.type) !== "undefined" || typeof (query.WortSex) !== "undefined") {

            _filterSQL = query.type ? "WHERE type = ?" : "WHERE wort_sex = ?";
            _sqlParam = [query.type ? query.type : query.WortSex];

        } else if (typeof (query.type) == "undefined" && typeof (query.WortSex) == "undefined") {

            _filterSQL = "";
            _sqlParam = [];

        }

        const _sqlCount = "SELECT Count(id) AS TotalCount FROM content_dictionary_de " + _filterSQL;
        const _sql = "SELECT id, wort, wort_sex as WortSex, plural, type, zh, is_regel as isregel, is_recommend as isrecommend"
            + " FROM content_dictionary_de " + _filterSQL
            + " ORDER BY wort  " + _limitSQL;


        const sqlObj = {
            pageNum: _pageNum,
            pageSize: _pageSize,
            sqlCount: _sqlCount,
            sql: _sql
        }

        const result = await execSqlForRowsNList(sqlObj, _sqlParam);
        return result;

    },

    wordDetail: async function (wort, id) {

        const _sql = "SELECT id, wort, wort_sex as WortSex, plural, type, zh,en, level, is_regel as isregel, is_recommend as isrecommend, create_date"
            + " FROM content_dictionary_de WHERE id= ? OR wort = ?";

        return await DB.execSql(_sql, [id, wort]);
        //execSql({ sql: _sql, }, [id, wort]);

    },

    wordUpdate: async function (wordObj) {

        const that = this;
        const {error, data} = await that.wordDetail(wordObj.wort);

        if (data.length == 0) {
            await that._add(wordObj);
        } else {
            const _sql = "UPDATE content_dictionary_de set type = ?, zh= ?, "
                + "wort_sex = ?, level = ?, is_recommend = ? WHERE wort = ?";
            const _sqlParam = [wordObj.type,
            wordObj.zh,  //wordObj.zh ? wordObj.zh : ""
            wordObj.WortSex, wordObj.level, wordObj.isrecommend,
            wordObj.wort];

            const { error, data } = await DB.execSql(_sql, _sqlParam);
            if (!error && data?.affectedRows == 1) { console.log(data); }
            else {
                console.log('\nError:\n\r' + error?.sql + '\n- ' + error?.sqlMessage)
            }
            console.log(data); 

        }

        return await that.wordDetail(wordObj.wort);

    },


    deleteWord: async function (wordObj) {

        const that = this;
        const detailObj = await that.wordDetail(wordObj.wort);
        let _messgae = "Dieses Wort erfolgreich gelöscht, " + wordObj.wort;

        if (detailObj.data.length == 1) {

            const _sql = "DELETE FROM content_dictionary_de "
                + "WHERE wort = ? AND id = ?";
            const _sqlParam = [wordObj.wort, wordObj.id];
            const { error, data } = await DB.execSql(_sql, _sqlParam);

            console.log(data);
            if (!error && data?.affectedRows == 1) { 
                console.log(data); 
            }
            else if(data?.affectedRows == 0){
                return detailObj.data[0];
            }
            else {
                console.log('\nError:\n\r' + error?.sql + '\n- ' + error?.sqlMessage)
                _messgae = "Löschfehler, bitte überprüfen Sie die ID," + wordObj.id
            }

        }
        else{
            _messgae = "Es wurden keine mit der " + wordObj.wort
        }

        return _messgae;
        //return await that.wordDetail(wordObj.wort);

    },
};

module.exports = wordLogic;

