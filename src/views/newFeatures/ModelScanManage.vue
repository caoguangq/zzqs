<template>
  <div class="nf-page nf-page-compact">
    <div class="nf-toolbar nf-toolbar-top">
      <button type="button" class="nf-pill-btn" @click="createTask">
        新建任务
        <span class="nf-pill-icon">
          <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round">
            <path d="M10 4.5v11M4.5 10h11" />
          </svg>
        </span>
      </button>
    </div>

    <section class="nf-card">
      <div class="nf-table-wrap">
        <table class="nf-table">
          <colgroup>
            <col style="width: 21%" />
            <col style="width: 9%" />
            <col style="width: 12%" />
            <col style="width: 12%" />
            <col style="width: 9%" />
            <col style="width: 9%" />
            <col style="width: 12%" />
            <col style="width: 8%" />
            <col style="width: 8%" />
          </colgroup>
          <thead>
            <tr>
              <th>扫描任务ID</th>
              <th>操作人</th>
              <th>扫描开始时间</th>
              <th>扫描结束时间</th>
              <th>扫描模型数</th>
              <th>异常模型数</th>
              <th>结果时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in pageRows" :key="row.id">
              <td class="nf-cell-nowrap">{{ row.id }}</td>
              <td>{{ row.operator }}</td>
              <td class="nf-cell-nowrap">{{ row.startTime }}</td>
              <td class="nf-cell-nowrap">{{ row.endTime }}</td>
              <td>{{ row.modelCount }}</td>
              <td>{{ row.abnormalCount }}</td>
              <td class="nf-cell-nowrap">{{ row.resultTime }}</td>
              <td>{{ row.state }}</td>
              <td><a class="nf-link" @click="openView(row)">异常查看</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 31 异常数据查看 -->
    <el-dialog v-model="viewVisible" width="1020px" class="nf-dialog nf-wide-dialog" :show-close="true">
      <template #header>
        <span class="nf-dialog-center-title">异常数据查看</span>
      </template>

      <div class="nf-wide-row">
        <span class="nf-wide-label">模型来源：</span>
        <el-select v-model="viewForm.source" class="nf-wide-select">
          <el-option label="数据库直连" value="数据库直连" />
          <el-option label="模型抽取" value="模型抽取" />
        </el-select>
        <span class="nf-wide-label">模型表存储位置：</span>
        <el-input v-model="viewForm.location" class="nf-wide-input" />
        <span class="nf-wide-label">模型依赖数据库名称：</span>
        <el-input v-model="viewForm.database" class="nf-wide-input" />
        <button type="button" class="nf-btn nf-btn-primary nf-btn-sm2" @click="queryView">查询</button>
        <button type="button" class="nf-btn nf-btn-ghost nf-btn-sm2" @click="queryView">重置</button>
      </div>

      <p class="nf-current-query">
        当前查询： <a class="nf-link">{{ viewResult.path }}</a>
      </p>

      <table class="nf-table nf-detail-table">
        <colgroup>
          <col style="width: 33%" />
          <col style="width: 34%" />
          <col style="width: 33%" />
        </colgroup>
        <thead>
          <tr>
            <th>模型依赖库名称</th>
            <th>模型依赖表名称</th>
            <th>模型数据是否正常</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ viewForm.database }}</td>
            <td>{{ viewResult.tableName }}</td>
            <td>{{ viewResult.normal }}</td>
          </tr>
        </tbody>
      </table>

      <p class="nf-warn-banner">
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
          <circle cx="10" cy="10" r="9" fill="#fa8c16" />
          <path d="M10 5.2v6" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="10" cy="14.4" r="1" fill="#ffffff" />
        </svg>
        源表不存在，请模型配置人员或源表创建人员进行源表重建。
      </p>

      <div class="nf-dialog-counters">
        <span>共{{ viewResult.count }}条记录</span>
        <span>第 1/1页</span>
      </div>
    </el-dialog>

    <!-- 32 模型账期异常查询 -->
    <el-dialog v-model="periodVisible" width="1020px" class="nf-dialog nf-wide-dialog" :show-close="true">
      <template #header>
        <span class="nf-dialog-center-title">模型账期异常查询</span>
      </template>

      <div class="nf-period-row">
        <span class="nf-wide-label">账期名称</span>
        <el-select v-model="periodForm.name" class="nf-period-select">
          <el-option v-for="item in periodOptions" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
        <button type="button" class="nf-btn nf-btn-primary nf-btn-sm2" @click="queryPeriod">查询</button>
        <button type="button" class="nf-btn nf-btn-ghost nf-btn-sm2" @click="resetPeriod">重置</button>
      </div>

      <p class="nf-period-summary">
        是否存在账期异常： <b>是</b>
        <span class="nf-summary-gap">账期类型： <b>月账期</b></span>
        <span class="nf-summary-gap">账期时间： <b>{{ periodInfo.period }}</b></span>
      </p>

      <div class="nf-period-meta">
        <span>查询条件： 账期名称 = {{ periodForm.name }}</span>
        <span>数据来源： 模型账期信息汇总表</span>
      </div>

      <table class="nf-table nf-detail-table">
        <colgroup>
          <col style="width: 33%" />
          <col style="width: 34%" />
          <col style="width: 33%" />
        </colgroup>
        <thead>
          <tr>
            <th>账期维护人</th>
            <th>账期负责人</th>
            <th>账期更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in periodRows" :key="item.owner + item.time">
            <td>{{ item.maintainer }}</td>
            <td>{{ item.owner }}</td>
            <td class="nf-cell-nowrap">{{ item.time }}</td>
          </tr>
        </tbody>
      </table>

      <p class="nf-warn-banner">
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
          <circle cx="10" cy="10" r="9" fill="#fa8c16" />
          <path d="M10 5.2v6" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="10" cy="14.4" r="1" fill="#ffffff" />
        </svg>
        分区表无账期数据，请模型配置人员改用账期维表配置模型最大账期，禁止配置系统时间为该模型最大账期。
      </p>

      <div class="nf-dialog-counters">
        <span>共 10 条记录</span>
        <span>第 1/1 页　每次返回 10 条</span>
      </div>
    </el-dialog>
  <!-- 35 模型异常消息提醒 -->
    <el-dialog
      v-model="noticeVisible"
      width="1070px"
      class="nf-dialog nf-notice-dialog"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="nf-notice-head">
          <span class="nf-notice-title">模型异常消息提醒</span>
          <span class="nf-notice-sub">您有 5 条未读模型异常消息</span>
        </div>
      </template>

      <div class="nf-notice-body">
        <aside class="nf-notice-list">
          <p class="nf-notice-list-title">提醒名称</p>
          <div
            v-for="(item, index) in notices"
            :key="item.id"
            class="nf-notice-item"
            :class="{ active: index === noticeIndex }"
            @click="noticeIndex = index"
          >
            <span class="nf-notice-item-title">{{ item.title }}</span>
            <span class="nf-notice-item-model">模型：{{ item.model }}</span>
            <span class="nf-notice-item-time">{{ item.time }}</span>
          </div>
        </aside>

        <section class="nf-notice-detail">
          <p class="nf-notice-detail-title">提醒详情</p>

          <div class="nf-notice-field">
            <span class="nf-notice-label">提醒方式：</span>
            <span>{{ currentNotice.method }}</span>
          </div>
          <div class="nf-notice-field">
            <span class="nf-notice-label">提醒名称：</span>
            <span>{{ currentNotice.title }}</span>
          </div>
          <div class="nf-notice-field">
            <span class="nf-notice-label">提醒详情：</span>
            <span>{{ currentNotice.detail }}</span>
          </div>
          <div class="nf-notice-field">
            <span class="nf-notice-label">是否二次提醒：</span>
            <span>{{ currentNotice.again }}</span>
          </div>

          <div class="nf-notice-divider"></div>

          <div class="nf-notice-query">
            <span>查询条件： 提醒名称 = {{ currentNotice.title }}</span>
            <span>数据来源： 模型异常提醒记录表</span>
          </div>

          <table class="nf-table nf-notice-table">
            <colgroup>
              <col style="width: 35%" />
              <col style="width: 35%" />
              <col style="width: 30%" />
            </colgroup>
            <thead>
              <tr>
                <th>提醒内容维护人</th>
                <th>提醒人手机号</th>
                <th>提醒人账号</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ currentNotice.maintainer }}</td>
                <td>{{ currentNotice.phone }}</td>
                <td>{{ currentNotice.account }}</td>
              </tr>
            </tbody>
          </table>

          <div class="nf-notice-foot">
            <span>共 1 条记录</span>
            <span>第 1/1 页</span>
          </div>

          <div class="nf-notice-actions">
            <button type="button" class="nf-btn" @click="noticeVisible = false">关闭</button>
          </div>
        </section>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
