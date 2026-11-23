<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { abnormalFileRows, dispatchResults, dispatchTasks } from '../../data/fileDownload.js'
import { setPageBreadcrumb } from '../../config/pageBreadcrumb.js'

const router = useRouter()
const view = ref('download')
watch(view, (value) => {
  setPageBreadcrumb(value === 'download'
    ? ['自助取数', '应用中心', '文件下载']
    : ['自助取数', '异常下载任务', '任务处理'])
}, { immediate: true })
const rows = ref(abnormalFileRows.map((row) => ({ ...row })))
const selected = ref([])
const all = computed({
  get: () => rows.value.length > 0 && selected.value.length === rows.value.length,
  set: (value) => { selected.value = value ? rows.value.map((row) => row.id) : [] }
})
const failedIds = computed(() => rows.value.filter((row) => row.state !== '下载完成').map((row) => row.id))
const selectedFailed = computed(() => selected.value.filter((id) => failedIds.value.includes(id)))

const taskFilters = reactive({ id: '', file: '', state: '全部', handler: '全部' })
const appliedTaskFilters = ref({ ...taskFilters })
const tasks = computed(() => dispatchTasks.filter((task) =>
  (!appliedTaskFilters.value.id || task.id.includes(appliedTaskFilters.value.id)) &&
  (!appliedTaskFilters.value.file || task.file.includes(appliedTaskFilters.value.file)) &&
  (appliedTaskFilters.value.state === '全部' || task.state === appliedTaskFilters.value.state) &&
  (appliedTaskFilters.value.handler === '全部' || task.handler === appliedTaskFilters.value.handler)
))
function queryTasks() { appliedTaskFilters.value = { ...taskFilters } }
function resetTasks() { Object.assign(taskFilters, { id: '', file: '', state: '全部', handler: '全部' }); queryTasks() }

const modal = ref(false)
const form = reactive({
  reason: '存储空间不足，导致文件生成失败。',
  handler: '张伟（运维人员）',
  expected: '2026-10-26 18:00:00',
  minutes: 120,
  submitter: 'admin管理员'
})
const dispatchTarget = computed(() => {
  const id = selectedFailed.value[0]
  return rows.value.find((row) => row.id === id) || rows.value.find((row) => row.state !== '下载完成') || rows.value[0]
})
const formComplete = computed(() => form.reason.trim() && form.handler && form.expected && Number(form.minutes) > 0 && form.submitter.trim())

