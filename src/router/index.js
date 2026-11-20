import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
