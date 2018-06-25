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
          <template v-if="item.type !== 'text' && item.type !== 'time' && item.type !== 'node'">
            <div v-if="item.type === 'img'" class="img-select-wrap" :ref="'img-select-' + itemIndex">
              <input type="file" @change="imgFileChange(itemIndex)" accept="image/*">
            </div>
            <input type="hidden" v-model="item.model">
          </template>
          <input class="form-item-input" v-if="item.type === 'text'" type="text" v-model="item.model">
          <input :id="'form-item-input-' + itemIndex + '-' + item.sign" :ref="'form-item-input-' + itemIndex + '-' + item.sign" class="form-item-input" v-if="item.type === 'time'" type="text" readonly v-model="item.model">
          <div class="form-item-split" v-if="item.type === 'split'"></div>
          <div class="form-item-node-wrap" v-if="item.type === 'node'">
            <button class="addNewNodeBtn" @click="addNewNode">添加新节点</button>
            <div class="node-tree-wrap">
              <div :class="['node-item-wrap', 'status-' + node.status, node.status === 1 ? 'open' : 'close']" v-for="(node, nodeIndex) in modeNodes" :key="nodeIndex" :ref="'node-item-' + nodeIndex">
                <span class="node-item-progress-point" @click="selectCurNode(nodeIndex)"></span>
                <span class="point-line"></span>
                <button class="addNodeBtn" @click="addExecutor(nodeIndex)">添加组</button>
                <span class="title">{{node.title}}</span>
                <div class="dutys-tree-show">
                  <div v-for="(executor, exeIndex) in node.executors" :key="exeIndex">
                    <span>
                      {{executor.duty}}&nbsp;&nbsp;{{executor.peoples.length}} 人
                      <div>
                        <button class="moveNodeUpBtn" @click="moveNodeUp(nodeIndex)" v-if="exeIndex === 0 && nodeIndex > 0">上移</button>
                        <button class="moveNodeDownBtn" @click="moveNodeDown(nodeIndex)" v-if="exeIndex === 0 && nodeIndex < modeNodes.length - 1">下移</button>
                        <button class="addPeopleBtn" @click="addPeople(nodeIndex, exeIndex)">添加人</button>
                        <button class="deleteNodeBtn" @click="deleteNode(nodeIndex, exeIndex)">删除</button>
                      </div>
                    </span>
                    <div>
                      <span v-for="(exepeople, exePeopleIndex) in executor.peoples" :key="exePeopleIndex" @click="deleteExeUser(nodeIndex, exeIndex, exePeopleIndex)">{{exepeople}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <input type="hidden" v-model="item.model">
          </div>
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
      modeNodes: [],
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
          model: this.type === 'update-mode-info' ? this.updateModelInit[0] : ''
        },
        {
          type: 'text',
          tip: '模块负责人',
          model: this.type === 'update-mode-info' ? this.updateModelInit[1] : ''
        },
        {
          type: 'time',
          tip: '模块开始时间',
          sign: 'mode',
          model: this.type === 'update-mode-info' ? this.updateModelInit[2] : '',
          max: 3
        },
        {
          type: 'time',
          tip: '模块结束时间',
          sign: 'mode',
          model: this.type === 'update-mode-info' ? this.updateModelInit[3] : '',
          min: 2
        },
        {
          type: 'text',
          tip: '模块计划天数',
          model: this.type === 'update-mode-info' ? this.updateModelInit[4] : ''
        },
        {
          type: 'text',
          tip: '模块已用天数',
          model: this.type === 'update-mode-info' ? this.updateModelInit[5] : ''
        },
        {
          type: 'node',
          tip: '模块相关节点',
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
    addNewNode () {
      this.$dialog_confirm({
        items: [
          {
            title: '节点名称',
            model: ''
          },
          {
            title: '默认组名称',
            model: ''
          },
          {
            title: '默认组中的人',
            model: '',
            placeholder: '多个人用 | 分隔'
          },
          {
            title: '计划开发天数',
            model: ''
          },
          {
            title: '规定结束日期',
            type: 'time',
            model: ''
          }
        ],
        callback: (data) => {
          this.modeNodes.splice(this.modeNodes.length, 1, {
            title: data['data-0'],
            executors: [
              {
                duty: data['data-1'],
                peoples: data['data-2'].replace('，', '|').replace(',', '|').replace(';', '|').replace('、', '|').split('|')
              }
            ],
            'plan-day': Number(data['data-3']),
            'end-date': data['data-4'],
            status: 0
          })
        }
      })
    },
    addExecutor (nodeIndex) {
      this.$dialog_confirm({
        items: [
          {
            title: '组名称',
            model: ''
          },
          {
            title: '组中的人',
            model: '',
            placeholder: '多个人用 | 分隔'
          }
        ],
        callback: (data) => {
          this.modeNodes[nodeIndex].executors.splice(this.modeNodes[nodeIndex].executors.length, 1, {
            duty: data['data-0'],
            peoples: data['data-1'].replace('，', '|').replace(',', '|').replace(';', '|').replace('、', '|').split('|')
          })
        }
      })
    },
    addPeople (nodeIndex, exeIndex) {
      this.$dialog_confirm({
        items: [
          {
            title: '要添加的人名',
            model: '',
            placeholder: '多个人用 | 分隔'
          }
        ],
        callback: (data) => {
          for (let p = 0; p < data['data-0'].replace('，', '|').replace(',', '|').replace(';', '|').replace('、', '|').split('|').length; p++) {
            this.modeNodes[nodeIndex].executors[exeIndex].peoples.splice(this.modeNodes[nodeIndex].executors[exeIndex].peoples.length, 1, data['data-0'].replace('，', '|').replace(',', '|').replace(';', '|').replace('、', '|').split('|')[p])
          }
        }
      })
    },
    deleteNode (nodeIndex, exeIndex) {
      if (this.modeNodes[nodeIndex].executors.length > 1) {
        this.modeNodes[nodeIndex].executors.splice(exeIndex, 1)
      } else {
        this.modeNodes.splice(nodeIndex, 1)
      }
    },
    moveNodeUp (nodeIndex) {
      this.modeNodes[nodeIndex] = this.modeNodes.splice(nodeIndex - 1, 1, this.modeNodes[nodeIndex])[0]
      var curProgressIndex = -1
      for (let n = 0; n < this.modeNodes.length; n++) {
        if (this.modeNodes[n].status === 1) {
          curProgressIndex = n
        }
      }
      if (curProgressIndex >= 0) {
        for (let n = 0; n < this.modeNodes.length; n++) {
          if (n < curProgressIndex) {
            this.modeNodes[n].status = 2
          } else if (n === curProgressIndex) {
            this.modeNodes[n].status = 1
          } else if (n > curProgressIndex) {
            this.modeNodes[n].status = 0
          }
        }
      }
    },
    moveNodeDown (nodeIndex) {
      this.modeNodes[nodeIndex] = this.modeNodes.splice(nodeIndex + 1, 1, this.modeNodes[nodeIndex])[0]
      var curProgressIndex = -1
      for (let n = 0; n < this.modeNodes.length; n++) {
        if (this.modeNodes[n].status === 1) {
          curProgressIndex = n
        }
      }
      if (curProgressIndex >= 0) {
        for (let n = 0; n < this.modeNodes.length; n++) {
          if (n < curProgressIndex) {
            this.modeNodes[n].status = 2
          } else if (n === curProgressIndex) {
            this.modeNodes[n].status = 1
          } else if (n > curProgressIndex) {
            this.modeNodes[n].status = 0
          }
        }
      }
    },
    deleteExeUser (nodeIndex, exeIndex, exeUserIndex) {
      if (this.modeNodes[nodeIndex].executors[exeIndex].peoples.length > 1) {
        this.modeNodes[nodeIndex].executors[exeIndex].peoples.splice(exeUserIndex, 1)
      } else {
        if (this.modeNodes[nodeIndex].executors.length > 1) {
          this.modeNodes[nodeIndex].executors.splice(exeIndex, 1)
        } else {
          this.modeNodes.splice(nodeIndex, 1)
        }
      }
    },
    selectCurNode (nodeIndex) {
      var noProgress = false
      for (let n = 0; n < this.modeNodes.length; n++) {
        if (n < nodeIndex) {
          this.modeNodes[n].status = 2
        } else if (n === nodeIndex) {
          if (this.modeNodes[n].status === 1) {
            noProgress = true
          } else {
            this.modeNodes[n].status = 1
          }
        } else if (n > nodeIndex) {
          this.modeNodes[n].status = 0
        }
      }
      if (noProgress) {
        for (let n = 0; n < this.modeNodes.length; n++) {
          this.modeNodes[n].status = 0
        }
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
        if (this.formItems[this.type][i].model !== undefined) {
          projectData[this.type + '-data-' + i] = this.formItems[this.type][i].model
        }
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
        },
        {
          type: 'node',
          tip: '模块相关节点',
          model: ''
        }
      ]
      var that = this
      var NewFormPageComponent = Vue.extend({
        template: `<div><div class="form-item-wrap" v-for="(item, itemIndex) in formItems[type]" :key="itemIndex" :ref="'form-item-' + itemIndex">
          <span>{{item.tip}}</span>
          <template v-if="item.type !== 'text' && item.type !== 'time' && item.type !== 'node'">
            <div v-if="item.type === 'img'" class="img-select-wrap" :ref="'img-select-' + itemIndex">
              <input type="file" @change="imgFileChange(itemIndex)" accept="image/*">
            </div>
            <input type="hidden" v-model="item.model">
          </template>
          <input class="form-item-input" v-if="item.type === 'text'" type="text" v-model="item.model">
          <input :id="'form-item-input-' + itemIndex + '-' + item.sign" :ref="'form-item-input-' + itemIndex + '-' + item.sign" class="form-item-input" v-if="item.type === 'time'" type="text" readonly v-model="item.model">
          <div class="form-item-split" v-if="item.type === 'split'"></div>
          <div class="form-item-node-wrap" v-if="item.type === 'node'">
            <button class="addNewNodeBtn" @click="addNewNode">添加新节点</button>
            <div class="node-tree-wrap">
              <div :class="['node-item-wrap', 'status-' + node.status, node.status === 1 ? 'open' : 'close']" v-for="(node, nodeIndex) in modeNodes" :key="nodeIndex" :ref="'node-item-' + nodeIndex">
                <span class="node-item-progress-point" @click="selectCurNode(nodeIndex)"></span>
                <span class="point-line"></span>
                <button class="addNodeBtn" @click="addExecutor(nodeIndex)">添加组</button>
                <span class="title">{{node.title}}</span>
                <div class="dutys-tree-show">
                  <div v-for="(executor, exeIndex) in node.executors" :key="exeIndex">
                    <span>
                      {{executor.duty}}&nbsp;&nbsp;{{executor.peoples.length}} 人
                      <div>
                        <button class="moveNodeUpBtn" @click="moveNodeUp(nodeIndex)" v-if="exeIndex === 0 && nodeIndex > 0">上移</button>
                        <button class="moveNodeDownBtn" @click="moveNodeDown(nodeIndex)" v-if="exeIndex === 0 && nodeIndex < modeNodes.length - 1">下移</button>
                        <button class="addPeopleBtn" @click="addPeople(nodeIndex, exeIndex)">添加人</button>
                        <button class="deleteNodeBtn" @click="deleteNode(nodeIndex, exeIndex)">删除</button>
                      </div>
                    </span>
                    <div>
                      <span v-for="(exepeople, exePeopleIndex) in executor.peoples" :key="exePeopleIndex" @click="deleteExeUser(nodeIndex, exeIndex, exePeopleIndex)">{{exepeople}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <input type="hidden" v-model="item.model">
          </div>
        </div></div>`,
        data () {
          return {
            type: that.type,
            formItems: that.formItems,
            modeNodes: that.modeNodes
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
          },
          addNewNode: that.addNewNode,
          addExecutor: that.addExecutor,
          addPeople: that.addPeople,
          deleteNode: that.deleteNode,
          moveNodeUp: that.moveNodeUp,
          moveNodeDown: that.moveNodeDown,
          deleteExeUser: that.deleteExeUser,
          selectCurNode: that.selectCurNode
        }
      })
      this.newFormPage = new NewFormPageComponent().$mount()
      this.$refs['form-wrap'].appendChild(this.newFormPage.$el)
    },
    submitForm () {
      for (let i = 0; i < this.formItems[this.type].length; i++) {
        if (this.formItems[this.type][i].type === 'node') {
          if (this.modeNodes.length > 0) {
            this.formItems[this.type][i].model = this.modeNodes
          }
        }
        if (!this.$comfun.isNotNull(this.formItems[this.type][i].model)) {
          this.$dialog_msg({
            msg: this.formItems[this.type][i].tip + '不能为空'
          })
          return false
        }
      }
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
          if (this.formItems[key][i].model !== undefined) {
            projectData[key + '-data-' + i] = this.formItems[key][i].model
          }
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
  position: fixed;
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
  border-top: 2rem solid #7fa7be;
  z-index: 99;
}