/** 编号 31 = 模型元数据异常查询，32 = 模型账期异常查询 */
const featureNo = computed(() => Number(route.params.no) || 31)

const taskRows = [
  ['CHECK202503241737250434', '2025-03-03 15:22:18'],
  ['CHECK202503041400067270', '2025-03-03 15:35:02'],
  ['CHECK202503051636074950', '2025-03-03 15:29:31'],
  ['CHECK202503071536199071', '2025-03-03 15:33:52'],
  ['CHECK202503051125073170', '2025-03-03 15:22:18'],
  ['CHECK202503051036404190', '2025-03-03 15:40:09'],
  ['CHECK202503041958201240', '2025-03-03 15:35:02'],
  ['CHECK202503041958153550', '2025-03-03 14:40:09'],
  ['CHECK202503041933190570', '2025-03-03 15:22:18'],
  ['CHECK202503041638897050', '2025-03-03 15:35:02'],
  ['CHECK202503041442463810', '2025-03-03 14:40:09'],
  ['CHECK202503041400268880', '2025-03-03 15:22:18'],
  ['CHECK202503031651229730', '2025-03-03 15:35:02'],
  ['CHECK202503031648166850', '2025-03-03 15:40:09']
]

const rows = ref(
  taskRows.map(([id, start], index) => ({
    id,
    operator: 'admin管理员',
    startTime: start,
    endTime: `2025-03-03 15:${String(25 + (index % 12)).padStart(2, '0')}:${String(30 + (index % 25)).padStart(2, '0')}`,
    modelCount: String(333 + (index % 6)),
    abnormalCount: String(68 + (index % 3)),
    resultTime: `2025-03-03 15:${String(15 + (index % 20)).padStart(2, '0')}:${String(18 + (index % 30)).padStart(2, '0')}`,
    state: '已完成'
  }))
)

