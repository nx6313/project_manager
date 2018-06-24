import DialogMsg from './msg.js'
import DialogPop from './pop.js'
import DialogConfirm from './confirm.js'

export default {
  install: function (Vue, options) {
    Vue.component(DialogMsg.name, DialogMsg)
    Vue.component(DialogPop.name, DialogPop)
    Vue.component(DialogConfirm.name, DialogConfirm)

    Vue.prototype.$dialog_msg = DialogMsg.installMsg
    Vue.prototype.$dialog_pop = DialogPop.installPop
    Vue.prototype.$dialog_confirm = DialogConfirm.installConfirm
  }
}
