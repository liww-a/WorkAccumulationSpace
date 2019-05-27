export default {
  /** 设置cookie
   *option { key: key, value: value, expires: expires, path: path, domain: domain, secure: secure}
   *key:cookiename,value: cookievalue,expires: cookie的有效期，path: cookiepath,
  */
  setCookie (option) {
    var cookieStr = encodeURIComponent(option.key) + '=' + encodeURIComponent(option.value)
    let date = null
    if (option.expires) {
      if (typeof option.expires === 'number' && option.expires > 0) {
        date = new Date()
        date.setDate(date.getDate() + option.expires)
        cookieStr += ';expires' + '=' + date
      } else {
        alert('您输入的expires不合法')
      }
    }
    if (option.path) {
      cookieStr += ';path' + '=' + option.path
    }
    if (option.domain) {
      cookieStr += ';domain' + '=' + option.domain
    }
    if (option.secure) {
      cookieStr += ';secure'
    }
    document.cookie = cookieStr
  },
  /**
   *获取cookie
   *参数： key ：cookiename
  */
  getCookie (key) {
    var cookieName = encodeURIComponent(key) + '='
    // 从cookie的字符串中找到 cookieName的下标
    var start = document.cookie.indexOf(cookieName)
    // start的返回值 > -1
    if (start > -1) {
      var end = document.cookie.indexOf(';', start)
      var cookieValue = ''
      if (end === -1) {
        end = document.cookie.length
      }
      cookieValue = decodeURIComponent(document.cookie.substring(start + cookieName.length, end))
    }
    return cookieValue
  },
  /**
   *删除cookie
   *@key = cookiename
  */
  removeCookie (key) {
    // debugger
    var cookieName = encodeURIComponent(key) + '='
    var start = document.cookie.indexOf(cookieName)
    if (start > -1) {
      var end = document.cookie.indexOf(';', start)
      var cookieValue = ''
      if (end === -1) {
        end = document.cookie.length
      }
      cookieValue = decodeURIComponent(document.cookie.substring(start + cookieName.length, end))
    }
    if (cookieValue != null) {
      document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(cookieValue) + ';expires' + '=' + new Date(0)
    }
  }
}
