<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Promotion, Download, Search } from '@element-plus/icons-vue'
import { queryTasks, taskNames } from '../data/instantTasks.js'
const filters = reactive({ name:taskNames[0], date:'', source:'', state:'', urge:'' })
const rows = ref(queryTasks(filters.name))
const selected = ref([])
const detail = ref(null)
const allSelected = computed(() => rows.value.length > 0 && rows.value.every(row => selected.value.includes(row.id)))
const summary = computed(() => ['全部任务','已完成','执行中','待执行','执行失败'].map((label,i) => ({ label,count:i===0 ? rows.value.length : rows.value.filter(row => row.state===label).length })))
function search() {
 rows.value = queryTasks(filters.name).filter(row => (!filters.date || filters.date==='2026-03-12') && (!filters.source || row.source===filters.source) && (!filters.state || row.state===filters.state) && (!filters.urge || (filters.urge==='未催办' ? row.urge==='未催办' : row.urge!=='未催办')))
 selected.value=[]
}
function toggleAll(event) { selected.value=event.target.checked ? rows.value.map(row=>row.id) : [] }
function urge(row) { ElMessage.info(row ? '任务「'+row.name+'」催办功能暂不可用' : selected.value.length ? '已选择 '+selected.value.length+' 个任务，催办功能暂不可用' : '请先勾选任务') }
function download(items) {
 const columns=['任务名称','结果标识','任务进度','任务条件','任务依赖','任务来源','催办情况','任务描述']
 const values=items.map(row=>[row.name,row.id,row.state+' '+row.progress+'%',row.condition,row.dependency,row.source,row.urge,row.description])
 const csv='\uFEFF'+[columns,...values].map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\r\n')
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}))
 const link=document.createElement('a'); link.href=url; link.download='即时任务详情.csv'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000)
}
</script>
<template>
<div class="task-query">
 <form class="task-filters" @submit.prevent="search">
  <label class="field"><span class="field-label">任务名称</span><el-input v-model="filters.name" list="task-names" clearable /><datalist id="task-names"><option v-for="name in taskNames" :key="name" :value="name" /></datalist></label>
  <label class="field"><span class="field-label">提交日期</span><el-date-picker v-model="filters.date" type="date" value-format="YYYY-MM-DD" placeholder="请输入提交日期..." /></label>
  <label class="field"><span class="field-label">任务来源</span><el-select v-model="filters.source" placeholder="全部"><el-option label="全部" value=""/><el-option v-for="name in ['自助取数','指标探索','调度任务','业务数据管理','系统监控']" :key="name" :label="name" :value="name"/></el-select></label>
  <label class="field"><span class="field-label">任务进度</span><el-select v-model="filters.state" placeholder="全部"><el-option label="全部" value=""/><el-option v-for="name in ['已完成','执行中','待执行','执行失败']" :key="name" :label="name" :value="name"/></el-select></label>
  <label class="field task-urge-filter"><span class="field-label">催办情况</span><el-select v-model="filters.urge" placeholder="全部"><el-option label="全部" value=""/><el-option label="未催办" value="未催办"/><el-option label="已催办" value="已催办"/></el-select></label>
  <button type="submit" class="search-btn task-search"><span>查询</span><span class="search-icon"><el-icon><Search/></el-icon></span></button>
 </form>
 <section class="task-card">
  <div class="task-heading"><div><h2>即时任务详情表</h2><p>根据任务结果标识关联任务进度、催办情况、描述及来源，汇总展示任务详情。</p></div><div class="task-actions"><button @click="search(); ElMessage.success('进度已刷新')"><el-icon><Refresh/></el-icon>刷新进度</button><button @click="urge()"><el-icon><Promotion/></el-icon>批量催办</button><button @click="download(selected.length ? rows.filter(row=>selected.includes(row.id)) : rows)"><el-icon><Download/></el-icon>导出详情</button></div></div>
  <div class="task-summary"><div v-for="item in summary" :key="item.label"><span>{{ item.label }}</span><strong>{{ item.count }}</strong></div></div>
  <div class="task-table-wrap"><table class="task-table"><colgroup><col style="width:3%"/><col style="width:15%"/><col style="width:10%"/><col style="width:12%"/><col style="width:12%"/><col style="width:11%"/><col style="width:8%"/><col style="width:9%"/><col style="width:11%"/><col style="width:9%"/></colgroup>
  <thead><tr><th><input type="checkbox" aria-label="全选任务" :checked="allSelected" :indeterminate="selected.length>0 && !allSelected" @change="toggleAll"/></th><th v-for="label in ['任务名称','结果标识','任务进度','任务条件','任务依赖','任务来源','催办情况','任务描述','操作']" :key="label">{{ label }}</th></tr></thead>
  <tbody><tr v-for="row in rows" :key="row.id"><td><input v-model="selected" type="checkbox" :value="row.id" :aria-label="'选择'+row.name"/></td><td>{{ row.name }}</td><td>{{ row.id }}</td><td><div class="task-progress" role="progressbar" :aria-label="row.name" :aria-valuenow="row.progress" aria-valuemin="0" aria-valuemax="100"><i :style="{width:row.progress+'%'}"/></div><span>{{ row.state }} {{ row.progress }}%</span></td><td>{{ row.condition }}</td><td>{{ row.dependency }}</td><td>{{ row.source }}</td><td>{{ row.urge }}</td><td>{{ row.description }}</td><td><button class="task-link" @click="detail=row">详情</button><span class="task-slash">/</span><button v-if="row.state==='已完成'" class="task-link" @click="download([row])">下载</button><button v-else class="task-link" @click="urge(row)">催办</button></td></tr><tr v-if="!rows.length"><td colspan="10" class="task-empty">暂无数据</td></tr></tbody></table></div>
  <div class="task-pager"><span>共 {{ rows.length }} 条</span><button disabled aria-label="上一页">‹</button><button class="active">1</button><button disabled aria-label="下一页">›</button></div>
 </section>
 <el-dialog :model-value="!!detail" title="任务详情" width="640px" @close="detail=null"><el-descriptions v-if="detail" :column="1" border><el-descriptions-item v-for="(label,key) in {name:'任务名称',id:'结果标识',state:'任务进度',condition:'任务条件',dependency:'任务依赖',source:'任务来源',urge:'催办情况',description:'任务描述'}" :key="key" :label="label">{{ detail[key] }}<template v-if="key==='state'"> {{ detail.progress }}%</template></el-descriptions-item></el-descriptions></el-dialog>
