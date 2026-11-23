import { ref } from 'vue'

// 页面可在运行时覆盖 /new/:no 的面包屑（例如同一路由下切换子视图）。
export const pageBreadcrumb = ref(null)

export function setPageBreadcrumb(value) {
  pageBreadcrumb.value = value
}

export function resetPageBreadcrumb() {
  pageBreadcrumb.value = null
}
