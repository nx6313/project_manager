import DialogPop from './pop.js'

export default {
  install: function (Vue, options) {
    Vue.component(DialogPop.name, DialogPop)

    Vue.prototype.$dialog_pop = DialogPop.installPop
  }
}
