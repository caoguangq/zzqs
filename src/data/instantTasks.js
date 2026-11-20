
const definitions = [
 { name:'吉市场口大数据分析表', prefix:'JT2026031201', suffixes:['用户规模','渠道统计','区域汇总','月度明细','业务分类'], conditions:['统计日期=2026-03-12','渠道=全部','区域=全部','统计月份=2026-03','业务类型=全部'], dependencies:['用户明细已就绪','用户规模已完成','渠道统计已完成','等待区域汇总完成','业务字典待补齐'], descriptions:['用户规模统计','各渠道用户统计','区域数据汇总','月度业务明细','业务分类分析'], lastSource:'业务数据管理' },
 { name:'终端质量监控日报表', prefix:'JT2026031200', suffixes:['全省汇总','地市明细','品牌统计','型号分析','异常终端'], conditions:['统计日期=2026-03-12','地市=全部','品牌=全部','型号=全部','质量评分<60'], dependencies:['终端明细已就绪','全省汇总已完成','终端明细已就绪','等待品牌统计完成','校验数据待补齐'], descriptions:['全省终端质量汇总','各地市质量明细','按品牌统计质量','按型号分析质量','异常终端识别'], lastSource:'系统监控' }
]
export const taskNames = definitions.map(item => item.name)
export function queryTasks(name) {
 const group = definitions.find(item => item.name === name.trim())
 if (!group) return []
 return group.suffixes.map((suffix,i) => ({ id:group.prefix+(i+1), name:group.name+'-'+suffix, state:['已完成','已完成','执行中','待执行','执行失败'][i], progress:[100,100,65,0,40][i], condition:group.conditions[i], dependency:group.dependencies[i], source:['自助取数','自助取数','指标探索','调度任务',group.lastSource][i], urge:['未催办','未催办','已催办1次','已催办2次','已催办1次'][i], description:group.descriptions[i] }))
}
