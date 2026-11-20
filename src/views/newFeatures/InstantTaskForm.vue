<script setup>
import { computed, reactive, ref, h } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import TaskDataPreview from './TaskDataPreview.vue'
const props = defineProps({ editMode: Boolean, initialTask: Object })
const emit = defineEmits(['saved', 'cancel'])
const fields=['city_id','county_name','school_id','school_name','user_id','create_date','term_brand','flow','arpu','plan_id','plan_name']
const defaults={name:'未捆绑目标校园客户--测试20260313161826唐雯丽',notify:'发送',purpose:'运维',limited:'否',maximum:'',offline:'不生成',expires:'2026-03-28',description:''}
if (props.initialTask) { defaults.name = props.initialTask.taskName; defaults.notify = '不发送' }
const form=reactive({...defaults})
const open=ref(true)
const saved=ref([])
const remaining=computed(()=> form.expires ? Math.round((new Date(form.expires+'T00:00:00')-new Date('2026-03-13T00:00:00'))/86400000) : 0)
function reopen(){Object.assign(form,defaults);open.value=true}
async function save(){if(!form.name.trim()||!form.purpose||!form.expires)return ElMessage.warning('请填写查询任务名称、取数用途和有效期');if(form.limited==='是'&&(!Number.isInteger(Number(form.maximum))||Number(form.maximum)<=0))return ElMessage.warning('请输入有效的最大生成条数');if (props.editMode) {
  try { await ElMessageBox.confirm(h('div', [h('p', '您确定要保存该即时查询任务的信息吗?'), h('p', { style: 'color:red;font-weight:bold' }, '说明：修改保存成功后查询任务会重新执行!')]), '询问', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', customClass:'nf-edit-confirm', modalClass:'nf-edit-confirm-mask' }) } catch { return }
}
saved.value.push({...form});emit('saved', {...form});open.value=false;ElMessage.success('保存成功')}
</script>
<template>
<TaskDataPreview :editor-fields="fields" :initial-preview="false" task-form entity-text="数据实体名称：【新增取数】经分报表测试数据->未捆绑目标校园客户--测试　数据表：未捆绑目标校园客户--测试　最新数据时间：2026-03-14 00:00:00" @save-instant="reopen">
<div v-if="open" class="nf-task-mask"><section class="nf-instant-form" :class="{ 'nf-edit-form': editMode }" role="dialog" aria-modal="true" aria-labelledby="instant-title"><header><h2 id="instant-title">存为即时任务</h2><button aria-label="关闭任务表单" @click="open=false; emit('cancel')">×</button></header>
<form @submit.prevent="save"><label class="nf-name"><span><b>*</b> 查询任务名称</span><input v-model="form.name" aria-label="查询任务名称"/></label>
<div class="nf-form-row"><fieldset><legend>发送通知短信</legend><label><input v-model="form.notify" type="radio" value="发送"/>发送</label><label><input v-model="form.notify" type="radio" value="不发送"/>不发送</label></fieldset><label class="nf-purpose"><span><b>*</b> 取数用途</span><select v-model="form.purpose" aria-label="取数用途"><option>运维</option><option>业务分析</option><option>数据核查</option></select><span v-if="editMode" class="nf-hint">(说明)</span></label></div>
<div class="nf-form-row nf-limit-row"><fieldset><legend>限制最多生成条数</legend><label><input v-model="form.limited" type="radio" value="否"/>否</label><label><input v-model="form.limited" type="radio" value="是"/>是</label><input v-if="form.limited==='是'" v-model="form.maximum" aria-label="最大生成条数" type="number" min="1"/></fieldset><label class="nf-purpose"><span>生成离线下载文件</span><select v-model="form.offline" aria-label="生成离线下载文件"><option>不生成</option><option>生成</option></select></label></div>
<div class="nf-expiry"><label><span><b>*</b> 有效期至</span><el-date-picker v-model="form.expires" type="date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" aria-label="有效期至"/></label><p>[剩余:<em>{{remaining}}</em>天]</p></div>
<label class="nf-description"><span>查询任务描述</span><textarea v-model="form.description" aria-label="查询任务描述" placeholder="请输入任务描述..."/></label>
<footer><button type="button" @click="open=false">取消</button><button class="nf-save" type="submit">保存</button></footer></form></section></div>
</TaskDataPreview>
</template>
<style scoped>
.nf-task-mask { position:absolute;inset:0;background:rgba(0,0,0,.3); }
.nf-instant-form { position:absolute;left:50%;top:16.4%;transform:translateX(-50%);width:706px;height:492px;background:white;border-radius:9px;box-shadow:0 0 24px #555;overflow:hidden;color:#606266;font-size:12px; }
header {height:61px;border-bottom:1px solid #eee;position:relative;text-align:center}h2{margin:0;padding:18px;font-size:18px;color:#222}header button{position:absolute;right:24px;top:14px;border:0;background:none;font-size:28px;color:#ccc;cursor:pointer}
form{padding:12px 16px 8px 12px}label{display:flex;align-items:center}label>span{width:104px;flex-shrink:0;text-align:right;padding-right:8px}b{color:red;font-weight:400}input:not([type=radio]),select{height:34px;border:1px solid #eee;border-radius:18px;padding:0 10px;color:#8a94a0;font-size:12px;min-width:0}.nf-name input{flex:1}.nf-form-row{display:flex;justify-content:space-between;align-items:center}fieldset{display:flex;align-items:center;gap:36px;border:0;padding:0;margin:0;width:320px;min-width:0}legend{float:left;width:104px;text-align:right;padding-right:8px}fieldset label{white-space:nowrap}input[type=radio]{margin:0 3px 0 0;accent-color:#528bfa}fieldset input[type=number]{width:65px}.nf-purpose{flex:1}.nf-purpose>span{width:126px}.nf-purpose select{flex:1}.nf-limit-row{margin-top:36px}.nf-expiry{margin-top:38px}.nf-expiry input{width:230px}.nf-expiry p{margin:6px 0 0 104px}.nf-expiry em{font-style:normal;color:#409eff}.nf-description{align-items:flex-start;margin-top:41px}.nf-description>span{padding-top:6px}.nf-description textarea{height:94px;flex:1;border:1px solid #eee;resize:none;padding:6px 0;font:inherit;color:#606266}footer{display:flex;justify-content:flex-end;gap:14px;margin-top:10px;padding-right:6px}footer button{height:36px;width:80px;border:1px solid #ddd;border-radius:20px;background:white;color:#777;cursor:pointer}footer button.nf-save{background:#1681c7;color:#222;box-shadow:0 0 5px #aaa}
@media(max-width:800px){.nf-instant-form{width:94%;top:8%;height:auto;min-height:492px}.nf-form-row{flex-wrap:wrap;gap:10px}.nf-purpose{min-width:280px}.nf-description{margin-top:20px}fieldset{width:100%}.nf-expiry{margin-top:20px}}
fieldset {gap:0}legend {white-space:nowrap}fieldset label:first-of-type {margin-right:42px} .nf-expiry :deep(.el-date-editor.el-input){width:230px}.nf-expiry :deep(.el-input__wrapper){height:32px;min-height:32px;border-radius:16px;box-shadow:none;border:1px solid #eee}.nf-expiry :deep(.el-input__prefix){order:2;margin:0 0 0 8px}.nf-description {margin-top:36px}
.nf-edit-form {width:840px;top:19%;height:440px}.nf-hint{margin-left:8px;color:#909399;font-size:12px;white-space:nowrap}.nf-edit-form .nf-limit-row {margin-top:16px}.nf-edit-form .nf-expiry{margin-top:16px}.nf-edit-form .nf-description{margin-top:20px}@media(max-width:900px){.nf-edit-form{width:94%;height:auto;min-height:460px}}
:global(.nf-edit-confirm){width:414px;max-width:94%;padding:0;border-radius:9px;position:relative;top:-78px}:global(.nf-edit-confirm .el-message-box__header){height:61px;padding:18px;text-align:center;border-bottom:1px solid #eee}:global(.nf-edit-confirm .el-message-box__title){font-size:18px;font-weight:bold;color:#222;justify-content:center}:global(.nf-edit-confirm .el-message-box__content){padding:18px 24px}:global(.nf-edit-confirm .el-message-box__btns){padding:10px 18px 12px}:global(.nf-edit-confirm .el-button){border-radius:20px;min-width:80px;height:36px}:global(.nf-edit-confirm-mask){background:rgba(0,0,0,.6)}
:global(.nf-edit-confirm .el-message-box__status){font-size:48px;color:#ffbf00}:global(.nf-edit-confirm .el-message-box__message){padding-left:48px;font-size:12px;line-height:22px}:global(.nf-edit-confirm .el-message-box__message p){margin:0;font-size:12px}:global(.nf-edit-confirm .el-message-box__btns .el-button:first-child){border:none;background:transparent;color:#606266;box-shadow:none}
</style>
