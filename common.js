/**
 * 完善typeof功能
 * @param {any} target 
 * @returns 
 */
function type(target) {
    // 第一步区分target为  原始值("string" "number" "undefined" "boolean" "function"和  引用值
    // 第二步区分引用值
    // Object.prototype.toString.call(target) 
    // 有可能返回的值为 
    let ret = typeof(target)
    let templateObject = {
        "[object Array]": 'array',
        "[object Object]": 'object',
        "[object String]": 'string-object',
        "[object Number]": 'number-object',
        "[object Boolean]": 'boolean-object'
    }
    if (target === null) {
        return 'null'
    } else if (ret == 'object') {
        var str = Object.prototype.toString.call(target)
        return templateObject[str]
    } else {
        return ret
    }
}
// 数组has去重法
Array.prototype.unique = function() {
    var temp = {},
        arr = [],
        i,
        len = this.length
    for (i = 0; i < len; i++) {
        if (!temp[this[i]]) {
            temp[this[i]] = 'abc'
            arr.push(this[i])
        }
    }
    return arr
}

/**
 * 把一个值转换成任意进制
 * @param {any} value 要转换的目标
 * @param {any} num  要转换成的进制数
 * @returns 
 */
function transcoder(target, curRadix, targetRadix) { // 未完成
    let newTarget = parseInt(target, curRadix) // 以curRadix进制为基底转换成10进制
        // parseInt(variable, '进制数') 把variable 以进制数为基底 转成 10进制
    newTarget.toString(targetRadix) // 以十进制为基底转换成targetRadix进制数
    return newTarget
}


/**
 * 封装原生获取dom对象的方式
 * @param {any} select 
 * @returns 
 */
function $(select) {
    var obj = null;
    if (select.substring(0, 1) == "#") {
        obj = document.getElementById(select.substring(1));
    } else if (select.substring(0, 1) == ".") {
        obj = document.getElementsByClassName(select.substring(1));
    } else {
        obj = document.getElementsByTagName(select);
    }
    return obj;
}

/**
 * 判断是否是闰年
 * @param {any} year 
 * @returns 
 */
function checkLeapYear(year) {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
        return true;
    } else {
        return false;
    }

}

/**
 * @returns 
 */
function checkNum() {
    //��������������֣��򷵻�true�������һ���Ƿ����֣��򷵻�false
    // arguments实参列表
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i].length == 0) {
            return false;
        }
        if (isNaN(arguments[i])) {
            return false;
        }
    }
    return true;
}

/**
 * @param {any} n 
 * @returns 
 */
function getNumUnit(n) {
    if (checkNum(n)) {
        //���n��һ�����֣����������ĸ�λ��ʮλ����λ����
        var arr = [];
        while (n) {
            arr.push(n % 10);
            // arr.unshift(n%10);
            n = parseInt(n / 10);
        }
        // console.log(arr.join());
        return arr;
    } else {
        console.log(n + " ����һ������");
        return null;
    }

}

/**
 * @param {any} n 
 * @returns 
 */