const pageRows = computed(() => rows.value)

const viewVisible = ref(false)
const viewForm = reactive({
  source: '数据库直连',
  location: 'store.T11052',
  database: 'MODEL_STORE'
})
const viewResult = reactive({
  path: '数据库直连 / MODEL_STORE / store.T11052',
  tableName: 'T11052',
  normal: '否（源表不存在）',
  count: 1
})

const periodVisible = ref(false)
const periodOptions = [
  { name: '2026年9月账期', period: '2026-09', month: '10' },
  { name: '2026年8月账期', period: '2026-08', month: '09' }
]
const periodForm = reactive({ name: '2026年9月账期' })
const periodInfo = reactive({ period: '2026-09' })
const owners = ['张明', '李华', '王芳', '赵强', '陈静', '刘洋', '周敏', '吴磊', '郑丽', '孙伟']
const maintainers = ['admin管理员', '1超级管理员', 'admin管理员', 'admin管理员', '1超级管理员', 'admin管理员', 'admin管理员', '1超级管理员', 'admin管理员', 'admin管理员']

const periodRows = computed(() => {
  const option = periodOptions.find((item) => item.name === periodForm.name) || periodOptions[0]
  return owners.map((owner, index) => ({
    maintainer: maintainers[index],
    owner,
    time: `${option.period}-${option.month} 09:${String(10 + index * 5).padStart(2, '0')}:00`
  }))
})

