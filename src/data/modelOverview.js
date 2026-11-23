import { reactive } from 'vue'

// 编号18/19/20截图中的模型列表（数据模型管理页面状态）
export const overviewRows = reactive([
  { id: 'MO01', name: '取数_市场部_张璐璐_卓越钻卡客户统计2', updated: '2026-03-15 00:00:00', publisher: '钟同佩', owner: '张璐璐', city: '南昌', heat: 98, status: '已发布' },
  { id: 'MO02', name: '取数_市场部_张璐璐_卓越钻卡客户统计1', updated: '2026-03-15 00:00:00', publisher: '钟同佩', owner: '张璐璐', city: '南昌', heat: 96, status: '已发布' },
  { id: 'MO03', name: '流量增幅来源监控月报-phb-测试', updated: '2026-03-15 00:00:00', publisher: '彭辉邦', owner: '侯莫凡', city: '省公司', heat: 91, status: '已发布' },
  { id: 'MO04', name: '移码惠运营日报明细表-phb-测试', updated: '2026-03-15 00:00:00', publisher: '彭辉邦', owner: '何英健', city: '省公司', heat: 88, status: '已发布' },
  { id: 'MO05', name: '取数_市场经营部_马骏_超高流量用户分析工单1', updated: '2026-03-14 00:00:00', publisher: '方承远', owner: '马骏', city: '赣州', heat: 86, status: '已发布' },
  { id: 'MO06', name: '取数_市场经营部_马骏_需求超高流量用户分析工单', updated: '2026-03-14 00:00:00', publisher: '方承远', owner: '马骏', city: '赣州', heat: 84, status: '已发布' },
  { id: 'MO07', name: '取数_市场部_刘胂_沿街商铺数据提取需求', updated: '2026-03-14 00:00:00', publisher: '钟同佩', owner: '刘胂', city: '九江', heat: 82, status: '已发布' },
  { id: 'MO08', name: '取数_市场经营部_黄盛_1-2月储备政策办理跟踪取数', updated: '2026-03-14 00:00:00', publisher: '刘康', owner: '黄盛', city: '宜春', heat: 80, status: '已发布' },
  { id: 'MO09', name: '取数_市场部_黄静_收入分析（同比）', updated: '2026-03-14 00:00:00', publisher: '钟同佩', owner: '黄静', city: '上饶', heat: 78, status: '已发布' },
  { id: 'MO10', name: '取数_集客部_万玉倩_关于省战客400家集团IV网渗透率取数需求', updated: '2026-03-14 00:00:00', publisher: '刘康', owner: '万玉倩', city: '省公司', heat: 75, status: '已发布' },
  { id: 'MO11', name: '取数_市场部_侯莫凡_关于超套用户数取数的需求', updated: '2026-03-14 00:00:00', publisher: '钟同佩', owner: '侯莫凡', city: '抚州', heat: 72, status: '已发布' },
  { id: 'MO12', name: '沿街店铺报表-phb-测试', updated: '2026-03-14 00:00:00', publisher: '彭辉邦', owner: '刘胂', city: '九江', heat: 70, status: '已发布' },
  { id: 'MO13', name: '街长沿街店铺报表-phb-测试', updated: '2026-03-14 00:00:00', publisher: '彭辉邦', owner: '刘胂', city: '九江', heat: 68, status: '已发布' },
  { id: 'MO14', name: '取数_市场经营部_马骏_需求取流量活动信息的工作联系单', updated: '2026-03-14 00:00:00', publisher: '刘康', owner: '马骏', city: '吉安', heat: 66, status: '已发布' },
  { id: 'MO15', name: '运维twl', updated: '2026-03-14 00:00:00', publisher: '唐雯丽', owner: 'crm运维平台', city: '省公司', heat: 64, status: '已发布' },
  { id: 'MO16', name: '吉-2026年资费扩容23类客户', updated: '2026-03-14 00:00:00', publisher: '唐雯丽', owner: '赵鹏', city: '吉安', heat: 60, status: '已发布' },
  { id: 'MO17', name: '取数_产品运营中心_刘志_校园客户分析', updated: '2026-03-14 00:00:00', publisher: '钟同佩', owner: '刘志', city: '南昌', heat: 58, status: '已发布' },
  { id: 'MO18', name: '未捆绑目标校园客户--测试', updated: '2026-03-14 00:00:00', publisher: '彭辉邦', owner: '刘志', city: '萍乡', heat: 55, status: '已发布' },
  { id: 'MO19', name: '2025年3月至6月将到期未续约客户清单', updated: '2026-03-14 00:00:00', publisher: '刘康', owner: '黄静', city: '新余', heat: 52, status: '已发布' },
  { id: 'MO20', name: '校园客户未办理校园宽带用户清单', updated: '2026-03-14 00:00:00', publisher: '方承远', owner: '万玉倩', city: '景德镇', heat: 50, status: '已发布' }
])

export const pinnedModel = reactive({
  id: 'MO-PIN',
  name: '全球通2024年拍照',
  updated: '2026-03-16 00:00:00',
  publisher: '张福仓',
  owner: 'crm运维平台',
  city: '省公司',
  heat: 100,
  status: '已发布'
})
