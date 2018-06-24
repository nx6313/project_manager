<template>
  <div class="project-manager-wrap">
    <div class="title">项目数据管理</div>
    <div class="update-tip" v-show="updteFlag">
      <img src="./../assets/loading.gif">
      <span>数据保存中...</span>
    </div>
    <div class="btn-wrap">
      <button @click="addNewProject">添加新项目</button>
      <!-- <button @click="saveAppData">保存修改</button> -->
    </div>
    <div>
      <div>
        <table>
          <tr>
            <th>项目图标</th>
            <th>项目名称</th>
            <th>项目进度</th>
            <th>项目负责人</th>
            <th>项目开始时间</th>
            <th>项目结束时间</th>
            <th>项目当前状态</th>
            <th>项目当前节点</th>
            <th>项目参与人数</th>
            <th>操作</th>
          </tr>
          <tbody v-if="appData.projects && appData.projects.length > 0" v-for="(app, appIndex) in appData.projects" :key="appIndex">
            <tr>
              <td><img :src="app.icon"></td>
              <td>{{app.name}}</td>
              <td>{{app.progress}}</td>
              <td>{{app['duty-person']}}</td>
              <td>{{app['period-start']}}</td>
              <td>{{app['period-end']}}</td>
              <td>{{app['cur-status']}}</td>
              <td>{{app['cur-node']}}</td>
              <td>{{app['people-num']}}</td>
              <td>
                <button @click="updateProject(app)">修改</button>
                <button @click="deleteProject(appIndex)">删除</button>
              </td>
            </tr>
            <tr>
              <td class="detail-td" colspan="10">
                <div class="detail-btn-wrap">
                  <button @click="addNewMode(appIndex)">添加新模块</button>
                </div>
                <table class="detail-table">
                  <tr>
                    <th>模块名称</th>
                    <th>模块负责人</th>
                    <th>模块开始时间</th>
                    <th>模块结束时间</th>
                    <th>模块计划天数</th>
                    <th>模块已用天数</th>
                    <th>模块剩余天数</th>
                    <th>操作</th>
                  </tr>
                  <template v-if="appData[app.id]">
                    <tbody v-for="(mode, modeIndex) in appData[app.id].modes" :key="modeIndex">
                      <tr>
                        <td>{{mode.name}}</td>
                        <td>{{mode['duty-person']}}</td>
                        <td>{{mode['period-start']}}</td>
                        <td>{{mode['period-end']}}</td>
                        <td>{{mode['plan-day']}}</td>
                        <td>{{mode['use-day']}}</td>
                        <td>{{mode['plan-day'] - mode['use-day']}}</td>
                        <td>
                          <button @click="updateMode(mode)">修改</button>
                          <button @click="deleteMode(app.id, modeIndex)">删除</button>
                        </td>
                      </tr>
                      <tr>
                        <td class="note-td" colspan="8">
                            <div class="node-tree-wrap">
                                <div :class="['node-item-wrap', 'status-' + node.status, node.status === 1 ? 'open' : 'close']" v-for="(node, nodeIndex) in mode.nodes" :key="nodeIndex" :ref="'mode-item-' + modeIndex + '-node-item-' + nodeIndex" @click.stop="toggleUnfoldNode(modeIndex, nodeIndex)">
                                <span class="point-line"></span>
                                <span class="title">{{node.title}}</span>
                                <div class="dutys-show" v-show="node.status !== 1">
                                    <div v-for="(executor, exeIndex) in node.executors" :key="exeIndex">
                                    <span>{{executor.duty}}</span>
                                    <span><span>{{executor.peoples.length}}</span> 人</span>
                                    </div>
                                </div>
                                <div class="dutys-tree-show" v-show="node.status === 1">
                                    <div v-for="(executor, exeIndex) in node.executors" :key="exeIndex">
                                    <span>{{executor.duty}}&nbsp;&nbsp;{{executor.peoples.length}} 人</span>
                                    <div>
                                        <span v-for="(exepeople, exePeopleIndex) in executor.peoples" :key="exePeopleIndex">{{exepeople}}</span>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                  <tbody v-if="!appData[app.id]">
                    <tr>
                      <td class="full-td" colspan="10">该项目暂无模块数据</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
          <tbody v-if="!(appData.projects && appData.projects.length > 0)">
            <tr>
              <td class="full-td" colspan="10">暂无计划中项目</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isEmpty: false,
      updteFlag: false,
      appData: {},
      autoSaveTimer: null
    }
  },
  created () {
    this.appData = require('./../../static/data.json')
    if (!this.appData.projects) {
      this.appData = {
        projects: []
      }
    }
    if (this.appData.projects.length === 0) {
      this.isEmpty = true
    }
  },
  methods: {
    toggleUnfoldNode (index, nodeIndex) {
      var clickNodeItem = this.$refs['mode-item-' + index + '-node-item-' + nodeIndex][0]
      if (clickNodeItem.classList.contains('close')) {
        clickNodeItem.classList.remove('close')
        clickNodeItem.classList.add('open')
        clickNodeItem.getElementsByClassName('dutys-show')[0].style.display = 'none'
        clickNodeItem.getElementsByClassName('dutys-tree-show')[0].style.display = 'inline-block'
      } else {
        clickNodeItem.classList.remove('open')
        clickNodeItem.classList.add('close')
        clickNodeItem.getElementsByClassName('dutys-show')[0].style.display = 'inline-block'
        clickNodeItem.getElementsByClassName('dutys-tree-show')[0].style.display = 'none'
      }
    },
    addNewProject () {
      this.$dialog_pop({
        type: 'add-project-info',
        callback: (formData) => {
          if (formData.type === 'only-project') {
            this.appData.projects.splice(this.appData.projects.length, 1, {
              id: this.$comfun.guid(),
              name: formData['add-project-info-data-1'],
              icon: formData['add-project-info-data-0'],
              progress: Number(formData['add-project-info-data-2']),
              'duty-person': formData['add-project-info-data-3'],
              'period-start': formData['add-project-info-data-4'],
              'period-end': formData['add-project-info-data-5'],
              'cur-status': formData['add-project-info-data-6'],
              'cur-node': formData['add-project-info-data-7'],
              'people-num': Number(formData['add-project-info-data-8'])
            })
            this.updteFlag = true
          } else if (formData.type === 'project-mode') {
            // 项目数据
            this.appData.projects.splice(this.appData.projects.length, 1, {
              id: this.$comfun.guid(),
              name: formData['add-project-info-data-1'],
              icon: formData['add-project-info-data-0'],
              progress: Number(formData['add-project-info-data-2']),
              'duty-person': formData['add-project-info-data-3'],
              'period-start': formData['add-project-info-data-4'],
              'period-end': formData['add-project-info-data-5'],
              'cur-status': formData['add-project-info-data-6'],
              'cur-node': formData['add-project-info-data-7'],
              'people-num': Number(formData['add-project-info-data-8'])
            })
            // 模块数据
            var pIndex = this.appData.projects.length - 1
            var pId = this.appData.projects[pIndex].id
            if (!this.appData[pId]) {
              this.$set(this.appData, pId, {
                id: this.appData.projects[pIndex].id,
                name: this.appData.projects[pIndex].name,
                icon: this.appData.projects[pIndex].icon,
                progress: this.appData.projects[pIndex].progress,
                'duty-person': this.appData.projects[pIndex]['duty-person'],
                'period-start': this.appData.projects[pIndex]['period-start'],
                'period-end': this.appData.projects[pIndex]['period-end'],
                'cur-status': this.appData.projects[pIndex]['cur-status'],
                'cur-node': this.appData.projects[pIndex]['cur-node'],
                'people-num': this.appData.projects[pIndex]['people-num'],
                modes: []
              })
            }
            this.appData[pId].modes.splice(this.appData[pId].modes.length, 1, {
              name: formData['add-mode-info-data-0'],
              'duty-person': formData['add-mode-info-data-1'],
              'period-start': formData['add-mode-info-data-2'],
              'period-end': formData['add-mode-info-data-3'],
              'plan-day': Number(formData['add-mode-info-data-4']),
              'use-day': Number(formData['add-mode-info-data-5']),
              nodes: formData['add-mode-info-data-6']
            })
            this.updteFlag = true
          }
        }
      })
    },
    updateProject (pData) {
      this.$dialog_pop({
        type: 'update-project-info',
        updateModelInit: [
          pData.icon,
          pData.name,
          pData.progress,
          pData['duty-person'],
          pData['period-start'],
          pData['period-end'],
          pData['cur-status'],
          pData['cur-node'],
          pData['people-num']
        ],
        callback: (formData) => {
          if (formData.type === 'update-project') {
            pData.name = formData['update-project-info-data-1']
            pData.icon = formData['update-project-info-data-0']
            pData.progress = Number(formData['update-project-info-data-2'])
            pData['duty-person'] = formData['update-project-info-data-3']
            pData['period-start'] = formData['update-project-info-data-4']
            pData['period-end'] = formData['update-project-info-data-5']
            pData['cur-status'] = formData['update-project-info-data-6']
            pData['cur-node'] = formData['update-project-info-data-7']
            pData['people-num'] = Number(formData['update-project-info-data-8'])
            this.updteFlag = true
          }
        }
      })
    },
    deleteProject (pIndex) {
      this.appData.projects.splice(pIndex, 1)
      if (this.isEmpty && this.appData.projects.length === 0) {
        this.updteFlag = false
      } else {
        this.updteFlag = true
      }
    },
    addNewMode (pIndex) {
      this.$dialog_pop({
        type: 'add-mode-info',
        callback: (formData) => {
          if (formData.type === 'only-mode') {
            var pId = this.appData.projects[pIndex].id
            if (!this.appData[pId]) {
              this.$set(this.appData, pId, {
                id: this.appData.projects[pIndex].id,
                name: this.appData.projects[pIndex].name,
                icon: this.appData.projects[pIndex].icon,
                progress: this.appData.projects[pIndex].progress,
                'duty-person': this.appData.projects[pIndex]['duty-person'],
                'period-start': this.appData.projects[pIndex]['period-start'],
                'period-end': this.appData.projects[pIndex]['period-end'],
                'cur-status': this.appData.projects[pIndex]['cur-status'],
                'cur-node': this.appData.projects[pIndex]['cur-node'],
                'people-num': this.appData.projects[pIndex]['people-num'],
                modes: []
              })
            }
            this.appData[pId].modes.splice(this.appData[pId].modes.length, 1, {
              name: formData['add-mode-info-data-0'],
              'duty-person': formData['add-mode-info-data-1'],
              'period-start': formData['add-mode-info-data-2'],
              'period-end': formData['add-mode-info-data-3'],
              'plan-day': Number(formData['add-mode-info-data-4']),
              'use-day': Number(formData['add-mode-info-data-5']),
              nodes: formData['add-mode-info-data-6']
            })
          }
        }
      })
    },
    updateMode (mode) {
      this.$dialog_pop({
        type: 'update-mode-info',
        updateModelInit: [
          mode.name,
          mode['duty-person'],
          mode['period-start'],
          mode['period-end'],
          mode['plan-day'],
          mode['use-day']
        ],
        modeNodes: [].concat(mode.nodes),
        callback: (formData) => {
          if (formData.type === 'update-mode') {
            mode.name = formData['update-mode-info-data-0']
            mode['duty-person'] = formData['update-mode-info-data-1']
            mode['period-start'] = formData['update-mode-info-data-2']
            mode['period-end'] = formData['update-mode-info-data-3']
            mode['plan-day'] = Number(formData['update-mode-info-data-4'])
            mode['use-day'] = Number(formData['update-mode-info-data-5'])
            mode.nodes = formData['update-mode-info-data-6']
            this.updteFlag = true
          }
        }
      })
    },
    deleteMode (pId, modeIndex) {
      this.appData[pId].modes.splice(modeIndex, 1)
      if (this.appData[pId].modes.length === 0) {
        delete this.appData[pId]
      }
      this.updteFlag = true
    },
    saveAppData () {
      if (this.updteFlag) {
        console.log(this.appData)
        this.updteFlag = false
      }
    }
  },
  watch: {
    updteFlag (cur, old) {
      if (cur === true) {
        clearTimeout(this.autoSaveTimer)
        this.autoSaveTimer = setTimeout(() => {
          this.saveAppData()
        }, 100)
      }
    }
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  font-weight: bold;
  font-size: 1.6rem;
  margin-top: 1rem;
}

