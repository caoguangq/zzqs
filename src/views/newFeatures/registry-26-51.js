/**
 * 新开发功能（编号 26-51）注册表
 *
 * 数据来源：`新开发功能/` 目录下的后评估材料 xlsx（功能点编号 26-51，共 55 张截图）。
 * 本文件只负责 26-51 这一段；1-25 在 registry-01-25.js，两段由 registry.js 聚合。
 */

/* 层级取自后评估材料：B 列一级功能、C 列二级功能、D 列三级功能、E 列四级功能（功能点） */
export const featureGroups = [
  {
    key: 'model-view',
    label: '模型全局视图',
    items: [
      { no: 26, title: '模型历史版本新增', group: '模型全局视图' },
      { no: 27, title: '模型历史版本修改', group: '模型全局视图' },
      { no: 28, title: '模型历史版本删除', group: '模型全局视图' },
      { no: 29, title: '模型顺序结构升级', group: '模型全局视图' },
      { no: 30, title: '模型顺序结构降级', group: '模型全局视图' }
    ]
  },
  {
    key: 'model-config',
    label: '模型配置优化升级',
    items: [
      { no: 31, title: '模型元数据异常查询展示', group: '模型配置优化升级' },
      { no: 32, title: '模型账期异常查询展示', group: '模型配置优化升级' },
      { no: 33, title: '模型异常任务派发', group: '模型配置优化升级' },
      { no: 34, title: '模型异常任务处理', group: '模型配置优化升级' },
      { no: 35, title: '模型异常消息提醒', group: '模型配置优化升级' }
    ]
  },
  {
    key: 'permission',
    label: '权限管理',
    items: [
      { no: 36, title: '按负责人查询数据集', group: '权限管理' },
      { no: 37, title: '负责人关联数据集总览列表', group: '权限管理' },
      { no: 38, title: '负责人关联数据集新增赋权', group: '权限管理' },
      { no: 39, title: '负责人关联数据集撤销赋权', group: '权限管理' },
      { no: 40, title: '已赋权数据集权限查询展示', group: '权限管理' }
    ]
  },
  {
    key: 'localization',
    label: '国产化对接改造',
    items: [
      { no: 41, title: '脱敏设置管理', group: '国产化对接改造' },
      { no: 42, title: '直连数据模型管理', group: '国产化对接改造' },
      { no: 43, title: '数据视图管理', group: '国产化对接改造' },
      { no: 44, title: '模型样例数据管理', group: '国产化对接改造' },
      { no: 45, title: '手写查询语句管理', group: '国产化对接改造' },
      { no: 46, title: '模型数据抽取管理', group: '国产化对接改造' },
      { no: 47, title: '模型数据采样', group: '国产化对接改造' },
      { no: 48, title: '模型数据合并', group: '国产化对接改造', note: '原表无截图' },
      { no: 49, title: '模型数据清洗', group: '国产化对接改造' },
      { no: 50, title: '模型数据扩展和行列转换', group: '国产化对接改造' },
      { no: 51, title: '维度管理适配改造', group: '国产化对接改造' }
    ]
  }
]

export const featureList = featureGroups.flatMap((group) => group.items)

/** 已实现的功能点：编号 -> 组件加载函数 */
export const featureViews = {
  26: () => import('./ModelHistoryVersion.vue'),
  27: () => import('./ModelHistoryVersion.vue'),
  28: () => import('./ModelHistoryVersion.vue'),
  29: () => import('./DataModelManage.vue'),
  30: () => import('./DataModelManage.vue'),
  31: () => import('./ModelScanManage.vue'),
  32: () => import('./ModelScanManage.vue'),
  33: () => import('./ModelAbnormalDispatch.vue'),
  34: () => import('./ModelAbnormalHandle.vue'),
  35: () => import('./ModelScanManage.vue'),
  36: () => import('./OwnerDatasetQuery.vue'),
  37: () => import('./OwnerDatasetOverview.vue'),
  38: () => import('./DataModelManage.vue'),
  39: () => import('./DataModelManage.vue'),
  40: () => import('./AuthorizedDatasetQuery.vue'),
  41: () => import('./DesensitizeSetting.vue'),
  42: () => import('./DirectModelManage.vue'),
  43: () => import('./DataViewManage.vue'),
  44: () => import('./SampleDataManage.vue'),
  45: () => import('./HandwriteSqlManage.vue'),
  46: () => import('./ModelExtractManage.vue'),
  47: () => import('./ModelDataSample.vue'),
  49: () => import('./ModelDataClean.vue'),
  50: () => import('./ModelDataTransform.vue'),
  51: () => import('./DimensionManage.vue')
}

/** 已实现功能点的面包屑，未登记时使用默认面包屑 */
export const featureBreadcrumbs = {
  26: ['业务数据管理', '数据模型准备', '模型历史版本管理'],
  27: ['业务数据管理', '数据模型准备', '模型历史版本查询'],
  28: ['业务数据管理', '数据模型准备', '模型历史版本管理'],
  29: ['业务数据管理', '数据模型准备', '数据模型管理'],
  30: ['业务数据管理', '数据模型准备', '数据模型管理'],
  31: ['业务数据管理', '数据模型管理', '模型扫描管理'],
  32: ['业务数据管理', '数据模型管理', '模型扫描管理'],
  33: ['业务数据管理', '数据模型准备', '模型异常任务派发'],
  34: ['业务数据管理', '数据模型准备', '模型异常任务处理'],
  35: ['业务数据管理', '数据模型准备', '模型扫描管理'],
  36: ['业务数据管理', '数据集管理', '按负责人查询数据集'],
  37: ['权限管理', '负责人管理', '负责人关联数据集总览'],
  38: ['业务数据管理', '数据模型准备', '数据模型管理'],
  39: ['业务数据管理', '数据模型准备', '数据模型管理'],
  40: ['权限管理', '数据集权限', '已赋权数据集查询'],
  41: ['参数配置', '脱敏设置管理', '设置列表'],
  42: ['业务数据管理', '数据模型准备', '直连数据模型管理'],
  43: ['业务数据管理', '数据模型准备', '数据视图管理'],
  44: ['业务数据管理', '数据模型准备', '模型样例数据管理'],
  45: ['业务数据管理', '数据模型准备', '手写查询语句管理'],
  46: ['业务数据管理', '数据模型准备', '模型数据抽取管理'],
  47: ['自助取数', '新建取数任务'],
  49: ['业务数据管理', '数据模型准备', '数据预处理能力'],
  50: ['业务数据管理', '数据模型准备', '数据扩展与透视'],
  51: ['业务数据管理', '基础数据配置', '维度管理']
}

export function findFeature(no) {
  return featureList.find((item) => item.no === Number(no))
}