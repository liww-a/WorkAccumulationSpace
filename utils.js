let util = {

};

/**
 * 页面添加title的方法
 */
util.title = function(title) {
    title = title ? title : 'Glodon BIM5D';
    window.document.title = title;
};


/**
 *  @比较新旧两个函数，返回被删除的数组和新添加的数组
 *  @params oldArr：旧数组
 *  @params newArr 新数组
 *
 */

util.addArr = function(oldArr, newArr) {
    var oldLen = oldArr.length;
    var newLen = newArr.length;
    var arr = [];
    for (var i = 0; i < oldLen; i++) {  
        for (var j = 0; j < newLen; j++) {
            if (oldArr[i] == newArr[j]) {   arr.push(oldArr[i]);   }  
        }
    }
    var addArr = [];
    for (var n = 0; n < newLen; n++) {
        if (arr.indexOf(newArr[n]) < 0) {
            addArr.push(newArr[n]);
        }
    }
    return addArr;
}

util.delArr = function(oldArr, newArr) {
    var oldLen = oldArr.length;
    var newLen = newArr.length;
    var arr = [];
    for (var i = 0; i < oldLen; i++) {  
        for (var j = 0; j < newLen; j++) {
            if (oldArr[i] == newArr[j]) {   arr.push(oldArr[i]);   }  
        }
    }
    var delArr = [];
    for (var n = 0; n < oldLen; n++) {
        if (arr.indexOf(oldArr[n]) < 0) {
            delArr.push(oldArr[n])
        }
    }
    return delArr;
}


/**
 * @ 获取cookie方法；
 * @params key需要获取的键值；
 */
util.getCookie = function(key) {
    var cookieArr = document.cookie.split('; ');
    for (var i = 0; i < cookieArr.length; i++) {
        var arr = cookieArr[i].split('=');
        if (arr[0] === key) {
            return arr[1];
        }
    }
    return false;
}

util.setCookie = function(key, value, iDay) {
        if (iDay > 0) {
            var oDate = new Date();
            oDate.setDate(oDate.getDate() + iDay);
            // Cookie 的expires 属性指定浏览器可发送Cookie 的有效期。当省略expires 属性时，Cookie仅在浏览器关闭之前有效。
            document.cookie = key + '=' + value + ';expires=' + oDate + ';path=/';
        } else {
            document.cookie = key + '=' + value + ';path=/';
        }
    }
    /**
     * 数组转递归
     * @param  {Array} data   [数据源]
     * @param  {Object} option [配置项]
     * id 默认为id
     * label 接口中的key
     * labelName tree中的key
     * parent   父id key
     * @return {Array}        [递归数组]
     */
util.getTree = function(data, option) {
    let targetId = option.id ? option.id : 'id';
    let label = option.label;
    let labelName = option.labelName;
    let parent = option.parent;

    function a(data, id, child) {
        let result = [],
            temp;
        child = child ? child : 'children';
        let _len = data.length;
        for (let i = 0; i < _len; i++) {
            let item = data[i];
            if (item[parent] == id) {
                let obj = {};
                for (let key in item) {
                    obj[key] = item[key]
                }
                obj[labelName] = item[label];
                obj.id = item[targetId];
                temp = a(data, item[targetId], child);
                if (temp.length > 0) {
                    obj[child] = temp;
                }
                result.push(obj);
            }
        }
        return result;
    }
    return a(data)
}

/**
 * 正则匹配特殊字符
 */
util.patrn = new RegExp('[,<,>,;]');


/**
 * 自定义form表单输入项特殊字符验证
 * @returns form表单验证规则
 */
util.formChars = function() {
    let reg = new RegExp('[",<,>,;]')
    const chars = (rule, value, callback) => {
        if (value.length !== value.trim().length) {
            callback(new Error());
        } else if (reg.test(value)) {
            callback(new Error());
        }
        callback();
    }
    return {
        validator: chars,
        message: '请不要输入特殊字符',
        trigger: 'blur'
    }
}

export default util;