</div>
</template>
<style scoped>
.task-query{color:#51668e}
:global(.app-content:has(.task-query)){background:#f0f7fb;padding:33px 14px 20px 24px}
.task-query :deep(.el-select__placeholder.is-transparent){color:#8995a5}
.task-filters{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:52px;row-gap:20px;margin-bottom:30px;padding-right:210px;position:relative}
.task-filters .field{gap:10px}.task-filters :deep(.el-input__wrapper),.task-filters :deep(.el-select__wrapper){height:40px;min-height:40px;border-radius:22px;border:1px solid #e6edf5}.task-filters :deep(.el-input__inner),.task-filters :deep(.el-select__placeholder){font-size:14px}.task-filters :deep(.el-date-editor){width:100%}
.task-urge-filter{grid-column:1}.task-search{position:absolute;right:12px;bottom:8px;height:40px;width:112px;margin:0}
.task-card{background:#fff;border:1px solid #e6eef6;border-radius:4px;overflow:hidden}.task-heading{padding:15px 18px 0;display:flex;justify-content:space-between;gap:20px}.task-heading h2{color:#182e68;font-size:18px;margin:10px 0 12px}.task-heading p{margin:0;font-size:14px;color:#8299bf}
.task-actions{display:flex;gap:12px;align-items:flex-start}.task-actions button{display:flex;align-items:center;gap:10px;white-space:nowrap;height:44px;border:1px solid #e4edf7;border-radius:24px;padding:0 22px;background:white;color:#0084ff;cursor:pointer;font-size:14px}.task-actions .el-icon{font-size:20px}
.task-summary{display:grid;grid-template-columns:repeat(5,1fr);gap:24px;padding:16px 15px 14px}.task-summary>div{position:relative;background:#f4f9fd;text-align:center;padding:12px 0 8px;border-radius:4px}.task-summary>div:not(:last-child)::after{content:'';position:absolute;right:-12px;top:10px;bottom:10px;border-right:1px solid #e8eff7}.task-summary span{display:block;font-size:14px}.task-summary strong{display:block;font-size:28px;color:#0085ff;margin-top:3px;line-height:30px}
.task-table-wrap{overflow:auto}.task-table{width:100%;min-width:1250px;border-collapse:collapse;table-layout:fixed;font-size:14px}.task-table th,.task-table td{border:1px solid #e8eff6;padding:9px 16px;text-align:left;font-weight:normal;height:54px}.task-table th{height:44px;background:#f4f9fd;color:#354e7a}.task-table td:first-child,.task-table th:first-child{padding:0;text-align:center}.task-table input{width:16px;height:16px;accent-color:#0084ff;cursor:pointer}
.task-progress{background:#e6eaf0;height:12px;border-radius:8px;overflow:hidden;margin-bottom:5px}.task-progress i{display:block;height:100%;background:#087eff;border-radius:8px}.task-link{color:#0084ff;cursor:pointer;border:0;background:none;padding:0;font-size:14px}.task-slash{color:#0084ff;margin:0 7px}
.task-pager{display:flex;align-items:center;justify-content:flex-end;gap:10px;height:56px;padding:0 12px}.task-pager span{margin-right:8px}.task-pager button{width:32px;height:32px;background:white;border:1px solid #e6eef7;border-radius:4px;color:#b5c7e4;font-size:20px}.task-pager button.active{color:white;background:#087eff;border-color:#087eff;font-size:16px}.task-table .task-empty{height:160px;text-align:center}
@media(max-width:1500px){.task-filters{column-gap:30px;padding-right:150px}.task-table th,.task-table td{padding-left:10px;padding-right:10px}}
@media(max-width:1000px){.task-filters{grid-template-columns:repeat(2,minmax(0,1fr));padding-right:0;padding-bottom:55px}.task-heading{flex-direction:column}.task-actions{flex-wrap:wrap}.task-summary{gap:10px}}
</style>
