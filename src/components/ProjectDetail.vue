<template>
  <div class="project-detail-wrap">
    <div class="data-empty" v-if="!projectData">数据未录入</div>
    <div v-if="projectData" class="head-wrap">
      <div class="project-name-wrap">
        <span :style="{ 'background-image': `url(${projectData.icon})` }"></span>
        <span>{{projectData.name}}</span>
        <div class="progress-wrap">
          <div class="wrapper right">
            <div class="circle-progress rightcircle" :style="progressRotate('right', projectData.progress)"></div>
          </div>
          <div class="wrapper left">
            <div class="circle-progress leftcircle" :style="progressRotate('left', projectData.progress)"></div>
          </div>
          <div class="progress-val" v-html="circleProgressVal(projectData.progress)"></div>
          <div class="water-wrap">
            <div class="water-wave"></div>
          </div>
        </div>
      </div>
      <div class="project-info">
        <div>
          <div>
            <span>责任人</span>
            <span>{{projectData['duty-person']}}</span>
          </div>
          <div>
            <span>项目周期</span>
            <span>{{projectData['period-start']}} - {{projectData['period-end']}}</span>
          </div>
        </div>
        <div>
          <div>
            <span>当前节点</span>
            <span>{{projectData['cur-node']}}</span>
          </div>
          <div>
            <span>参与人数(人)</span>
            <span>{{projectData['people-num']}}</span>
          </div>
          <div>
            <span>当前状态</span>
            <span>{{projectData['cur-status']}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="projectData" class="mode-detail-wrap">
      <div class="mode-item-wrap close" v-for="(mode, index) in projectData.modes" :key="index" :ref="'mode-item-' + index" @click="toggleUnfold(index)">
        <div class="mode-title-wrap">
          <span>{{mode.name}}<span :ref="'mode-icon-' + index">模块{{index + 1}}</span></span>
        </div>
        <div class="mode-info">
          <div>
            <div>
              <span>责任人</span>
              <span>{{mode['duty-person']}}</span>
            </div>
            <div>
              <span>项目周期</span>
              <span>{{mode['period-start']}} - {{mode['period-end']}}</span>
            </div>
          </div>
          <div>
            <div>
              <span>计划天数</span>
              <span>{{mode['plan-day']}}</span>
            </div>
            <div>
              <span>已开发天数</span>
              <span>{{mode['use-day']}}</span>
            </div>
            <div>
              <span>剩余天数</span>
              <span>{{mode['plan-day'] - mode['use-day']}}</span>
            </div>
          </div>
        </div>
        <div class="nodes-wrap">
          <div class="cur-node-wrap" v-for="(node, nodeIndex) in mode.nodes" :key="nodeIndex" v-if="node.status === 1">
            <span>当前节点</span>
            <div>
              <span class="legend">
                <span></span>
              </span>
              <span>周期</span>
              <span class="hight">{{node['plan-day']}}</span>
              <span>天</span>
              <span class="left-margin">截止</span>
              <span class="hight">{{formatDate(new Date(node['end-date']), 'yy/MM/dd')}}</span>
            </div>
          </div>
          <div class="node-tree-wrap">
            <div :class="['node-item-wrap', 'status-' + node.status, node.status === 1 ? 'open' : 'close']" v-for="(node, nodeIndex) in mode.nodes" :key="nodeIndex" :ref="'mode-item-' + index + '-node-item-' + nodeIndex" @click.stop="toggleUnfoldNode(index, nodeIndex)">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      projectId: null,
      projectData: {}
    }
  },
  created () {
    this.projectId = this.$route.params.projectid
    this.projectData = require('./../../static/data.json')[this.projectId]
  },
  mounted () {
    if (this.projectData && this.projectData.modes) {
      for (let m = 0; m < this.projectData.modes.length; m++) {
        let modeIcon = this.$refs['mode-icon-' + m]
        modeIcon[0].style.top = `-${modeIcon[0].offsetHeight * 1 / 3}px`
        modeIcon[0].style.right = `-${modeIcon[0].offsetWidth}px`
      }
    }
    scrollTo(0, 0)
  },
  methods: {
    formatDate: function (date, fmt) {
      var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    },
    circleProgressVal (progress) {
      return `<span style="font-size: 1.6rem;">${progress}</span><span style="font-size: 0.8rem; margin-left: 0.2rem;">%</span>`
    },
    progressRotate (ori, progress) {
      // -135 >>> 45
      if (ori === 'left') {
        if (progress > 50) {
          return { 'transform': `rotate(${(progress - 50) * 3.6 - 135}deg)` }
        }
      } else if (ori === 'right') {
        if (progress > 50) {
          return { 'transform': 'rotate(45deg)' }
        } else {
          return { 'transform': `rotate(${progress * 3.6 - 135}deg)` }
        }
      }
      return { 'transform': 'rotate(-135deg)' }
    },
    toggleUnfold (index) {
      var clickModeItem = this.$refs['mode-item-' + index][0]
      if (clickModeItem.classList.contains('close')) {
        clickModeItem.classList.remove('close')
        clickModeItem.classList.add('open')
        clickModeItem.getElementsByClassName('nodes-wrap')[0].style.maxHeight = 'none'
      } else {
        clickModeItem.classList.remove('open')
        clickModeItem.classList.add('close')
        clickModeItem.getElementsByClassName('nodes-wrap')[0].style.maxHeight = '0px'
      }
    },
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
.data-empty {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #7e7e7e;
}

.head-wrap {
  position: relative;
  height: 13rem;
  background-color: #0269B8;
  background-image: url('./../assets/detail-head-bg.jpg');
  background-size: auto 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem 1.6rem;
}

.head-wrap > .project-name-wrap {
  position: relative;
}

.head-wrap > .project-name-wrap > span {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  font-size: 1.2rem;
  color: rgb(255, 255, 255);
}

.head-wrap > .project-name-wrap > span:first-of-type {
  width: 1.6rem;
  height: 1.6rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.head-wrap > .project-name-wrap > span:last-of-type {
  width: 7.6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.head-wrap > .project-name-wrap > div.progress-wrap {
  position: absolute;
  top: 0;
  right: 0;
  width: 5rem;
  height: 5rem;
  border-radius: 5rem;
  border: 1px solid #c5e6ff;
  color: #ffffff;
  font-size: 0px;
  overflow: hidden;
  z-index: 1;
}

.head-wrap > .project-name-wrap > div.progress-wrap > .wrapper {
  position: absolute;
  width: 2.5rem;
  height: 5rem;
  top: 0;
  overflow: hidden;
  z-index: 1;
}

.head-wrap > .project-name-wrap > div.progress-wrap > .right {
  right: 0;
}

.head-wrap > .project-name-wrap > div.progress-wrap > .left {
  left: 0;
}

.head-wrap > .project-name-wrap > div.progress-wrap > .wrapper > .circle-progress {
  position: absolute;
  width: calc(5rem - 6px);
  height: calc(5rem - 6px);
  border-radius: 50%;
  top: -1px;
  overflow: hidden;
  border: 4px solid transparent;
}

.head-wrap > .project-name-wrap > div.progress-wrap > .wrapper > .rightcircle {
  border-top: 4px solid #00e2f6;
  border-right: 4px solid #00e2f6;
  right: -1px;
  /* animation: circleProgressLoad_right 5s linear infinite; */
}

.head-wrap > .project-name-wrap > div.progress-wrap > .wrapper > .leftcircle {
  border-bottom: 4px solid #00e2f6;
  border-left: 4px solid #00e2f6;
  left: -1px;
  /* animation: circleProgressLoad_left 5s linear infinite; */
}

.head-wrap > .project-name-wrap > div.progress-wrap > .progress-val {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 5rem;
  z-index: 9;
  font-weight: bold;
}

.head-wrap > .project-name-wrap > div.progress-wrap > .water-wrap {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  border-radius: 50%;
  overflow: hidden;
  z-index: 5;
}

.head-wrap > .project-name-wrap > div.progress-wrap > .water-wrap > .water-wave {
  position: absolute;
  bottom: -45%;
  left: 0px;
  width: 100%;
  height: 100%;
  border-radius: 38% 42%;
  z-index: 5;
  background: rgba(0, 223, 243, 0.781);
  box-shadow: 0 0 10px rgba(58, 230, 227, 0.4);
  transform-origin: 50% 50%;
  animation: spin 16s infinite linear;
}

.head-wrap > .project-name-wrap > div.progress-wrap > .water-wrap > .water-wave::before {
  content: '';
  position: absolute;
  bottom: 20%;
  left: 0px;
  width: 100%;
  height: 100%;
  border-radius: 60% 38%;
  z-index: 5;
  background: rgba(252, 234, 255, 0.568);
  box-shadow: 0 0 10px rgba(127, 13, 144, 0.3);
  transform-origin: 49% 51%;
  animation: spin 13s infinite linear;
}

.head-wrap > .project-name-wrap > div.progress-wrap > .water-wrap > .water-wave::after {
  content: '';
  position: absolute;
  bottom: 10%;
  left: 0px;
  width: 110%;
  height: 110%;
  border-radius: 40% 49%;
  z-index: 5;
  background: rgba(50, 241, 152, 0.568);
  box-shadow: 0 0 10px rgba(72, 218, 31, 0.4);
  transform-origin: 51% 49%;
  animation: spin 10s infinite linear;
}

.head-wrap > .project-info {
  position: relative;
  margin-top: 2rem;
}

.head-wrap > .project-info > div {
  position: relative;
  font-size: 0px;
}

.head-wrap > .project-info > div:nth-of-type(n + 2) {
  margin-top: 1.4rem;
}

.head-wrap > .project-info > div > div {
  display: inline-block;
  vertical-align: top;
}

.head-wrap > .project-info > div > div:nth-of-type(1) {
  position: relative;
  width: 25%;
}

.head-wrap > .project-info > div > div:nth-of-type(2) {
  position: relative;
  width: 55%;
}

.head-wrap > .project-info > div > div:nth-of-type(3) {
  position: relative;
  width: 20%;
}

.head-wrap > .project-info > div > div > span {
  position: relative;
  display: block;
}

.head-wrap > .project-info > div > div > span:nth-of-type(1) {
  font-size: 0.8rem;
  color: #8dcaf9;
}

.head-wrap > .project-info > div > div > span:nth-of-type(2) {
  font-size: 1rem;
  color: rgb(255, 255, 255);
  margin-top: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mode-detail-wrap {
  position: relative;
  top: -2.4rem;
}

.mode-detail-wrap > div.mode-item-wrap {
  position: relative;
  background-color: #ffffff;
  width: 96vw;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(100, 100, 100, 0.2);
}

.mode-detail-wrap > div.mode-item-wrap:nth-of-type(n + 2) {
  margin-top: 1rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-title-wrap {
  position: relative;
  padding: 1rem 0.8rem 0.8rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-title-wrap > span {
  position: relative;
  color: #202020;
  font-size: 1rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-title-wrap > span > span {
  position: absolute;
  top: 0px;
  right: 0px;
  display: inline-block;
  color: #e93e3e;
  font-size: 0.6rem;
  border-radius: 2px;
  border: 1px solid rgba(248, 64, 64, 0.6);
  padding: 0.2rem 0.4rem;
  transform: scale(0.8, 0.8);
  box-shadow: inset 0 0 20px rgba(255, 123, 123, 0.6);
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-title-wrap::after {
  content: '';
  position: absolute;
  left: 0.4rem;
  right: 0.4rem;
  bottom: 0;
  border-bottom: 1px solid #f5f4f4;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-info {
  position: relative;
  padding: 1rem 0.8rem 1.4rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-info > div {
  position: relative;
  font-size: 0px;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-info > div:nth-of-type(n + 2) {
  margin-top: 1.4rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-info > div > div {
  display: inline-block;
  vertical-align: top;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-info > div > div:nth-of-type(1) {
  position: relative;
  width: 25%;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-info > div > div:nth-of-type(2) {
  position: relative;
  width: 55%;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-info > div > div:nth-of-type(3) {
  position: relative;
  width: 20%;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-info > div > div > span {
  position: relative;
  display: block;
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-info > div > div > span:nth-of-type(1) {
  font-size: 0.8rem;
  color: rgb(112, 112, 112);
}

.mode-detail-wrap > div.mode-item-wrap > div.mode-info > div > div > span:nth-of-type(2) {
  font-size: 1rem;
  color: rgb(34, 34, 34);
  margin-top: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap {
  position: relative;
  max-height: 0px;
  overflow: hidden;
  transition: all 0.4s ease 0s;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap::before {
  content: '';
  position: absolute;
  left: 0.4rem;
  right: 0.4rem;
  top: 0;
  border-bottom: 1px solid #f5f4f4;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.cur-node-wrap {
  position: relative;
  padding: 1.2rem 0.8rem 0.1rem;
  font-size: 0.9rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.cur-node-wrap > span {
  position: relative;
  display: inline-block;
  color: #5f5f5f;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.cur-node-wrap > div {
  position: relative;
  display: block;
  float: right;
  color: #5f5f5f;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.cur-node-wrap > div > .hight {
  color: #0e0e0e;
  font-weight: bold;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.cur-node-wrap > div > .left-margin {
  margin-left: 0.3rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.cur-node-wrap > div > .legend {
  position: relative;
  margin-right: 1.4rem;
  top: -1px;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.cur-node-wrap > div > .legend::before {
  content: '';
  position: absolute;
  top: calc(0.5rem + 1px);
  left: -1.2rem;
  display: inline-block;
  width: 0.8rem;
  height: 2px;
  background: rgba(32, 147, 236, 0.4);
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.cur-node-wrap > div > .legend::after {
  content: '';
  position: absolute;
  top: calc(0.5rem + 1px);
  right: -1.2rem;
  display: inline-block;
  width: 0.8rem;
  height: 2px;
  background: rgba(32, 147, 236, 0.4);
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.cur-node-wrap > div > .legend > span {
  position: relative;
  display: inline-block;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: #8bccfe;
  border: 2px solid #2093ec;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.cur-node-wrap > div > .legend > span::after {
  content: '';
  position: absolute;
  top: -6px;
  left: -6px;
  display: inline-block;
  width: calc(0.4rem + 8px);
  height: calc(0.4rem + 8px);
  border-radius: 50%;
  border: 2px solid rgba(32, 147, 236, 0.4);
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap {
  position: relative;
  padding: 1.8rem 0.8rem 1.4rem;
  font-size: 0.9rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap {
  position: relative;
  padding: 0.6rem 0 0.8rem 2.6rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap::before {
  content: '';
  position: absolute;
  top: calc(1rem - 4px);
  left: calc(0.6rem - 4px);
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  z-index: 9;
  border: 4px solid rgb(255, 255, 255);
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.status-0::before {
  background: #C4C6CF;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.status-1::before {
  background: #8BCCFE;
  top: calc(1rem);
  left: calc(0.6rem);
  width: calc(1rem - 4px);
  height: calc(1rem - 4px);
  border: 2px solid #2093EC;
  z-index: 10;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.status-1::after {
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

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.status-2::before {
  background: #8BCCFE;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .point-line {
  position: absolute;
  left: 1.06rem;
  top: 0;
  display: inline-block;
  width: 2px;
  height: 100%;
  z-index: 1;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap:first-of-type > .point-line {
  top: -20%;
  height: 120%;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.status-0 > .point-line {
  background: #C4C6CF;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.status-1 > .point-line {
  background: #00e2f6;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.status-2 > .point-line {
  background: #00e2f6;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .title {
  position: relative;
  display: inline-block;
  font-weight: bold;
  width: 4.2rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.open > .title {
  top: 0.35rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-show {
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

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-show > div {
  position: relative;
  display: inline-block;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show {
  display: inline-block;
  position: relative;
  width: calc(100% - 1rem - 4.2rem);
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
  overflow: visible;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div {
  position: relative;
  width: 100%;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > span {
  position: relative;
  display: block;
  background: #F1F1F1;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > span::before {
  content: '';
  position: absolute;
  top: 1rem;
  left: -6px;
  width: 4px;
  border-top: 2px dashed #8bccfe;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div:first-of-type > span::before {
  left: -13px;
  width: 11px;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div::before {
  content: '';
  position: absolute;
  top: 1rem;
  left: -10px;
  height: 102%;
  border-left: 2px dashed #8bccfe;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div:last-of-type:before {
  border-left: none;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > div {
  position: relative;
  white-space: normal;
  padding: 0.5rem 0;
}

.mode-detail-wrap > div.mode-item-wrap > div.nodes-wrap > div.node-tree-wrap > div.node-item-wrap > .dutys-tree-show > div > div > span {
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
