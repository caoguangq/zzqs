<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addScheduledTask } from '../../data/scheduledTasks'
import TaskDataPreview from './TaskDataPreview.vue'
const props = defineProps({ initialTask: Object, editMode: Boolean })
const emit = defineEmits(['saved', 'cancel'])
const fields = ['city_id','county_name','school_id','school_name','user_id','create_date','term_brand','flow','arpu','plan_id','plan_name']
const defaults = {name: props.initialTask?.name || '未捆绑目标校园客户--测试20260313164844唐雯丽', notify:'不发送', purpose:'运维', days:91, cycle:'每日调度', clear:'是', start:'2026-03-13', hour:8, minute:0, end:'', limited:'否', maximum:'', offline:'不生成', description:'' , ...props.initialTask}
const form = reactive({...defaults})
const open = ref(true)
function reopen() { Object.assign(form, defaults); open.value = true }
function cancel() { open.value = false; emit('cancel') }
function save() {
  if (!form.name.trim() || !form.purpose || !form.end) return ElMessage.warning('请填写查询任务名称、取数用途和调度终止时间')
  if (!form.start || !Number.isInteger(Number(form.hour)) || Number(form.hour) < 0 || Number(form.hour) > 23 || !Number.isInteger(Number(form.minute)) || Number(form.minute) < 0 || Number(form.minute) > 59) return ElMessage.warning('请输入有效的调度开始时间')
  if (form.end < form.start) return ElMessage.warning('调度终止时间不能早于调度开始时间')
  if (!Number.isInteger(Number(form.days)) || Number(form.days) < 1) return ElMessage.warning('请输入有效的记录保存天数')
  if (form.limited === '是' && (!Number.isInteger(Number(form.maximum)) || Number(form.maximum) < 1)) return ElMessage.warning('请输入有效的最大生成条数')
  if (!props.editMode) addScheduledTask(form)
  emit('saved', {...form}); open.value = false; ElMessage.success('保存成功')
}
</script>
<template>
<TaskDataPreview :editor-fields="fields" :initial-preview="false" task-form entity-text="数据实体名称：【新增取数】经分报表测试数据->未捆绑目标校园客户--测试　数据表：未捆绑目标校园客户--测试　最新数据时间：2026-03-14 00:00:00" @save-scheduled="reopen">
<div v-if="open" class="nf-task-mask"><section class="nf-instant-form nf-scheduled-form" role="dialog" aria-modal="true" aria-labelledby="scheduled-title">
<header><h2 id="scheduled-title">存为定时任务</h2><button aria-label="关闭定时任务表单" @click="cancel">×</button></header>
<form @submit.prevent="save">
<label class="nf-name"><span><b>*</b> 查询任务名称</span><input v-model="form.name" aria-label="查询任务名称"/></label>
<div class="nf-form-row"><fieldset><legend>发送通知短信</legend><label><input v-model="form.notify" type="radio" value="发送"/>发送</label><label><input v-model="form.notify" type="radio" value="不发送"/>不发送</label></fieldset><label class="nf-purpose"><span><b>*</b> 取数用途</span><select v-model="form.purpose" aria-label="取数用途"><option>运维</option><option>业务分析</option><option>数据核查</option></select></label></div>
<div class="nf-form-row nf-schedule-row"><label><span>记录保存天数</span><input type="number" v-model="form.days" min="1" aria-label="记录保存天数"/></label><label class="nf-purpose"><span><b>*</b> 任务调度周期</span><select v-model="form.cycle" aria-label="任务调度周期"><option>每日调度</option><option>每周调度</option><option>每月调度</option></select></label></div>
<div class="nf-form-row nf-schedule-row"><fieldset><legend>是否删除历史记录</legend><label><input v-model="form.clear" type="radio" value="是"/>是</label><label><input v-model="form.clear" type="radio" value="否"/>否（说明）</label></fieldset><div class="nf-time"><span>调度开始时间</span><el-date-picker v-model="form.start" value-format="YYYY-MM-DD" aria-label="调度开始时间"/><input v-model="form.hour" type="number" min="0" max="23" aria-label="调度小时"/>：<input v-model="form.minute" type="number" min="0" max="59" aria-label="调度分钟"/></div></div>
<div class="nf-form-row nf-schedule-row"><label class="nf-end"><span><b>*</b> 调度终止时间</span><el-date-picker v-model="form.end" value-format="YYYY-MM-DD" aria-label="调度终止时间"/></label><fieldset><legend>限制最多生成条数</legend><label><input v-model="form.limited" type="radio" value="否"/>否</label><label><input v-model="form.limited" type="radio" value="是"/>是</label><input v-if="form.limited==='是'" v-model="form.maximum" type="number" min="1" aria-label="最大生成条数"/></fieldset></div>
<label class="nf-offline"><span>生成离线下载文件（说明）</span><select v-model="form.offline" aria-label="生成离线下载文件"><option>不生成</option><option>生成</option></select></label>
<label class="nf-description"><span>查询任务描述</span><textarea v-model="form.description" aria-label="查询任务描述" placeholder="请输入任务描述..."/></label>
<footer><button type="button" @click="cancel">取消</button><button class="nf-save" type="submit">保存</button></footer>
</form></section></div>
</TaskDataPreview>
</template>
<style scoped>

