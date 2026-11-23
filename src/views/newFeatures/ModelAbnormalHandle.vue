<template>
  <div class="nf-page nf-handle-page">
    <section class="nf-card nf-handle-card">
      <h1 class="nf-handle-title">模型异常任务处理</h1>

      <div class="nf-handle-filter">
        <span class="nf-handle-flabel">任务编号</span>
        <el-input v-model="draft.taskNo" class="nf-handle-input" placeholder="请输入任务编号" />
        <span class="nf-handle-flabel">异常类型</span>
        <el-input v-model="draft.type" class="nf-handle-input" placeholder="请输入异常类型" />
        <span class="nf-handle-flabel">处理状态</span>
        <el-select v-model="draft.state" class="nf-handle-select">
          <el-option v-for="item in stateOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <span class="nf-handle-flabel">处理人</span>
        <el-select v-model="draft.handler" class="nf-handle-select">
          <el-option v-for="item in handlerOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <button type="button" class="nf-btn nf-btn-primary nf-handle-query" @click="doSearch">查询</button>
        <button type="button" class="nf-btn nf-handle-reset" @click="resetSearch">重置</button>
      </div>

      <div class="nf-table-wrap nf-handle-table-wrap">
        <table class="nf-table nf-handle-table">
          <colgroup>
            <col style="width: 12.32%" />
            <col style="width: 8.76%" />
            <col style="width: 15.26%" />
            <col style="width: 10.63%" />
            <col style="width: 7.69%" />
            <col style="width: 7.63%" />
            <col style="width: 13.57%" />
            <col style="width: 7.75%" />
            <col style="width: 16.39%" />
          </colgroup>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>异常模型ID</th>
              <th>模型名称</th>
              <th>异常类型</th>
              <th>优先级</th>
              <th>处理人</th>
              <th>要求完成时间</th>
              <th>处理状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pageRows" :key="row.id">
              <td class="nf-cell-nowrap">{{ row.taskNo }}</td>
              <td>{{ row.modelId }}</td>
              <td>{{ row.modelName }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.priority }}</td>
              <td>{{ row.handler }}</td>
              <td class="nf-cell-nowrap">{{ row.dueTime }}</td>
              <td>{{ row.state }}</td>
              <td class="nf-handle-ops">
                <template v-if="row.state === '待处理'">
                  <a class="nf-link" @click="openHandle(row)">开始处理</a>
                  <span class="nf-sep">/</span>
                  <a class="nf-link" @click="transfer(row)">转派</a>
                </template>
                <template v-else-if="row.state === '处理中'">
                  <a class="nf-link" @click="openHandle(row)">处理</a>
                  <span class="nf-sep">/</span>
                  <a class="nf-link" @click="transfer(row)">转派</a>
                </template>
                <template v-else-if="row.state === '已完成'">
                  <a class="nf-link" @click="openResult(row)">查看结果</a>
                </template>
                <span v-if="row.state !== '已关闭'" class="nf-sep">/</span>
                <a class="nf-link" @click="showDetail(row)">详情</a>
              </td>
            </tr>
            <tr v-if="!pageRows.length" class="nf-empty">
              <td colspan="9">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="nf-pager nf-handle-pager">
        <span class="nf-pager-total">共 {{ filteredRows.length }} 条记录</span>
        <div class="nf-pager-controls">
          <button type="button" class="nf-page-btn nf-page-arrow" :disabled="true">
            <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12.5 4.5 7 10l5.5 5.5" /></svg>
          </button>
          <button type="button" class="nf-page-btn active">1</button>
          <button type="button" class="nf-page-btn nf-page-arrow" :disabled="true">
            <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg>
          </button>
          <span class="nf-page-jump">跳至 <input v-model="jumpPage" class="nf-page-input" /> 页</span>
        </div>
      </div>
    </section>

    <!-- 处理 -->
    <el-dialog
      v-model="handleVisible"
      title="模型异常任务处理"
      width="764px"
      class="nf-dialog nf-handle-dialog"
      :close-on-click-modal="false"
    >
      <p class="nf-handle-band">任务信息</p>

      <div class="nf-handle-taskline">
        <span class="nf-handle-tlabel">任务编号：</span>
        <span class="nf-handle-tvalue">{{ target?.taskNo }}</span>
        <span class="nf-handle-tlabel2">异常模型ID：</span>
        <span>{{ target?.modelId }}</span>
      </div>

      <div class="nf-handle-field">
        <span class="nf-handle-field-label">任务名称<i>*</i>：</span>
        <div class="nf-handle-field-control">
          <el-input v-model="form.name" />
        </div>
      </div>

      <div class="nf-handle-field">
        <span class="nf-handle-field-label">任务处理时间<i>*</i>：</span>
        <div class="nf-handle-field-control">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="nf-handle-date"
            style="width: 100%"
          />
        </div>
      </div>

      <div class="nf-handle-field">
        <span class="nf-handle-field-label">任务所属模型<i>*</i>：</span>
        <div class="nf-handle-field-control">
          <el-select v-model="form.model" style="width: 100%">
            <el-option :label="target?.modelName || ''" :value="target?.modelName || ''" />
          </el-select>
        </div>
      </div>

      <div class="nf-handle-field">
        <span class="nf-handle-field-label">任务处理人<i>*</i>：</span>
        <div class="nf-handle-field-control">
          <el-input v-model="form.handler" />
        </div>
      </div>

      <p class="nf-handle-band nf-handle-band-gap">异常原因信息</p>

      <div class="nf-handle-field">
        <span class="nf-handle-field-label">关联异常原因：</span>
        <div class="nf-handle-field-control">
          <el-input v-model="form.reason" />
        </div>
      </div>

      <p v-if="formValid" class="nf-handle-valid">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <circle cx="10" cy="10" r="9" fill="#00b42a" />
          <path d="m6 10.3 2.7 2.7 5.3-5.5" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        必填项完整；处理时间格式正确；处理人与任务匹配。
      </p>

      <p class="nf-handle-hint">校验输入 → 关联异常任务 → 保存模型异常处理表 → 更新任务状态。</p>

      <template #footer>
        <div class="nf-dialog-footer">
          <button type="button" class="nf-btn nf-handle-cancel" @click="handleVisible = false">取消</button>
          <button type="button" class="nf-btn nf-btn-primary nf-handle-submit" @click="submitHandle">提交处理结果</button>
        </div>
      </template>
    </el-dialog>

    <!-- 处理结果 -->
    <el-dialog
      v-model="resultVisible"
      title="处理结果"
      width="490px"
      class="nf-dialog nf-handle-result-dialog"
      @closed="onResultClosed"
    >
      <div class="nf-handle-success">
        <svg viewBox="0 0 24 24" width="52" height="52" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill="#00b42a" />
          <path d="m7 12.3 3.2 3.2 6.4-6.6" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <p>处理结果提交成功。</p>
      </div>

      <table class="nf-kv-table nf-handle-kv">
        <tbody>
          <tr>
            <th>任务处理人：</th>
            <td>{{ resultInfo.handler }}</td>
          </tr>
          <tr>
            <th>任务处理理由：</th>
            <td>{{ resultInfo.reason }}</td>
          </tr>
          <tr>
            <th>任务处理时间：</th>
            <td>{{ resultInfo.time }}</td>
          </tr>
        </tbody>
      </table>

      <template #footer>
        <div class="nf-dialog-footer">
          <button type="button" class="nf-btn nf-btn-primary nf-handle-close" @click="resultVisible = false">关闭</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'

