const instantTasks = [
  {
    id: 'TASK9435',
    taskName: '9435',
    runState: '失败',
    creator: '吕艳景',
    notifyState: '1',
    submitTime: '2026-03-13 11:07:53',
    queryStartTime: '2026-03-13 11:08:35',
    queryEndTime: '2026-03-13 11:10:01',
    executeTime: '1分26秒',
    occupySize: '0',
    failReason: '文件出库异常，请检查sql数据出库耗时：33秒,文件装载时间需要(0.0)秒',
    purpose: '业务分析'
  },
  {
    id: 'TASK20260313002',
    taskName: '取数_集客部_舒宇嵩_客户经理产品数据统计_明细2026031',
    runState: '失败',
    creator: '舒宇嵩',
    notifyState: '1',
    submitTime: '2026-03-13 09:27:51',
    queryStartTime: '2026-03-13 09:28:34',
    queryEndTime: '2026-03-13 09:37:51',
    executeTime: '9分17秒',
    occupySize: '0',
    failReason: '存储空间不足：剩余1269.76M，本次任务需要4520.0M，请删除不要的任务，如果无效请联系平台管理员处理。',
    purpose: '报表生成'
  },
  {
    id: 'TASK20260312003',
    taskName: '赣州集客-木本型产品明细表（2026年首季度，偶数点',
    runState: '失败',
    creator: '杨明辉',
    notifyState: '1',
    submitTime: '2026-03-12 10:59:23',
    queryStartTime: '2026-03-12 11:00:01',
    queryEndTime: '2026-03-12 11:03:32',
    executeTime: '3分31秒',
    occupySize: '0',
    failReason: '文件出库异常，请检查sql数据出库耗时：201秒,文件装载时间需要(0.0)秒',
    purpose: '数据核查'
  },
  {
    id: 'TASK20260311004',
    taskName: '省-用户服务标签月表20260311150738傅碧莲',
    runState: '失败',
    creator: '傅碧莲',
    notifyState: '0',
    submitTime: '2026-03-11 15:08:49',
    queryStartTime: '2026-03-11 15:10:42',
    queryEndTime: '2026-03-11 15:37:05',
    executeTime: '26分23秒',
    occupySize: '0',
    failReason: '文件出库异常，请检查sql数据出库耗时：1256秒,文件装载时间需要(0.0)秒',
    purpose: '业务分析'
  },
  {
    id: 'TASK20260310005',
    taskName: '取数_市场部_曾凡荣_关于新入网园区流量占比情况统',
    runState: '失败',
    creator: '曾凡荣',
    notifyState: '1',
    submitTime: '2026-03-10 16:29:05',
    queryStartTime: '2026-03-10 16:29:37',
    queryEndTime: '2026-03-10 16:32:14',
    executeTime: '2分37秒',
    occupySize: '0',
    failReason: '用户自行终止',
    purpose: '数据核查'
  },
  {
    id: 'TASK20260310006',
    taskName: '吉-2026年全量资费扩容目标20260310145738曾欢',
    runState: '失败',
    creator: '曾欢',
    notifyState: '1',
    submitTime: '2026-03-10 14:58:22',
    queryStartTime: '2026-03-13 08:29:44',
    queryEndTime: '2026-03-13 08:30:05',
    executeTime: '21秒',
    occupySize: '0',
    failReason: '创建查询任务的数据表时出现错误！null,文件装载时间需要(0.0)秒',
    purpose: '报表生成'
  },
  {
    id: 'TASK20260310007',
    taskName: '取数_集客部_曾昭鑫_关于全量V网用户的取数需求_0310',
    runState: '失败',
    creator: '黄熠',
    notifyState: '1',
    submitTime: '2026-03-10 09:31:45',
    queryStartTime: '2026-03-10 09:35:30',
    queryEndTime: '2026-03-10 09:40:50',
    executeTime: '5分20秒',
    occupySize: '0',
    failReason: '存储空间不足：剩余2048.0M，本次任务需要2402.08M，请删除不要的任务，如果无效请联系平台管理员处理。',
    purpose: '业务分析'
  },
  {
    id: 'TASK20260309008',
    taskName: 'H叠加态到达用户明细',
    runState: '失败',
    creator: '黄珍',
    notifyState: '1',
    submitTime: '2026-03-09 20:05:47',
    queryStartTime: '2026-03-09 20:07:56',
    queryEndTime: '2026-03-09 20:08:05',
    executeTime: '0秒',
    occupySize: '0',
    failReason: '创建查询任务的数据表时出现错误！null,文件装载时间需要(0.0)秒',
    purpose: '数据核查'
  }
]


export function createTaskStore(seed = instantTasks) {
  let tasks = seed.map(item => ({ ...item }))
  return {
    query(filters = {}, page = 1, pageSize = 10) {
      const matches = tasks.filter(item =>
        (!filters.taskName || item.taskName.includes(filters.taskName.trim())) &&
        (!filters.creator || item.creator.includes(filters.creator.trim())) &&
        (!filters.submitDate || item.submitTime.startsWith(filters.submitDate)) &&
        (!filters.runState || item.runState === filters.runState) &&
        (!filters.purpose || item.purpose === filters.purpose))
      return { total: matches.length, list: matches.slice((page - 1) * pageSize, page * pageSize) }
    },
    remove(ids) {
      const before = tasks.length
      tasks = tasks.filter(item => !ids.includes(item.id))
      return before - tasks.length
    },
    update(id, changes) { tasks = tasks.map(item => item.id === id ? { ...item, ...changes } : item) },
    selected(ids) { return tasks.filter(item => ids.includes(item.id)) }
  }
}

export function toCsv(items) {
  const keys = ['taskName', 'runState', 'creator', 'notifyState', 'submitTime', 'queryStartTime', 'queryEndTime', 'executeTime', 'occupySize', 'failReason']
  const header = ['任务名称', '运行状态', '创建者', '通知状态', '提交时间', '查询开始时间', '查询结束时间', '执行时间', '占用空间(M)', '失败原因']
  const values = [header, ...items.map(item => keys.map(key => item[key] ?? ''))]
  return '\uFEFF' + values.map(row => row.map(value => '"' + String(value).replaceAll('"', '""') + '"').join(',')).join('\r\n')
}
