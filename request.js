import Axios from 'axios';
import qs from 'qs';
import {
  Message
} from 'element-ui';
import utils from 'utils/utils';

/**
 * 设置公共请求头access_token
 */
const access_token = utils.getCookie('access_token');
Axios.defaults.headers.common['Authorization'] = `bearer ${access_token}`;

/**
 * post
 * @param  {String} url    [地址]
 * @param  {Object} params [参数]
 * @return {Object}        [Promise]
 */
export const $get = (url, params) => {
  return new Promise((resolve, reject) => {
    Axios.get(url, {
      params: {
        ...params,
        _t: new Date().getTime(),
      }
    }).then((res) => {
      if (res.status === 200) {
        if (res.data.code == 0) {
          resolve(res.data)
        } else {
          failMessage(res.data.message);
          reject(res)
        }
      } else {
        failMessage()
        reject(res)
      }
    }).catch((mes) => {
      if (mes.response.status == 401) {
        failMessage('您身份已过期，3秒后返回登录页面');
        utils.setCookie('access_token', '');
        setTimeout(() => {
          // window.location.href = '/static/managerTool/pages/login/login.html';
        }, 3000);
      } else {
        failMessage();
        reject(mes);
      }
    })
  })
}
/**
 * post
 * @param  {String} url    [地址]
 * @param  {Object} {Array} params [参数,可直接传入一个数组]
 * @param  {String} type   [可不传，设定为form为formdata提交]
 * @return {Object}        [Promise]
 */
export const $post = (url, params, type) => {
  if (type == 'form') {
    return new Promise((resolve, reject) => {
      Axios.post(url, qs.stringify(params)).then((res) => {
        if (res.status === 200) {
          if (res.data.code == 0) {
            resolve(res.data)
          } else {
            failMessage(res.data.message);
            reject(res)
          }
        } else {
          failMessage()
          reject(res)
        }
      }).catch((mes) => {
        failMessage()
        reject(mes)
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      let type = Object.prototype.toString.call(params);
      if (type == '[object Array]') {
        Axios.post(url, params).then((res) => {
          if (res.status === 200) {
            if (res.data.code == 0) {
              resolve(res.data)
            } else {
              failMessage(res.data.message)
              reject(res)
            }
          } else {
            failMessage()
            reject(res)
          }
        }).catch((mes) => {
          if (mes.response.status == 401) {
            failMessage('您身份已过期，3秒后返回登录页面');
            utils.setCookie('access_token', '');
            setTimeout(() => {
              window.location.href = '/static/managerTool/pages/login/login.html';
            }, 3000);
          } else {
            failMessage();
            reject(mes);
          }
        })
      } else {
        Axios.post(url, {
          ...params
        }).then((res) => {
          if (res.status === 200) {
            if (res.data.code == 0) {
              resolve(res.data)
            } else {
              failMessage(res.data.message)
              reject(res)
            }
          } else {
            failMessage()
            reject(res)
          }
        }).catch((mes) => {
          if (mes.response.status == 401) {
            failMessage('您身份已过期，3秒后返回登录页面');
            utils.setCookie('access_token', '');
            setTimeout(() => {
              window.location.href = '/static/managerTool/pages/login/login.html';
            }, 3000);
          } else {
            failMessage();
            reject(mes);
          }
        })
      }
    })
  }
}


function failMessage(mes = '数据获取失败') {
  Message({
    showClose: true,
    message: mes,
    type: 'warning'
  })
}