const stateOptions = ['全部', '待处理', '处理中', '已完成', '已关闭']
const handlerOptions = ['全部', '张伟', '李静', '王强']

const draft = reactive({
  taskNo: '',
  type: '',
  state: '全部',
  handler: '全部'
})

const applied = reactive({
  taskNo: '',
  type: '',
  state: '全部',
  handler: '全部'
})

const rows = ref([
  {
    id: 1,
    taskNo: 'TASK20260921001',
    modelId: 'T11052',
    modelName: '移动用户日新增规模预测',
    type: '数据表不存在',
    priority: '高',
    handler: '张伟',
    dueTime: '2026-09-22 18:00:00',
    state: '待处理',
    taskName: '源表缺失处理任务',
    handleTime: '2026-09-21 11:16:00',
    reason: '模型结果表创建脚本执行失败',
    result: null
  },
  {
    id: 2,
    taskNo: 'TASK20260921002',
    modelId: 'T113904',
    modelName: '移动客户价值评估模型',
    type: '数据源连接异常',
    priority: '高',
    handler: '李静',
    dueTime: '2026-09-22 18:30:00',
    state: '处理中',
    taskName: '数据源连接处理任务',
    handleTime: '2026-09-21 14:20:00',
    reason: '数据源连接超时',
    result: null
  },
  {
    id: 3,
    taskNo: 'TASK20260921003',
    modelId: 'T113565',
    modelName: '移动用户业务订购明细',
    type: '字段结构异常',
    priority: '中',
    handler: '王强',
    dueTime: '2026-09-23 12:00:00',
    state: '已完成',
    taskName: '字段结构修复任务',
    handleTime: '2026-09-22 10:12:00',
    reason: '字段结构已按源表同步修复',
    result: {
      handler: '王强',
      reason: '字段结构已按源表同步修复',
      time: '2026-09-22 10:12:00'
    }
  },
  {
    id: 4,
    taskNo: 'TASK20260921004',
    modelId: 'T11053',
    modelName: '基站流量趋势预测',
    type: '数据表不存在',
    priority: '中',
    handler: '张伟',
    dueTime: '2026-09-23 18:00:00',
    state: '已完成',
    taskName: '源表缺失处理任务',
    handleTime: '2026-09-22 16:40:00',
    reason: '模型结果表已重建',
    result: {
      handler: '张伟',
      reason: '模型结果表已重建',
      time: '2026-09-22 16:40:00'
    }
  },
  {
    id: 5,
    taskNo: 'TASK20260921005',
    modelId: 'T11054',
    modelName: '小区流量负荷预测',
    type: '数据源连接异常',
    priority: '低',
    handler: '李静',
    dueTime: '2026-09-24 12:00:00',
    state: '已关闭',
    taskName: '数据源连接处理任务',
    handleTime: '2026-09-24 09:30:00',
    reason: '数据源连接超时',
    result: null
  }
])

