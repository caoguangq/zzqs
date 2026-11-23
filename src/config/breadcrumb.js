import { ref } from 'vue'

/**
 * 页面内切换（列表 -> 详情）时需要临时覆盖顶栏面包屑。
 * 设置为 null 时回退到路由 meta.breadcrumb。
 */
export const manualBreadcrumb = ref(null)