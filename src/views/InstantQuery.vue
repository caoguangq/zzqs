<template>
  <div class="page">
    <section class="filter-panel">
      <div class="filter-grid">
        <label class="field">
          <span class="field-label">任务名称</span>
          <el-input v-model="filters.taskName" placeholder="请输入任务名称..." clearable @keyup.enter="search" />
        </label>

        <label class="field">
          <span class="field-label">提交日期</span>
          <el-date-picker
            v-model="filters.submitDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请输入提交日期..."
            class="date-field"
          />
        </label>

        <label class="field">
          <span class="field-label">创建人</span>
          <el-input v-model="filters.creator" placeholder="请输入创建人..." clearable @keyup.enter="search" />
        </label>

        <label class="field">
          <span class="field-label">运行状态</span>
          <el-select v-model="filters.runState" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option v-for="state in runStates" :key="state" :label="state" :value="state" />
          </el-select>
        </label>

        <label class="field field-purpose">
          <span class="field-label">取数用途</span>
          <el-select v-model="filters.purpose" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option v-for="purpose in purposes" :key="purpose" :label="purpose" :value="purpose" />
          </el-select>
        </label>

        <div class="field-actions">
          <button type="button" class="search-btn" @click="search">
            <span>查询</span>
            <span class="search-icon">
              <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round">
                <circle cx="9" cy="9" r="5.2" />
                <path d="m13 13 4 4" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>

    <section class="card action-card">
      <div class="action-head">
        <h2 class="action-title">即时取数浏览</h2>
        <div class="action-buttons">
          <button type="button" class="pill-btn" @click="batchDelete">批量删除</button>
          <button type="button" class="pill-btn" @click="batchDownload">批量下载</button>
          <button type="button" class="pill-btn" @click="pushToFolder">推送AA文件夹</button>
          <button type="button" class="pill-btn primary" @click="shareData">共享数据查看</button>
        </div>
      </div>
      <p class="limit-tip">
        根据4A脱敏平台对要脱敏下载到本地的文件大小要求（csv最大支持300兆，Excel最大支持20兆），建议下载文件类型选择CSV，且文件大小不超过300M(20个字段约40万行记录，具体需要看各列数据的大小），如果文件<br />大小超出限制，将无法正常下载，建议拆分为多个取数任务
      </p>
    </section>

    <section class="card table-card">
      <div v-loading="loading" class="table-wrap">
        <table class="data-table">
          <colgroup>
            <col style="width: 1.5%" />
            <col style="width: 10.6%" />
            <col style="width: 3.5%" />
            <col style="width: 4.5%" />
            <col style="width: 4.5%" />
            <col style="width: 7.6%" />
            <col style="width: 7.6%" />
            <col style="width: 7.6%" />
            <col style="width: 3.8%" />
            <col style="width: 7.6%" />
            <col style="width: 20.4%" />
            <col style="width: 20.8%" />
          </colgroup>
          <thead>
            <tr>
              <th class="col-check">
                <input ref="selectAllRef" type="checkbox" class="table-checkbox" :checked="allSelected" @change="toggleAll" />
              </th>
              <th>任务名称</th>
              <th>运行状态</th>
              <th>创建者</th>
              <th>通知状态</th>
              <th>提交时间</th>
              <th>查询开始时间</th>
              <th>查询结束时间</th>
              <th>执行时间</th>
              <th>占用空间(M)</th>
              <th>失败原因</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td class="col-check">
                <input
                  type="checkbox"
                  class="table-checkbox"
                  :checked="selectedIds.includes(row.id)"
                  @change="toggleRow(row.id)"
                />
              </td>
              <td class="cell-task" :title="row.taskName">{{ row.taskName }}</td>
              <td :class="{ 'cell-run-fail': row.runState === '失败' }">{{ row.runState }}</td>
              <td>{{ row.creator }}</td>
              <td>{{ row.notifyState }}</td>
              <td>{{ row.submitTime }}</td>
              <td>{{ row.queryStartTime }}</td>
              <td>{{ row.queryEndTime }}</td>
              <td>{{ row.executeTime }}</td>
              <td>{{ row.occupySize }}</td>
              <td class="cell-fail">{{ row.failReason }}</td>
              <td class="cell-ops">
                <a class="op-link" @click="viewTask(row)">查看</a><span class="op-sep">/</span><a class="op-link" @click="rerunTask(row)">重跑</a><span class="op-sep">/</span><a class="op-link" @click="saveAsTask(row)">另存</a><span class="op-sep">/</span><a class="op-link" @click="deleteTask(row)">删除</a><span class="op-sep">/</span><a class="op-link" @click="editTask(row)">修改</a><span class="op-sep">/</span><a class="op-link" @click="lifecycleTask(row)">生命周期</a>
              </td>
            </tr>
            <tr v-if="!loading && !rows.length">
              <td colspan="12" class="empty-cell">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pager">
        <span class="pager-total">共 {{ total }} 条</span>
        <button type="button" class="pager-btn" :disabled="page <= 1" @click="goPage(page - 1)">
          <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12.5 4.5 7 10l5.5 5.5" />
          </svg>
        </button>
        <button
          v-for="number in pageNumbers"
          :key="number"
          type="button"
          class="pager-btn"
          :class="{ active: number === page }"
          @click="goPage(number)"
        >
          {{ number }}
        </button>
        <button type="button" class="pager-btn" :disabled="page >= pageCount" @click="goPage(page + 1)">
          <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="m7.5 4.5 5.5 5.5-5.5 5.5" />
          </svg>
        </button>
      </div>
    </section>

    <el-dialog v-model="detailVisible" title="任务详情" width="640px" class="detail-dialog">
      <div v-if="detailTask" class="detail-grid">
        <div class="detail-row"><span class="detail-label">任务名称：</span><span>{{ detailTask.taskName }}</span></div>
        <div class="detail-row"><span class="detail-label">运行状态：</span><span>{{ detailTask.runState }}</span></div>
        <div class="detail-row"><span class="detail-label">创建者：</span><span>{{ detailTask.creator }}</span></div>
        <div class="detail-row"><span class="detail-label">通知状态：</span><span>{{ detailTask.notifyState }}</span></div>
        <div class="detail-row"><span class="detail-label">提交时间：</span><span>{{ detailTask.submitTime }}</span></div>
        <div class="detail-row"><span class="detail-label">查询开始时间：</span><span>{{ detailTask.queryStartTime }}</span></div>
        <div class="detail-row"><span class="detail-label">查询结束时间：</span><span>{{ detailTask.queryEndTime }}</span></div>
        <div class="detail-row"><span class="detail-label">执行时间：</span><span>{{ detailTask.executeTime }}</span></div>
        <div class="detail-row"><span class="detail-label">占用空间(M)：</span><span>{{ detailTask.occupySize }}</span></div>
        <div class="detail-row"><span class="detail-label">失败原因：</span><span>{{ detailTask.failReason }}</span></div>
      </div>
      <template #footer>
        <button type="button" class="pill-btn" @click="detailVisible = false">关闭</button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const runStates = ['成功', '运行中', '失败']
const purposes = ['业务分析', '报表生成', '数据核查']

const filters = reactive({
  taskName: '',
  submitDate: '',
  creator: '',
  runState: '失败',
  purpose: ''
})

const rows = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const selectedIds = ref([])
const selectAllRef = ref(null)
const detailVisible = ref(false)
const detailTask = ref(null)

const pageCount = computed(() => Math.max(Math.ceil(total.value / pageSize.value), 1))
const pageNumbers = computed(() => Array.from({ length: pageCount.value }, (_, index) => index + 1))
const allSelected = computed(() => rows.value.length > 0 && rows.value.every((row) => selectedIds.value.includes(row.id)))
const partiallySelected = computed(() => !allSelected.value && rows.value.some((row) => selectedIds.value.includes(row.id)))

async function fetchList() {
  loading.value = true
  try {
    const params = new URLSearchParams({
      taskName: filters.taskName,
      submitDate: filters.submitDate || '',
      creator: filters.creator,
      runState: filters.runState,
      purpose: filters.purpose,
      page: String(page.value),
      pageSize: String(pageSize.value)
    })
    const response = await fetch(`/api/query/instant?${params.toString()}`)
    if (!response.ok) {
      throw new Error('查询失败')
    }
    const data = await response.json()
    rows.value = data.list || []
    total.value = data.total || 0
  } catch (error) {
    ElMessage.error('查询失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

function search() {
  page.value = 1
  selectedIds.value = []
  fetchList()
}

function goPage(number) {
  if (number < 1 || number > pageCount.value || number === page.value) {
    return
  }
  page.value = number
  fetchList()
}

function toggleRow(id) {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((item) => item !== id)
  } else {
    selectedIds.value = [...selectedIds.value, id]
  }
}

function toggleAll() {
  if (allSelected.value) {
    selectedIds.value = selectedIds.value.filter((id) => !rows.value.some((row) => row.id === id))
  } else {
    const merged = new Set(selectedIds.value)
    rows.value.forEach((row) => merged.add(row.id))
    selectedIds.value = [...merged]
  }
}

async function batchDelete() {
  if (!selectedIds.value.length) {
    ElMessage.warning('请勾选需要删除的任务！')
    return
  }
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 个任务吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
  } catch (error) {
    return
  }
  try {
    const response = await fetch('/api/query/instant', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds.value })
    })
    if (!response.ok) {
      throw new Error('删除失败')
    }
    ElMessage.success('删除成功')
    selectedIds.value = []
    await fetchList()
  } catch (error) {
    ElMessage.error('删除失败，请稍后重试')
  }
}

