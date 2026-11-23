import { reactive } from 'vue'

export const noticeTaskRows = [
  ['终端销量监控日报表.csv', '文件生成失败', 'admin管理员', '2025-11-19 15:11:24', '2025-11-19 15:11:24', '2025-11-19 17:35:27', '文件下载', '-'],
  ['吉市项目大数据分析表.xlsx', '下载完成', 'admin管理员', '2025-11-19 11:31:01', '2025-11-19 11:30:57', '2025-11-19 14:21:35', '文件下载', '185'],
  ['区域业绩汇总表.csv', '文件生成失败', 'admin管理员', '2025-07-16 09:40:32', '2025-07-16 09:40:31', '2025-07-16 09:40:36', '文件下载', '-'],
  ['渠道用户明细.xlsx', '下载完成', 'admin管理员', '2025-07-10 10:11:43', '2025-07-10 10:11:41', '2025-07-10 10:11:48', '文件下载', '32'],
  ['月度经营分析表.xlsx', '下载完成', 'admin管理员', '2025-07-08 16:48:03', '2025-07-08 16:48:02', '2025-07-08 16:48:11', '文件下载', '28']
].map(([name, state, operator, operateTime, startTime, endTime, outputType, seconds], index) => ({
  id: 'FILE13' + (index + 1),
  name,
  state,
  operator,
  operateTime,
  startTime,
  endTime,
  outputType,
  seconds
}))

export const abnormalFileRows = [
  ['202511191763538284164', '文件生成失败', 'admin管理员', '2025-11-19 15:11:24', '2025-11-19 15:11:24', '2025-11-19 17:35:27', '-'],
  ['测试0数据集202507211869', '下载超时', 'admin管理员', '2025-11-19 11:31:01', '2025-11-19 11:30:57', '2025-11-19 14:21:35', '185'],
  ['测试0数据集202507031060', '下载失败', 'admin管理员', '2025-07-16 09:40:32', '2025-07-16 09:40:31', '2025-07-16 09:40:36', '-'],
  ['测试0数据集202507091846', '下载完成', 'admin管理员', '2025-07-10 10:11:43', '2025-07-10 10:11:41', '2025-07-10 10:11:48', '32'],
  ['测试0数据集202507031041', '下载完成', 'admin管理员', '2025-07-08 16:48:03', '2025-07-08 16:48:02', '2025-07-08 16:48:11', '28']
].map(([name, state, operator, operateTime, startTime, endTime, seconds], index) => ({
  id: 'FILE14' + (index + 1),
  name,
  state,
  operator,
  operateTime,
  startTime,
  endTime,
  outputType: '文件下载',
  seconds
}))

export const noticeRows = reactive([
  { code: 'DOC20261026001', name: '终端质量监控日报表.csv', permission: '无下载权限', previewTime: '2026-10-26 09:30:12', userCode: 'U20260018', userName: '王玉洁' },
  { code: 'DOC20261026002', name: '吉市场口大数据分析表.xlsx', permission: '允许下载', previewTime: '2026-10-26 09:32:08', userCode: 'U20260018', userName: '王玉洁' }
])

export const dispatchTasks = reactive([
  { id: 'DL-20260920-001', file: '202511191763538284164', type: '文件生成失败', priority: '高', dispatcher: 'admin管理员', handler: '张伟', dispatchTime: '2026-09-20 16:45:03', dueTime: '2026-09-20 18:00:00', state: '待处理' },
  { id: 'DL-20260920-002', file: '测试众数模型202507211859', type: '下载超时', priority: '高', dispatcher: 'admin管理员', handler: '李娜', dispatchTime: '2026-09-20 16:30:12', dueTime: '2026-09-20 18:30:00', state: '处理中' },
  { id: 'DL-20260920-003', file: '测试众数模型202507031050', type: '下载失败', priority: '中', dispatcher: 'admin管理员', handler: '王强', dispatchTime: '2026-09-20 15:50:08', dueTime: '2026-09-20 19:00:00', state: '已完成' },
  { id: 'DL-20260919-012', file: '用户明细下载20250919', type: '下载超时', priority: '中', dispatcher: 'admin管理员', handler: '张伟', dispatchTime: '2026-09-19 14:22:36', dueTime: '2026-09-19 17:00:00', state: '已完成' },
  { id: 'DL-20260919-011', file: '稀疏数据下载20250919', type: '文件生成失败', priority: '低', dispatcher: 'admin管理员', handler: '李娜', dispatchTime: '2026-09-19 11:10:25', dueTime: '2026-09-19 16:00:00', state: '已关闭' }
])

export const dispatchResults = reactive([
  { dispatchTime: '2026-10-26 16:00:00', state: '已派发（待处理）', dispatcher: 'admin管理员', reason: '存储空间不足，文件生成失败', description: '派发至张伟，期望18:00前完成，处理时效120分钟' }
])
