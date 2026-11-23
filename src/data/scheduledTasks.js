import { reactive } from 'vue'
export const scheduledTasks = reactive([
  {id:'q1',name:'云信出账明细（按日）20260225173445何浩',cycle:'最新数据日期调度',creator:'何浩',last:'--',state:'--',next:'2026-02-27 12:00:00',end:'2029-02-01',valid:'有效',success:0,failed:0,space:'0',reason:'',purpose:'运维'},
  {id:'q2',name:'吉-BOSS系统办理45G手机明细20260313110515尹满珍',cycle:'每月调度',creator:'尹满珍',last:'--',state:'--',next:'2026-03-13 22:00:00',end:'2026-03-31',valid:'有效',success:0,failed:0,space:'0',reason:'',purpose:'运维'},
  {id:'q3',name:'2026年七大收入攻坚20260312190508章立萍',cycle:'每日调度',creator:'章立萍',last:'--',state:'--',next:'2026-03-13 17:00:00',end:'2026-03-31',valid:'有效',success:0,failed:0,space:'0',reason:'',purpose:'运维'},
  {id:'q4',name:'新入网尊享年卡办理明细20260126162849吴建增',cycle:'每日调度',creator:'吴建增',last:'--',state:'等待',next:'2026-03-14 16:35:00',end:'2026-12-31',valid:'有效',success:1,failed:0,space:'0.97',reason:'',purpose:'运维'},
  {id:'q5',name:'新春劳动竞赛宽带明细-定时16:35',cycle:'每日调度',creator:'郭红敏',last:'--',state:'等待',next:'2026-03-14 16:35:00',end:'2030-01-01',valid:'有效',success:1,failed:1,space:'0.55',reason:'',purpose:'运维'},
  {id:'q6',name:'H叠加态定时16:35',cycle:'每日调度',creator:'郭红敏',last:'--',state:'等待',next:'2026-03-14 16:35:00',end:'2030-08-31',valid:'有效',success:1,failed:0,space:'1.04',reason:'',purpose:'运维'},
  {id:'q7',name:'H叠加态产品上单明细-定时16:35',cycle:'每日调度',creator:'郭红敏',last:'--',state:'等待',next:'2026-03-14 16:35:00',end:'2030-08-31',valid:'有效',success:1,failed:0,space:'1.12',reason:'',purpose:'运维'},
  {id:'q8',name:'新和商务日报明细_new20251230173427刘恒媛',cycle:'每日调度',creator:'刘恒媛',last:'--',state:'正在运行',next:'2026-03-14 16:30:00',end:'2027-01-01',valid:'有效',success:1,failed:0,space:'1.29',reason:'',purpose:'运维'},
  {id:'s1',name:'未捆绑目标校园客户--测试20260313164844唐雯丽',cycle:'每日调度',creator:'唐雯丽',last:'2026-03-13 16:55:10',state:'成功',next:'2026-03-14 08:00:00',end:'2026-03-15',valid:'有效',success:1,failed:0,space:'34.76',reason:'',purpose:'运维'},
  {id:'s2',name:'取数_渠道中心_蔡芬_疑似违规外呼渠道业务办理清单2',cycle:'只调度一次',creator:'唐雯丽',last:'2026-01-20 00:58:28',state:'成功',next:'2026-01-20 00:54:00',end:'2026-01-20',valid:'无效',success:1,failed:0,space:'1.19',reason:'',purpose:'运维'},
  {id:'s3',name:'取数_市场部_侯克凡_工作会材料取数20260118005304唐雯丽',cycle:'只调度一次',creator:'唐雯丽',last:'2026-01-18 13:58:12',state:'成功',next:'2026-01-18 00:54:00',end:'2026-01-18',valid:'无效',success:1,failed:0,space:'0',reason:'',purpose:'运维'},
  {id:'s4',name:'模型测试表20251211213955唐雯丽',cycle:'每日调度',creator:'唐雯丽',last:'2025-12-11 23:44:39',state:'成功',next:'2025-12-12 21:00:00',end:'2025-12-12',valid:'无效',success:1,failed:0,space:'0.01',reason:'',purpose:'运维'}
])
export function addScheduledTask(form) {
  scheduledTasks.unshift({...form,id:'s'+Date.now(),creator:'唐雯丽',last:'--',state:'等待',next:form.start+' '+String(form.hour).padStart(2,'0')+':'+String(form.minute).padStart(2,'0')+':00',valid:'有效',success:0,failed:0,space:'0',reason:''})
}
