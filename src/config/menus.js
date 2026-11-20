export const menus = [
  { key: 'home', label: '我的首页', icon: 'home', chevron: false },
  { key: 'visual', label: '数据可视化', icon: 'globe' },
  { key: 'query', label: '自助取数', icon: 'download', route: '/query/instant' },
  { key: 'data', label: '业务数据管理', icon: 'briefcase' },
  { key: 'monitor', label: '取数监控', icon: 'monitor' },
  { key: 'config', label: '参数配置', icon: 'layers' },
  { key: 'notice', label: '公告', icon: 'clipboard', chevron: false },
  { key: 'sql', label: '手写SQL', icon: 'download' },
  { key: 'message5g', label: '5G消息', icon: 'download' }
]

export function findMenu(key) {
  return menus.find((item) => item.key === key)
}
