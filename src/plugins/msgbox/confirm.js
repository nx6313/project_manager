import Vue from 'vue'
import Confirm from './confirm.vue'

Confirm.installConfirm = function (options) {
  var ConfirmComment = Vue.extend(Confirm)
  var comment = new ConfirmComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
}

export default Confirm
