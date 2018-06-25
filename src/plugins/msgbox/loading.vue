<template>
  <div v-if="isShow" id="dialog-loading-wrap" class="dialog-loading-wrap">
    <div class="loading-shade animated fadeIn" @click="closeLoading"></div>
    <div class="loading-content animated flipInX">
      <div class="loadster" :style="{ 'transform': 'scale(' + scale + ', ' + scale + ')' }">
        <div class="loadster__body">
          <div class="body__gum"></div>
        </div>
        <div class="loadster__mask"></div>
        <div class="loadster__head">
          <div class="head__face"></div>
          <div class="head__ear"></div>
          <div class="head__eye"></div>
          <div class="head__horn">
            <div class="horn__circle"></div>
          </div>
          <div class="head__smile"></div>
          <div class="head__hand"></div>
        </div>
        <div class="loadster__bottom">
          <div class="bottom__foot"></div>
        </div>
      </div>
      <span class="loading-tip">{{tip}}</span>
    </div>
  </div>
</template>

<script>
import './loading.css'

export default {
  name: 'dialog-confirm',
  data () {
    return {
      isShow: true,
      shadeClose: false,
      scale: 0.16,
      tip: '数据加载中...'
    }
  },
  beforeMount () {
    let dialogLoading = document.querySelector('#dialog-loading-wrap')
    if (dialogLoading && dialogLoading.parentNode) {
      dialogLoading.parentNode.removeChild(dialogLoading)
    }
  },
  methods: {
    closeLoading () {
      if (this.shadeClose) {
        this.isShow = false
      }
    }
  }
}
</script>

<style scoped>
#dialog-loading-wrap {
  position: relative;
  transition: all 0.3s ease 0s;
}

.loading-shade {
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

.loading-content {
  position: fixed;
  top: calc((100% - 6rem) / 2);
  left: calc((100% - 20rem) / 2);
  width: 20rem;
  height: 6rem;
  background-color: #ffffff;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 3px;
  z-index: 999999;
  box-shadow: 0 0 10px 0px rgba(143, 143, 143, 0.3);
}

.loading-content > div.loadster {
  top: 1.4rem;
  left: 1.2rem;
}

.loading-content > span.loading-tip {
  position: absolute;
  display: inline-block;
  top: 2.4rem;
  left: 6rem;
}
</style>
