<template>
  <div v-if="isShow" id="dialog-pop-wrap" class="dialog-pop-wrap">
    <div class="pop-shade animated fadeIn" @click="closePop"></div>
    <div class="pop-wrap animated bounceInDown">
      <div class="step-wrap flex-r flex-b">
        <div :class="(type === 'add-project-info' || type === 'update-project-info') ? 'current' : ''">
          <span>1</span>
          <span v-if="type === 'add-project-info'">填写项目信息</span>
          <span v-if="type === 'update-project-info'">更新项目信息</span>
          <span v-if="type === 'add-mode-info'">填写项目信息</span>
          <span v-if="type === 'update-mode-info'">更新项目信息</span>
        </div>
        <div :class="(type === 'add-mode-info' || type === 'update-mode-info') ? 'current' : ''">
          <span>2</span>
          <span v-if="type === 'add-project-info'">填写模块信息</span>
          <span v-if="type === 'update-project-info'">更新模块信息</span>
          <span v-if="type === 'add-mode-info'">填写模块信息</span>
          <span v-if="type === 'update-mode-info'">更新模块信息</span>
        </div>
      </div>
      <div class="form-wrap" ref="form-wrap">
        <div class="form-item-wrap" v-for="(item, itemIndex) in formItems[type]" :key="itemIndex" :ref="'form-item-' + itemIndex">
          <span>{{item.tip}}</span>
          <template v-if="item.type !== 'text' && item.type !== 'time'">
            <div v-if="item.type === 'img'" class="img-select-wrap" :ref="'img-select-' + itemIndex">
              <input type="file" @change="imgFileChange(itemIndex)" accept="image/*">
            </div>
            <input type="hidden" v-model="item.model">
          </template>
          <input class="form-item-input" v-if="item.type === 'text'" type="text" v-model="item.model">
          <input :id="'form-item-input-' + itemIndex + '-' + item.sign" :ref="'form-item-input-' + itemIndex + '-' + item.sign" class="form-item-input" v-if="item.type === 'time'" type="text" readonly v-model="item.model">
        </div>
      </div>
      <div class="btn-wrap">
        <button v-if="type === 'add-project-info'" @click="saveProjectData">暂时仅保存项目信息</button>
        <button v-if="type === 'add-project-info'" @click="toNextStep">下一步</button>
        <button v-if="type === 'add-mode-info' || type === 'update-project-info' || type === 'update-mode-info'" @click="submitForm">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'dialog-pop',
  data () {
    return {
      initType: null,
      type: null,
      callback: () => {},
      formItems: {},
      items: [],
      updateModelInit: [],
      newFormPage: null,
      isShow: true
    }
  },
  beforeMount () {
    let dialogPop = document.querySelector('#dialog-pop-wrap')
    if (dialogPop && dialogPop.parentNode) {
      dialogPop.parentNode.removeChild(dialogPop)
    }
    this.initType = this.type
    if (this.type === 'add-project-info' || this.type === 'update-project-info') {
      this.formItems[this.type] = [
        {
          type: 'img',
          tip: '项目图标',
          model: this.type === 'update-project-info' ? this.updateModelInit[0] : ''
        },
        {
          type: 'text',
          tip: '项目名称',
          model: this.type === 'update-project-info' ? this.updateModelInit[1] : ''
        },
        {
          type: 'text',
          tip: '项目进度',
          model: this.type === 'update-project-info' ? this.updateModelInit[2] : ''
        },
        {
          type: 'text',
          tip: '项目负责人',
          model: this.type === 'update-project-info' ? this.updateModelInit[3] : ''
        },
        {
          type: 'time',
          tip: '项目开始时间',
          sign: 'project',
          model: this.type === 'update-project-info' ? this.updateModelInit[4] : '',
          max: 5
        },
        {
          type: 'time',
          tip: '项目结束时间',
          sign: 'project',
          model: this.type === 'update-project-info' ? this.updateModelInit[5] : '',
          min: 4
        },
        {
          type: 'text',
          tip: '项目当前状态',
          model: this.type === 'update-project-info' ? this.updateModelInit[6] : ''
        },
        {
          type: 'text',
          tip: '项目当前节点',
          model: this.type === 'update-project-info' ? this.updateModelInit[7] : ''
        },
        {
          type: 'text',
          tip: '项目参与人数',
          model: this.type === 'update-project-info' ? this.updateModelInit[8] : ''
        }
      ]
    } else if (this.type === 'add-mode-info' || this.type === 'update-mode-info') {
      this.formItems[this.type] = [
        {
          type: 'text',
          tip: '模块名称',
          model: ''
        },
        {
          type: 'text',
          tip: '模块负责人',
          model: ''
        },
        {
          type: 'time',
          tip: '模块开始时间',
          sign: 'mode',
          model: '',
          max: 3
        },
        {
          type: 'time',
          tip: '模块结束时间',
          sign: 'mode',
          model: '',
          min: 2
        },
        {
          type: 'text',
          tip: '模块计划天数',
          model: ''
        },
        {
          type: 'text',
          tip: '模块已用天数',
          model: ''
        }
      ]
    }
  },
  mounted () {
    this.renderForm()
  },
  methods: {
    closePop () {
      this.isShow = false
    },
    renderForm () {
      for (let i = 0; i < this.formItems[this.type].length; i++) {
        if (this.formItems[this.type][i].type === 'img') {
          if (this.formItems[this.type][i].model !== '') {
            var selectImgElem = document.createElement('img')
            selectImgElem.classList.add('select-img-show')
            selectImgElem.src = this.formItems[this.type][i].model
            var itemRoot = this.$refs['img-select-' + i][0]
            if (itemRoot.getElementsByClassName('select-img-show')[0]) {
              itemRoot.removeChild(itemRoot.getElementsByClassName('select-img-show')[0])
            }
            itemRoot.appendChild(selectImgElem)
          }
        } else if (this.formItems[this.type][i].type === 'time') {
          if (this.$refs['form-item-input-' + i + '-' + this.formItems[this.type][i].sign]) {
            let formRender = {
              elem: this.$refs['form-item-input-' + i + '-' + this.formItems[this.type][i].sign][0],
              theme: 'grid',
              done: (value, date) => {
                this.formItems[this.type][i].model = value
                if (this.formItems[this.type][i].min !== undefined && this.formItems[this.type][this.formItems[this.type][i].min].dateRender !== undefined) {
                  this.formItems[this.type][this.formItems[this.type][i].min].dateRender.config.max = {
                    year: date.year,
                    month: date.month - 1,
                    date: date.date,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                  }
                }
                if (this.formItems[this.type][i].max !== undefined && this.formItems[this.type][this.formItems[this.type][i].max].dateRender !== undefined) {
                  this.formItems[this.type][this.formItems[this.type][i].max].dateRender.config.min = {
                    year: date.year,
                    month: date.month - 1,
                    date: date.date,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                  }
                }
              }
            }
            let dateRender = this.$moment.laydate.render(formRender)
            this.formItems[this.type][i].dateRender = dateRender
          }
        }
      }
    },
    imgFileChange (itemIndex) {
      var file = event.target.files[0]
      if (file) {
        var reader = new FileReader()
        var imgFile = null
        reader.onload = (e) => {
          imgFile = e.target.result
          this.formItems[this.type][itemIndex].model = imgFile
          var selectImgElem = document.createElement('img')
          selectImgElem.classList.add('select-img-show')
          selectImgElem.src = imgFile
          var itemRoot = this.$refs['img-select-' + itemIndex][0]
          if (itemRoot.getElementsByClassName('select-img-show')[0]) {
            itemRoot.removeChild(itemRoot.getElementsByClassName('select-img-show')[0])
          }
          itemRoot.appendChild(selectImgElem)
        }
        reader.readAsDataURL(file)
      }
    },
    saveProjectData () {
      for (let i = 0; i < this.formItems[this.type].length; i++) {
        if (!this.$comfun.isNotNull(this.formItems[this.type][i].model)) {
          this.$dialog_msg({
            msg: this.formItems[this.type][i].tip + '不能为空'
          })
          return false
        }
      }
      this.isShow = false
      var projectData = {}
      projectData.type = 'only-project'
      for (let i = 0; i < this.formItems[this.type].length; i++) {
        projectData[this.type + '-data-' + i] = this.formItems[this.type][i].model
      }
      this.callback(projectData)
    },
    toNextStep () {
      for (let i = 0; i < this.formItems[this.type].length; i++) {
        if (!this.$comfun.isNotNull(this.formItems[this.type][i].model)) {
          this.$dialog_msg({
            msg: this.formItems[this.type][i].tip + '不能为空'
          })
          return false
        }
      }
      this.$refs['form-wrap'].innerHTML = ''
      this.type = 'add-mode-info'
      this.formItems[this.type] = [
        {
          type: 'text',
          tip: '模块名称',
          model: ''
        },
        {
          type: 'text',
          tip: '模块负责人',
          model: ''
        },
        {
          type: 'time',
          tip: '模块开始时间',
          sign: 'mode',
          model: '',
          max: 3
        },
        {
          type: 'time',
          tip: '模块结束时间',
          sign: 'mode',
          model: '',
          min: 2
        },
        {
          type: 'text',
          tip: '模块计划天数',
          model: ''
        },
        {
          type: 'text',
          tip: '模块已用天数',
          model: ''
        }
      ]
      var that = this
      var NewFormPageComponent = Vue.extend({
        template: `<div><div class="form-item-wrap" v-for="(item, itemIndex) in formItems[type]" :key="itemIndex" :ref="'form-item-' + itemIndex">
          <span>{{item.tip}}</span>
          <template v-if="item.type !== 'text' && item.type !== 'time'">
            <div v-if="item.type === 'img'" class="img-select-wrap" :ref="'img-select-' + itemIndex">
              <input type="file" @change="imgFileChange(itemIndex)" accept="image/*">
            </div>
            <input type="hidden" v-model="item.model">
          </template>
          <input class="form-item-input" v-if="item.type === 'text'" type="text" v-model="item.model">
          <input :id="'form-item-input-' + itemIndex + '-' + item.sign" :ref="'form-item-input-' + itemIndex + '-' + item.sign" class="form-item-input" v-if="item.type === 'time'" type="text" readonly v-model="item.model">
        </div></div>`,
        data () {
          return {
            type: that.type,
            formItems: that.formItems
          }
        },
        mounted () {
          this.renderForm()
        },
        methods: {
          imgFileChange: that.imgFileChange,
          renderForm () {
            for (let i = 0; i < this.formItems[this.type].length; i++) {
              if (this.formItems[this.type][i].type === 'time') {
                if (this.$refs['form-item-input-' + i + '-' + this.formItems[this.type][i].sign]) {
                  let formRender = {
                    elem: this.$refs['form-item-input-' + i + '-' + this.formItems[this.type][i].sign][0],
                    theme: 'grid',
                    done: (value, date) => {
                      this.formItems[this.type][i].model = value
                      if (this.formItems[this.type][i].min !== undefined && this.formItems[this.type][this.formItems[this.type][i].min].dateRender !== undefined) {
                        this.formItems[this.type][this.formItems[this.type][i].min].dateRender.config.max = {
                          year: date.year,
                          month: date.month - 1,
                          date: date.date,
                          hours: 0,
                          minutes: 0,
                          seconds: 0
                        }
                      }
                      if (this.formItems[this.type][i].max !== undefined && this.formItems[this.type][this.formItems[this.type][i].max].dateRender !== undefined) {
                        this.formItems[this.type][this.formItems[this.type][i].max].dateRender.config.min = {
                          year: date.year,
                          month: date.month - 1,
                          date: date.date,
                          hours: 0,
                          minutes: 0,
                          seconds: 0
                        }
                      }
                    }
                  }
                  let dateRender = this.$moment.laydate.render(formRender)
                  this.formItems[this.type][i].dateRender = dateRender
                }
              }
            }
          }
        }
      })
      this.newFormPage = new NewFormPageComponent().$mount()
      this.$refs['form-wrap'].appendChild(this.newFormPage.$el)
    },
    submitForm () {
      var projectData = {}
      if (this.initType === 'add-project-info') {
        projectData.type = 'project-mode'
      } else if (this.initType === 'add-mode-info') {
        projectData.type = 'only-mode'
      } else if (this.initType === 'update-project-info') {
        projectData.type = 'update-project'
      } else if (this.initType === 'update-mode-info') {
        projectData.type = 'update-mode'
      }
      for (let key in this.formItems) {
        for (let i = 0; i < this.formItems[key].length; i++) {
          projectData[key + '-data-' + i] = this.formItems[key][i].model
        }
      }
      this.isShow = false
      this.callback(projectData)
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
  -vendor-animation-duration: 0.3s;
  animation-duration: 0.3s;
  -vendor-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.step-wrap {
  position: relative;
  font-size: 2rem;
  color: rgb(87, 87, 87);
  padding: 0 6rem;
  user-select: none;
}

.step-wrap::before {
  content: '';
  position: absolute;
  top: 2.34rem;
  width: calc(100% - 13rem);
  border: 2px solid #8e9fb9;
  border-radius: 10px;
}

.step-wrap > div {
  position: relative;
  padding-top: 1.4rem;
  text-align: center;
  background: #ffffff;
}

.step-wrap > div > span {
  position: relative;
  display: block;
  z-index: 9;
}

.step-wrap > div > span:first-of-type {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  color: #ffffff;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.6rem;
}

.step-wrap > div > span:first-of-type::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 2rem;
  height: 2rem;
  text-align: center;
  line-height: 2rem;
  background: #7c90aa;
  border-radius: 0.4rem;
  transform: rotate(45deg);
  z-index: -1;
}

.step-wrap > div > span:last-of-type {
  position: relative;
  color: #5d6c79;
  font-size: 0.8rem;
}

.step-wrap > div.current > span:first-of-type::before {
  background: #a07283;
}

.step-wrap > div.current > span:last-of-type {
  color: #b42b74;
}

.form-wrap {
  position: relative;
  margin-top: 2.8rem;
  padding-top: 4rem;
  padding-bottom: 4rem;
  height: calc(100% - 2.8rem - 20rem);
  overflow-x: hidden;
  overflow-y: auto;
}

.form-wrap::before {
  content: '';
  position: fixed;
  top: 8.4rem;
  left: 0;
  width: 100%;
  border-top: 3rem solid #7fa7be;
  z-index: 99;
}

.form-wrap::after {
  content: '';
  position: fixed;
  bottom: 7rem;
  left: 0;
  width: 100%;
  border-top: 3rem solid #7fa7be;
  z-index: 99;
}

.btn-wrap {
  margin-top: 2.8rem;
  text-align: center;
}

.btn-wrap > button {
  border: none;
  padding: 0.6rem 1.2rem;
  background-color: #8e9fb9;
  outline: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: bold;
}

.btn-wrap > button:active {
  background-color: #8eb999;
}

.btn-wrap > button:nth-of-type(n + 2) {
  margin-left: 1rem;
}
</style>

<style>
.form-wrap .form-item-wrap {
  position: relative;
  font-size: 0px;
}

.form-wrap .form-item-wrap:nth-of-type(n + 2) {
  margin-top: 0.8rem;
}

.form-wrap .form-item-wrap > span {
  position: relative;
  display: inline-block;
  width: 10rem;
  font-size: 1rem;
  padding-right: 30px;
  text-align: right;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-wrap .form-item-wrap > input {
  position: relative;
  display: inline-block;
  width: calc(100% - 10rem - 2rem - 2px - 40px);
  padding: 0.6rem 1rem;
  font-size: 1rem;
  border: 1px solid #afafaf;
  color: #505050;
  outline: none;
  vertical-align: middle;
}

.form-wrap .form-item-wrap > div.img-select-wrap {
  position: relative;
  display: inline-block;
  width: 6rem;
  height: 6rem;
  font-size: 1rem;
  border: 1px solid #afafaf;
  vertical-align: middle;
  box-shadow: inset 0 0 6.4rem 0px rgba(0, 0, 0, 0.8);
}

.form-wrap .form-item-wrap > div.img-select-wrap::before {
  content: '点击选图';
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 6rem;
  font-size: 0.8rem;
  background-color: rgba(0, 0, 0, .1);
  color: #ebebeb;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.16);
  pointer-events: none;
  z-index: 9;
}

.form-wrap .form-item-wrap > div.img-select-wrap > input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.form-wrap .form-item-wrap > div.img-select-wrap > img {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  width: 80%;
  height: 80%;
  pointer-events: none;
}
</style>
