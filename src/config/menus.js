/**
 * 侧栏菜单配置
 *
 * 结构说明：
 * - 一级菜单直接写在 menus 里；
 * - 有 `children` 的菜单点击只负责展开/收起，不跳转；
 * - 最末级菜单用 `route` 指定跳转地址；
 * - 新开发功能（编号 26-51）按后评估材料的“三级功能”分组，挂到截图面包屑对应的位置。
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
        key: 'query-task',
        label: '取数任务',
        children: [
          { key: 'query-instant', label: '即时取数浏览', route: '/query/instant' }
        ]
      }
    ]
  },
  {
    key: 'data',
    label: '业务数据管理',
    icon: 'briefcase',
    wide: true,
    children: featureMenuGroups
  },
  { key: 'monitor', label: '取数监控', icon: 'monitor' },
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

/** 找出某个路由对应的整条菜单链，用于展开父级菜单 */
export function findMenuPathByRoute(path) {
  function walk(items, trail) {
    for (const item of items) {
      const next = [...trail, item]
      if (item.route && path.startsWith(item.route)) {
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