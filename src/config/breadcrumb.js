/**
 * 兼容入口：26-51 页面内切换（列表 -> 详情）时通过这里覆盖顶栏面包屑。
 * 实际状态统一由 pageBreadcrumb.js 维护，避免两套面包屑互相覆盖。
 */
export { pageBreadcrumb as manualBreadcrumb } from './pageBreadcrumb.js'