const filteredRows = computed(() =>
  rows.value.filter((row) => {
    if (applied.taskNo && !row.taskNo.includes(applied.taskNo.trim())) return false
    if (applied.type && !row.type.includes(applied.type.trim())) return false
    if (applied.state !== '全部' && row.state !== applied.state) return false
    if (applied.handler !== '全部' && row.handler !== applied.handler) return false
    return true
  })
)

const pageRows = computed(() => filteredRows.value)
const jumpPage = ref('1')

const handleVisible = ref(false)
const target = ref(null)
const form = reactive({
  name: '',
  time: '',
  model: '',
  handler: '',
  reason: ''
})

const formValid = computed(
  () => Boolean(form.name.trim()) && Boolean(form.time) && Boolean(form.model) && Boolean(form.handler.trim())
)

const resultVisible = ref(false)
const resultInfo = ref({ handler: '', reason: '', time: '' })
const justSubmitted = ref(false)

function doSearch() {
  applied.taskNo = draft.taskNo
  applied.type = draft.type
  applied.state = draft.state
  applied.handler = draft.handler
}

function resetSearch() {
  draft.taskNo = ''
  draft.type = ''
  draft.state = '全部'
  draft.handler = '全部'
  doSearch()
}

function openHandle(row) {
  target.value = row
  form.name = row.taskName
  form.time = row.handleTime
  form.model = row.modelName
  form.handler = row.handler
  form.reason = row.reason
  handleVisible.value = true
}

