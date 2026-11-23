// 编号 22/25 素材中的模型来源与历史版本数据（仅前端静态数据）
export const logicalModels = [
  { id: 'M001', name: '用户信息模型', code: 'M001', mark: 'USER_INFO', type: '逻辑模型', tag: '用户', category: '基础模型', source: 'CRM生产库' },
  { id: 'M002', name: '数据分享模型', code: 'M002', mark: 'DATA_SHARE', type: '逻辑模型', tag: '共享', category: '共享模型', source: '数据共享平台' },
  { id: 'M003', name: '客户基础模型', code: 'M003', mark: 'CUSTOMER', type: '逻辑模型', tag: '客户', category: '基础模型', source: '客户中心' },
  { id: 'M004', name: '地区维度模型', code: 'M004', mark: 'REGION_DIM', type: '逻辑模型', tag: '地域', category: '维度模型', source: '统一基础库' },
  { id: 'M005', name: '业务受理模型', code: 'M005', mark: 'BIZ_ACCEPT', type: '逻辑模型', tag: '业务', category: '明细模型', source: 'BSS生产库' }
]

export const physicalModels = [
  { id: 'P001', name: '用户明细表', code: 'P001', mark: 'T_USER', type: '物理模型', tag: '用户', category: '明细模型', source: 'CRM生产库' },
  { id: 'P002', name: '共享资源表', code: 'P002', mark: 'T_SHARE', type: '物理模型', tag: '共享', category: '共享模型', source: '数据共享平台' },
  { id: 'P003', name: '客户资料表', code: 'P003', mark: 'T_CUSTOMER', type: '物理模型', tag: '客户', category: '基础模型', source: '客户中心' },
  { id: 'P004', name: '地区编码表', code: 'P004', mark: 'T_REGION', type: '物理模型', tag: '地域', category: '维度模型', source: '统一基础库' },
  { id: 'P005', name: '业务订单表', code: 'P005', mark: 'T_ORDER', type: '物理模型', tag: '业务', category: '明细模型', source: 'BSS生产库' }
]

export const modelSourceTypes = {
  逻辑模型: { rows: logicalModels, time: '2026-10-26 10:00:00' },
  物理模型: { rows: physicalModels, time: '2026-10-26 10:05:00' }
}

export const shareVersions = [
  { id: 'SHARE_V005', name: '数据分享模型V5.0', code: 'SHARE_V005', updated: '2026-09-20 10:25:18', operator: 'admin管理员' },
  { id: 'SHARE_V004', name: '数据分享模型V4.0', code: 'SHARE_V004', updated: '2026-08-20 15:16:42', operator: '1超级管理员' },
  { id: 'SHARE_V003', name: '数据分享模型V3.0', code: 'SHARE_V003', updated: '2026-07-22 09:48:30', operator: 'admin管理员' },
  { id: 'SHARE_V002', name: '数据分享模型V2.0', code: 'SHARE_V002', updated: '2026-06-16 14:05:27', operator: '1超级管理员' },
  { id: 'SHARE_V001', name: '数据分享模型V1.0', code: 'SHARE_V001', updated: '2026-05-12 11:32:09', operator: 'admin管理员' }
]

export const authVersions = [
  { id: 'AUTH_V005', name: '数据授权模型V5.0', code: 'AUTH_V005', updated: '2026-09-18 14:20:36', operator: 'admin管理员' },
  { id: 'AUTH_V004', name: '数据授权模型V4.0', code: 'AUTH_V004', updated: '2026-08-15 09:35:21', operator: '1超级管理员' },
  { id: 'AUTH_V003', name: '数据授权模型V3.0', code: 'AUTH_V003', updated: '2026-07-12 16:42:08', operator: 'admin管理员' },
  { id: 'AUTH_V002', name: '数据授权模型V2.0', code: 'AUTH_V002', updated: '2026-06-10 11:18:45', operator: '1超级管理员' },
  { id: 'AUTH_V001', name: '数据授权模型V1.0', code: 'AUTH_V001', updated: '2026-05-08 10:06:32', operator: 'admin管理员' }
]
