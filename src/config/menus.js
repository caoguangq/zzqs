export const menus = [
  { key: 'home', label: '我的首页', icon: 'home', chevron: false },
  { key: 'visual', label: '数据可视化', icon: 'globe' },
  { key: 'query', label: '自助取数', icon: 'download', route: '/query/instant', children: [{key:'query-making',label:'自助取数制作',children:[{key:'nf-10-templates',label:'数据集管理',route:'/new/10'}]}, { key: 'query-tasks', label: '取数任务', children: [{ key:'nf-8-browse',label:'定时取数浏览',route:'/query/scheduled' }, { key:'nf-7-create', label:'定时任务新增', route:'/new/7' }, { key:'nf-5-edit', label:'即时任务修改', route:'/new/5' }, { key:'nf-4-create', label:'即时任务新增', route:'/new/4' }, { key: 'nf-2-preview', label: '任务数据预览', route: '/new/2' }, { key: 'nf-1-browse', label: '即时取数浏览', route: '/query/instant' }, { label: '即时任务查询展示', route: '/query/tasks' }] }, { key: 'query-upload', label: '上传任务', children: [{ key: 'nf-15-upload', label: '文件上传浏览', route: '/new/15' }, { key: 'nf-17-preview', label: '文件内容预览', route: '/new/17' }] }, { key: 'query-app', label: '应用中心', children: [{ key: 'nf-13-download', label: '文件下载', route: '/new/13' }] }, { key: 'query-abnormal', label: '异常下载任务', children: [{ key: 'nf-14-handle', label: '任务处理', route: '/new/14' }] }] },
  { key: 'data', label: '业务数据管理', icon: 'briefcase', route: '/new/11', children: [{ key: 'data-model', label: '数据模型准备', children: [{ key: 'nf-11-model', label: '数据模型管理', route: '/new/11', aliases: ['/new/18', '/new/19', '/new/20'] }] }] },
  { key: 'monitor', label: '取数监控', icon: 'monitor', route: '/new/3', children: [{ key: 'monitor-system', label: '自助取数系统监控', children: [{ key: 'nf-3-logs', label: '取数日志查看', route: '/new/3' }] }] },
  { key: 'config', label: '参数配置', icon: 'layers' },
  { key: 'notice', label: '公告', icon: 'clipboard', chevron: false },
  { key: 'sql', label: '手写SQL', icon: 'download' },
  { key: 'message5g', label: '5G消息', icon: 'download' }
]

export function findMenu(key) {
  return menus.find((item) => item.key === key)
}