function submitHandle() {
  if (!formValid.value) {
    ElMessage.error('请填写必填项')
    return
  }

  const info = {
    handler: form.handler,
    reason: form.reason || '已处理',
    time: form.time
  }

  if (target.value) {
    target.value.state = '已完成'
    target.value.result = info
    target.value.reason = form.reason
    target.value.handleTime = form.time
  }

  resultInfo.value = info
  justSubmitted.value = true
  handleVisible.value = false
  resultVisible.value = true
}

function openResult(row) {
  resultInfo.value = row.result || { handler: row.handler, reason: row.reason, time: row.handleTime }
  justSubmitted.value = false
  resultVisible.value = true
}

function onResultClosed() {
  if (!justSubmitted.value) return
  justSubmitted.value = false
  ElNotification({
    title: '处理结果提交成功',
    type: 'success',
    offset: 64,
    duration: 3000,
    customClass: 'nf-handle-notice'
  })
}

function transfer(row) {
  ElMessage.info(`任务「${row.taskNo}」转派功能未接入`)
}

function showDetail(row) {
  ElMessage.info(
    `任务编号：${row.taskNo}；异常模型ID：${row.modelId}；模型名称：${row.modelName}；处理状态：${row.state}`
  )
}
</script>

<style scoped>
.nf-handle-page {
  margin-top: -7px;
  padding: 0;
}

.nf-handle-card {
  overflow: hidden;
}

.nf-handle-title {
  margin: 0;
  padding: 24px 24px 11px;
  border-bottom: 1px solid #ebeef5;
  color: #1f2329;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
}

/* ---------- 筛选 ---------- */
.nf-handle-filter {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 94px;
  padding: 0 24px;
}

.nf-handle-flabel {
  flex: none;
  color: #1f2329;
  font-size: 14px;
  white-space: nowrap;
}

.nf-handle-input {
  flex: none;
  width: 218px;
}

.nf-handle-select {
  flex: none;
  width: 231px;
}

.nf-handle-query {
  flex: none;
  min-width: 82px;
  height: 40px;
  padding: 0 18px;
}

.nf-handle-reset {
  flex: none;
  min-width: 92px;
  height: 40px;
  padding: 0 24px;
  margin-left: -12px;
}

/* ---------- 表格 ---------- */
.nf-handle-table-wrap {
  padding: 0 0 0 20px;
}

.nf-handle-table th,
.nf-handle-table td {
  text-align: left;
  padding-left: 20px;
  padding-right: 8px;
}

.nf-handle-table th {
  height: 49px;
  background: #ffffff;
  font-weight: 600;
  border-color: #ebeef5;
}

.nf-handle-table td {
  height: 46px;
  border-color: #ebeef5;
}

.nf-handle-ops {
  white-space: nowrap;
}

/* ---------- 分页 ---------- */
.nf-handle-pager {
  padding: 36px 24px 24px;
}

.nf-page-arrow {
  padding: 0 10px;
}

/* ---------- 处理弹窗 ---------- */
:global(.nf-handle-dialog) {
  margin-top: 80px;
  padding: 0;
}

:global(.nf-handle-dialog .el-dialog__header) {
  padding: 21px 24px 7px;
}

:global(.nf-handle-dialog .el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
}

:global(.nf-handle-dialog .el-dialog__body) {
  max-height: none;
  padding: 14px 25px 6px;
}

:global(.nf-handle-dialog .el-dialog__footer) {
  padding-bottom: 34px;
}

