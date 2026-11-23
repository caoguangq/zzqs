// 公共聚合入口：按编号分段登记，禁止整文件覆盖其他分支的映射。
import {
  featureViews as featureViews01to25,
  featureBreadcrumbs as featureBreadcrumbs01to25,
  featureMeta
} from './registry-01-25.js'
import {
  featureGroups,
  featureList,
  featureViews as featureViews26to51,
  featureBreadcrumbs as featureBreadcrumbs26to51
} from './registry-26-51.js'

export { featureGroups, featureList, featureMeta }

/** 1-25 与 26-51 合并后的组件映射 */
export const featureViews = {
  ...featureViews01to25,
  ...featureViews26to51
}

/** 1-25 与 26-51 合并后的面包屑映射 */
export const featureBreadcrumbs = {
  ...featureBreadcrumbs01to25,
  ...featureBreadcrumbs26to51
}

export function findFeature(no) {
  return featureList.find((item) => item.no === Number(no))
}

export function isFeatureImplemented(no) {
  return Object.prototype.hasOwnProperty.call(featureViews, Number(no))
}

export function loadFeatureView(no) {
  return featureViews[Number(no)] || null
}

export function getFeatureBreadcrumb(no) {
  const feature = findFeature(no)
  return featureBreadcrumbs[Number(no)] || (feature ? ['新开发功能', feature.title] : ['功能未实现'])
}
