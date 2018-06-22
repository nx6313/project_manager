<template>
  <div class="project-manager-wrap">
    <div class="title">项目数据管理</div>
    <div class="btn-wrap">
      <button>添加新项目</button>
      <button>保存修改</button>
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
                <button>修改</button>
                <button>删除</button>
              </td>
            </tr>
            <tr>
              <td class="detail-td" colspan="10">
                <div class="detail-btn-wrap">
                  <button>添加新模块</button>
                </div>
                <table class="detail-table">
                  <tr>
                    <th>模块名称</th>
                    <th>模块负责人</th>
                    <th>模块开始时间</th>
                    <th>模块结束时间</th>
                    <th>模块计划天数</th>
                    <th>模块已用天数</th>
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
                        <td>
                          <button>修改</button>
                          <button>删除</button>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="7">
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
            <tr class="full-td" colspan="10">暂无计划中项目</tr>
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
      appData: {}
    }
  },
  created () {
    this.appData = require('./../../static/data.json')
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
    }
  }
}
</script>

<style scoped>
.title {
  text-align: center;
  font-weight: bold;
  font-size: 8rem;
  margin-top: 1rem;
}

.btn-wrap {
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
  border-color: #999999;
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
  height: 3rem;
  border-style: solid;
  border-color: #999999;
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
  border-color: #666666;
  text-align: center;
}

table td.detail-td {
  background: none;
}

table td.full-td {
  background-size: 100% auto;
}

table td img {
  height: 160px;
}

table.detail-table {
  width: 96%;
  margin-bottom: 0.6rem;
}

table.detail-table th {
  height: 2rem;
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
  border: 4px solid #DDDDC1;
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
  display: inline-block;
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
  background: #F1F1F1;
  padding: 0.4rem 0.8rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  font-size: 0.8rem;
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
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div {
  position: relative;
  width: 100%;
}

div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > span {
  position: relative;
  display: block;
  background: #F1F1F1;
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
