<template>
  <div v-if="isShow" id="dialog-pop-wrap" class="dialog-pop-wrap">
    <div class="pop-shade animated fadeIn" @click="closePop"></div>
    <div class="pop-wrap animated bounceInDown">
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog-pop',
  data () {
    return {
      isShow: true
    }
  },
  beforeMount () {
    let dialogPop = document.querySelector('#dialog-pop-wrap')
    if (dialogPop && dialogPop.parentNode) {
      dialogPop.parentNode.removeChild(dialogPop)
    }
  },
  created () {
    console.log(this.layui)
    // layui.use('form', function () {
    //   var form = layui.form
    //   console.log(form)
    // })
  },
  methods: {
    closePop () {
      this.isShow = false
    }
  }
}
</script>

<style scoped>
.pop-shade {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(30, 30, 30, .6);
  z-index: 999;
  -vendor-animation-duration: 0.2s;
  animation-duration: 0.2s;
  -vendor-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.pop-wrap {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background: #ffffff;
  z-index: 9999;
  box-shadow: 0 0 20px 5px rgba(49, 49, 49, 0.1);
  padding: 0.8rem 1.4rem;
}
</style>
