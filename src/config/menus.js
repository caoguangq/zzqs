/**
 * 侧栏菜单配置
 *
 * 结构说明：
 * - 一级菜单直接写在 menus 里；
 * - 有 `children` 的菜单点击只负责展开/收起，不跳转；
 * - 最末级菜单用 `route` 指定跳转地址；
 * - 编号 1-25 的菜单来自同事分支，26-51 按后评估材料的“三级功能”分组挂载；
 * - `aliases` 用于多个编号共用同一页面时保持菜单高亮。
 */
import { featureGroups } from '../views/newFeatures/registry.js'

/** 26-51 按三级功能分组：模型全局视图 / 模型配置优化升级 / 权限管理 / 国产化对接改造 */
const featureMenuGroups = featureGroups.map((group) => ({
  key: `feature-${group.key}`,
  label: group.label,
  children: group.items.map((item) => ({
    key: `feature-${item.no}`,
    label: item.title,
    route: `/new/${item.no}`
  }))
}))

export const menus = [
  { key: 'home', label: '我的首页', icon: 'home', chevron: false },
  { key: 'visual', label: '数据可视化', icon: 'globe' },
  {
    key: 'query',
    label: '自助取数',
    icon: 'download',
    children: [
      {
        key: 'query-making',
        label: '自助取数制作',
        children: [
          { key: 'nf-10-templates', label: '数据集管理', route: '/new/10' },
          { key: 'nf-21-favorites', label: '自助取数制作', route: '/new/21' }
        ]
      },
      {
        key: 'query-tasks',
        label: '取数任务',
        children: [
          { key: 'nf-8-browse', label: '定时取数浏览', route: '/query/scheduled' },
          { key: 'nf-7-create', label: '定时任务新增', route: '/new/7' },
          { key: 'nf-5-edit', label: '即时任务修改', route: '/new/5' },
          { key: 'nf-4-create', label: '即时任务新增', route: '/new/4' },
          { key: 'nf-2-preview', label: '任务数据预览', route: '/new/2' },
          { key: 'nf-1-browse', label: '即时取数浏览', route: '/query/instant' },
          { key: 'nf-6-query', label: '即时任务查询展示', route: '/query/tasks' }
        ]
      },
      {
        key: 'query-upload',
        label: '上传任务',
        children: [
          { key: 'nf-15-upload', label: '文件上传浏览', route: '/new/15' },
          { key: 'nf-17-preview', label: '文件内容预览', route: '/new/17' }
        ]
      },
      {
        key: 'query-app',
        label: '应用中心',
        children: [{ key: 'nf-13-download', label: '文件下载', route: '/new/13' }]
      },
      {
        key: 'query-abnormal',
        label: '异常下载任务',
        children: [{ key: 'nf-14-handle', label: '任务处理', route: '/new/14' }]
      }
    ]
  },
  {
    key: 'data',
    label: '业务数据管理',
    icon: 'briefcase',
    wide: true,
    children: [
      {
        key: 'data-model',
        label: '数据模型准备',
        children: [
          {
            key: 'nf-11-model',
            label: '数据模型管理',
            route: '/new/11',
            aliases: ['/new/18', '/new/19', '/new/20', '/new/23', '/new/24']
          },
          { key: 'nf-22-source', label: '模型来源查询', route: '/new/22' },
          { key: 'nf-25-history', label: '模型历史版本查询', route: '/new/25' }
        ]
      },
      ...featureMenuGroups
    ]
  },
  {
    key: 'monitor',
    label: '取数监控',
    icon: 'monitor',
    children: [
      {
        key: 'monitor-system',
        label: '自助取数系统监控',
        children: [{ key: 'nf-3-logs', label: '取数日志查看', route: '/new/3' }]
      }
    ]
  },
  {
    key: 'config',
    label: '参数配置',
    icon: 'layers',
    children: [
      {
        key: 'desensitize-setting',
        label: '脱敏设置管理',
        children: [
          { key: 'desensitize-list', label: '设置列表', route: '/new/41' },
          { key: 'desensitize-rule', label: '规则配置', route: '/new/41' }
        ]
      }
    ]
  },
  { key: 'notice', label: '公告', icon: 'clipboard', chevron: false },
  { key: 'sql', label: '手写SQL', icon: 'download' },
  { key: 'message5g', label: '5G消息', icon: 'download' }
]

export function findMenu(key) {
  return menus.find((item) => item.key === key)
}

/** 路径是否命中菜单项（含 aliases），按段匹配避免 /new/1 误命中 /new/11 */
function matchesRoute(item, path) {
  const routes = item.route ? [item.route, ...(item.aliases || [])] : item.aliases || []
  return routes.some((route) => path === route || path.startsWith(route + '/'))
}

/** 找出某个路由对应的整条菜单链，用于展开父级菜单 */
export function findMenuPathByRoute(path) {
  function walk(items, trail) {
    for (const item of items) {
      const next = [...trail, item]
      if (matchesRoute(item, path)) {
        return next
      }
      if (item.children) {
        const found = walk(item.children, next)
        if (found) {
          return found
        }
      }
    }
    return null
  }
  return walk(menus, [])
}