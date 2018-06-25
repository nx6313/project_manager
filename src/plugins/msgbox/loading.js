import Vue from 'vue'
import Loading from './loading.vue'

Loading.installLoading = function (options) {
  var LoadingComment = Vue.extend(Loading)
  var comment = new LoadingComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
}
Loading.closeLoading = function () {
  if (document.getElementById('dialog-loading-wrap')) {
    document.getElementById('dialog-loading-wrap').style.opacity = 0
    setTimeout(() => {
      document.querySelector('body').removeChild(document.getElementById('dialog-loading-wrap'))
    }, 305)
  }
}

export default Loading
