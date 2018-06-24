export default {
  install: function (Vue, options) {
    var ComFun = {
      http_get: function (context, url) {
        if (context && url) {
          var http = new Promise((resolve, reject) => {
            var callUrl = context.$moment.server + url
            if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
              callUrl = url
            }
            context.$http.get(callUrl).then(response => {
              context.$comfun.consoleBeautiful(context, '接口访问完成：url【' + url + '】', '#0FB0BF', 'https://img.zcool.cn/community/01db9f579571700000012e7e9da0fb.gif', {
                '链接': callUrl,
                '请求返回': response
              })
              context.$loading_close()
              resolve(response)
            }, response => {
              context.$comfun.consoleBeautiful(context, '接口访问出错：url【' + url + '】', '#BF0F3D', 'https://img.zcool.cn/community/014db6579571700000012e7e602493.gif', {
                '链接': callUrl,
                '请求返回': response
              })
              context.$loading_close()
              reject(response)
            })
          })
          return http
        } else {
          console.error('上下文对象或请求地址不能为空', 'http_get(context, url)')
        }
      },
      http_post: function (context, url, params) {
        if (context && url) {
          var paramsData = params || {}
          var http = new Promise((resolve, reject) => {
            var callUrl = context.$moment.server + url
            if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
              callUrl = url
            }
            context.$http.post(callUrl, JSON.stringify(paramsData)).then(response => {
              context.$comfun.consoleBeautiful(context, '接口访问完成：url【' + url + '】', '#0FB0BF', 'https://img.zcool.cn/community/01db9f579571700000012e7e9da0fb.gif', {
                '链接': callUrl,
                '请求返回': response,
                '相关参数': paramsData
              })
              context.$loading_close()
              resolve(response)
            }, response => {
              context.$comfun.consoleBeautiful(context, '接口访问出错：url【' + url + '】', '#BF0F3D', 'https://img.zcool.cn/community/014db6579571700000012e7e602493.gif', {
                '链接': callUrl,
                '请求返回': response,
                '相关参数': paramsData
              })
              context.$loading_close()
              reject(response)
            })
          })
          return http
        } else {
          console.error('上下文对象或请求地址不能为空', 'http_post(context, url)')
        }
      },
      http_file: function (context, url, aboutKey, file, progressFn) {
        if (context && url && file) {
          context.$comfun.console(context, '要上传的视频对象', file)
          const formData = new FormData()
          formData.append(aboutKey, file)
          var http = new Promise((resolve, reject) => {
            var callUrl = context.$moment.server + url
            if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
              callUrl = url
            }
            context.$http.post(callUrl, formData, {
              'headers': {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': '*'
              },
              progress (event) {
                context.$comfun.console(context, '视频上传进度', parseFloat(event.loaded / event.total * 100))
                if (progressFn && typeof progressFn === 'function' && Object.prototype.toString.call(progressFn).toLowerCase() === '[object function]') {
                  progressFn(parseFloat(event.loaded / event.total))
                }
              }
            }).then(response => {
              context.$comfun.consoleBeautiful(context, '接口访问完成：url【' + url + '】', '#0FB0BF', 'https://img.zcool.cn/community/01db9f579571700000012e7e9da0fb.gif', {
                '链接': callUrl,
                '请求返回': response,
                '要上传的视频对象': file
              })
              context.$loading_close()
              resolve(response)
            }, response => {
              context.$comfun.consoleBeautiful(context, '接口访问出错：url【' + url + '】', '#BF0F3D', 'https://img.zcool.cn/community/014db6579571700000012e7e602493.gif', {
                '链接': callUrl,
                '请求返回': response,
                '要上传的视频对象': file
              })
              context.$loading_close()
              reject(response)
            })
          })
          return http
        } else {
          console.error('上下文对象或请求地址不能为空', 'http_file(context, url)')
        }
      },
      console: function (context, tip, data, type) {
        context.$comfun.consoleBeautiful(context, tip, null, null, data, type)
      },
      consoleBeautiful: function (context, tip, tipColor, tipPic, consoleData, type) {
        if (!tipColor) {
          tipColor = '#0FB0BF'
        }
        if (!tipPic) {
          tipPic = 'https://img.zcool.cn/community/01c3365795716f0000012e7ef2e489.gif'
        }
        if (type) {
          if (type === 'error') {
            tipColor = '#BF0F3D'
            tipPic = 'https://img.zcool.cn/community/014db6579571700000012e7e602493.gif'
          } else if (type === 'warn') {
            tipColor = '#BF720F'
            tipPic = 'https://img.zcool.cn/community/01db9f579571700000012e7e9da0fb.gif'
          } else if (type === 'info') {
            tipColor = '#0FB0BF'
            tipPic = 'https://img.zcool.cn/community/01c3365795716f0000012e7ef2e489.gif'
          }
        }
        if (consoleData) {
          console.log(`%c ${tip}`, `height: 40px; padding-left: 60px; line-height: 56px; color: ${tipColor}; background-repeat: no-repeat; background-size: auto 100%; background-image: url(${tipPic});`, consoleData)
        } else {
          console.log(`%c ${tip}`, `height: 40px; padding-left: 60px; line-height: 56px; color: ${tipColor}; background-repeat: no-repeat; background-size: auto 100%; background-image: url(${tipPic});`)
        }
      },
      // 判断字符串是否为空
      isNotNull: function (str) {
        if (!this.isJsonOrArr(str) && !this.isNumber(str)) {
          if (!str || str === '' || str === null || str.toLowerCase() === 'null' || typeof str === 'undefined') {
            return false
          }
        }
        return true
      },
      // 判断obj是否为json对象或数组
      isJsonOrArr (obj) {
        var isjson = typeof obj === 'object' && (Object.prototype.toString.call(obj).toLowerCase() === '[object object]' || Object.prototype.toString.call(obj).toLowerCase() === '[object array]' || Object.prototype.toString.call(obj).toLowerCase() === '[object file]')
        return isjson
      },
      // 判断obj是否为数字
      isNumber (obj) {
        if (obj === '' || obj === null || obj === undefined) {
          return false
        }
        if (!isNaN(obj)) {
          return true
        } else {
          return false
        }
      },
      // 日期格式转字符串，指定格式
      // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符
      // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
      // 例子：
      // (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
      // (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
      formatDate: function (date, fmt) {
        var o = {
          'M+': date.getMonth() + 1, // 月份
          'd+': date.getDate(), // 日
          'h+': date.getHours(), // 小时
          'm+': date.getMinutes(), // 分
          's+': date.getSeconds(), // 秒
          'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
          'S': date.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
          }
        }
        return fmt
      },
      // 将相差的毫秒数转为时间
      formatDiffMilliseconds (diffMilliseconds) {
        let dayMill = 24 * 60 * 60 * 1000
        let hourMill = 60 * 60 * 1000
        let minuteMill = 60 * 1000
        let secondMill = 1000
        let day = Math.floor(diffMilliseconds / dayMill)
        let dayResidue = diffMilliseconds % dayMill
        let hour = Math.floor(dayResidue / hourMill)
        let hourResidue = dayResidue % hourMill
        let minute = Math.floor(hourResidue / minuteMill)
        let minuteResidue = hourResidue % minuteMill
        let second = Math.floor(minuteResidue / secondMill)
        let returnVal = ''
        if (day > 0) {
          returnVal += day + ' 天 '
        }
        if (hour > 0) {
          returnVal += hour + ' 小时 '
        }
        if (minute > 0) {
          returnVal += minute + ' 分钟 '
        }
        if (day === 0 && hour === 0 && minute === 0) {
          returnVal = second + ' 秒 '
        }
        return returnVal
      },
      // 获取当前浏览器访问地址，会将地址，参数部分，#部分分别放入json返回
      getCurrentUrl: function (encodeURIFlag) {
        var pathname = location.pathname
        var search = location.search
        var hash = location.hash
        var urlAnalysis = {
          pathname: pathname,
          search: search,
          hash: hash
        }
        return urlAnalysis
      },
      // 获取网址中的参数
      getRequest: function (key) {
        var url = location.search
        var theRequest = {}
        if (url.indexOf('?') !== -1) {
          var str = url.substr(1)
          var strs = str.split('&')
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
          }
        }
        if (key) {
          return theRequest[key]
        }
        return theRequest
      },
      // 生成uuid
      guid () {
        return ((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) + '-' +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1) +
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1))
      }
    }

    Object.defineProperty(Vue.prototype, '$comfun', { value: ComFun })
  }
}
