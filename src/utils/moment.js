var HttpIp = ''
var HttpPort = ''

export default {
  install: function (Vue, options) {
    var Moment = {
      // 服务器地址
      server: 'http://' + HttpIp + ':' + HttpPort + '/'
    }

    Object.defineProperty(Vue.prototype, '$moment', { value: Moment })
  }
}
