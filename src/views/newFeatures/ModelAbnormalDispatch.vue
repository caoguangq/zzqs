<template>
  <div class="nf-page nf-page-compact">
    <h1 class="nf-page-title">模型异常任务派发</h1>

    <div class="nf-abn-filter">
      <span class="nf-abn-label">异常类型</span>
      <el-select v-model="abnormalType" class="nf-abn-select">
        <el-option label="数据表不存在" value="数据表不存在" />
        <el-option label="字段缺失" value="字段缺失" />
      </el-select>
      <button type="button" class="nf-btn nf-btn-primary nf-btn-query" @click="doSearch">查询</button>
    </div>

    <section class="nf-card">
      <div class="nf-table-wrap">
        <table class="nf-table nf-abn-table">
          <colgroup>
            <col style="width: 13.5%" />
            <col style="width: 11.5%" />
            <col style="width: 17%" />
            <col style="width: 11%" />
            <col style="width: 12.5%" />
            <col style="width: 15%" />
            <col style="width: 9.5%" />
            <col style="width: 10%" />
          </colgroup>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>异常模型ID</th>
              <th>模型名称</th>
              <th>异常类型</th>
              <th>异常原因</th>
              <th>发现时间</th>
              <th>派发状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in visibleRows" :key="row.id">
              <td class="nf-cell-nowrap">{{ row.taskNo }}</td>
              <td>{{ row.modelId }}</td>
              <td>{{ row.modelName }}</td>
              <td>{{ row.type }}</td>
              <td>{{ row.reason }}</td>
              <td class="nf-cell-nowrap">{{ row.foundTime }}</td>
              <td>{{ row.state }}</td>
              <td>
                <a v-if="row.state === '待派发'" class="nf-link" @click="openDispatch(row)">派发</a>
                <a v-else class="nf-link" @click="viewTask(row)">查看</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="nf-pager">
        <span class="nf-pager-total">共 10 条记录</span>
        <div class="nf-pager-controls">
          <button type="button" class="nf-page-btn nf-page-arrow" :disabled="true">
            <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12.5 4.5 7 10l5.5 5.5" /></svg>
          </button>
          <button type="button" class="nf-page-btn active">1</button>
          <button type="button" class="nf-page-btn nf-page-arrow" :disabled="true">
            <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg>
          </button>
        </div>
      </div>
    </section>

    <!-- 派发 -->
    <el-dialog v-model="dispatchVisible" title="模型异常任务派发" width="775px" class="nf-dialog" :close-on-click-modal="false">
      <div class="nf-dispatch-banner">
        <span>任务编号： <b>{{ dispatchTarget?.taskNo }}</b></span>
        <span>异常模型ID： <b>{{ dispatchTarget?.modelId }}</b></span>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label">任务名称<i class="nf-star">*</i></span>
        <div class="nf-form-control">
          <el-input v-model="dispatchForm.name" />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label">任务派发时间<i class="nf-star">*</i></span>
        <div class="nf-form-control">
          <el-date-picker
            v-model="dispatchForm.time"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            class="nf-form-date"
            style="width: 100%"
          />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label">任务所属模型<i class="nf-star">*</i></span>
        <div class="nf-form-control">
          <el-select v-model="dispatchForm.model" style="width: 100%">
            <el-option :label="dispatchTarget?.modelName || ''" :value="dispatchTarget?.modelName || ''" />
          </el-select>
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label">任务派发人<i class="nf-star">*</i></span>
        <div class="nf-form-control">
          <el-input v-model="dispatchForm.dispatcher" />
        </div>
      </div>

      <p class="nf-readonly-line"><span>运维处理人：</span>{{ handlers }}</p>
      <p class="nf-readonly-line"><span>当前异常：</span>{{ dispatchTarget?.reason }}</p>

      <p class="nf-form-valid nf-form-valid-inline">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#00b42a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="10" cy="10" r="8" />
          <path d="m6.4 10.2 2.4 2.4 4.8-5" />
        </svg>
        必填项完整；所属模型有效；派发人身份校验通过。
      </p>

      <template #footer>
        <div class="nf-dialog-footer">
          <button type="button" class="nf-btn" @click="dispatchVisible = false">取消</button>
          <button type="button" class="nf-btn nf-btn-primary" @click="confirmDispatch">确认派发</button>
        </div>
      </template>
    </el-dialog>

    <!-- 派发结果 -->
    <el-dialog v-model="resultVisible" title="派发结果" width="490px" class="nf-dialog">
      <div class="nf-dispatch-success">
        <svg viewBox="0 0 24 24" width="56" height="56" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill="#00b42a" />
          <path d="m7 12.3 3.2 3.2 6.4-6.6" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="nf-dispatch-success-text">派发成功</span>
      </div>

      <table class="nf-kv-table">
        <tbody>
          <tr>
            <th>任务派发人：</th>
            <td>{{ resultInfo.dispatcher }}</td>
          </tr>
          <tr>
            <th>任务派发理由：</th>
            <td>{{ resultInfo.reason }}</td>
          </tr>
          <tr>
            <th>任务派发时间：</th>
            <td>{{ resultInfo.time }}</td>
          </tr>
        </tbody>
      </table>

      <template #footer>
        <div class="nf-dialog-footer">
          <button type="button" class="nf-btn nf-btn-primary" @click="resultVisible = false">关闭</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const abnormalType = ref('数据表不存在')
const appliedType = ref('数据表不存在')

const handlers = '张伟（数据模型组）'