/* ---------- 35 模型异常消息提醒 ---------- */
const notices = ref([
  {
    id: 1,
    title: '模型结果表不存在',
    model: '全球疫情日新增确诊预测',
    time: '2026-09-21 09:14:27',
    method: '站内提醒',
    detail: '模型结果表未创建，请核查源表并安排重建。',
    again: '否',
    maintainer: '张伟',
    phone: '138****1024',
    account: 'zhangwei'
  },
  {
    id: 2,
    title: '数据源连接异常',
    model: '客户价值评估模型',
    time: '2026-09-21 09:27:13',
    method: '短信通知',
    detail: '数据源连接超时，请核查网络及数据库服务状态。',
    again: '是',
    maintainer: '李静',
    phone: '139****2068',
    account: 'lijing'
  },
  {
    id: 3,
    title: '模型字段结构异常',
    model: '用户级订单日期明细',
    time: '2026-09-21 10:03:45',
    method: '站内提醒',
    detail: '模型字段结构发生变化，请核查字段映射关系。',
    again: '否',
    maintainer: '王强',
    phone: '137****3089',
    account: 'wangqiang'
  },
  {
    id: 4,
    title: '模型任务连续执行失败',
    model: '累计降雨量预测',
    time: '2026-09-21 10:18:06',
    method: '短信通知',
    detail: '模型任务连续执行失败，请核查任务运行日志。',
    again: '是',
    maintainer: '张伟',
    phone: '138****1024',
    account: 'zhangwei'
  },
  {
    id: 5,
    title: '模型账期数据未更新',
    model: '平均气温预测',
    time: '2026-09-21 11:26:33',
    method: '站内提醒',
    detail: '模型账期数据未更新，请核查账期任务执行情况。',
    again: '否',
    maintainer: '李静',
    phone: '139****2068',
    account: 'lijing'
  }
])

const noticeVisible = ref(false)
const noticeIndex = ref(0)
const currentNotice = computed(() => notices.value[noticeIndex.value] || notices.value[0])

function openView() {
  viewVisible.value = true
}

function queryView() {
  if (!viewForm.location.trim()) {
    ElMessage.warning('请输入模型表存储位置')
    return
  }
  const tableName = viewForm.location.split('.').pop()
  viewResult.path = `${viewForm.source} / ${viewForm.database} / ${viewForm.location}`
  viewResult.tableName = tableName
}

function queryPeriod() {
  const option = periodOptions.find((item) => item.name === periodForm.name) || periodOptions[0]
  periodInfo.period = option.period
}

function resetPeriod() {
  periodForm.name = '2026年9月账期'
  queryPeriod()
}

function createTask() {
  ElMessage.info('新建任务功能未接入')
}

onMounted(() => {
  if (featureNo.value === 31) {
    viewVisible.value = true
  }
  if (featureNo.value === 32) {
    periodVisible.value = true
  }
  if (featureNo.value === 35) {
    noticeVisible.value = true
  }
})
</script>

<style scoped>
.nf-toolbar-top {
  padding: 0 0 12px;
}

.nf-dialog-center-title {
  display: block;
  color: #1f2329;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
}

.nf-wide-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}

.nf-wide-label {
  flex: none;
  color: #606266;
  font-size: 14px;
  white-space: nowrap;
}

.nf-wide-select {
  flex: none;
  width: 180px;
}

.nf-wide-input {
  flex: none;
  width: 150px;
}

.nf-btn-sm2 {
  height: 34px;
  min-width: 54px;
  padding: 0 12px;
  font-size: 14px;
}

.nf-current-query {
  margin: 0 0 16px;
  padding: 10px 16px;
  border-radius: 4px;
  background: #f0f7ff;
  color: #606266;
  font-size: 14px;
}

