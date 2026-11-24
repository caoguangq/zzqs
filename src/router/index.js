import { createRouter, createWebHistory } from 'vue-router'
import { getFeatureBreadcrumb } from '../views/newFeatures/registry.js'

const routes = [
  {
    path: '/home',
    name: 'my-home',
    component: () => import('../views/MyHome.vue'),
    meta: { breadcrumb: ['我的首页'] }
  },
  {
    path: '/visual',
    name: 'data-visualization',
    component: () => import('../views/DataVisualization.vue'),
    meta: { breadcrumb: ['数据可视化'] }
  },
  {
    path: '/notice',
    name: 'notice-center',
    component: () => import('../views/NoticeCenter.vue'),
    meta: { breadcrumb: ['公告'] }
  },
  {
    path: '/sql',
    name: 'handwrite-sql',
    component: () => import('../views/HandwriteSql.vue'),
    meta: { breadcrumb: ['手写SQL'] }
  },
  {
    path: '/message5g',
    name: 'message-5g',
    component: () => import('../views/Message5G.vue'),
    meta: { breadcrumb: ['5G消息'] }
  },
  {
    path: '/query/scheduled',
    component: () => import('../views/newFeatures/ScheduledTaskBrowse.vue'),
    meta: { breadcrumb: ['自助取数', '取数任务', '定时取数浏览'] }
  },
  {
    path: '/new/:no',
    name: 'new-feature',
    component: () => import('../views/newFeatures/FeatureHost.vue'),
    beforeEnter: (to) => {
      if (to.params.no === '8') return '/query/scheduled?creator=' + encodeURIComponent('唐雯丽')
      if (to.params.no === '9') return '/query/scheduled'
      if (to.params.no === '6') return '/query/tasks'
      return true
    }
  },
  {
    path: '/query/tasks',
    name: 'instant-tasks',
    component: () => import('../views/InstantTaskQuery.vue'),
    meta: { breadcrumb: ['自助取数', '取数任务', '即时任务查询展示'] }
  },
  { path: '/', redirect: '/query/instant' },
  {
    path: '/query/instant',
    name: 'instant-query',
    component: () => import('../views/InstantQuery.vue'),
    meta: { breadcrumb: ['自助取数', '取数任务', '即时取数浏览'] }
  },
  {
    path: '/new',
    name: 'new-feature-index',
    component: () => import('../views/newFeatures/IndexPage.vue'),
    meta: { breadcrumb: ['新开发功能', '功能点索引'] }
  },
  {
    path: '/module/:key',
    name: 'placeholder',
    component: () => import('../views/Placeholder.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 新开发功能的面包屑由 registry 合并提供，进入页面前写到 meta 上，TopBar 直接读取
router.beforeEach((to) => {
  if (to.name === 'new-feature') {
    to.meta.breadcrumb = getFeatureBreadcrumb(to.params.no)
  }
  return true
})

export default router
