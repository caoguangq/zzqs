<script setup>
import { useRoute } from 'vue-router'
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { scheduledTasks } from '../../data/scheduledTasks'
import ScheduledTaskForm from './ScheduledTaskForm.vue'
const route = useRoute()
const filters = reactive({ name:'',cycle:'全部',creator:route.query.creator || '',state:'全部',purpose:'全部',valid:'全部' })
const applied = ref({...filters})
const selected = ref([])
const editing = ref(null)
const details = ref(null)
const prompt = ref(false)
const pending = ref(null)
const rows = computed(()=>scheduledTasks.filter(r=>Object.entries(applied.value).every(([k,v])=>!v || v==='全部' || (['name','creator'].includes(k)?String(r[k]||'').includes(v):r[k]===v))))
const all = computed({get:()=>rows.value.length>0&&selected.value.length===rows.value.length,set:v=>selected.value=v?rows.value.map(r=>r.id):[]})
function query() { applied.value={...filters}; selected.value=[] }
function edit(row) { editing.value={...row} }
function saved(form) {
  const row = scheduledTasks.find(r=>r.id===editing.value.id)
  const changed = form.start !== (editing.value.start || '2026-03-13') || Number(form.hour) !== Number(editing.value.hour ?? 8) || Number(form.minute) !== Number(editing.value.minute ?? 0)
  Object.assign(row,form)
  if(changed) row.next=form.start+' '+String(form.hour).padStart(2,'0')+':'+String(form.minute).padStart(2,'0')+':00'
  pending.value=row; prompt.value=true
}
function rerun(yes) {
  if (yes) Object.assign(pending.value,{state:'等待',last:'--',success:0,failed:0,space:'0'})
  prompt.value=false; editing.value=null; pending.value=null
}
async function remove(ids) {
  if (!ids.length) return ElMessage.warning('请先选择任务')
  try {await ElMessageBox.confirm('确定删除所选任务吗？','询问',{confirmButtonText:'确定',cancelButtonText:'取消'})} catch {return}
  for(let i=scheduledTasks.length-1;i>=0;i--) if(ids.includes(scheduledTasks[i].id)) scheduledTasks.splice(i,1)
  selected.value=[]; ElMessage.success('删除成功')
}
function download(target) {
  if (!target.length) return ElMessage.warning('请先选择任务')
  const data = [['任务名称','调度周期','创建人','最近运行时间','最近运行状态','下次调度时间','任务终止日期','是否有效','占用空间(M)'],...target.map(r=>[r.name,r.cycle,r.creator,r.last,r.state,r.next,r.end,r.valid,r.space])]
  const csv='\ufeff'+data.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n')
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='定时取数任务.csv';a.click();URL.revokeObjectURL(url)
}
function unavailable(text) {ElMessage.info(text+'暂不可用')}
</script>
<template>
<div class="nf-feature-8">
<form class="nf-scheduled-filters" @submit.prevent="query">
<label>任务名称<input v-model="filters.name" aria-label="任务名称" placeholder="请输入任务名称..."/></label>
<label>调度周期<select v-model="filters.cycle" aria-label="调度周期"><option>全部</option><option>每日调度</option><option>只调度一次</option><option>每周调度</option><option>每月调度</option><option>最新数据日期调度</option></select></label>
<label>创建人<input v-model="filters.creator" aria-label="创建人" placeholder="请输入创建人..."/></label>
<label>最近运行状态<select v-model="filters.state" aria-label="最近运行状态"><option>全部</option><option>成功</option><option>失败</option><option>等待</option><option>正在运行</option><option>--</option></select></label>
<label>取数用途<select v-model="filters.purpose" aria-label="取数用途"><option>全部</option><option>运维</option><option>业务分析</option><option>数据核查</option></select></label>
<label>是否有效<select v-model="filters.valid" aria-label="是否有效"><option>全部</option><option>有效</option><option>无效</option></select></label>
<button class="nf-query" type="submit" aria-label="查询">查询 <span>⌕</span></button>
</form>
<section class="nf-schedule-heading"><div><h2>定时取数浏览</h2><aside><button @click="remove(selected)">批量删除</button><button @click="download(rows.filter(r=>selected.includes(r.id)))">批量下载</button><button @click="unavailable('推送4A文件夹')">推送4A文件夹</button><button class="nf-share" @click="unavailable('共享数据查看')">共享数据查看</button></aside></div><p>根据4A脱敏平台对要脱敏下载到本地的文件大小要求（csv最大支持300兆，Excel最大支持20兆），建议下载文件类型选择CSV，且文件大小不超过300M(20个字段约40万行记录，具体需要看各列数据的大小)，如果文件大小超出限制，将无法正常下载，建议拆分为多个取数任务</p></section>
<section class="nf-schedule-table"><div class="nf-table-scroll"><table><colgroup><col style="width:1.6%"/><col style="width:12.7%"/><col style="width:4.75%"/><col style="width:4.75%"/><col style="width:9.15%"/><col style="width:6.5%"/><col style="width:9.57%"/><col style="width:5.7%"/><col style="width:4.8%"/><col style="width:6.6%"/><col style="width:6.65%"/><col style="width:12.9%"/><col style="width:14.33%"/></colgroup>
<thead><tr><th><input type="checkbox" v-model="all" :indeterminate="selected.length>0&&!all" aria-label="全选定时任务"/></th><th>任务名称</th><th>调度周期</th><th>创建人</th><th>最近运行时间</th><th>最近运行状态</th><th>下次调度时间</th><th>任务终止日期</th><th>是否有效</th><th>已运行次数</th><th>占用空间(M)</th><th>失败原因</th><th>操作</th></tr></thead>
<tbody><tr v-for="row in rows" :key="row.id"><td><input v-model="selected" :value="row.id" type="checkbox" :aria-label="'选择'+row.name"/></td><td class="nf-task-name">{{row.name}}</td><td>{{row.cycle}}</td><td>{{row.creator}}</td><td>{{row.last}}</td><td :class="{'nf-red':row.state==='失败'}">{{row.state}}</td><td>{{row.next}}</td><td>{{row.end}}</td><td>{{row.valid}}</td><td>成功 {{row.success}} <span class="nf-red">失败 {{row.failed}}</span></td><td>{{row.space}}</td><td>{{row.reason}}</td><td class="nf-actions"><button @click="details=row">查看</button> / <button @click="remove([row.id])">删除</button> / <template v-if="row.valid==='有效'&&row.state!=='等待'&&row.state!=='正在运行'"><button @click="edit(row)">修改</button> / </template><template v-if="row.state==='成功'"><button @click="download([row])">下载</button> / </template><button v-if="row.state!=='--'" @click="unavailable(row.state==='等待'?'提示':'更多操作')">{{row.state==='等待'?'提示':'……'}}</button><template v-if="row.state!=='成功'">  <button @click="details=row">生命周期</button></template></td></tr><tr v-if="!rows.length"><td colspan="13">暂无数据</td></tr></tbody></table></div>
<footer>共 {{rows.length}} 条记录,1页 <nav><button disabled>上一页</button><button class="nf-current">1</button><button disabled>下一页</button></nav></footer></section>
<el-dialog :model-value="!!details" title="定时任务详情" width="650px" @close="details=null"><template v-if="details"><p>任务名称：{{details.name}}</p><p>调度周期：{{details.cycle}}</p><p>最近运行状态：{{details.state}}</p><p>任务终止日期：{{details.end}}</p><p>占用空间(M)：{{details.space}}</p></template></el-dialog>
<ScheduledTaskForm v-if="editing" :key="editing.id" edit-mode :initial-task="editing" @saved="saved" @cancel="editing=null"/>
<div v-if="prompt" class="nf-rerun-mask"><section role="dialog" aria-label="询问" class="nf-rerun"><header>询问<button aria-label="关闭询问" @click="rerun(false)">×</button></header><div><b>✓</b><p>任务保存成功，检测到该定时任务已经执行过，是否基于最近一次的执行记录重新立即执行?</p></div><footer><button @click="rerun(false)">否</button><button class="nf-yes" @click="rerun(true)">是</button></footer></section></div>
</div>
</template>
<style scoped>
.nf-feature-8{margin:-33px -43px -40px -31px;padding:24px 39px 40px 31px;color:#8b949e;font-size:12px}.nf-scheduled-filters{display:grid;grid-template-columns:repeat(4,minmax(0,306px));column-gap:44px;row-gap:12px;grid-template-rows:63px 63px;position:relative;min-height:174px}.nf-scheduled-filters label{display:flex;flex-direction:column;gap:12px;color:#606266}.nf-scheduled-filters input,.nf-scheduled-filters select{width:100%;height:36px;border:1px solid #f0f1f3;border-radius:20px;background:white;color:#8b949e;padding:0 12px;font:inherit}.nf-scheduled-filters label:nth-child(3) input:not(:placeholder-shown){background:#e8effc;color:#444}.nf-query{position:absolute;right:12px;bottom:36px;background:#1681c7;border:0;border-radius:22px;color:white;width:100px;height:36px;cursor:pointer}.nf-query span{margin-left:14px;font-size:20px}.nf-schedule-heading{background:white;border:1px solid #eee;height:130px;padding:14px 20px;margin-bottom:46px}.nf-schedule-heading>div{display:flex;align-items:center;justify-content:space-between}.nf-schedule-heading h2{font-size:14px;font-weight:400;color:#606266;margin:5px 0}.nf-schedule-heading aside{display:flex;gap:10px}.nf-schedule-heading button{height:36px;padding:0 14px;border:1px solid #eee;border-radius:20px;background:white;color:#8b949e;font:inherit;cursor:pointer}.nf-schedule-heading .nf-share{background:#1681c7;color:white}.nf-schedule-heading p{line-height:24px;color:#d44d42;margin:0;max-width:1250px}.nf-schedule-table{background:white}.nf-table-scroll{overflow:auto}table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:12px}th{height:50px;background:#fafbfe;color:#606266;font-weight:400;border-bottom:1px solid #eee}td{border:1px solid #eee;height:38px;line-height:24px;padding:0 2px;overflow-wrap:break-word;white-space:normal}td.nf-task-name{text-align:left}tbody tr:hover{background:#f0f4fa}.nf-red{color:red}.nf-actions{text-align:left;padding:0 7px}.nf-actions button{display:inline-block;white-space:nowrap;color:#1681c7;background:none;border:0;padding:0;font:inherit;cursor:pointer}.nf-schedule-table>footer{height:40px;display:flex;align-items:center;padding:8px;justify-content:space-between}nav{display:flex;gap:8px}nav button{border:1px solid #eee;border-radius:16px;background:white;color:#bbb;padding:4px 10px}.nf-current{background:#409eff;color:white;border-radius:0}.nf-rerun-mask{position:fixed;inset:0;z-index:80;background:rgba(0,0,0,.6)}.nf-rerun{position:absolute;top:28.3%;left:50%;transform:translateX(-50%);width:414px;height:228px;border-radius:9px;background:white;box-shadow:0 0 24px #222;color:#333}.nf-rerun header{height:62px;border-bottom:1px solid #eee;text-align:center;padding-top:18px;font-size:18px;font-weight:bold;position:relative}.nf-rerun header button{position:absolute;right:24px;top:16px;color:#ccc;border:0;background:none;font-size:28px}.nf-rerun>div{display:flex;gap:32px;align-items:center;padding:16px 28px}.nf-rerun b{font-size:42px;border-radius:100%;background:#1ac994;color:white;width:48px;height:48px;line-height:48px;text-align:center;flex-shrink:0;box-shadow:0 2px 5px #bbb}.nf-rerun p{font-size:13px;line-height:24px;margin:6px 0}.nf-rerun footer{position:absolute;bottom:8px;right:0;display:flex;justify-content:flex-end;gap:16px;padding-right:18px}.nf-rerun footer button{width:80px;height:36px;background:white;border:0;border-radius:20px;color:#444;cursor:pointer}.nf-rerun footer .nf-yes{background:#1681c7;color:white;box-shadow:0 0 6px #888}@media(max-width:1500px){.nf-scheduled-filters{column-gap:30px}.nf-schedule-heading{height:auto;min-height:130px}.nf-table-scroll table{min-width:1400px}}@media(max-width:800px){.nf-scheduled-filters{grid-template-columns:repeat(2,minmax(0,1fr));padding-bottom:70px}.nf-query{bottom:12px}.nf-schedule-heading>div{flex-wrap:wrap}.nf-schedule-heading aside{flex-wrap:wrap}.nf-rerun{width:94%}}
</style>