.nf-handle-band {
  margin: 0;
  height: 34px;
  padding-left: 15px;
  border-radius: 2px;
  background: #fafafa;
  color: #1f2329;
  font-size: 14px;
  font-weight: 600;
  line-height: 34px;
}

.nf-handle-band-gap {
  margin-top: 26px;
}

.nf-handle-taskline {
  display: flex;
  align-items: center;
  padding: 25px 0 0 15px;
  color: #606266;
  font-size: 14px;
  line-height: 22px;
}

.nf-handle-taskline b {
  color: #1f2329;
  font-weight: 400;
}

.nf-handle-tlabel {
  flex: none;
  width: 144px;
}

.nf-handle-tvalue {
  flex: none;
  width: 210px;
  color: #1f2329;
}

.nf-handle-tlabel2 {
  flex: none;
  width: 118px;
}

.nf-handle-field {
  display: flex;
  align-items: flex-start;
  margin-top: 20px;
  padding-left: 15px;
}

.nf-handle-taskline + .nf-handle-field {
  margin-top: 27px;
}

.nf-handle-band-gap + .nf-handle-field {
  margin-top: 26px;
}

.nf-handle-field-label {
  flex: none;
  width: 150px;
  padding-top: 8px;
  color: #606266;
  font-size: 14px;
  line-height: 20px;
}

.nf-handle-field-label i {
  margin: 0 2px 0 5px;
  color: #f5222d;
  font-style: normal;
}

.nf-handle-field-control {
  flex: 1;
  min-width: 0;
}

.nf-handle-valid {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 24px 0 0;
  padding: 9px 16px;
  border-radius: 4px;
  background: #f0f9eb;
  color: #00b42a;
  font-size: 14px;
  line-height: 22px;
}

.nf-handle-valid svg {
  flex: none;
}

.nf-handle-hint {
  margin: 20px 0 0;
  color: #606266;
  font-size: 13px;
  line-height: 20px;
}

.nf-handle-cancel {
  min-width: 97px;
  height: 40px;
}

.nf-handle-submit {
  min-width: 140px;
  height: 40px;
  padding: 0 20px;
}

:global(.nf-handle-dialog .nf-dialog-footer) {
  gap: 14px;
}

/* ---------- 结果弹窗 ---------- */
:global(.nf-handle-result-dialog) {
  margin-top: calc(50vh - 219px);
  padding: 0;
}

:global(.nf-handle-result-dialog .el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
}

.nf-handle-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin: 2px 0 6px;
}

.nf-handle-success p {
  margin: 0;
  color: #00b42a;
  font-size: 17px;
  line-height: 24px;
}

.nf-handle-kv th {
  width: 33%;
}

.nf-handle-kv th,
.nf-handle-kv td {
  padding: 5px 14px;
}

:global(.nf-handle-result-dialog .el-dialog__body) {
  min-height: 319px;
}

.nf-handle-close {
  min-width: 74px;
  height: 40px;
}

/* ---------- Element 控件尺寸 ---------- */
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 40px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:global(.nf-handle-dialog .el-input__wrapper),
:global(.nf-handle-dialog .el-select__wrapper),
:global(.nf-handle-dialog .el-date-editor .el-input__wrapper) {
  min-height: 36px;
  border-radius: 4px;
}

:global(.nf-handle-dialog .nf-handle-date .el-input__prefix) {
  display: none;
}

:global(.nf-handle-dialog .nf-handle-date .el-input__wrapper) {
  padding-right: 34px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23606666' stroke-width='1.4'%3E%3Crect x='3' y='4.5' width='14' height='12' rx='1.5'/%3E%3Cpath d='M3 8h14M6.5 3v3M13.5 3v3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
}

:deep(.el-select__wrapper.is-focused),
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1677ff inset;
}

:global(.el-notification.nf-handle-notice) {
  width: 284px;
}

:global(.el-notification.nf-handle-notice .el-notification__title) {
  font-size: 14px;
  font-weight: 500;
}
</style>