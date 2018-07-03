var HttpIp = ''
var HttpPort = ''

export default {
  install: function (Vue, options) {
    var Moment = {
      // 服务器地址
      server: 'http://' + HttpIp + ':' + HttpPort + '/',
      // eslint-disable-next-line
      laydate: laydate, // layui日期选择插件
      // filename: 'dc_project_data',
      // appname: '信息商业智能管理中心'
      filename: 'xingyun_project_data',
      appname: '星云系统实施智能管理中心'
    }

    Object.defineProperty(Vue.prototype, '$moment', { value: Moment })
  }
}
