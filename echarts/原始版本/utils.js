import Axios from 'axios';
import echarts from 'echarts';
import qs from 'qs';

const DEV = process.env.NODE_ENV !== 'production'

let util = {

};


util.qs = qs;
/**
 * 页面添加title的方法
 */
util.title = function(title) {
    title = title ? title : 'Glodon BIM5D';
    window.document.title = title;
};
util.getCookie = function(key) {
    let cookieArr = document.cookie.split('; ');
    for (let i = 0; i < cookieArr.length; i++) {
        let arr = cookieArr[i].split('=');
        if (arr[0] === key) {
            return arr[1];
        }
    }
    return false;
}

/**
 * 生成cookie
 * @param {String} key   [cookie键名]
 * @param {String} value [cookie键值]
 * @param {Number} iDay  [cookie有效时间]
 */
util.setCookie = function(key, value, iDay) {
    if (iDay > 0) {
        let oDate = new Date();
        oDate.setDate(oDate.getDate() + iDay);
        // Cookie 的expires 属性指定浏览器可发送Cookie 的有效期。当省略expires 属性时，Cookie仅在浏览器关闭之前有效。
        document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString() + ';path=/';
    } else {
        document.cookie = key + '=' + value + ';path=/';
    }
}

util.removeCookie = function(key) {
    let oDate = new Date();
    oDate.setDate(oDate.getDate() - 1000); //更改为过去时间即可删除，需要指定path
    document.cookie = key + '=a; expires=' + oDate + ';path=/';
}

util.checkOut = function() {
    util.removeCookie('access_token');
    util.removeCookie('enterpriseTenantId');
    util.removeCookie('userName');
    window.location.href = BIM_BASE_CONFIG.enterprise.login;
}

/**
 * 从url上获取参数
 */
util.getUrlParams = function() {
    let arr = window.location.href.split('?');
    let _len = arr.length;
    // 后台管理的url是 /admin?index#/entry 需要取最后一个作为数据源
    if (_len > 1) {
        const param = qs.parse(arr[_len - 1]);
        return param;
    } else {
        return {}
    }
}

/**
 * 生成跳转项目url
 * @param id 项目id
 */
util.createProjectPath = function(id) {
    let access_token = util.getCookie('access_token');
    // let domain = 'http://bim5d-hunan.glodon.com';
    let domain = BIM_BASE_CONFIG.projectDomain;
    return `${domain}/api/v1/projects/${id}/index.html?access_token=${access_token}`;
}

/**
 * 重组数据源至符合函数generateChartData接收的格式
 * util.generateChartData(outData,keys)
 * example:
 * 把相同类型在不同年份下的数据整合在一个对象中
 * @param  {Object} obj
 * {
 *      key      去重字段,相同字段的对象只有一个
 *      target   合并字段，生成一个新key存放value的值
 *      value    取值字段
 * }
 *
 * @param {String}
 * @return {Object} {outData,keys}
 */
util.resetData = function(data, obj) {
        let key = obj.key;
        let target = obj.target;
        let value = obj.value;
        let outData = [];
        let temp = {};
        let keys = {};
        data.map((item) => {
                //如果没有就赋值
                if (!temp[item[key]]) {
                    temp[item[key]] = item;
                    item[value + item[target]] = item[value];
                    keys[value + item[target]] = item[target];
                    outData.push(item);
                    //相同字段的对象已有，在该对象下用一个新key存放value
                } else {
                    let a = temp[item[key]];
                    a[value + item[target]] = item[value];
                    keys[value + item[target]] = item[target];
                }
            })
            // console.log(keys)
            // console.log(outData)
        return { outData, keys };
    }
    /**
     * 初始化series
     * @param  {Object} keys [使用的数据源keys,映射关系 ]
     * @return {Array}      [series数组]
     */
util.initSeries = function(keys) {
    let series = [];
    //初始化图表series
    for (let key in keys) {
        series.push({
            name: keys[key],
            genre: key,
            data: []
        })
    }
    return series;
}

/**
 * 生成Echart数据格式
 * @param  {Array} data [数据源]
 * @param  {Object} keys [使用的数据源keys,映射关系 ]
 * @param  {String} xAxis [坐标轴]
 * @param  {String} extra [额外参数]
 * @return {Object}      [Echart数据格式]
 */
