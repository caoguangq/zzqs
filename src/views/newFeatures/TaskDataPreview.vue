<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
const props = defineProps({ editorFields: Array, initialPreview: { type: Boolean, default: true }, entityText: String, taskForm: Boolean })
const emit = defineEmits(['save-instant', 'save-scheduled'])
const fields = props.editorFields || ['extend_id','extend_name','product_item_id','region_id','sale_mode','exp_date','ent_name','search_mode','free_resource','free_flow','val_mon','val_day','cnt_2602','cnt_2601','cnt_2512','cnt_2511']
const selected = ref([...fields])
const checkedFields = ref([])
const filter = ref('')
const visible = ref(props.initialPreview)
const limit = ref(10)
const sorting = ref(false)
const info = ref('')
const infoVisible = computed({ get: () => !!info.value, set: value => { if (!value) info.value = '' } })
const ids = ['80724136','78031381','80724730','80722223','80181145','80022652','80182781','80022032','78020302','81140001']
const names = ['【宜**************G不…','新年特惠12天包','【集**************通用…','跑腿**************12…','10元60分钟语音翻番包','3元******定向流量包','渝水*******0分钟','定向**************哔哩…','1天1gb10分钟赣南流****','大众*******功能包']
const rows = ids.map((id,i) => ({extend_id:id,extend_name:names[i],product_item_id:'2210'+id,region_id:['795','0','0','701','0','0','790','0','0','701'][i],sale_mode:['','','3','','0','0','3','0','','0'][i],exp_date:i===4?'2019-12-31':'2099-12-31',ent_name:['','','','','','资费停售(不能加给任何…','渝水供电','资费停售(不能加给任何…','','资费下线(不能加给任何…'][i],search_mode:['','','1','','0','1','1','1','','0'][i]}))
const shownFields = computed(() => fields.filter(f => f.includes(filter.value)))
function toggle(field) {
  selected.value = checkedFields.value.includes(field)
    ? [...new Set([...selected.value, field])]
    : selected.value.filter(item => item !== field)
}
function removeField(field) {
  selected.value = selected.value.filter(item => item !== field)
  checkedFields.value = checkedFields.value.filter(item => item !== field)
}
function preview() { if (!selected.value.length) return ElMessage.warning('请勾选取数需要的字段'); visible.value=true }
function saveInstant() { if (props.taskForm) emit('save-instant'); else demo('存为即时任务') }
function demo(text) { ElMessage.info(text+'暂不可用') }
</script>
<template>
<div class="nf-feature-2">
  <header class="nf-editor-toolbar">
    <button @click="preview"><span>▣</span>预览取数结果</button>
    <button @click="saveInstant"><span>⇩</span>存为即时任务</button>
    <button @click="emit('save-scheduled')"><span>◴</span>存为定时任务</button>
    <button @click="info='数据实体名称：【新增取数】点对点取数，数据更新时间：2026-03-14 00:00:00'"><span>⌕</span>预览取数信息</button>
    <p>{{ props.entityText || "数据实体名称：【新增取数】点对点取数->取数_市场经营部_马骏_需求取流量活动信息的工作联系单　数据表：取数_市场经营部_马骏_需求取流量活动信息的工作联系单　最新数据时间：2026-03-14 00:00:00" }}</p>
  </header>
  <aside class="nf-field-tree"><h3>数据字段</h3><p>ⓘ 请勾选取数需要的字段</p><input v-model="filter" placeholder="请输入" aria-label="搜索数据字段"/><div>⌄ □ 系统属性组分组</div><div class="nf-tree-group">⌄ □ 默认属性组</div><label v-for="field in shownFields" :key="field"><input type="checkbox" v-model="checkedFields" :value="field" @change="toggle(field)"/><b>T</b>{{field}}</label><button class="nf-custom" @click="demo('设置个性化指标')">设置个性化指标</button></aside>
  <main class="nf-editor-main"><div class="nf-result-heading">结果字段 ♧ <span>□ 过滤重复数据（影响查询效率，请谨慎使用） □ 关联其它信息　<span class="nf-red">ⓘ 根据4A脱敏平台对要脱敏下载到本地的文件大小不超过300兆（20个字段约40万行记录）的要求，建议只选择需要字段。</span></span></div><div class="nf-field-chips"><button v-for="field in selected" :key="field" @click="removeField(field)">{{field}}　⚙ ×</button></div><section>筛选条件</section><section>排序字段</section></main>
  <div v-if="visible" class="nf-preview-mask">
    <section class="nf-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title">
      <header><h2 id="preview-title">预览取数结果信息</h2><button aria-label="关闭预览" @click="visible=false">×</button></header>
      <div class="nf-preview-scroll"><table><thead><tr><th v-for="field in selected" :key="field">{{field}}</th></tr></thead><tbody><tr v-for="row in rows.slice(0,limit)" :key="row.extend_id"><td v-for="field in selected" :key="field" :title="row[field] || ''">{{row[field] || ''}}</td></tr></tbody></table></div>
      <div class="nf-preview-options"><label>预览前 <select v-model.number="limit" aria-label="预览条数"><option :value="10">10</option><option :value="5">5</option></select> 条</label><label><input v-model="sorting" type="checkbox"/>使用排序字段 （会严重影响预览的速度，不建议勾选）</label></div>
      <footer><button @click="demo('保存为即时任务')">保存为即时任务</button><button @click="ElMessage.success('预览已刷新')">重新预览</button><button @click="info='预览取数总数：10 条'">预览取数总数</button><button @click="info='SELECT '+selected.join(', ')+' FROM mock_task_data;'">预览取数SQL</button><button class="nf-primary" @click="visible=false">关闭</button></footer>
    </section>
  </div>
  <slot />
  <el-dialog v-model="infoVisible" title="取数信息" width="600px" @close="info=''">{{info}}</el-dialog>