function batchDownload() {
  if (!selectedIds.value.length) {
    ElMessage.warning('请勾选需要下载的任务！')
    return
  }
  window.open(`/api/query/instant/download?ids=${encodeURIComponent(selectedIds.value.join(','))}`)
}

function pushToFolder() {
  if (!selectedIds.value.length) {
    ElMessage.warning('请勾选需要推送的任务！')
    return
  }
  ElMessage.info('暂不支持推送 AA 文件夹，请使用下载功能')
}

function shareData() {
  ElMessage.info('暂无共享数据')
}

function viewTask(row) {
  detailTask.value = row
  detailVisible.value = true
}

function rerunTask(row) {
  ElMessage.info(`任务「${row.taskName}」重跑功能未接入`)
}

function saveAsTask(row) {
  ElMessage.info(`任务「${row.taskName}」另存功能未接入`)
}

async function deleteTask(row) {
  try {
    await ElMessageBox.confirm(`确认删除任务「${row.taskName}」吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
  } catch (error) {
    return
  }
  try {
    const response = await fetch('/api/query/instant', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [row.id] })
    })
    if (!response.ok) {
      throw new Error('删除失败')
    }
    ElMessage.success('删除成功')
    selectedIds.value = selectedIds.value.filter((id) => id !== row.id)
    await fetchList()
  } catch (error) {
    ElMessage.error('删除失败，请稍后重试')
  }
}

function editTask(row) {
  ElMessage.info(`任务「${row.taskName}」修改功能未接入`)
}

function lifecycleTask(row) {
  ElMessage.info(`任务「${row.taskName}」生命周期功能未接入`)
}

watch([rows, selectedIds], () => {
  nextTick(() => {
    if (selectAllRef.value) {
      selectAllRef.value.indeterminate = partiallySelected.value
    }
  })
})

onMounted(fetchList)
</script>