.nf-task-mask { position:absolute;inset:0;background:rgba(0,0,0,.3); }
.nf-instant-form { position:absolute;left:50%;top:16.4%;transform:translateX(-50%);width:706px;height:492px;background:white;border-radius:9px;box-shadow:0 0 24px #555;overflow:hidden;color:#606266;font-size:12px; }
header {height:61px;border-bottom:1px solid #eee;position:relative;text-align:center}h2{margin:0;padding:18px;font-size:18px;color:#222}header button{position:absolute;right:24px;top:14px;border:0;background:none;font-size:28px;color:#ccc;cursor:pointer}
form{padding:12px 16px 8px 12px}label{display:flex;align-items:center}label>span{width:104px;flex-shrink:0;text-align:right;padding-right:8px}b{color:red;font-weight:400}input:not([type=radio]),select{height:34px;border:1px solid #eee;border-radius:18px;padding:0 10px;color:#8a94a0;font-size:12px;min-width:0}.nf-name input{flex:1}.nf-form-row{display:flex;justify-content:space-between;align-items:center}fieldset{display:flex;align-items:center;gap:36px;border:0;padding:0;margin:0;width:320px;min-width:0}legend{float:left;width:104px;text-align:right;padding-right:8px}fieldset label{white-space:nowrap}input[type=radio]{margin:0 3px 0 0;accent-color:#528bfa}fieldset input[type=number]{width:65px}.nf-purpose{flex:1}.nf-purpose>span{width:126px}.nf-purpose select{flex:1}.nf-limit-row{margin-top:36px}.nf-expiry{margin-top:38px}.nf-expiry input{width:230px}.nf-expiry p{margin:6px 0 0 104px}.nf-expiry em{font-style:normal;color:#409eff}.nf-description{align-items:flex-start;margin-top:41px}.nf-description>span{padding-top:6px}.nf-description textarea{height:94px;flex:1;border:1px solid #eee;resize:none;padding:6px 0;font:inherit;color:#606266}footer{display:flex;justify-content:flex-end;gap:14px;margin-top:10px;padding-right:6px}footer button{height:36px;width:80px;border:1px solid #ddd;border-radius:20px;background:white;color:#777;cursor:pointer}footer button.nf-save{background:#1681c7;color:#222;box-shadow:0 0 5px #aaa}
@media(max-width:800px){.nf-instant-form{width:94%;top:8%;height:auto;min-height:492px}.nf-form-row{flex-wrap:wrap;gap:10px}.nf-purpose{min-width:280px}.nf-description{margin-top:20px}fieldset{width:100%}.nf-expiry{margin-top:20px}}
fieldset {gap:0}legend {white-space:nowrap}fieldset label:first-of-type {margin-right:42px} .nf-expiry :deep(.el-date-editor.el-input){width:230px}.nf-expiry :deep(.el-input__wrapper){height:32px;min-height:32px;border-radius:16px;box-shadow:none;border:1px solid #eee}.nf-expiry :deep(.el-input__prefix){order:2;margin:0 0 0 8px}.nf-description {margin-top:36px}
.nf-edit-form {width:840px;top:19%;height:440px}.nf-edit-form .nf-limit-row {margin-top:16px}.nf-edit-form .nf-expiry{margin-top:16px}.nf-edit-form .nf-description{margin-top:20px}@media(max-width:900px){.nf-edit-form{width:94%;height:auto;min-height:460px}}
:global(.nf-edit-confirm){width:414px;max-width:94%;padding:0;border-radius:9px;position:relative;top:-78px}:global(.nf-edit-confirm .el-message-box__header){height:61px;padding:18px;text-align:center;border-bottom:1px solid #eee}:global(.nf-edit-confirm .el-message-box__title){font-size:18px;font-weight:bold;color:#222;justify-content:center}:global(.nf-edit-confirm .el-message-box__content){padding:18px 24px}:global(.nf-edit-confirm .el-message-box__btns){padding:10px 18px 12px}:global(.nf-edit-confirm .el-button){border-radius:20px;min-width:80px;height:36px}:global(.nf-edit-confirm-mask){background:rgba(0,0,0,.6)}
:global(.nf-edit-confirm .el-message-box__status){font-size:48px;color:#ffbf00}:global(.nf-edit-confirm .el-message-box__message){padding-left:48px}

.nf-scheduled-form {top:10.8%;height:630px}.nf-scheduled-form form{padding-top:12px}.nf-schedule-row{margin-top:36px}.nf-schedule-row>label{width:336px}.nf-schedule-row>label>input{width:232px}.nf-time{display:flex;align-items:center;gap:4px;font-size:12px;white-space:nowrap}.nf-time>span{margin-right:4px}.nf-time :deep(.el-date-editor){width:118px}.nf-time>input{width:50px;padding:0 9px}.nf-end :deep(.el-date-editor){width:232px}.nf-scheduled-form :deep(.el-input__wrapper){box-shadow:none;border:1px solid #eee;border-radius:18px;height:32px}.nf-offline{margin-top:36px;width:330px}.nf-offline select{width:232px}.nf-scheduled-form .nf-description{margin-top:60px}.nf-scheduled-form .nf-purpose>span{width:110px}.nf-scheduled-form fieldset{width:336px}.nf-scheduled-form .nf-schedule-row fieldset label:first-of-type{margin-right:42px}
@media(max-width:800px){.nf-scheduled-form{top:2%;max-height:96%;overflow:auto;min-height:0}.nf-schedule-row{margin-top:20px;gap:12px}.nf-scheduled-form .nf-description{margin-top:20px}.nf-scheduled-form fieldset{width:100%}.nf-time{flex-wrap:wrap}}
</style>
