var HttpIp = ''
var HttpPort = ''

export default {
  install: function (Vue, options) {
    var Moment = {
      // 服务器地址
      server: 'http://' + HttpIp + ':' + HttpPort + '/',
      // eslint-disable-next-line
      laydate: laydate // layui日期选择插件
    }

    Object.defineProperty(Vue.prototype, '$moment', { value: Moment })
  }
}
