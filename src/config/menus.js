/**
 * 侧栏菜单配置
 *
 * 结构说明：
 * - 一级菜单直接写在 menus 里；
 * - 有 `children` 的菜单点击只负责展开/收起，不跳转；
 * - 二级/三级菜单通过侧栏右侧浮层展示，`wide` 表示双列浮层；
 * - 最末级菜单用 `route` 指定跳转地址，`aliases` 用于同一页面挂多个入口；
 * - 新开发功能（编号 26-51）按后评估材料的“三级功能”分组，挂到截图面包屑对应的位置。
 *   （菜单与页面面包屑不一致是已知情况，合并时原样保留。）
 */
import { featureGroups } from '../views/newFeatures/registry.js'

/**
 * 26-51 按三级功能分组：模型全局视图 / 模型配置优化升级 / 权限管理 / 国产化对接改造。
 * 41 号只保留「参数配置 → 脱敏设置管理」入口，不再重复出现在“国产化对接改造”下。
 */
/**
 * 以下功能共用同一个页面，页面里通过按钮/行操作切换具体功能，
 * 因此左侧每组只保留一个菜单入口，其余编号通过 aliases 命中并高亮同一个菜单：
 * - 26/27/28 模型历史版本新增/修改/删除 → 模型历史版本管理
 * - 29/30 模型顺序结构升级/降级 → 模型顺序结构管理
 * - 31/32/35 模型元数据异常/账期异常/异常消息提醒 → 模型扫描管理
 * - 38/39 负责人关联数据集新增/撤销赋权 → 负责人关联数据集赋权
 * 所有编号对应的 /new/:no 路由仍然可用，便于逐项核对。
 */
const mergedFeatureMenus = new Map([
  [26, { label: '模型历史版本管理', aliases: ['/new/27', '/new/28'] }],
  [29, { label: '模型顺序结构管理', aliases: ['/new/30'] }],
  [31, { label: '模型扫描管理', aliases: ['/new/32', '/new/35'] }],
  [38, { label: '负责人关联数据集赋权', aliases: ['/new/39'] }]
])
const hiddenFeatureMenuNos = new Set([27, 28, 30, 32, 35, 39])

const featureMenuGroups = featureGroups.map((group) => ({
  key: `feature-${group.key}`,
  label: group.label,
  children: group.items
    .filter((item) => item.no !== 41 && !hiddenFeatureMenuNos.has(item.no))
    .map((item) => {
      const merged = mergedFeatureMenus.get(item.no)
      return {
        key: `feature-${item.no}`,
        label: merged?.label ?? item.title,
        route: `/new/${item.no}`,
        ...(merged?.aliases ? { aliases: merged.aliases } : {})
      }
    })
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
          { key: 'nf-6-tasks', label: '即时任务查询展示', route: '/query/tasks' }
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

/**
 * 找出某个路由对应的整条菜单链，用于高亮父级菜单。
 * 采用精确匹配（含 aliases），避免 /new/2 误命中 /new/21、/new/22。
 */
export function findMenuPathByRoute(path) {
  function walk(items, trail) {
    for (const item of items) {
      const next = [...trail, item]
      if (item.children) {
        const found = walk(item.children, next)
        if (found) {
          return found
        }
      }
      if (item.route && (path === item.route || (item.aliases || []).includes(path))) {
        return next
      }
    }
    return null
  }
  return walk(menus, [])
}
