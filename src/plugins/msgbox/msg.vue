<template>
  <div v-if="isShow" id="dialog-msg-wrap" class="dialog-msg-wrap">
    <div class="msg-shade animated fadeIn" @click="closeMsg"></div>
    <div class="msg-content animated flipInX">{{msg}}</div>
  </div>
</template>

<script>
export default {
  name: 'dialog-msg',
  data () {
    return {
      isShow: true,
      shadeClose: true,
      duration: 1200,
      autoCloseTimer: null,
      msg: ''
    }
  },
  beforeMount () {
    clearTimeout(this.autoCloseTimer)
    let dialogMsg = document.querySelector('#dialog-msg-wrap')
    if (dialogMsg && dialogMsg.parentNode) {
      dialogMsg.parentNode.removeChild(dialogMsg)
    }
  },
  mounted () {
    this.autoCloseTimer = setTimeout(() => {
      this.isShow = false
    }, this.duration)
  },
  methods: {
    closeMsg () {
      if (this.shadeClose) {
        clearTimeout(this.autoCloseTimer)
        this.isShow = false
      }
    }
  }
}
</script>

<style scoped>
.msg-shade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  z-index: 99999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
  -vendor-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.msg-content {
  position: fixed;
  top: calc((100% - 2rem) / 2);
  left: calc((100% - 10rem) / 2);
  width: 10rem;
  height: 2rem;
  text-align: center;
  line-height: 2rem;
  background-color: #6b6b6b;
  color: #efefef;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 3px;
  z-index: 999999;
  box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.31);
}
</style>
