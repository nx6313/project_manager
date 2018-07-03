<template>
  <div v-if="isShow" id="dialog-confirm-wrap" class="dialog-confirm-wrap">
    <div class="confirm-shade animated fadeIn" @click="closeConfirm"></div>
    <div :class="['confirm-content', 'animated', 'flipInX', (tip !== '' && items.length === 0) ? 'confirm-tip-content-wrap' : '']">
      <div class="confirm-tip" v-if="tip !== '' && items.length === 0">
        {{tip}}
      </div>
      <div class="confirm-item-wrap" v-for="(item, itemIndex) in items" :key="itemIndex">
        <span>{{item.title}}</span>
        <input v-if="item.type === undefined || item.type === 'text'" type="text" :placeholder="item.placeholder !== undefined ? item.placeholder : ''" v-model="item.model">
        <input v-if="item.type === 'time'" :ref="'confirm-input-' + itemIndex" type="text" readonly :placeholder="item.placeholder !== undefined ? item.placeholder : ''" v-model="item.model">
      </div>
      <div class="btn-wrap">
        <button @click="sure">确定</button>
        <button @click="cancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog-confirm',
  data () {
    return {
      isShow: true,
      shadeClose: false,
      tip: '',
      items: [],
      callback: () => {}
    }
  },
  beforeMount () {
    let dialogConfirm = document.querySelector('#dialog-confirm-wrap')
    if (dialogConfirm && dialogConfirm.parentNode) {
      dialogConfirm.parentNode.removeChild(dialogConfirm)
    }
  },
  mounted () {
    this.renderForm()
  },
  methods: {
    closeConfirm () {
      if (this.shadeClose) {
        this.isShow = false
      }
    },
    renderForm () {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].type === 'time') {
          let formRender = {
            elem: this.$refs['confirm-input-' + i][0],
            theme: 'grid',
            done: (value, date) => {
              this.items[i].model = value
            }
          }
          this.$moment.laydate.render(formRender)
        }
      }
    },
    sure () {
      for (let i = 0; i < this.items.length; i++) {
        if (!this.$comfun.isNotNull(this.items[i].model)) {
          this.$dialog_msg({
            msg: this.items[i].title + '不能为空'
          })
          return false
        }
      }
      var confirmData = {}
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].model !== undefined) {
          confirmData['data-' + i] = this.items[i].model
        }
      }
      this.isShow = false
      this.callback(confirmData)
    },
    cancel () {
      this.isShow = false
    }
  }
}
</script>

<style scoped>
.confirm-shade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(31, 31, 31, 0.3);
  z-index: 99999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
  -vendor-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.confirm-content {
  position: fixed;
  top: calc((100% - 20rem) / 2);
  left: calc((100% - 30rem) / 2);
  width: 30rem;
  height: 20rem;
  background-color: #2c2c2c;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 3px;
  z-index: 999999;
  box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.31);
}

.confirm-tip-content-wrap {
  top: calc((100% - 10rem) / 2);
  left: calc((100% - 20rem) / 2);
  width: 20rem;
  height: 10rem;
}

.confirm-content > .confirm-tip {
  position: relative;
  color: #ffffff;
  text-align: center;
  margin: 2.6rem 0;
}

.confirm-item-wrap {
  position: relative;
  font-size: 0;
  margin-top: 1.4rem;
}

.confirm-item-wrap:nth-of-type(n + 2) {
  margin-top: 0.4rem;
}

.confirm-item-wrap > span {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 6rem;
  text-align: right;
  padding-right: 10px;
  font-size: 0.6rem;
  color: #efefef;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.confirm-item-wrap > input {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: calc(100% - 6rem - 4rem);
  padding: 0.6rem 0.8rem;
  border: 1px solid rgb(238, 238, 238);
  font-size: 0.8rem;
  outline: none;
  border-radius: 4px;
}

.btn-wrap {
  text-align: center;
  margin-top: 1.4rem;
}

.btn-wrap > button {
  border: none;
  padding: 0.2rem 0.4rem;
  background-color: #8e9fb9;
  outline: none;
  border-radius: 2px;
  color: #ffffff;
  font-size: 0.6rem;
}

.btn-wrap > button:nth-of-type(n + 2) {
  margin-left: 1rem;
}

.btn-wrap > button:active {
  background-color: #8eb999;
}
</style>
