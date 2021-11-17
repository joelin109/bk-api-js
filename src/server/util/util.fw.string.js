let crypto = require('crypto');
let moment = require('moment');
let Config_server_hostKey = 'd01'

module.exports = StringUtil = {

    YYYYMMddHHMMSS : 'YYYY-MM-DD HH:mm:ss',
    trim: function (s) {  //删除左右空格
        if(typeof(s)=='string'){
            return s.replace(/^\s*|\s*$/g, "");
        }
        return ''+s;
    },
    isNull: function (s) { //判断是否为空
        return typeof(s) == 'undefined' || !s || s == null || s == '';
    },
    isEmpty: function (s) { //判断是否为空字符串
        return typeof(s) == 'undefined' || !s || s == null || this.trim(s) == '';
    },
    getRandString: function (len) { //获取随机字符串
        var a = "", b = "abcdefghjkmnpqrstuvwxyz0123456789ABCDEFGHJKMNPQRSTUVWXYZ", c = b.length;
        for (var i = 0; i < len; i++) {
            a += b.charAt(Math.floor(Math.random() * c));
        }
        return a;
    },
    getRandNumber: function (len) { //获取随机数字
        var a = "", b = "0123456789", c = b.length;
        for (var i = 0; i < len; i++) {
            a += b.charAt(Math.floor(Math.random() * c));
        }
        return a;
    },
    getRandLetter: function (len) { //获取随机字母
        var a = "", b = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ", c = b.length;
        for (var i = 0; i < len; i++) {
            a += b.charAt(Math.floor(Math.random() * c));
        }
        return a;
    },
    isInt: function (s) { //判断是否为数字
        if (!s || s.length == 0) return false;
        for (var i = 0; i < s.length; i++) {
            if ('1234567890'.indexOf(s.charAt(i)) < 0) {
                return false;
            }
        }
        return true;
    },
    getInt: function (s, defaultValue) { //获取数字
        return this.isInt(s) ? parseInt(s) : defaultValue;
    },
    getSqlWhere0: function (param) { //拼接查询sql
        var s = '';
        if (param && param.keys.length > 0) {
            for (var i = 0; i < param.keys.length; i++) {
                if(param.keys[i].indexOf('=')<0){
                    s += ' and ' + param.keys[i] + '=?';
                }else{
                    s += ' '+param.keys[i] ;
                }
            }
        }
        return s;
    },
    getSqlWhere2: function (param,begin, end,tag) { //拼接查询sql
        var s = begin;
        if (param && param.length > 0) {
            for (var i = 0; i < param.length; i++) {
                s+=tag;
            }
        }
        s+=end;
        return s;
    },
    getSqlWhere: function (param) { //拼接查询sql
        var s = '';
        if (param && param.length > 0) {
            for (var i = 0; i < param.length; i++) {
                var o=param[i];
                if(o.name && o.name!="-"){
                    s+=' and '+ o.name+o.sqlValue;
                }else{
                    s += ' '+ o.sqlValue;
                }
            }
        }
        return s;
    },
    addParam:function(list,req,name,type,sqlValue){ //添加参数
        var s=this.getParam(req,name,"");
        if(!this.isEmpty(s)){
            list.push({name:name,type:type,value:s,sqlValue:sqlValue});
        }
    },
    getSqlValues: function (param) { //获取sql的对应值
        var s = [];
        if (param && param.length > 0) {
            for (var i = 0; i < param.length; i++) {
                var o=param[i];
                if(!this.isEmpty(o.name)){
                    if(o.type=='like'){
                        s.push("%"+o.value+"%");
                    }else{
                        s.push(o.value);
                    }
                }
            }
        }
        return s;
    },
    getSqlOrder: function (sql,row,orderBy,orderValue) { //获取排序 sql
        if(!this.isEmpty(orderBy)){
            sql+=" order by "+orderBy;
            if(!this.isEmpty(orderValue)){
                sql+=" "+orderValue;
            }
        }
        if(row && row>0){
            sql+=" limit "+row;
        }
        return sql;
    },
    getParam: function (req, name, defaultValue) { //获取参数值
        var s = req.body[name];
        if (typeof(s) == 'undefined') {
            s = req.params[name];
        }
        if (typeof(s) == 'undefined') {
            s = req.query[name];
            if(typeof(defaultValue)=='number'){
                if(this.isEmpty(s)){
                    s=defaultValue;
                }else{
                    s=parseFloat(s);
                    if(isNaN(s)){
                        s=defaultValue;
                    }
                }
            }
        }
        if (typeof(s) == 'undefined') {
            s = defaultValue;
        }
        return s;
    },
    splits: function (txt, flag, filter, isTrim, isUnique, includeText) { //分割字符串
        if (this.isEmptytxt) {
            return null;
        }
        if (!flag || flag == "") {
            return [txt];
        }
        var startIdx = 0, idxOld = 0, list = [], len = flag.length, len2 = txt.length, s = null;
        while ((idxOld = txt.indexOf(flag, startIdx)) >= 0) {
            s = txt.substring(startIdx, idxOld);
            if (isTrim) {
                s = this.trim(s);
            }
            if (filter != null) {
                if (s == filter) {
                    startIdx = idxOld + len;
                    continue;
                }
            }
            if (includeText && includeText != "") {
                if (s.indexOf(includeText) == -1) {
                    startIdx = idxOld + len;
                    continue;
                }
            }
            if (isUnique) {
                if (list.indexOf(s) == -1) {
                    list.push(s);
                }
            } else {
                list.push(s);
            }
            startIdx = idxOld + len;
        }
        if (startIdx < len2) {
            s = txt.substring(startIdx);
            if (isTrim) {
                s = this.trim(s);
            }
            if (filter != null) {
                if (s == filter) {
                    s = null;
                }
            }
            if (s != null) {
                if (isUnique) {
                    if (list.indexOf(s) == -1) {
                        list.push(s);
                    }
                } else {
                    list.push(s);
                }
            }
        }
        return list;
    },
    getText: function (txt, begin, end, defaultValue, fromEnd) { //获取字符串
        var s = null;
        if (!this.isEmpty(txt)) {
            var i = 0;
            if (!this.isEmpty(begin)) {
                i = txt.indexOf(begin);
            }
            if (i != -1) {
                var j = txt.length;
                if (!this.isEmpty(end)) {
                    if (fromEnd) {
                        j = txt.lastIndexOf(end);
                    } else {
                        j = txt.indexOf(end, i + begin.length);
                    }
                }
                if (j != -1) {
                    if (!begin) {
                        s = this.trim(txt.substring(j+1));
                    }else{
                        s = this.trim(txt.substring(i + begin.length, j));
                    }
                }
            }
        }
        if (s == null) {
            s = defaultValue;
        }
        return s;
    },
    getTitle:function(s,len,ext){ // 截取标题
        if(StringUtil.isEmpty(s)){
            s="";
        }else{
            if(len>0){
                if(StringUtil.isNull(ext)){
                    ext="";
                }
                if(s.length>len){
                    s=s.substring(0,len)+ext;
                }
            }
        }
        return s;
    },
    getHtmlText:function(s,len,ext){ //获取html text
        if(StringUtil.isEmpty(s)){
            s="";
        }else{
            s=s.replace(/<[^>].*?>/g,"");
            s=s.replace(/[ \r\n\t ]/g," ");
            s=s.replace(/\s+/g," ");
            s=StringUtil.trim(s);
            s=StringUtil.getTitle(s,len,ext);
        }
        return s;
    },
    getArray:function(start,end){ //获取数组
        var o=[];
        for(var i=start;i<=end;i++){
            o.push(i);
        }
        return o;
    },
    getKeyValues:function(txt,tag1,tag2){ //获取value
        if(txt && tag1 && tag2) {
            var a=StringUtil.splits(txt,tag1,"",true,true),o=[];
            if(a){
                for(var i=0;i< a.length;i++){
                    var b=this.getKeyValue(a[i],tag2);
                    if(b){
                        o.push(b);
                    }
                }
            }
            if(o.length>0) return o;
        }
        return false;
    },
    getKeyValue:function(txt,tag){ //获取value
        if(txt && tag) {
            var i=txt.indexOf(tag);
            if(i!=-1){
                return {"label":this.trim(txt.substring(0,i)), "value": this.trim(txt.substring(i+tag.length))};
            }
        }
        return false;
    },
    getDate:function(date){ //获取日期
        var t=typeof(date);
        if(t=='string'){
            date = date.replace(/-/g,"/");
            date=new Date(date);
        }else if(t=='number'){
            date=new Date(date);
        }else if(t!='object'||!date){
            date=null;
        }
        return date;
    },
    toHex:function(txt){ // to hex
        var s="";
        if(!this.isEmpty(txt)){
            for(var i = 0; i < txt.length; i++){
                s += txt.charCodeAt(i).toString(16);
            }
        }
        return s;
    },
    getDateString:function(date,format){ //获取日期
        if(!format) format=this.YYYYMMddHHMMSS;
        if(!date) date=new Date();
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "D+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "H+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(format) || /(Y+)/.test(format)){
            format=format.replace(RegExp.$1, (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(format)){
                format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return format;
    },
    print:function(){ //打印
        if(arguments){
            for(var i=0;i<arguments.length;i++){
                console.log("["+i+"]=["+JSON.stringify(arguments[i])+"]");
            }
        }
    },
    error:function(){//打印错误
        if(arguments){
            for(var i=0;i<arguments.length;i++){
                console.error(arguments[i]);
            }
        }
    },
    isBoolean:function(o){ //是否boolean
        return Object.prototype.toString.call(o) ==="[object Boolean]";
    },
    isArray:function(o){ //是否array
        return Object.prototype.toString.call(o) === '[object Array]';
    },
    isJsonObj:function(o){ //是否json
        return Object.prototype.toString.call(o) === '[object Object]';
    },
    isJsonObjArray:function(o){ //是否json array
        if( this.isArray(o) && o.length>0){
            for(var i=0;i< o.length;i++){
                if(!this.isJsonObj(o[i])){
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    getArrayFromJsonObj:function(keys,obj){ //从json对象转成array
        var r=[];
        if(keys && obj){
            for(var i=0;i<keys.length;i++){
                r.push(obj[keys[i]]);
            }
        }
        return r;
    },
    getArraysFromJsonObj:function(keys,objs){ //从json对象转成array
        var r=[];
        if(keys && objs){
            for(var i=0;i<objs.length;i++){
                r.push(this.getArrayFromJsonObj(keys,objs[i]));
            }
        }
        return r;
    },
    toCharArray:function(s){ //转成字符串数组
        var a=[];
        if(s&&s!=""){
            for(var i=0;i< s.length;i++){
                a.push(s.charAt(i));
            }
        }
        return a;
    },
    getStringFromArray:function(o,flag){ //从数组转成字符串
        var s="";
        if(this.isArray(o)){
            if(this.isJsonObjArray(o)){
                s= JSON.stringify(o);
            }else{
                if(typeof(flag)=="undefined" || typeof(flag)=="boolean" ){
                    s= JSON.stringify(o);
                }else{
                    for(var i=0;i< o.length;i++){
                        s+=o[i];
                    }
                }
            }
        }
        return s;
    },
    getString:function(txt,defaultValue,isTrim){ //获取字符串
        if(typeof(defaultValue)=="undefined"){
            defaultValue="";
        }
        if(typeof(isTrim)=="undefined"){
            isTrim=true;
        }
        if(typeof(txt)=="string"){
            if(txt!="" && isTrim){
                txt=txt.trim();
            }
            return txt;
        }else if(typeof(txt)=="undefined" || txt==null){
            return defaultValue;
        }else{
            return ""+txt;
        }
    },
    clone:function(o){ //复制对象
        if(o && this.isJsonObj(o)){
            var rs={};
            for(var key in o){
                rs[key]=o[key];
            }
            return rs;
        }else{
            return o;
        }
    },
    checkProperties:function(o, columns){ //检查属性
        if(o && this.isJsonObj(o)){
            var rs={};
            for(var key in o){
                if(this.hasProperty(key,columns)){
                    rs[key]=o[key];
                }
            }
            return rs;
        }
        return o;
    },
    hasProperty:function(key, columns){ //判断是否有属性
        if(key && columns ){
            var len=columns.length;
            for(var i=0;i<len;i++){
                if(key==columns[i].name){
                    return true;
                }
            }
        }
        return false;
    },
    toThousands: function (input) {
        if (!input || input == '') {
            return '0.00';
        }
        input = Number(input).toFixed(2).toString();
        var result;
        var int = '';//整数部分
        var decimal = '';//小数部分
        if (input.indexOf(".") >= 0) {
            decimal = input.split('.')[1];
            int = input.split('.')[0];
        } else {
            int = input;
        }
        var int_result = '';
        while (int.length > 3) {
            int_result = ',' + int.slice(-3) + int_result;
            int = int.slice(0, int.length - 3);
        }
        if (int) {
            int_result = int + int_result;
        }
        if (decimal.length == 0) {
            decimal = '00'
        }
        result = int_result + '.' + decimal;
        return result;
    },
    getOrderId:function () {
        return moment().format('YYYYMMDDHHmm') + this.getRandString(5);
    },
    toNumberFix:function (str) {
        if(isNaN(str)){
            return '0.00'
        }
        return Number(str).toFixed(2);
    },
    checkSign:function (obj, key, sign) {
        var md5 = function(str){//获取参数
            var sign = crypto.createHash('md5').update(str, 'utf8').digest("hex").toUpperCase();
            console.log("sign==="+sign);
            return sign
        };

        var combo = function (obj,key) {
            var keys = Object.keys(obj);
            keys = keys.sort();
            var str = [];
            keys.forEach(function (objkey) {
                if(obj[objkey]){
                    str.push(objkey+"="+obj[objkey])
                }
            });
            str = str.join('&');
            console.log(str);
            str = str + "&key="+key
            console.log(str);
            return str;
        }

        return md5(combo(obj,key)) === sign

    },
    getId: function() { //获取ID
        return Config_server_hostKey+new Date().getTime()+this.getRandString(10);
    },
};

//module.exports = StringUtil;


/*checkSign*/