// 公共聚合入口：1-25（同事分支）与 26-51（本分支）两段映射在这里合并，禁止覆盖同事映射。
import {
  featureViews as featureViews0125,
  featureBreadcrumbs as featureBreadcrumbs0125,
  featureMeta
} from './registry-01-25.js'
import {
  featureGroups,
  featureList,
  featureViews as featureViews2651,
  featureBreadcrumbs as featureBreadcrumbs2651,
  findFeature as findFeature2651
} from './registry-26-51.js'

export { featureGroups, featureList, featureMeta }

/** 合并后的功能点：编号 -> 组件加载函数 */
export const featureViews = { ...featureViews0125, ...featureViews2651 }

/** 合并后的面包屑 */
export const featureBreadcrumbs = { ...featureBreadcrumbs0125, ...featureBreadcrumbs2651 }

export function findFeature(no) {
  return findFeature2651(no)
}

export function isFeatureImplemented(no) {
  return Object.prototype.hasOwnProperty.call(featureViews, Number(no))
}

export function loadFeatureView(no) {
  return featureViews[Number(no)] || null
}

export function getFeatureBreadcrumb(no) {
  return (
    featureBreadcrumbs[Number(no)] ||
    ['新开发功能', findFeature(no)?.title || featureMeta[Number(no)]?.name || '']
  )
}