.nf-detail-table th {
  height: 36px;
}

.nf-detail-table td {
  height: 32px;
}

.nf-detail-table th,
.nf-detail-table td {
  font-size: 13px;
}

.nf-warn-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0 0;
  padding: 12px 16px;
  border: 1px solid #ffe0b2;
  border-radius: 4px;
  background: #fff8ec;
  color: #fa8c16;
  font-size: 14px;
  line-height: 22px;
}

.nf-dialog-counters {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 2px 4px;
  color: #606266;
  font-size: 14px;
}

.nf-period-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 22px;
}

.nf-period-select {
  width: 250px;
}

.nf-period-summary {
  display: flex;
  align-items: center;
  margin: 0 0 12px;
  color: #1f2329;
  font-size: 15px;
}

.nf-period-summary b {
  font-weight: 500;
}

.nf-summary-gap {
  margin-left: 90px;
}

.nf-period-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #606266;
  font-size: 14px;
}

:deep(.nf-dialog .el-dialog__body) {
  display: flex;
  flex-direction: column;
  min-height: 520px;
}

:deep(.nf-dialog .el-dialog__header) {
  padding: 16px 24px 14px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 36px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-select__wrapper.is-focused),
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1677ff inset;
}

/* ---------- 35 模型异常消息提醒 ---------- */
:global(.nf-notice-dialog) {
  margin-top: 74px;
  padding: 0;
}

:global(.nf-dialog.nf-notice-dialog .el-dialog__header) {
  padding: 22px 24px 21px;
}

:global(.nf-notice-dialog .el-dialog__body) {
  max-height: none;
  padding: 0;
}

.nf-notice-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.nf-notice-title {
  color: #1f2329;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
}

.nf-notice-sub {
  color: #909399;
  font-size: 13px;
  line-height: 18px;
}

.nf-notice-body {
  display: flex;
  align-items: stretch;
  min-height: 592px;
}

.nf-notice-list {
  flex: none;
  width: 420px;
  padding-top: 20px;
  border-right: 1px solid #ebeef5;
}

.nf-notice-list-title {
  margin: 0 0 13px 36px;
  color: #1f2329;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
}

.nf-notice-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 13px 20px 16px 46px;
  border-bottom: 1px solid #f2f3f5;
  cursor: pointer;
}

.nf-notice-item-title {
  color: #1f2329;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
}

.nf-notice-item-model,
.nf-notice-item-time {
  color: #909399;
  font-size: 13px;
  line-height: 18px;
}

.nf-notice-item.active {
  background: #f5f9ff;
}

.nf-notice-item.active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #1677ff;
}

.nf-notice-item.active .nf-notice-item-title {
  color: #1677ff;
}

.nf-notice-detail {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 24px 22px 32px;
}

.nf-notice-detail-title {
  margin: 0 0 21px;
  color: #1f2329;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
}

.nf-notice-field {
  display: flex;
  align-items: flex-start;
  padding: 12px 0 11px;
  border-bottom: 1px solid #f5f5f5;
  color: #1f2329;
  font-size: 14px;
  line-height: 22px;
}

.nf-notice-label {
  flex: none;
  width: 124px;
  color: #606266;
}

.nf-notice-divider {
  margin: 14px 0 25px;
  border-top: 1px solid #ebeef5;
}

.nf-notice-query {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  color: #606266;
  font-size: 13px;
  line-height: 20px;
}

.nf-notice-table th {
  height: 40px;
  padding-left: 19px;
  background: #fafafa;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}

.nf-notice-table td {
  height: 42px;
  padding-left: 19px;
  font-size: 14px;
  text-align: left;
}

.nf-notice-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 28px;
  color: #606266;
  font-size: 13px;
  line-height: 20px;
}

.nf-notice-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 32px;
}

.nf-notice-actions .nf-btn {
  min-width: 114px;
  height: 40px;
}
</style>