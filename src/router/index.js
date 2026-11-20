import { createRouter, createWebHistory } from 'vue-router'
import { featureBreadcrumbs } from '../views/newFeatures/registry.js'

const routes = [
  {path:'/query/scheduled',component:()=>import('../views/newFeatures/ScheduledTaskBrowse.vue'),meta:{breadcrumb:['自助取数','取数任务','定时取数浏览']}},
  { path: '/new/:no', name: 'new-feature', component: () => import('../views/newFeatures/FeatureHost.vue'), beforeEnter: (to) => { if (to.params.no === '8') return '/query/scheduled?creator='+encodeURIComponent('唐雯丽'); if (to.params.no === '9') return '/query/scheduled'; if (to.params.no === '6') return '/query/tasks'; to.meta.breadcrumb = featureBreadcrumbs[to.params.no] || ['功能未实现'] } },
  { path: '/query/tasks', name: 'instant-tasks', component: () => import('../views/InstantTaskQuery.vue'), meta: { breadcrumb: ['自助取数', '取数任务', '即时任务查询展示'] } },
  { path: '/', redirect: '/query/instant' },
  {
    path: '/query/instant',
    name: 'instant-query',
    component: () => import('../views/InstantQuery.vue'),
    meta: { breadcrumb: ['自助取数', '取数任务', '即时取数浏览'] }
  },
  {
    path: '/module/:key',
    name: 'placeholder',
    component: () => import('../views/Placeholder.vue')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
