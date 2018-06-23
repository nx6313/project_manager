import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import Moment from '@/utils/moment.js'
import ComFun from '@/utils/comfun.js'
import '@/plugins/animate.css'
import Msgbox from '@/plugins/msgbox/msgbox.js'
import ProjectList from '@/components/ProjectList'
import ProjectDetail from '@/components/ProjectDetail'
import ProjectManager from '@/components/ProjectManager'

Vue.use(Router)
Vue.use(VueResource)
Vue.use(Moment)
Vue.use(ComFun)
Vue.use(Msgbox)

var router = new Router({
  routes: [
    {
      path: '/',
      name: 'ProjectList',
      component: ProjectList
    },
    {
      path: '/project-detail/:projectname/:projectid',
      name: 'ProjectDetail',
      component: ProjectDetail,
      meta: {
        title: '项目详情'
      }
    },
    {
      path: '/manager',
      name: 'ProjectManager',
      component: ProjectManager,
      meta: {
        title: '项目进度展板 数据管理'
      }
    }
  ]
})
router.beforeEach(function (to, from, next) {
  if (to.meta.title) {
    var projectName = to.params['projectname'] || ''
    document.title = projectName + to.meta.title
  } else {
    document.title = '项目进度展板'
  }
  next()
})

export default router