function checkPrime(n) {
    if (checkNum(n)) {
        if (n <= 3) {
            return n > 1;
        }
        if (n % 2 == 0 || n % 3 == 0) {
            return false;
        }
        for (var i = 2; i < n; i++) {
            if (n % i == 0) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

/** 
 * @param {any} n 
 * @returns 
 */
function checkPrime2(n) {
    for (var i = 2; i < n; i++) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
}

/**
 * @param {any} n 
 * @returns 
 */
function factorial(n) {
    for (var i = 1, fact = 1; i <= n; i++) {
        fact *= i;
    }
    return fact;
}

/**
 * n的阶乘
 * @param {any} n 
 * @returns 
 */
function fact(n) {
    if (n == 1) {
        return 1;
    }
    return n * fact(n - 1);
}

/**
 * n 的阶加
 * @param {any} n 
 * @returns 
 */
function addPlus(n) {
    if (n == 1) {
        return 1;
    }
    return n + addPlus(n - 1);
}

/**
 * @param {any} str 
 * @param {any} arr 
 * @param {any} reChar 
 * @returns 
 */
function sensitiveRreplace(str, arr, reChar) {
    for (var i = 0; i < arr.length; i++) {
        var reg = new RegExp(arr[i], "g");
        str = str.replace(reg, reChar);
    }
    return str;
}

/**
 * @param {any} arr 
 * @param {any} n 
 * @returns 
 */
function getIdentifiedCode(arr, n) {
    var tmp = "";
    while (tmp.length < n) {
        var i = Math.floor(Math.random() * arr.length);
        // console.log(i);
        var reg = new RegExp(arr.charAt(i), "i");
        if (tmp.search(reg) == -1) {
            tmp += arr.charAt(i);
        }
    }
    return tmp;
}
/**
 * 獲取文件後綴名
 * @param {any} fileName 
 * @returns 
 */
function getFileSuffix(fileName) {
    return fileName.substring(fileName.lastIndexOf('.') + 1)
}
/**
 * 求絕對值
 * @param {any} num 
 * @returns 
 */
function getAbs(num) {
    return num > 0 ? num : -num
}
/**
 * 压缩字符串
 * @param {any} str 
 * @returns 
 */
function zipStr(str) {
    var newStr = ''
    for (let i = 0; i < str.length; i++) {
        var count = 1
        for (let j = i + 1; j < str.length; j++) {
            if (str.charAt(i) !== str.charAt(j)) {
                break
            } else {
                count++
            }
        }
        newStr += str.charAt(i) + count
        i = j
    }
    return newStr
}
/**
 * 字符串去重
 * @param {any} str 
 * @returns 
 */
function strDeWeight(str) {
    str = str.split('').sort().join('')
    let newStr = ''
    for (let i = 0; i < str.length; i++) {
        if (str.charAt(i) !== str.charAt(i + 1)) {
            newStr += str.charAt(i)
        }
    }
    return newStr
}


/**
 * 正数n的阶乘
 * @param {any} n 
 * @returns 
 */
function factorial(n) {
    if (n === 1 || n === 0) {
        return 1;
    } else {
        return n * factorial(n - 1)
    }
}
/**
 * 函数性能优化之函数记忆
 * 适用于本次执行依赖于上次执行产生的结果
 * @param {any} fn 
 * @returns 
 */
function ddd(fn) {
    var cache = {} // 用对象来做记忆载体是因为 对象的查找性能比数组更优
    return function() {
        var key = arguments.length + Array.prototype.join.call(arguments)
        if (cache[key]) {
            return cache[key]
        } else {
            cache[key] = fn.apply(this, arguments)
            return cache[key]
        }
    }
}
// 优化n！
var newFactorial = memorize(factorial)


/**
 * 获取滚动条的滚动距离
 * @returns 
 */
function getScrollOffset() {
    if (window.pageXOffset) { // 标准浏览器
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    } else { // IE8及以下
        return {
            x: document.body.scrollLeft + document.Element.scrollLeft,
            y: document.body.scrollTop + document.Element.scrollTop
        }
    }
}

/**
 * 获取当前浏览器可视区窗口尺寸
 * @returns 
 */
function getViewPortOffset() {
    if (window.innerWidth) { // 标准模式
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    } else {
        if (document.compatMode === 'BackCompat') { // IE怪异模式
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight
            }
        } else { // IE标准模式
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight
            }
        }
    }
}
/**
 * 格式化时间
 * @param {any} oDate 
 * @param {any} fmt 
 * @returns 
 */
function dateFormat(oDate, fmt) {
    var o = {
        'M+': oDate.getMonth() + 1, //月份
        'd+': oDate.getDate(), //日
        'h+': oDate.getHours(), //小时
        'm+': oDate.getMinutes(), //分
        's+': oDate.getSeconds(), //秒
        'q+': Math.floor((oDate.getMonth() + 3) / 3), //季度
        'S': oDate.getMilliseconds() //毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}


// 克隆数组

function cloneArr(arr) {
    var newArr = []
    for (let i = 0; i < arr.length; i++) {
        // 判断arr[i]的类型
        // 如是string， number， undefined， null， boolean，
        // 如是 object
        // 如是 array
        switch (type(arr[i])) {
            case 'null':
                newArr.push(arr[i])
                break;
            case 'object':
                newArr.push(Object.assign({}, arr[i]))
                break;
            case 'array':
                newArr.push(cloneArr(arr[i]))
                break;
            default:
                break;
        }
    }
    // 第一次进来 arr 肯定是数组，
    return newArr
}

/**
 *深度克隆
 *
 * @param {*} origin
 * @param {*} target
 */
function deepClone(origin, target) {
    // 判断是对象还是数组的方法
    // constructor, instanceof, toString
    let [target, toStr, arrStr] = [target || {}, Object.prototype.toString, '[object Array]']
    for (let key in origin) {
        // 判断属性值是原始值还是引用值
        if (origin.hasOwnProlperty(key)) {
            if (origin[key] !== null && typeof origin[key] === 'object') {
                // 判断是数组还是对象
                if (toStr.call(origin[key]) === arrStr) {
                    target[key] = []
                } else {
                    target[key] = {}
                }
                // target[key] = toStr.call(origin[key]) === arrStr ? [] : {}
                deepClone(origin[key], target[key])
            } else {
                target[key] = origin[key]
            }
        }
    }

}

/**
 * @param  {} event
 */
function keyCode(event) {
    event = event || window.event
    let keyCode = event.keyCode || event.which || event.charCode
    return keyCode
}

// 计算字符串字节
// 根据unicode 0-255 占一个byte  256-- 占2个bytes
function getBytesd (str) {
    let bytes = str.length
    for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) bytes++
    }
    return bytes
}