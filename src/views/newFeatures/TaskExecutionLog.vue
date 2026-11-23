<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
const draft = reactive({ start:'2026-03-12', end:'2026-03-12', result:'', scope:'省公司', sql:'' })
const applied = ref({...draft})
const page = ref(1)
const jump = ref('')
const sqlVisible = ref(false)
const current = ref(null)
const operators = ['范相全','范相全','范相全','陈鑫','章立萍','谢燕','邹小花','朱斯华','陈金玲','熊文鹏']
const names = ['2025新春CN叠加态发展明细2026新春季度明细','吉-战新产品发展明细-四季度','2026年首季度CHN叠加态明细表首季度定时取数','2026年新春开门红劳动竞赛通报_工号汇总20260105114313陈','2026年七大收入攻坚20260312230136章立萍','放号-有效新增明细','【萍乡】2026年1季度重点业务统计（渠道汇总）202601231','吉-当日实时AD计划明细20260122193522朱斯华','【萍乡】异网拉新办理明细_2026年20260211114048陈金玲','17-01当前存量用户表-797-2']
const times = ['23:52:11','23:46:46','23:31:41','23:31:26','23:02:28','23:01:30','23:01:29','23:01:27','23:01:26','22:57:47']
const counts = [96881,110256,369295,187,5331,22728,461,5,4194,3151611]
const durations = [47,21,21,6,5,9,6,6,6,131]
const seed = names.map((name,i) => ({ id:i+1, operator:operators[i], name, time:'2026-03-12 '+times[i], result:'成功', count:counts[i], note:'执行查询导入用时：'+durations[i]+'秒。', sql:'SELECT * FROM mock_task_'+(i+1)+';' }))
const matched = computed(() => seed.filter(row => (!applied.value.start || row.time.slice(0,10)>=applied.value.start) && (!applied.value.end || row.time.slice(0,10)<=applied.value.end) && (!applied.value.result || row.result===applied.value.result) && (!applied.value.scope || applied.value.scope==='省公司') && (!applied.value.sql || row.sql.toLowerCase().includes(applied.value.sql.toLowerCase()))))
const isDefault = computed(() => applied.value.start==='2026-03-12' && applied.value.end==='2026-03-12' && !applied.value.result && applied.value.scope==='省公司' && !applied.value.sql)
const total = computed(() => isDefault.value ? 2836 : matched.value.length)
const pages = computed(() => Math.max(1,Math.ceil(total.value/10)))
const rows = computed(() => page.value===1 ? matched.value : [])
function search() { if(draft.start && draft.end && draft.start>draft.end) return ElMessage.warning('查询开始日期不能晚于结束日期');applied.value={...draft};page.value=1 }
function go(value) { const next=Number(value);if(!Number.isInteger(next)||next<1||next>pages.value)return ElMessage.warning('请输入有效页码');page.value=next }
function view(row) { current.value=row;sqlVisible.value=true }
function download() { const header=['操作人','任务名称','操作时间','执行结果','数据条数','备注'];const data=rows.value.map(row=>[row.operator,row.name,row.time,row.result,row.count+'条',row.note]);const csv='\uFEFF'+[header,...data].map(row=>row.map(cell=>'"'+String(cell).replaceAll('"','""')+'"').join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='取数日志.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000) }
</script>
<template>
<div class="nf-feature-3">
<form class="nf-log-filters" @submit.prevent="search">
<label class="field"><span>查询开始日期</span><el-date-picker v-model="draft.start" type="date" value-format="YYYY-MM-DD"/></label>
<label class="field"><span>查询结束日期</span><el-date-picker v-model="draft.end" type="date" value-format="YYYY-MM-DD"/></label>
<label class="field"><span>执行结果</span><el-select v-model="draft.result" placeholder="全部"><el-option label="全部" value=""/><el-option label="成功" value="成功"/><el-option label="失败" value="失败"/></el-select></label>
<label class="field"><span>监控范围</span><el-input v-model="draft.scope"/></label>
<label class="field"><span>操作SQL</span><el-input v-model="draft.sql" placeholder="请输入操作SQL..."/></label>
<button class="search-btn" type="submit" aria-label="查询"><span>查询</span><span class="search-icon">⌕</span></button>
</form>
<section class="nf-log-card"><header><span>取数日志查看</span><button @click="download">下载</button></header><div class="nf-log-scroll"><table><thead><tr><th v-for="label in ['操作人','任务名称','操作时间','执行结果','数据条数','备注','查看SQL']" :key="label">{{label}}</th></tr></thead><tbody><tr v-for="row in rows" :key="row.id"><td>{{row.operator}}</td><td>{{row.name}}</td><td>{{row.time}}</td><td>{{row.result}}</td><td>{{row.count}}条</td><td>{{row.note}}</td><td><button @click="view(row)">查看sql</button></td></tr><tr v-if="!rows.length"><td colspan="7" class="nf-log-empty">{{ page>1 ? '暂无数据' : '暂无数据' }}</td></tr></tbody></table></div><footer><span>共 {{total}} 条记录,{{pages}}页</span><nav><button :disabled="page<=1" @click="go(page-1)">上一页</button><button v-for="n in [1,2,3,4,5,6].filter(n=>n<=pages)" :key="n" :class="{active:page===n}" @click="go(n)">{{n}}</button><template v-if="pages>6"><span>…</span><button :class="{active:page===pages}" @click="go(pages)">{{pages}}</button></template><button :disabled="page>=pages" @click="go(page+1)">下一页</button><label>至第 <input v-model="jump" aria-label="跳转页码"/> 页</label><button @click="go(jump)">确定</button></nav></footer></section>
<el-dialog v-model="sqlVisible" title="查看SQL" width="700px"><p>{{current?.name}}</p><pre>{{current?.sql}}</pre><template #footer><el-button @click="sqlVisible=false">关闭</el-button></template></el-dialog>
</div>
</template>
<style scoped>
.nf-feature-3 { color:#7c8794; font-size:12px; }
:global(.app-content:has(.nf-feature-3)) { padding:23px 16px 40px 31px; }
.nf-log-filters { display:grid;grid-template-columns:repeat(4,307px);column-gap:73px;row-gap:10px;position:relative;margin-bottom:29px; }
.nf-log-filters .field { gap:13px; }.nf-log-filters :deep(.el-date-editor.el-input) { width:100%; }.nf-log-filters :deep(.el-input__wrapper),.nf-log-filters :deep(.el-select__wrapper){height:36px;min-height:36px}
.nf-log-filters .search-btn { position:absolute;right:22px;bottom:0; }
.nf-log-card { background:white;border-radius:4px; }.nf-log-card>header { height:58px;display:flex;align-items:center;justify-content:space-between;padding:0 34px 0 20px; }.nf-log-card>header button { background:#167fc7;color:white;border:0;border-radius:20px;height:36px;width:80px;cursor:pointer; }
.nf-log-scroll { overflow:auto; }table { width:100%;min-width:1120px;table-layout:fixed;border-collapse:collapse; }th { height:50px;font-weight:400;background:#f8fafc;color:#555; }td { height:37px;text-align:center;border:1px solid #eee;padding:0 6px;line-height:17px;word-break:normal;overflow-wrap:break-word; }td:first-child{border-left:0}tbody tr:hover{background:#e9ecf3}td button {border:0;background:none;color:#1674a4;cursor:pointer;font-size:12px}td.nf-log-empty{height:200px}
footer {height:40px;display:flex;align-items:center;justify-content:space-between;padding:0 8px}nav{display:flex;align-items:center;gap:8px}nav button{border:1px solid #eee;background:white;color:#909399;min-width:26px;height:26px;cursor:pointer}nav button.active{background:#528bfa;color:white}nav button:disabled{opacity:.5;cursor:default}nav input{width:26px;border:1px solid #eee;height:26px}
@media(max-width:1700px){.nf-log-filters{grid-template-columns:repeat(4,minmax(0,1fr));column-gap:40px}}@media(max-width:1000px){.nf-log-filters{grid-template-columns:repeat(2,minmax(0,1fr));padding-bottom:42px}footer{height:auto;min-height:40px;flex-wrap:wrap}nav{flex-wrap:wrap}}
.nf-log-filters .search-btn { transform:translateY(-6px); }
.nf-log-filters :deep(.el-input__prefix) { order:2; margin-left:8px; margin-right:0; }
</style>