function openDispatch() {
  if (!selectedFailed.value.length) ElMessage.warning('请选择下载失败的任务')
  else { view.value = 'tasks'; modal.value = true }
}
function confirmDispatch() {
  if (!formComplete.value) return ElMessage.warning('请完整填写五项必填信息')
  const handler = form.handler.replace(/（.*?）/, '')
  if (dispatchResults[0]) {
    dispatchResults[0].dispatchTime = '2026-10-26 16:00:00'
    dispatchResults[0].state = '已派发（待处理）'
    dispatchResults[0].dispatcher = form.submitter
    dispatchResults[0].reason = form.reason.replace(/。$/, '')
    dispatchResults[0].description = `派发至${handler}，期望18:00前完成，处理时效${form.minutes}分钟`
  } else {
    dispatchResults.push({
      dispatchTime: '2026-10-26 16:00:00',
      state: '已派发（待处理）',
      dispatcher: form.submitter,
      reason: form.reason.replace(/。$/, ''),
      description: `派发至${handler}，期望18:00前完成，处理时效${form.minutes}分钟`
    })
  }
  modal.value = false
  ElMessage.success('派发成功，已生成运维通知')
}
async function remove(row) {
  try { await ElMessageBox.confirm('确定删除该文件吗？', '询问', { confirmButtonText: '确定', cancelButtonText: '取消' }) } catch { return }
  rows.value = rows.value.filter((item) => item.id !== row.id)
  selected.value = selected.value.filter((id) => id !== row.id)
  ElMessage.success('删除成功')
}
function taskAction(task, action) {
  if (action === '详情') return (taskDetail.value = task)
  if (action === '开始处理' || action === '处理') task.state = '处理中'
  if (action === '查看结果') return ElMessage.success('已打开处理结果')
  ElMessage.info(`${action}功能暂不可用`)
}
const taskDetail = ref(null)
function unavailable(text) { ElMessage.info(text + '暂不可用') }
function exportTasks() {
  const csv = '﻿' + [['任务编号', '异常文件', '异常类型', '优先级', '派发人', '处理人', '派发时间', '要求完成时间', '处理状态'], ...tasks.value.map((task) => [task.id, task.file, task.type, task.priority, task.dispatcher, task.handler, task.dispatchTime, task.dueTime, task.state])]
    .map((row) => row.map((value) => '"' + String(value).replaceAll('"', '""') + '"').join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = '异常下载任务.csv'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="nf-feature-14">
    <template v-if="view === 'download'">
      <form class="nf-dl-filter" @submit.prevent>
        <label>文件名称<input aria-label="文件名称筛选" placeholder="请输入文件名称..." /></label>
        <button class="nf-query" @click="ElMessage.info('按文件名称过滤暂不可用')">查询 <span>⌕</span></button>
      </form>
      <section class="nf-card nf-card-download">
        <header>
          <h2>文件下载</h2>
          <aside>
            <button class="nf-primary" @click="openDispatch">异常任务派发</button>
            <button class="nf-primary" @click="router.push('/new/13')">下载提示信息登记</button>
            <button class="nf-plain" @click="unavailable('删除')">删除</button>
          </aside>
        </header>
        <div class="nf-table-scroll">
          <table>
            <colgroup><col style="width:4.2%" /><col style="width:12.6%" /><col style="width:8.6%" /><col style="width:8.5%" /><col style="width:11.5%" /><col style="width:11.7%" /><col style="width:11.7%" /><col style="width:8.8%" /><col style="width:9.3%" /><col style="width:13.1%" /></colgroup>
            <thead><tr><th><input v-model="all" :indeterminate="selected.length > 0 && !all" type="checkbox" aria-label="全选下载文件" /></th><th>文件名称</th><th>生成状态</th><th>操作人</th><th>操作时间</th><th>开始时间</th><th>结束时间</th><th>输出类型</th><th>下载耗时（秒）</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id">
                <td><input v-model="selected" type="checkbox" :value="row.id" :aria-label="'选择' + row.name" /></td>
                <td>{{ row.name }}</td>
                <td>{{ row.state }}</td>
                <td>{{ row.operator }}</td>
                <td>{{ row.operateTime }}</td>
                <td>{{ row.startTime }}</td>
                <td>{{ row.endTime }}</td>
                <td>{{ row.outputType }}</td>
                <td>{{ row.seconds }}</td>
                <td class="nf-ops">
                  <template v-if="row.state !== '下载完成'"><button @click="selected = [row.id]; openDispatch()">派发处理</button><span class="nf-sep"> | </span></template>
                  <button @click="remove(row)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="nf-pager nf-dl-pager">
          <span>共 {{ rows.length }} 条记录</span>
          <nav><button disabled>上一页</button><button class="active">1</button><button disabled>下一页</button><span>前往</span><input value="1" aria-label="前往页码" /><span>页</span><button>确定</button></nav>
        </div>
      </section>
      <p v-if="selected.length" class="nf-selection-info"><b>i</b> 已选择 {{ selected.length }} 个下载失败任务，点击“异常任务派发”填写异常原因、处理人、期望处理时间、处理时效及提单人。</p>
    </template>

    <template v-else>
      <form class="nf-task-filters" @submit.prevent="queryTasks">
        <label>任务编号<input v-model="taskFilters.id" aria-label="任务编号" placeholder="请输入任务编号..." /></label>
        <label>异常文件<input v-model="taskFilters.file" aria-label="异常文件" placeholder="请输入文件名称..." /></label>
        <label>处理状态<select v-model="taskFilters.state" aria-label="处理状态"><option>全部</option><option>待处理</option><option>处理中</option><option>已完成</option><option>已关闭</option></select></label>
        <label>处理人<select v-model="taskFilters.handler" aria-label="处理人"><option>全部</option><option>张伟</option><option>李娜</option><option>王强</option></select></label>
        <button class="nf-query" type="submit">查询 <span>⌕</span></button>
        <button class="nf-reset" type="button" @click="resetTasks">重置</button>
      </form>
      <section class="nf-card nf-card-tasks">
        <header>
          <h2>异常下载任务</h2>
          <aside><button class="nf-primary" @click="unavailable('批量管理')">批量管理</button><button class="nf-primary" @click="exportTasks">导出</button></aside>
        </header>
        <div class="nf-table-scroll">
          <table class="nf-task-table">
            <colgroup><col style="width:2.7%" /><col style="width:11.6%" /><col style="width:14%" /><col style="width:7%" /><col style="width:5.5%" /><col style="width:8.7%" /><col style="width:6%" /><col style="width:11.3%" /><col style="width:11.1%" /><col style="width:5.7%" /><col style="width:16.4%" /></colgroup>
            <thead><tr><th><input type="checkbox" aria-label="全选异常任务" /></th><th>任务编号</th><th>异常文件</th><th>异常类型</th><th>优先级</th><th>派发人</th><th>处理人</th><th>派发时间</th><th>要求完成时间</th><th>处理状态</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="task in tasks" :key="task.id">
                <td><input type="checkbox" :aria-label="'选择' + task.id" /></td>
                <td>{{ task.id }}</td>
                <td>{{ task.file }}</td>
                <td>{{ task.type }}</td>
                <td>{{ task.priority }}</td>
                <td>{{ task.dispatcher }}</td>
                <td>{{ task.handler }}</td>
                <td>{{ task.dispatchTime }}</td>
                <td>{{ task.dueTime }}</td>
                <td>{{ task.state }}</td>
                <td class="nf-ops">
                  <template v-if="task.state === '待处理'"><button @click="taskAction(task, '开始处理')">开始处理</button> <button @click="taskAction(task, '转发')">转发</button> </template>
                  <template v-else-if="task.state === '处理中'"><button @click="taskAction(task, '处理')">处理</button> <button @click="taskAction(task, '转发')">转发</button> </template>
                  <template v-else-if="task.state === '已完成'"><button @click="taskAction(task, '查看结果')">查看结果</button> </template>
                  <button @click="taskAction(task, '详情')">详情</button>
                </td>
              </tr>
              <tr v-if="!tasks.length"><td colspan="11">暂无数据</td></tr>
            </tbody>
          </table>
        </div>
        <div class="nf-pager">
          <span>共 {{ tasks.length }} 条记录</span>
          <nav><button disabled>上一页</button><button class="active">1</button><button disabled>下一页</button><span>跳转</span><input value="1" aria-label="跳转页码" /><span>页</span><button>确定</button></nav>
        </div>
        <h3 class="nf-result-title">派发结果 <small>界面示意 · 示例数据</small></h3>
        <div class="nf-table-scroll">
          <table class="nf-result-table">
            <colgroup><col style="width:18%" /><col style="width:18%" /><col style="width:14%" /><col style="width:22%" /><col style="width:28%" /></colgroup>
            <thead><tr><th>派发时间</th><th>派发状态</th><th>派发人</th><th>派发理由</th><th>派发描述</th></tr></thead>
            <tbody><tr v-for="(item, index) in dispatchResults" :key="index"><td>{{ item.dispatchTime }}</td><td>{{ item.state }}</td><td>{{ item.dispatcher }}</td><td>{{ item.reason }}</td><td>{{ item.description }}</td></tr></tbody>
          </table>
        </div>
        <p class="nf-selection-info"><b>i</b> 通知状态（示例）：已生成运维通知，接收人：张伟；关联任务：DL-20261026-001。</p>
      </section>
    </template>

    <div v-if="modal" class="nf-mask">
      <section class="nf-dispatch-modal" role="dialog" aria-modal="true" aria-labelledby="dispatch-title">
        <header><h2 id="dispatch-title">派发异常下载任务</h2><button aria-label="关闭派发" @click="modal = false">×</button></header>
        <p class="nf-demo">界面示意 · 示例数据</p>
        <div class="nf-target"><span>异常文件：{{ dispatchTarget.name }}</span><span>当前状态：{{ dispatchTarget.state }}</span></div>
        <label class="nf-reason"><span>异常原因<b>*</b></span><textarea v-model="form.reason" aria-label="异常原因" /></label>
        <div class="nf-row"><label><span>处理人<b>*</b></span><select v-model="form.handler" aria-label="处理人"><option>张伟（运维人员）</option><option>李娜（运维人员）</option><option>王强（运维人员）</option></select></label>
          <label><span>期望处理时间<b>*</b></span><div class="nf-input-icon"><input v-model="form.expected" aria-label="期望处理时间" /><svg viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M896 192h-96V96a32 32 0 0 0-64 0v96H288V96a32 32 0 0 0-64 0v96h-96A64 64 0 0 0 64 256v640a64 64 0 0 0 64 64h768a64 64 0 0 0 64-64V256a64 64 0 0 0-64-64zm0 704H128V384h768v512zM320 512H192v128h128V512z"/></svg></div></label></div>
        <div class="nf-row"><label><span>处理时效<b>*</b></span><input v-model="form.minutes" aria-label="处理时效" /><em>分钟</em></label>
          <label><span>提单人<b>*</b></span><input v-model="form.submitter" aria-label="提单人" /></label></div>
        <div class="nf-check">
          <h4>派发校验</h4>
          <p>处理人已匹配运维人员；五项必填信息{{ formComplete ? '完整' : '不完整' }}。</p>
          <p>预计派发时间：2026-10-26 16:00:00；截止时间：{{ form.expected }}。</p>
          <p>处理时效校验：18:00 - 16:00 = {{ form.minutes }}分钟，通过。</p>
        </div>
        <footer><button class="nf-cancel" @click="modal = false">取消</button><button class="nf-save" @click="confirmDispatch">确认派发并通知</button></footer>
      </section>
    </div>

    <el-dialog :model-value="!!taskDetail" title="异常下载任务详情" width="560px" @close="taskDetail = null">
      <template v-if="taskDetail">
        <p>任务编号：{{ taskDetail.id }}</p>
        <p>异常文件：{{ taskDetail.file }}</p>
        <p>异常类型：{{ taskDetail.type }}</p>
        <p>处理人：{{ taskDetail.handler }}</p>
        <p>处理状态：{{ taskDetail.state }}</p>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.nf-feature-14 { margin: -33px -43px -40px -31px; padding: 12px 0 50px 31px; color: #6b7a87; font-size: 12px; }
.nf-dl-filter { display: flex; align-items: flex-end; gap: 2px; margin: 6px 0 42px; }
.nf-dl-filter label, .nf-task-filters label { display: flex; flex-direction: column; gap: 10px; color: #30475f; }
.nf-dl-filter label { gap: 23px; }
.nf-dl-filter input { width: 340px; height: 36px; border: 1px solid #e7ecf3; border-radius: 20px; padding: 0 14px; color: #8b949e; font: inherit; background: #fff; }
.nf-task-filters input, .nf-task-filters select { width: 220px; height: 36px; border: 1px solid #e7ecf3; border-radius: 20px; padding: 0 14px; color: #8b949e; font: inherit; background: #fff; }
.nf-query { height: 36px; width: 116px; border: 0; border-radius: 22px; background: #1681d7; color: #fff; font: inherit; cursor: pointer; }
.nf-query span { margin-left: 12px; font-size: 18px; }
.nf-task-filters { display: flex; align-items: center; gap: 26px; margin: 53px 0 36px; }
.nf-task-filters label { flex-direction: row; align-items: center; gap: 10px; white-space: nowrap; }
.nf-task-filters label:nth-child(1) input, .nf-task-filters label:nth-child(2) input { width: 240px; }
.nf-task-filters select { width: 170px; }
.nf-reset { height: 36px; width: 84px; border: 1px solid #e7ecf3; border-radius: 20px; background: #fff; color: #8b949e; font: inherit; cursor: pointer; }
.nf-card { background: #fff; border: 1px solid #eee; margin-right: 41px; padding: 12px 20px 10px; }
.nf-card > header { display: flex; align-items: center; justify-content: space-between; height: 52px; }
.nf-card-download { padding-top: 6px; padding-bottom: 0; }
.nf-card-download > header { height: 47px; }
.nf-card-tasks { padding-bottom: 24px; }
.nf-card h2 { font-size: 16px; font-weight: 400; color: #30475f; margin: 0; }
.nf-card aside { display: flex; gap: 14px; }
.nf-card button { font: inherit; cursor: pointer; }
.nf-primary { height: 36px; padding: 0 28px; border: 0; border-radius: 20px; background: #1681d7; color: #fff; }
.nf-plain { border: 0; background: none; color: #9aa7b4; }
.nf-table-scroll { overflow: auto; }
table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 12px; }
th { height: 44px; background: #fafbfe; color: #30475f; font-weight: 400; border: 1px solid #eee; }
td { height: 42px; border: 1px solid #eee; text-align: center; padding: 0 4px; overflow-wrap: anywhere; }
.nf-card-download th { height: 46px; }
.nf-card-download td { height: 45px; }
.nf-task-table th { height: 54px; }
.nf-task-table td { height: 50px; }
.nf-result-table th { height: 42px; }
.nf-result-table td { height: 43px; }
tbody tr:hover { background: #f4f8fd; }
.nf-ops button { border: 0; background: none; color: #1681d7; padding: 0; font: inherit; cursor: pointer; }
.nf-ops button + button { margin-left: 14px; }
.nf-sep { color: #c0c4cc; }
.nf-pager { display: flex; align-items: center; justify-content: space-between; height: 46px; color: #30475f; }
.nf-dl-pager { height: 56px; margin-top: 0; }
.nf-card-tasks > .nf-pager { margin-top: 0; height: 60px; }
.nf-pager nav { display: flex; align-items: center; gap: 10px; }
.nf-pager button { min-width: 30px; height: 28px; border: 1px solid #e4ebf5; background: #fff; color: #606266; font: inherit; cursor: pointer; }
.nf-pager button.active { background: #1681d7; color: #fff; border-color: #1681d7; }
.nf-pager input { width: 40px; height: 26px; border: 1px solid #e4ebf5; text-align: center; }
.nf-selection-info { display: flex; gap: 10px; align-items: center; margin: 16px 41px 0 0; padding: 16px; border: 1px solid #e4ebf5; background: #f7faff; color: #1681d7; }
.nf-card-tasks > .nf-selection-info { margin-top: 10px; padding: 7px 16px; }
.nf-selection-info b { width: 16px; height: 16px; border-radius: 50%; background: #1681d7; color: #fff; text-align: center; line-height: 16px; font-weight: 400; flex-shrink: 0; }
.nf-result-title { font-size: 15px; font-weight: 400; color: #30475f; margin: 30px 0 12px; }
.nf-result-title small { margin-left: 10px; font-size: 12px; color: #9aa7b4; }
.nf-mask { position: fixed; inset: 0; background: rgba(0, 0, 0, .5); z-index: 60; }
.nf-dispatch-modal { position: absolute; top: 60px; left: 50%; transform: translateX(-50%); width: 896px; min-height: 750px; display: flex; flex-direction: column; background: #fff; border-radius: 8px; padding: 0; color: #606266; }
.nf-dispatch-modal header { display: flex; align-items: center; justify-content: space-between; padding: 26px 27px 0; }
.nf-dispatch-modal h2 { font-size: 18px; font-weight: 500; color: #1d5f97; margin: 0; }
.nf-dispatch-modal header button { border: 0; background: none; font-size: 20px; color: #999; cursor: pointer; }
.nf-demo { margin: 6px 27px 36px; color: #9aa7b4; }
.nf-target { display: flex; gap: 120px; margin: 0 27px; padding: 16px 20px; background: #fafbfe; border: 1px solid #eef2f7; color: #30475f; }
.nf-dispatch-modal label { display: flex; align-items: center; gap: 18px; margin: 0 27px 14px; }
.nf-dispatch-modal label > span { width: 100px; text-align: right; flex-shrink: 0; color: #30475f; }
.nf-dispatch-modal label b { color: #f5222d; font-weight: 400; margin-left: 4px; }
.nf-dispatch-modal .nf-input-icon { position: relative; flex: 1; display: flex; align-items: center; }
.nf-dispatch-modal .nf-input-icon input { width: 100%; padding-right: 36px; }
.nf-dispatch-modal .nf-input-icon svg { position: absolute; right: 12px; top: 50%; width: 16px; height: 16px; margin-top: -8px; color: #1677ff; pointer-events: none; }
.nf-dispatch-modal input, .nf-dispatch-modal select, .nf-dispatch-modal textarea { height: 40px; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0 10px; color: #606266; font: inherit; background: #fff; flex: 1; }
.nf-dispatch-modal .nf-reason { align-items: flex-start; margin: 43px 27px 43px; }
.nf-reason > span { padding-top: 10px; }
.nf-reason textarea { height: 96px; padding: 10px; resize: vertical; }
.nf-row { display: flex; gap: 18px; }
.nf-dispatch-modal .nf-row label { flex: 1; margin-bottom: 33px; }
.nf-row em { font-style: normal; color: #9aa7b4; }
.nf-check { margin: 13px 27px 0; padding: 12px 16px; background: #fafbfe; border: 1px solid #eef2f7; }
.nf-check h4 { margin: 0 0 12px; font-size: 14px; color: #30475f; font-weight: 500; }
.nf-check p { margin: 4px 0; line-height: 24px; }
.nf-dispatch-modal footer { display: flex; justify-content: flex-end; gap: 22px; margin-top: auto; padding: 0 32px 20px; }
.nf-cancel { height: 40px; min-width: 98px; border: 1px solid #e4ebf5; border-radius: 20px; background: #fff; color: #606266; font: inherit; cursor: pointer; }
.nf-save { height: 40px; padding: 0 34px; border: 0; border-radius: 20px; background: #1681d7; color: #fff; font: inherit; cursor: pointer; }
@media (max-width: 1500px) {
  .nf-task-filters { flex-wrap: wrap; }
  .nf-card { margin-right: 20px; }
  .nf-table-scroll table { min-width: 1200px; }
}
</style>