util.generateChartData = function(data, keys, xAxis, extra) {
        //初始化series
        let series = data.length ? util.initSeries(keys) : [];
        let column = [];
        //数组的话拼接数组中的各项
        if (xAxis instanceof Array) {
            data.map((item) => {
                let name = '';
                //坐标轴
                for (let i = 0; i < xAxis.length; i++) {
                    let a = xAxis[i];
                    if (i != xAxis.length - 1) {
                        name += item[a] + '年';
                    } else {
                        name += item[a];
                    }
                }
                column.push({
                        name: name,
                        extra: item[extra] ? item[extra] : null
                    })
                    //从每一项中取需要的值
                for (let key in keys) {
                    series.map((s) => {
                        if (s.name == keys[key]) {
                            s.data.push(item[key]);
                        }
                    })
                }
            });
        } else {
            data.map((item) => {
                //坐标轴
                column.push({
                        name: item[xAxis],
                        extra: item[extra] ? item[extra] : null
                    })
                    //从每一项中取需要的值
                for (let key in keys) {
                    series.map((s) => {
                        if (s.name == keys[key]) {
                            s.data.push(item[key]);
                        }
                    })
                }
            });
        }

        return { series, column }
    }
    /**
     * 生成Echarts柱图配置
     * @param  {Array} a [数据源，需要特定格式]
     * @param  {Object} o [series公共配置]
     * @param  {Array} c [颜色配置数组，生成线图时传入]
     * @return {Object}       [图表图例和主体]
     */
util.columnEchart = function(a, o = {}, c) {
        if (a instanceof Array) {

        } else {
            return;
        }
        let legend = [];
        let series = [];
        //生成线图时才传入c,调用渐变
        if (c) {
            a.map((item, index) => {
                if (item.type != 'scatter') {
                    let colorStyle = {
                        symbolSize: 8,
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: c[index]
                                }, {
                                    offset: 1,
                                    color: '#1c223a'
                                }])
                            }
                        },
                    }
                    item = Object.assign(colorStyle, item, o);
                }
                series.push(item);
                legend.push(item.name);
            });
        } else {
            a.map((item, index) => {
                let obj = Object.assign({}, item, o);
                series.push(obj);
                legend.push(item.name);
            });
        }
        return { legend, series };
    }
    /**
     * 生成Echarts饼图图例
     * @param  {Array} a [数据源，需要特定格式]
     * @return {Array}   [图例数组]
     */
util.pieEchart = function(a, obj, extra) {
        if (a instanceof Array) {

        } else {
            return
        }
        let legend = [];
        let series = [];
        let name = obj.name;
        let key = obj.key;
        a.map((item) => {
            legend.push({
                name: item[name],
                extra: item[extra]
            });
            series.push({
                name: item[name],
                value: item[key]
            })
        });
        return { legend, series };
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
    let parent = option.parent;
    let child = option.child ? option.child : 'children';
    let label = option.label;
    let labelName = option.labelName;
    let _level = 0;
    
    function a(data, id, child) {
        let result = [], temp;
        let _len = data.length;
        for (let i = 0; i < _len; i++) {
            let item = data[i];
            if (item[parent] == id) {
                if (id === null) _level = 0;
                _level++;

                let obj = {};
                Object.keys(item).forEach(key => {
                    obj[key] = item[key];
                });
                obj.id = item[targetId];
                obj[labelName] = item[label];
                
                temp = a(data, item[targetId], child);
                obj[child] = temp.length > 0 ? temp : [];
                result.push(obj);
                
                obj._level = result.length ? _level-- : _level;
            }
        }
        return result;
    }
    return a(data, null, child)
}
/**
 * 
 * @param {String} url 接口地址 
 * @param {Object} param 导出参数
 */
util.exportUrl = function(url, param) {
    let reg = /[\[\]\{\}]/;
    let normal = {},
        str = '';
    for (let key in param) {
        if (!reg.test(param[key])) {
            normal[key] = param[key];
        } else {
            str += `${key}=${param[key]}`
        }
    }
    let stringify = qs.stringify(normal);
    
    return str ? `${url}?${stringify}&` + encodeURI(`${str}`) : `${url}?${stringify}`;
}

/**
 * 获取从当前年开始之后的4年
 * @returns 
 */
util.getAfterFiveYears = function() {
    let arr = [];
    let currentYear = new Date().getFullYear();
    arr[0] = currentYear;
    for (let i = 0; i < 4; i++) {
        currentYear++
        arr.push(currentYear);
    }
    return arr;
}

util.formatValue = function(row, column) {
    let key = column.property;
    return row[key] != null ? row[key] : '-';
}

/**
 * @description 生成评分表URL
 * @param {Object} param {templateId, tenantId, access_token}
 * @param {String} reportType 报表类型
 * @return {String} reportURL
 */
util.generateReportURL = function (param, reportType) {
    let webReportHost = DEV ? 'http://10.1.83.98:8075/WebReport' : 'http://bim5d-report.glodon.com/report';
    let cptHost = DEV ? 'http://10.1.83.98:8899' : 'http://bimcc.glodon.com';
    let url = `${webReportHost}/ReportServer`;
    const reportlet = 'com.glodon.bim5d.report.enterprise.reportlet.EnterpriseReportlet';
    let query = {
        reportlet,
        ...param,
        token: param.access_token,
        cptUrl: `${cptHost}${BIM_BASE_CONFIG.baseURL}/enterprise/v4/enterprises/reports/${reportType}/downloadTemplate`
    }
    let queryURL = qs.stringify(query)

    return `${url}?${queryURL}`
}

export default util;