.form-wrap::after {
  content: '';
  position: fixed;
  bottom: 7rem;
  left: 0;
  width: 100%;
  border-top: 2rem solid #7fa7be;
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
  border-radius: 2px;
  color: #ffffff;
  font-size: 0.7rem;
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
  font-size: 0.8rem;
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
  width: 5rem;
  height: 5rem;
  font-size: 1rem;
  border: 1px solid #afafaf;
  vertical-align: middle;
  box-shadow: inset 0 0 4rem 0px rgba(0, 0, 0, 0.2);
}

.form-wrap .form-item-wrap > div.img-select-wrap::before {
  content: '点击选图';
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 5rem;
  font-size: 0.6rem;
  background-color: rgba(0, 0, 0, .1);
  color: rgb(30, 30, 30);
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

.form-wrap .form-item-wrap > div.form-item-split {
  position: relative;
  height: 2px;
  background: rgba(14, 36, 49, 0.8);
}

.form-wrap .form-item-wrap > div.form-item-node-wrap {
  position: relative;
  display: inline-block;
  width: calc(100% - 10rem - 2rem - 2px - 40px);
  padding: 0.4rem 0.6rem;
  font-size: 1rem;
  border: 1px solid #afafaf;
  color: #505050;
  outline: none;
  vertical-align: middle;
}

.form-wrap .form-item-wrap > div.form-item-node-wrap > .addNewNodeBtn {
  position: relative;
  border: none;
  padding: 0.2rem 0.4rem;
  background-color: #8e9fb9;
  outline: none;
  border-radius: 2px;
  color: #ffffff;
  font-size: 0.6rem;
}

.form-wrap .form-item-wrap > div.form-item-node-wrap > .addNewNodeBtn:active {
  background-color: #8eb999;
}

div.form-item-node-wrap > div.node-tree-wrap {
  position: relative;
  padding: 1.8rem 0.8rem 1.4rem;
  font-size: 0.9rem;
  text-align: left;
  overflow: hidden;
}

div.form-item-node-wrap > div.node-tree-wrap::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #224c61;
  margin-top: 4px;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap {
  position: relative;
  padding: 0.6rem 0 0.8rem 2.6rem;
  overflow: hidden;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > span.node-item-progress-point {
  position: absolute;
  display: block;
  top: calc(1rem - 4px);
  left: calc(0.6rem - 4px);
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  z-index: 9;
  border: 4px solid #ffffff;
  cursor: pointer;
}

div.form-item-node-wrap > div.node-tree-wrap > div.status-0 > span.node-item-progress-point {
  background: #C4C6CF;
}

div.form-item-node-wrap > div.node-tree-wrap > div.status-1 > span.node-item-progress-point::before {
  content: '';
  position: absolute;
  display: block;
  background: #8BCCFE;
  top: 0;
  left: 0;
  width: calc(1rem - 4px);
  height: calc(1rem - 4px);
  border: 2px solid #2093EC;
  border-radius: 50%;
  z-index: 10;
  pointer-events: none;
}

div.form-item-node-wrap > div.node-tree-wrap > div.status-1 > span.node-item-progress-point::after {
  content: '';
  position: absolute;
  top: calc(0rem - 4px);
  left: calc(0rem - 4px);
  display: inline-block;
  width: calc(1rem - 4px + 8px);
  height: calc(1rem - 4px + 8px);
  border-radius: 50%;
  border: 2px solid rgba(32, 147, 236, 0.4);
  background: #ffffff;
  z-index: 9;
  pointer-events: none;
}

div.form-item-node-wrap > div.node-tree-wrap > div.status-2 > span.node-item-progress-point {
  background: #8BCCFE;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .point-line {
  position: absolute;
  left: 1.06rem;
  top: 0;
  display: inline-block;
  width: 2px;
  height: 100%;
  z-index: 1;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap:first-of-type > .point-line {
  top: -20%;
  height: 120%;
}

div.form-item-node-wrap > div.node-tree-wrap > div.status-0 > .point-line {
  background: #C4C6CF;
}

div.form-item-node-wrap > div.node-tree-wrap > div.status-1 > .point-line {
  background: #00e2f6;
}

div.form-item-node-wrap > div.node-tree-wrap > div.status-2 > .point-line {
  background: #00e2f6;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .title {
  position: relative;
  display: inline-block;
  font-weight: bold;
  width: 4.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  background: rgba(128, 199, 113, 0.4);
  padding: 0 0.2rem;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > button.addNodeBtn {
  position: absolute;
  top: 2.2rem;
  left: 2.2rem;
  border: none;
  padding: 0.2rem 0.4rem;
  background-color: #8e9fb9;
  outline: none;
  border-radius: 2px;
  color: #ffffff;
  font-size: 0.6rem;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > button.addNodeBtn:active {
  background-color: #8eb999;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show {
  display: inline-block;
  position: relative;
  width: calc(100% - 1rem - 5.2rem);
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
  overflow: visible;
  margin-left: 20px;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div {
  position: relative;
  width: 100%;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > span {
  position: relative;
  display: block;
  background: rgb(176, 219, 236);
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > span::before {
  content: '';
  position: absolute;
  top: 1rem;
  left: -6px;
  width: 4px;
  border-top: 2px dashed #8bccfe;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > span > div {
  position: absolute;
  top: 0.26rem;
  right: 0.4rem;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > span > div > button {
  position: relative;
  border: none;
  padding: 0.2rem 0.4rem;
  background-color: #8e9fb9;
  outline: none;
  border-radius: 2px;
  color: #ffffff;
  font-size: 0.6rem;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > span > div > button:active {
  background-color: #8eb999;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div:first-of-type > span::before {
  left: -13px;
  width: 11px;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div::before {
  content: '';
  position: absolute;
  top: 1rem;
  left: -10px;
  height: 102%;
  border-left: 2px dashed #8bccfe;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div:last-of-type:before {
  border-left: none;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > div {
  position: relative;
  white-space: normal;
  padding: 0.5rem 0;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > div > span {
  position: relative;
  display: inline-block;
  margin: 0.1rem 0.4rem 0.1rem 0;
  border: 1px solid #00a0e9;
  padding: 0.2rem 0.4rem;
  word-break: break-all;
  word-wrap: break-word;
  border-radius: 4px;
  font-size: 0.6rem;
  cursor: pointer;
  user-select: none;
}

div.form-item-node-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > div > span:active {
  background-color: #8eb999;
  color: #efefef;
}

div.form-item-node-wrap > div.node-tree-wrap > div.note-form-tip {
  margin-top: 0.6rem;
  font-size: 0.6rem;
  background-color: rgba(210, 146, 167, 0.3);
  color: #ffffff;
}
</style>