.update-tip {
  position: fixed;
  right: 2rem;
  bottom: 1.6rem;
  font-size: 0.8rem;
  background: #b2dbe0;
  color: rgb(51, 51, 51);
  padding: 0.2rem 1.2rem 0.2rem 0.6rem;
  transition: all 0.4s ease 0s;
}

.update-tip > img {
  display: inline-block;
  vertical-align: middle;
  height: 30px;
}

.update-tip > span {
  display: inline-block;
  vertical-align: middle;
  font-weight: bold;
}

.btn-wrap {
  position: relative;
  padding: 0.4rem 5vw;
  margin-top: 2rem;
}

.btn-wrap > button {
  padding: 0.4rem 0.8rem;
}

table {
  position: relative;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 90vw;
  font-family: verdana,arial,sans-serif;
  font-size: 11px;
  color: #333333;
  border-width: 1px;
  border-color: rgba(102, 102, 102, 0.35);
  border-collapse: collapse;
  margin-bottom: 1.6rem;
}

table th {
  background-color: #b5cfd2;
  background-image: url('./../assets/cell-blue.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 100%;
  border-width: 1px;
  padding: 8px;
  height: 1rem;
  border-style: solid;
  border-color: rgba(102, 102, 102, 0.35);
}

table td {
  background-color: #dcddc0;
  background-image: url('./../assets/cell-grey.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: auto 100%;
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: rgba(102, 102, 102, 0.35);
  text-align: center;
}

table td.detail-td {
  background: none;
}

table td.full-td {
  background-size: 100% auto;
}

table td.note-td {
  background: #fdecf6;
}

table td img {
  height: 2.4rem;
}

table.detail-table {
  width: 96%;
  margin-bottom: 0.6rem;
}

table.detail-table th {
  height: 1rem;
}

.detail-btn-wrap {
  padding: 0.4rem 2%;
  text-align: left;
}

.btn-wrap > button {
  padding: 0.4rem 0.8rem;
}

div.node-tree-wrap {
  position: relative;
  padding: 1.8rem 0.8rem 1.4rem;
  font-size: 0.9rem;
  text-align: left;
}

div.node-tree-wrap > div.node-item-wrap {
  position: relative;
  padding: 0.6rem 0 0.8rem 2.6rem;
}

div.node-tree-wrap > div.node-item-wrap::before {
  content: '';
  position: absolute;
  top: calc(1rem - 4px);
  left: calc(0.6rem - 4px);
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  z-index: 9;
  border: 4px solid #fdecf6;
}

div.node-tree-wrap > div.status-0::before {
  background: #C4C6CF;
}

div.node-tree-wrap > div.status-1::before {
  background: #8BCCFE;
  top: calc(1rem);
  left: calc(0.6rem);
  width: calc(1rem - 4px);
  height: calc(1rem - 4px);
  border: 2px solid #2093EC;
  z-index: 10;
}

div.node-tree-wrap > div.status-1::after {
  content: '';
  position: absolute;
  top: calc(1rem - 4px);
  left: calc(0.6rem - 4px);
  display: inline-block;
  width: calc(1rem - 4px + 8px);
  height: calc(1rem - 4px + 8px);
  border-radius: 50%;
  border: 2px solid rgba(32, 147, 236, 0.4);
  background: #ffffff;
  z-index: 9;
}

div.node-tree-wrap > div.status-2::before {
  background: #8BCCFE;
}

div.node-tree-wrap > div.node-item-wrap > .point-line {
  position: absolute;
  left: 1.06rem;
  top: 0;
  display: inline-block;
  width: 2px;
  height: 100%;
  z-index: 1;
}

div.node-tree-wrap > div.node-item-wrap:first-of-type > .point-line {
  top: -20%;
  height: 120%;
}

div.node-tree-wrap > div.status-0 > .point-line {
  background: #C4C6CF;
}

div.node-tree-wrap > div.status-1 > .point-line {
  background: #00e2f6;
}

div.node-tree-wrap > div.status-2 > .point-line {
  background: #00e2f6;
}

div.node-tree-wrap > div.node-item-wrap > .title {
  position: relative;
  /* display: inline-block; */
  font-weight: bold;
  width: 4.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 0.8rem;
}

div.node-tree-wrap > div.open > .title {
  top: 0.35rem;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-show {
  display: inline-block;
  position: relative;
  width: calc(100% - 2.6rem - 4.2rem);
  background: rgb(176, 219, 236);
  padding: 0.4rem 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 0.8rem;
  margin-left: 20px;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-show > div {
  position: relative;
  display: inline-block;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show {
  display: inline-block;
  position: relative;
  width: calc(100% - 1rem - 4.2rem);
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
  overflow: visible;
  margin-left: 20px;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div {
  position: relative;
  width: 100%;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > span {
  position: relative;
  display: block;
  background: rgb(176, 219, 236);
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > span::before {
  content: '';
  position: absolute;
  top: 1rem;
  left: -6px;
  width: 4px;
  border-top: 2px dashed #8bccfe;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div:first-of-type > span::before {
  left: -13px;
  width: 11px;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div::before {
  content: '';
  position: absolute;
  top: 1rem;
  left: -10px;
  height: 102%;
  border-left: 2px dashed #8bccfe;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div:last-of-type:before {
  border-left: none;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > div {
  position: relative;
  white-space: normal;
  padding: 0.5rem 0;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > div > span {
  position: relative;
  display: inline-block;
  margin: 0.1rem 0.4rem 0.1rem 0;
  border: 1px solid #00a0e9;
  padding: 0.2rem 0.4rem;
  word-break: break-all;
  word-wrap: break-word;
  border-radius: 4px;
  font-size: 0.6rem;
}
</style>
