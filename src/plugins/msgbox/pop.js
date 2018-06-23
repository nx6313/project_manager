import Vue from 'vue'
import Pop from './pop'

Pop.installPop = function (options) {
  var PopComment = Vue.extend(Pop)
  var comment = new PopComment({
    data: options
  }).$mount()
  document.querySelector('body').appendChild(comment.$el)
}

export default Pop