</div>
</template>
<style scoped>
.nf-feature-2 { position:fixed; inset:0; z-index:40; background:#fff; color:#606266; font-size:12px; }
.nf-editor-toolbar { height:63px; display:flex; align-items:center; border-bottom:1px solid #ddd; }
.nf-editor-toolbar button { width:125px; flex-shrink:0; border:0; background:white; color:#606266; cursor:pointer; }
.nf-editor-toolbar button span { display:block; color:#3995c7; font-size:28px; height:32px; }
.nf-editor-toolbar p { margin-left:auto; padding-right:28px; white-space:nowrap; overflow:hidden; }
.nf-field-tree { position:absolute; top:63px; bottom:0; width:350px; border-right:1px solid #ddd; }
.nf-field-tree h3 { font-size:13px; font-weight:400; margin:0; padding:9px; border-bottom:1px solid #ddd; }
.nf-field-tree p { color:#f56c6c; margin:14px 8px 10px; }
.nf-field-tree>input { width:calc(100% - 20px); margin:0 10px 12px; height:28px; border:1px solid #ddd; padding:0 12px; }
.nf-field-tree>div { padding:5px 10px; }.nf-field-tree .nf-tree-group { padding-left:22px; }
.nf-field-tree label { display:flex; align-items:center; height:30px; padding-left:42px; gap:8px; }.nf-field-tree b { color:#67c23a; font-size:15px; }
.nf-custom { position:absolute; bottom:0; width:100%; height:30px; border:0; border-top:1px solid #ddd; background:white; color:#409eff; }
.nf-editor-main { margin-left:350px; }.nf-result-heading { height:33px; border-bottom:1px solid #ddd; padding:9px; }.nf-result-heading>span { margin-left:90px; }.nf-red { color:#f56c6c; }
.nf-field-chips { display:flex; flex-wrap:wrap; gap:8px; padding:10px; height:306px; align-content:start; }.nf-field-chips button { border:1px solid #dcdfe6; border-radius:4px; background:white; padding:8px 10px; cursor:pointer; }.nf-editor-main>section { height:338px; border-top:1px solid #ddd; padding:10px; }
.nf-preview-mask { position:absolute; inset:0; background:rgba(0,0,0,.3); }
.nf-preview-dialog { position:absolute; left:20.8%; top:21.4%; width:61%; height:72.6%; border-radius:9px; background:white; box-shadow:0 0 24px #666; display:flex; flex-direction:column; overflow:hidden; }
.nf-preview-dialog>header { height:62px; flex-shrink:0; position:relative; border-bottom:2px solid #ebeef5; text-align:center; }.nf-preview-dialog h2 { font-size:18px; color:#222; margin:20px 0; }.nf-preview-dialog>header button { position:absolute; right:24px; top:16px; background:none; border:0; font-size:28px; color:#c0c4cc; cursor:pointer; }
.nf-preview-scroll { flex:1; overflow:auto; margin:0 10px; }.nf-preview-scroll table { border-collapse:collapse; table-layout:fixed; width:2400px; color:#8b949e; }.nf-preview-scroll th { background:#f8fafc; height:49px; font-weight:400; color:#606266; }.nf-preview-scroll td { border:1px solid #eee; height:27px; padding:0 3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }.nf-preview-scroll td:first-child { border-left:0; }
.nf-preview-options { height:42px; flex-shrink:0; display:flex; justify-content:space-between; align-items:flex-start; padding:4px 12px; color:#909399; }.nf-preview-options>label:last-child { align-self:end; }.nf-preview-options select { border-radius:6px; }
.nf-preview-dialog footer { height:55px; display:flex; align-items:center; justify-content:flex-end; gap:12px; padding:0 22px; }.nf-preview-dialog footer button { background:white; border:1px solid #ddd; color:#777; border-radius:22px; height:36px; padding:0 6px; cursor:pointer; }.nf-preview-dialog footer .nf-primary { width:82px; background:#1681c7; color:#222; box-shadow:0 0 5px #aaa; }
@media(max-width:1400px) { .nf-preview-dialog { left:10%; width:80%; top:15%; height:80%; } }
.nf-preview-scroll::-webkit-scrollbar { height:16px; width:12px; background:#fafafa; }
.nf-preview-scroll::-webkit-scrollbar-thumb { background:#999; border-radius:8px; border:3px solid #fafafa; }
.nf-field-chips button { min-width:132px; }
.nf-field-chips button:nth-child(2) { min-width:139px; }
.nf-field-chips button:nth-child(3) { min-width:155px; }
</style>
