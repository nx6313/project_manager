<template>
  <div class="project-list-wrap">
    <div class="head-wrap">
      <span>大昌集团</span>
      <span>信息商业智能管理中心</span>
    </div>
    <div class="data-empty" v-if="!(appData.projects && appData.projects.length > 0)">暂无计划中项目</div>
    <div v-if="appData.projects && appData.projects.length > 0" class="projects-wrap">
      <div class="project-item-wrap" v-for="(project, index) in appData.projects" :key="index" @click="toDetail(project)">
        <div class="title">
          <span :style="{ 'background-image': `url(${project.icon})` }"></span>
          <span>{{project.name}}</span>
          <div class="progress-wrap">
            <span>完成度{{project.progress}}%</span>
            <div class="progress-bg">
              <div class="cur-progress-bg" :style="{ 'width': `${project.progress}%` }"></div>
            </div>
          </div>
        </div>
        <div class="info">
          <div>
            <div>
              <span>责任人</span>
              <span>{{project['duty-person']}}</span>
            </div>
            <div>
              <span>项目周期</span>
              <span>{{project['period-start']}} - {{project['period-end']}}</span>
            </div>
            <div>
              <span>当前状态</span>
              <span>{{project['cur-status']}}</span>
            </div>
          </div>
          <div>
            <div>
              <span>当前节点</span>
              <span>{{project['cur-node']}}</span>
            </div>
            <div>
              <span>参与人数(人)</span>
              <span>{{project['people-num']}}</span>
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
      appData: {}
    }
  },
  created () {
    this.$dialog_loading()
    this.$comfun.http_get(this, 'http://dashboard.dachangjr.com/index.php/Json/getJson').then((result) => {
      if (result.body.code === 1) {
        this.appData = JSON.parse(result.body.data)
      }
    })
  },
  methods: {
    toDetail (project) {
      this.$router.push(`/project-detail/${project.name} - /${project.id}`)
    }
  }
}
</script>

<style scoped>
.head-wrap {
  position: relative;
  height: 13rem;
  background-color: #0269B8;
  background-image: url('./../assets/head-bg.jpg');
  background-size: auto 100%;
  background-position: center;
  background-repeat: no-repeat;
  padding: 2rem 1.6rem;
}

.head-wrap > span {
  position: relative;
  display: block;
  color: #fafafa;
}

.head-wrap > span:nth-of-type(1) {
  font-size: 1.2rem;
}

.head-wrap > span:nth-of-type(2) {
  margin-top: 0.2rem;
  font-size: 1.6rem;
}

.head-wrap > span:nth-of-type(2)::after {
  content: '';
  position: absolute;
  width: 50px;
  height: 2px;
  border-radius: 10px;
  background: #fafafa;
  bottom: -0.8rem;
  left: 0;
  box-shadow: 0 0 20px rgba(11, 36, 121, 0.73);
}

.data-empty {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #7e7e7e;
}

.projects-wrap {
  position: relative;
  top: -2.4rem;
}

.projects-wrap > div.project-item-wrap {
  position: relative;
  background-color: #ffffff;
  width: 96vw;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(100, 100, 100, 0.2);
}

.projects-wrap > div.project-item-wrap:nth-of-type(n + 2) {
  margin-top: 1rem;
}

.projects-wrap > div.project-item-wrap > div.title {
  position: relative;
  padding: 1rem 0.8rem 0.8rem;
}

.projects-wrap > div.project-item-wrap > div.title::after {
  content: '';
  position: absolute;
  left: 0.4rem;
  right: 0.4rem;
  bottom: 0;
  border-bottom: 1px solid #f5f4f4;
}

.projects-wrap > div.project-item-wrap > div.title > span {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  font-size: 1rem;
  color: rgb(17, 17, 17);
}

.projects-wrap > div.project-item-wrap > div.title > span:first-of-type {
  width: 1.6rem;
  height: 1.6rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}

.projects-wrap > div.project-item-wrap > div.title > span:last-of-type {
  width: 7.6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.projects-wrap > div.project-item-wrap > div.title > div.progress-wrap {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  font-size: 0px;
  color: #7e7e7e;
}

.projects-wrap > div.project-item-wrap > div.title > div.progress-wrap > span {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  font-size: 0.8rem;
  margin-right: 0.3rem;
}

.projects-wrap > div.project-item-wrap > div.title > div.progress-wrap > div.progress-bg {
  position: relative;
  display: inline-block;
  width: 70px;
  height: 4px;
  border: 1px solid #02b5c5;
  border-radius: 10px;
  overflow: hidden;
  vertical-align: middle;
}

.projects-wrap > div.project-item-wrap > div.title > div.progress-wrap > div.progress-bg > div.cur-progress-bg {
  position: relative;
  display: inline-block;
  height: 4px;
  background: #02b5c5;
}

.projects-wrap > div.project-item-wrap > div.info {
  position: relative;
  padding: 1rem 0.8rem 1.6rem;
}

.projects-wrap > div.project-item-wrap > div.info > div {
  position: relative;
  font-size: 0px;
}

.projects-wrap > div.project-item-wrap > div.info > div:nth-of-type(n + 2) {
  margin-top: 1.4rem;
}

.projects-wrap > div.project-item-wrap > div.info > div > div {
  display: inline-block;
  vertical-align: top;
}

.projects-wrap > div.project-item-wrap > div.info > div > div:nth-of-type(1) {
  position: relative;
  width: 25%;
}

.projects-wrap > div.project-item-wrap > div.info > div > div:nth-of-type(2) {
  position: relative;
  width: 55%;
}

.projects-wrap > div.project-item-wrap > div.info > div > div:nth-of-type(3) {
  position: relative;
  width: 20%;
}

.projects-wrap > div.project-item-wrap > div.info > div > div > span {
  position: relative;
  display: block;
}

.projects-wrap > div.project-item-wrap > div.info > div > div > span:nth-of-type(1) {
  font-size: 0.8rem;
  color: rgb(112, 112, 112);
}

.projects-wrap > div.project-item-wrap > div.info > div > div > span:nth-of-type(2) {
  font-size: 1rem;
  color: rgb(34, 34, 34);
  margin-top: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