const rows = ref([
  { id: 1, taskNo: 'TASK20260921001', modelId: 'T11052', modelName: '移动用户日新增规模预测', type: '数据表不存在', reason: '模型结果表未创建', foundTime: '2026-09-21 09:12:35', state: '待派发' },
  { id: 2, taskNo: 'TASK20260921002', modelId: 'T113904', modelName: '移动客户价值评估模型', type: '数据表不存在', reason: '目标数据表已删除', foundTime: '2026-09-21 09:28:17', state: '已派发' },
  { id: 3, taskNo: 'TASK20260921003', modelId: 'T113565', modelName: '移动用户业务订购明细', type: '数据表不存在', reason: '发布表结构不存在', foundTime: '2026-09-21 10:05:26', state: '待派发' },
  { id: 4, taskNo: 'TASK20260921004', modelId: 'T11053', modelName: '基站流量趋势预测', type: '数据表不存在', reason: '模型映射表缺失', foundTime: '2026-09-21 10:18:43', state: '已派发' },
  { id: 5, taskNo: 'TASK20260921005', modelId: 'T11054', modelName: '小区流量负荷预测', type: '数据表不存在', reason: '模型结果表未创建', foundTime: '2026-09-21 11:07:59', state: '待派发' },
  { id: 6, taskNo: 'TASK20260921006', modelId: 'T11068', modelName: '移动月度经营分析模型', type: '数据表不存在', reason: '目标数据表已删除', foundTime: '2026-09-21 11:26:31', state: '已派发' },
  { id: 7, taskNo: 'TASK20260921007', modelId: 'T10684', modelName: '移动产品收入汇总模型', type: '数据表不存在', reason: '发布表结构不存在', foundTime: '2026-09-21 13:14:05', state: '待派发' },
  { id: 8, taskNo: 'TASK20260921008', modelId: 'T111060', modelName: '移动渠道运营统计模型', type: '数据表不存在', reason: '模型映射表缺失', foundTime: '2026-09-21 14:37:22', state: '已派发' },
  { id: 9, taskNo: 'TASK20260921009', modelId: 'T111063', modelName: '移动用户欠费风险预测', type: '数据表不存在', reason: '模型结果表未创建', foundTime: '2026-09-21 15:09:18', state: '待派发' },
  { id: 10, taskNo: 'TASK20260921010', modelId: 'T113570', modelName: '移动客户流失预警模型', type: '数据表不存在', reason: '目标数据表已删除', foundTime: '2026-09-21 16:21:37', state: '已派发' }
])

const visibleRows = computed(() => rows.value.filter((row) => row.type === appliedType.value))

const dispatchVisible = ref(false)
const dispatchTarget = ref(null)
const dispatchForm = reactive({
  name: '',
  time: '',
  model: '',
  dispatcher: 'admin管理员'
})

const resultVisible = ref(false)
const resultInfo = ref({ dispatcher: '', reason: '', time: '' })

function doSearch() {
  appliedType.value = abnormalType.value
}

function openDispatch(row) {
  dispatchTarget.value = row
  dispatchForm.name = '源表缺失处理任务'
  dispatchForm.time = '2026-09-21 09:30:00'
  dispatchForm.model = row.modelName
  dispatchForm.dispatcher = 'admin管理员'
  dispatchVisible.value = true
}

function confirmDispatch() {
  if (!dispatchForm.name.trim() || !dispatchForm.time || !dispatchForm.model || !dispatchForm.dispatcher.trim()) {
    ElMessage.error('请填写必填项')
    return
  }

  resultInfo.value = {
    dispatcher: dispatchForm.dispatcher,
    reason: `${dispatchTarget.value?.reason || ''}，需运维人员核查并重建源表。`,
    time: dispatchForm.time
  }

  if (dispatchTarget.value) {
    dispatchTarget.value.state = '已派发'
  }

  dispatchVisible.value = false
  resultVisible.value = true
}

function viewTask(row) {
  ElMessage.info(`任务「${row.taskNo}」已派发，处理人为${handlers}`)
}
</script>

<style scoped>
.nf-page-title {
  margin: 0 0 24px;
  color: #1f2329;
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;
}

.nf-abn-filter {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 22px;
}

.nf-abn-label {
  color: #1f2329;
  font-size: 15px;
}

.nf-abn-select {
  width: 268px;
}

.nf-btn-query {
  height: 40px;
  min-width: 86px;
  border-radius: 4px;
}

.nf-abn-table th {
  height: 48px;
}

.nf-abn-table td {
  height: 59px;
}

.nf-page-arrow {
  padding: 0 10px;
}

.nf-dispatch-banner {
  display: flex;
  align-items: center;
  gap: 90px;
  margin-bottom: 22px;
  padding: 14px 18px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  color: #606266;
  font-size: 14px;
}

.nf-dispatch-banner b {
  color: #1f2329;
  font-weight: 500;
}

.nf-star {
  margin-left: 4px;
  color: #f5222d;
  font-style: normal;
}

.nf-readonly-line {
  margin: 8px 0;
  color: #1f2329;
  font-size: 14px;
  line-height: 24px;
}

.nf-readonly-line span {
  color: #606266;
}

.nf-form-valid-inline {
  margin-left: 0;
  margin-top: 16px;
}

.nf-dispatch-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 6px 0 20px;
}

.nf-dispatch-success-text {
  color: #1f2329;
  font-size: 18px;
  font-weight: 700;
}

:deep(.nf-form-label) {
  width: 112px;
  white-space: nowrap;
}

:deep(.el-select__wrapper),
:deep(.el-input__wrapper) {
  min-height: 36px;
  border-radius: 4px;
}
</style>