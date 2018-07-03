export default {
  install: function (Vue, options) {
    // 指令 - 使指定DOM中的文字执行横向无限跑马灯效果
    Vue.directive('marquee', {
      inserted: function (el) {
        if (el.childNodes.length === 1) {
        }
      }
    })
  }
}
