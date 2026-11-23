<template>
  <div class="nf-page">
    <!-- 修改结果页（编号 27 保存后展示） -->
    <template v-if="resultVisible">
      <h1 class="nf-result-title">模型历史版本修改结果</h1>
      <section class="nf-card">
        <h2 class="nf-result-card-title">修改结果</h2>
        <p class="nf-result-version">
          当前版本： <a class="nf-link">{{ resultInfo.version }}</a>
        </p>
        <div class="nf-table-wrap">
          <table class="nf-table">
            <colgroup>
              <col style="width: 20%" />
              <col style="width: 22%" />
              <col style="width: 58%" />
            </colgroup>
            <thead>
              <tr>
                <th>修改模型名称</th>
                <th>修改模型编码</th>
                <th>修改模型说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ resultInfo.modelName }}</td>
                <td>{{ resultInfo.modelCode }}</td>
                <td class="nf-cell-left">{{ resultInfo.opinion }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="nf-result-foot">
          <span class="nf-result-count">本次修改1条记录</span>
          <button type="button" class="nf-btn nf-btn-primary" @click="backToList">返回列表</button>
        </div>
      </section>
    </template>

    <!-- 列表 -->
    <template v-else>
      <p class="nf-section-label">过滤条件</p>

      <section class="nf-card">
        <div class="nf-filter-row">
          <span class="nf-filter-label">模型名称</span>
          <el-select v-model="draftModel" class="nf-filter-control" placeholder="请选择模型名称">
            <el-option v-for="model in models" :key="model.code" :label="model.name" :value="model.name" />
          </el-select>
          <button type="button" class="nf-btn nf-btn-primary" @click="doSearch">
            <svg class="nf-btn-icon" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <circle cx="9" cy="9" r="5.4" />
              <path d="m13 13 4 4" />
            </svg>
            查询
          </button>
          <button type="button" class="nf-btn" @click="resetSearch">重置</button>
        </div>

        <div class="nf-filter-row">
          <span class="nf-filter-label">排序方式</span>
          <span
            v-for="option in sortOptions"
            :key="option"
            class="nf-sort-link"
            :class="{ active: sortBy === option }"
            @click="sortBy = option"
          >
            {{ option }}
          </span>
        </div>
      </section>

      <section class="nf-card">
        <div class="nf-card-head">
          <h2 class="nf-card-title">模型历史版本管理</h2>
          <div class="nf-card-actions">
            <button type="button" class="nf-btn nf-btn-primary" @click="openCreate">
              <span class="nf-btn-icon">+</span>新增版本
            </button>
            <button type="button" class="nf-view-toggle active" title="列表视图">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M3 5h14M3 10h14M3 15h9" />
              </svg>
            </button>
            <button type="button" class="nf-view-toggle" title="卡片视图">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <rect x="3" y="3" width="6" height="6" rx="1" />
                <rect x="11" y="3" width="6" height="6" rx="1" />
                <rect x="3" y="11" width="6" height="6" rx="1" />
                <rect x="11" y="11" width="6" height="6" rx="1" />
              </svg>
            </button>
          </div>
        </div>

        <p class="nf-query-line">
          查询条件：<a class="nf-link" @click="doSearch">模型名称 = {{ appliedModel }}</a>
        </p>
        <p class="nf-meta-line">
          <span>查询主数据：MODEL_INFO（模型信息表）</span>
          <span>结果数据：MODEL_VERSION_HISTORY（模型历史版本表）</span>
        </p>

        <div class="nf-table-wrap">
          <table class="nf-table">
            <colgroup>
              <col style="width: 3.7%" />
              <col style="width: 14.4%" />
              <col style="width: 8.9%" />
              <col style="width: 19.2%" />
              <col style="width: 12.6%" />
              <col style="width: 15.3%" />
              <col style="width: 11.9%" />
              <col style="width: 14%" />
            </colgroup>
            <thead>
              <tr>
                <th class="nf-col-check">
                  <input type="checkbox" class="nf-checkbox" :checked="allSelected" @change="toggleAll" />
                </th>
                <th>模型名称</th>
                <th>版本号</th>
                <th>版本说明</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th>发布状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pageRows" :key="row.id">
                <td class="nf-col-check">
                  <input
                    type="checkbox"
                    class="nf-checkbox"
                    :checked="selectedIds.includes(row.id)"
                    @change="toggleRow(row.id)"
                  />
                </td>
                <td><a class="nf-link">{{ row.modelName }}</a></td>
                <td>{{ row.version }}</td>
                <td>{{ row.reason }}</td>
                <td>{{ row.creator }}</td>
                <td class="nf-cell-nowrap">{{ row.createTime }}</td>
                <td>{{ row.state }}</td>
                <td class="nf-ops">
                  <a class="nf-link" @click="viewRow(row)">查看</a><span class="nf-sep">/</span><a class="nf-link" @click="openEdit(row)">修改</a><span class="nf-sep">/</span><a class="nf-link" @click="removeRow(row)">删除</a>
                </td>
              </tr>
              <tr v-if="!filteredRows.length" class="nf-empty">
                <td colspan="8">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="nf-pager">
          <span class="nf-pager-total">共 {{ filteredRows.length }} 条记录</span>
          <div class="nf-pager-controls">
            <button type="button" class="nf-page-btn" :disabled="page <= 1" @click="goPage(page - 1)">上一页</button>
            <button
              v-for="number in pageCount"
              :key="number"
              type="button"
              class="nf-page-btn"
              :class="{ active: number === page }"
              @click="goPage(number)"
            >
              {{ number }}
            </button>
            <button type="button" class="nf-page-btn" :disabled="page >= pageCount" @click="goPage(page + 1)">下一页</button>
            <span class="nf-page-jump">
              前往 <input v-model="jumpPage" class="nf-page-input" @keyup.enter="jumpToPage" /> 页
            </span>
            <button type="button" class="nf-btn nf-btn-primary nf-btn-sm" @click="jumpToPage">确定</button>
          </div>
        </div>
      </section>
    </template>

    <!-- 新增版本 -->
    <el-dialog v-model="formVisible" title="新增模型历史版本" width="620px" class="nf-dialog" :close-on-click-modal="false">
      <div class="nf-form-banner">
        当前模型： <b>{{ formModel.name }}（{{ formModel.code }}）</b>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label required">模型新增时间</span>
        <div class="nf-form-control">
          <el-date-picker
            v-model="form.createTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择时间"
            class="nf-form-date"
            style="width: 100%"
          />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label required">操作人</span>
        <div class="nf-form-control">
          <el-input v-model="form.creator" disabled />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label required">新增理由</span>
        <div class="nf-form-control">
          <el-input v-model="form.reason" type="textarea" :rows="3" placeholder="请填写新增理由" />
        </div>
      </div>

      <p v-if="formValid" class="nf-form-valid">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#00b42a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="10" cy="10" r="8" />
          <path d="m6.4 10.2 2.4 2.4 4.8-5" />
        </svg>
        必填项完整；时间格式正确；操作人有效。
      </p>

      <template #footer>
        <div class="nf-dialog-footer">
          <button type="button" class="nf-btn" @click="formVisible = false">取消</button>
          <button type="button" class="nf-btn nf-btn-primary" @click="submitCreate">保存</button>
        </div>
      </template>
    </el-dialog>

    <!-- 修改版本 -->
    <el-dialog v-model="editVisible" title="修改模型历史版本" width="650px" class="nf-dialog" :close-on-click-modal="false">
      <div class="nf-form-banner">
        当前模型： <b>{{ editTarget?.modelName }}（{{ editTarget?.modelCode }}）</b>
        <span class="nf-banner-sep">|</span>
        版本： <b>{{ editTarget?.version }}</b>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label required">修改时间</span>
        <div class="nf-form-control">
          <el-date-picker
            v-model="editForm.modifyTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择时间"
            class="nf-form-date"
            style="width: 100%"
          />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label required">修改理由</span>
        <div class="nf-form-control">
          <el-input v-model="editForm.reason" placeholder="请填写修改理由" />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label required">修改意见</span>
        <div class="nf-form-control">
          <el-input v-model="editForm.opinion" type="textarea" :rows="4" placeholder="请填写修改意见" />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label required">修改人名称</span>
        <div class="nf-form-control">
          <el-input v-model="editForm.modifier" placeholder="请输入修改人名称" />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label required">修改人编码</span>
        <div class="nf-form-control">
          <el-input v-model="editForm.modifierCode" placeholder="请输入修改人编码" />
        </div>
      </div>

      <p v-if="editValid" class="nf-form-valid">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#00b42a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="10" cy="10" r="8" />
          <path d="m6.4 10.2 2.4 2.4 4.8-5" />
        </svg>
        必填项完整；时间格式正确；修改人名称与编码匹配。
      </p>

      <template #footer>
        <div class="nf-dialog-footer">
          <button type="button" class="nf-btn" @click="editVisible = false">取消</button>
          <button type="button" class="nf-btn nf-btn-primary" @click="submitEdit">保存修改</button>
        </div>
      </template>
    </el-dialog>

    <!-- 删除版本 -->
    <el-dialog v-model="deleteVisible" title="删除模型历史版本" width="620px" class="nf-dialog" :close-on-click-modal="false">
      <div class="nf-form-banner">
        当前模型： <b>{{ deleteTarget?.modelName }}</b>
        <span class="nf-banner-sep">|</span>
        版本： <b>{{ deleteTarget?.version }}</b>
      </div>

      <p class="nf-warn-line">
        <svg viewBox="0 0 20 20" width="22" height="22" aria-hidden="true">
          <circle cx="10" cy="10" r="9" fill="#fa8c16" />
          <path d="M10 5.2v6" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="10" cy="14.4" r="1" fill="#ffffff" />
        </svg>
        确认删除该历史版本？
      </p>

      <div class="nf-form-row">
        <span class="nf-form-label">删除时间</span>
        <div class="nf-form-control">
          <el-date-picker
            v-model="deleteForm.time"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择时间"
            class="nf-form-date"
            style="width: 100%"
          />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label">删除人</span>
        <div class="nf-form-control">
          <el-input v-model="deleteForm.operator" placeholder="请输入删除人" />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label">删除理由</span>
        <div class="nf-form-control">
          <el-input v-model="deleteForm.reason" type="textarea" :rows="3" placeholder="请填写删除理由" />
        </div>
      </div>

      <div class="nf-form-row">
        <span class="nf-form-label">删除次数</span>
        <div class="nf-form-control">
          <el-input-number v-model="deleteForm.count" :min="1" :max="99" controls-position="right" style="width: 100%" />
        </div>
      </div>

      <p v-if="deleteValid" class="nf-form-valid">
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#00b42a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="10" cy="10" r="8" />
          <path d="m6.4 10.2 2.4 2.4 4.8-5" />
        </svg>
        必填项完整；删除次数为正整数；该版本无运行中引用任务。
      </p>

      <template #footer>
        <div class="nf-dialog-footer">
          <button type="button" class="nf-btn" @click="deleteVisible = false">取消</button>
          <button type="button" class="nf-btn nf-btn-primary" @click="confirmDelete">确认删除</button>
        </div>
      </template>
    </el-dialog>

    <!-- 删除结果 -->
    <el-dialog v-model="deleteResultVisible" title="删除结果" width="560px" class="nf-dialog">
      <div class="nf-success-head">
        <svg viewBox="0 0 24 24" width="42" height="42" aria-hidden="true">
          <circle cx="12" cy="12" r="11" fill="#00b42a" />
          <path d="m7 12.3 3.2 3.2 6.4-6.6" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="nf-success-title">删除成功</span>
      </div>

      <table class="nf-kv-table">
        <tbody>
          <tr>
            <th>删除版本名称：</th>
            <td>{{ deleteResult.name }}</td>
          </tr>
          <tr>
            <th>删除人：</th>
            <td>{{ deleteResult.operator }}</td>
          </tr>
          <tr>
            <th>删除时间：</th>
            <td>{{ deleteResult.time }}</td>
          </tr>
          <tr>
            <th>删除理由：</th>
            <td>{{ deleteResult.reason }}</td>
          </tr>
        </tbody>
      </table>

      <template #footer>
        <div class="nf-dialog-footer">
          <button type="button" class="nf-btn nf-btn-primary" @click="closeDeleteResult">关闭</button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog v-model="detailVisible" title="模型历史版本详情" width="620px" class="nf-dialog">
      <div v-if="detailRow" class="nf-desc-grid">
        <div class="nf-desc-row"><span class="nf-desc-label">模型名称：</span>{{ detailRow.modelName }}</div>
        <div class="nf-desc-row"><span class="nf-desc-label">模型编码：</span>{{ detailRow.modelCode }}</div>
        <div class="nf-desc-row"><span class="nf-desc-label">版本号：</span>{{ detailRow.version }}</div>
        <div class="nf-desc-row"><span class="nf-desc-label">发布状态：</span>{{ detailRow.state }}</div>
        <div class="nf-desc-row"><span class="nf-desc-label">创建人：</span>{{ detailRow.creator }}</div>
        <div class="nf-desc-row"><span class="nf-desc-label">创建时间：</span>{{ detailRow.createTime }}</div>
        <div class="nf-desc-row" style="grid-column: 1 / -1">
          <span class="nf-desc-label">版本说明：</span>{{ detailRow.reason }}
        </div>
      </div>
      <template #footer>
        <div class="nf-dialog-footer">
          <button type="button" class="nf-btn" @click="detailVisible = false">关闭</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const models = [
  { name: '数据分享信息表', code: 'MODEL_SHARE_001' },
  { name: '用户基础信息表', code: 'MODEL_USER_002' },
  { name: '客户价值评估表', code: 'MODEL_CUST_003' }
]

const sortOptions = ['版本号', '最近更新时间', '创建时间']

const defaultModelName = '数据分享信息表'

const versions = ref([
  {
    id: 'v-share-5',
    modelName: '数据分享信息表',
    modelCode: 'MODEL_SHARE_001',
    version: 'V5.0',
    reason: '增加共享有效期与访问范围字段',
    creator: 'admin管理员',
    createTime: '2026-09-20 10:25:18',
    state: '当前版本'
  },
  {
    id: 'v-share-4',
    modelName: '数据分享信息表',
    modelCode: 'MODEL_SHARE_001',
    version: 'V4.0',
    reason: '优化数据授权关系结构',
    creator: '1超级管理员',
    createTime: '2026-08-20 15:16:42',
    state: '历史版本'
  },
  {
    id: 'v-share-3',
    modelName: '数据分享信息表',
    modelCode: 'MODEL_SHARE_001',
    version: 'V3.0',
    reason: '增加共享申请编码字段',
    creator: 'admin管理员',
    createTime: '2026-07-22 09:48:30',
    state: '历史版本'
  },
  {
    id: 'v-share-2',
    modelName: '数据分享信息表',
    modelCode: 'MODEL_SHARE_001',
    version: 'V2.0',
    reason: '调整数据目录关联方式',
    creator: '1超级管理员',
    createTime: '2026-06-16 14:05:27',
    state: '历史版本'
  },
  {
    id: 'v-share-1',
    modelName: '数据分享信息表',
    modelCode: 'MODEL_SHARE_001',
    version: 'V1.0',
    reason: '初始版本',
    creator: 'admin管理员',
    createTime: '2026-05-12 11:32:09',
    state: '历史版本'
  },
  {
    id: 'v-user-2',
    modelName: '用户基础信息表',
    modelCode: 'MODEL_USER_002',
    version: 'V2.0',
    reason: '增加用户标签字段',
    creator: 'admin管理员',
    createTime: '2026-08-11 09:12:40',
    state: '当前版本'
  },
  {
    id: 'v-user-1',
    modelName: '用户基础信息表',
    modelCode: 'MODEL_USER_002',
    version: 'V1.0',
    reason: '初始版本',
    creator: 'admin管理员',
    createTime: '2026-04-02 14:30:12',
    state: '历史版本'
  }
])

const route = useRoute()

/** 编号 26 = 新增流程，27 = 修改流程，28 = 删除流程，共用同一个页面 */
const featureNo = computed(() => Number(route.params.no) || 26)

const draftModel = ref(defaultModelName)
const appliedModel = ref(defaultModelName)
const sortBy = ref('版本号')

const page = ref(1)
const pageSize = 10
const jumpPage = ref('1')
const selectedIds = ref([])

const formVisible = ref(false)
const form = reactive({
  createTime: '',
  creator: 'admin管理员',
  reason: ''
})

const editVisible = ref(false)
const editTarget = ref(null)
const editForm = reactive({
  modifyTime: '',
  reason: '',
  opinion: '',
  modifier: 'admin管理员',
  modifierCode: 'USR_ADMIN_002'
})

const deleteVisible = ref(false)
const deleteTarget = ref(null)
const deleteForm = reactive({
  time: '',
  operator: 'admin管理员',
  reason: '',
  count: 1
})
const deleteResultVisible = ref(false)
const deleteResult = ref({ name: '', operator: '', time: '', reason: '' })

const detailVisible = ref(false)
const detailRow = ref(null)

const resultVisible = ref(false)
const resultInfo = ref({ version: '', modelName: '', modelCode: '', opinion: '' })

const filteredRows = computed(() => {
  const list = versions.value.filter((row) => row.modelName === appliedModel.value)
  const toNumber = (version) => Number(version.replace(/[^\d.]/g, '')) || 0
  return [...list].sort((a, b) => {
    if (sortBy.value === '最近更新时间') {
      return b.createTime.localeCompare(a.createTime)
    }
    if (sortBy.value === '创建时间') {
      return a.createTime.localeCompare(b.createTime)
    }
    return toNumber(b.version) - toNumber(a.version)
  })
})

const pageCount = computed(() => Math.max(Math.ceil(filteredRows.value.length / pageSize), 1))
const pageRows = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})
const allSelected = computed(
  () => pageRows.value.length > 0 && pageRows.value.every((row) => selectedIds.value.includes(row.id))
)

const formModel = computed(() => models.find((item) => item.name === appliedModel.value) || models[0])

const formValid = computed(() => Boolean(form.createTime && form.creator && form.reason.trim()))

const deleteValid = computed(
  () =>
    Boolean(deleteForm.time) &&
    Boolean(deleteForm.operator.trim()) &&
    Boolean(deleteForm.reason.trim()) &&
    Number.isInteger(deleteForm.count) &&
    deleteForm.count > 0
)

const editValid = computed(
  () =>
    Boolean(editForm.modifyTime) &&
    Boolean(editForm.reason.trim()) &&
    Boolean(editForm.opinion.trim()) &&
    Boolean(editForm.modifier.trim()) &&
    Boolean(editForm.modifierCode.trim())
)

function doSearch() {
  appliedModel.value = draftModel.value
  page.value = 1
  selectedIds.value = []
  jumpPage.value = '1'
}

function resetSearch() {
  draftModel.value = defaultModelName
  sortBy.value = '版本号'
  doSearch()
}

function goPage(number) {
  if (number < 1 || number > pageCount.value) {
    return
  }
  page.value = number
  jumpPage.value = String(number)
}

function jumpToPage() {
  const number = Number(jumpPage.value)
  if (!Number.isInteger(number) || number < 1 || number > pageCount.value) {
    ElMessage.warning(`请输入 1-${pageCount.value} 之间的页码`)
    return
  }
  goPage(number)
}

function toggleRow(id) {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((item) => item !== id)
    : [...selectedIds.value, id]
}

function toggleAll() {
  if (allSelected.value) {
    selectedIds.value = selectedIds.value.filter((id) => !pageRows.value.some((row) => row.id === id))
  } else {
    const merged = new Set(selectedIds.value)
    pageRows.value.forEach((row) => merged.add(row.id))
    selectedIds.value = [...merged]
  }
}

function openCreate() {
  form.createTime = '2026-10-26 10:30:00'
  form.creator = 'admin管理员'
  form.reason = ''
  formVisible.value = true
}

function submitCreate() {
  if (!formValid.value) {
    ElMessage.error('请填写必填项')
    return
  }

  const model = formModel.value
  const sameModel = versions.value.filter((row) => row.modelCode === model.code)
  const maxVersion = sameModel.reduce((max, row) => Math.max(max, Number(row.version.replace(/[^\d.]/g, '')) || 0), 0)
  sameModel.forEach((row) => {
    row.state = '历史版本'
  })

  versions.value.unshift({
    id: `v-${model.code}-${Date.now()}`,
    modelName: model.name,
    modelCode: model.code,
    version: `V${(maxVersion + 1).toFixed(1)}`,
    reason: form.reason.trim(),
    creator: form.creator,
    createTime: form.createTime,
    state: '当前版本'
  })

  page.value = 1
  jumpPage.value = '1'
  formVisible.value = false
  ElMessage.success('新增成功')
}

function openEdit(row) {
  editTarget.value = row
  editForm.modifyTime = '2026-10-26 14:30:00'
  editForm.reason = '补充共享权限校验规则'
  editForm.opinion = '优化数据授权关系结构及共享权限校验'
  editForm.modifier = 'admin管理员'
  editForm.modifierCode = 'USR_ADMIN_002'
  editVisible.value = true
}

function submitEdit() {
  if (!editValid.value) {
    ElMessage.error('请填写必填项')
    return
  }

  const target = editTarget.value
  if (target) {
    target.createTime = editForm.modifyTime
    target.reason = editForm.opinion.trim()
    target.creator = editForm.modifier
  }

  resultInfo.value = {
    version: target?.version || '',
    modelName: target?.modelName || '',
    modelCode: target?.modelCode || '',
    opinion: editForm.opinion.trim()
  }
  editVisible.value = false
  resultVisible.value = true
  ElMessage.success('保存修改成功')
}

function backToList() {
  resultVisible.value = false
  page.value = 1
}

function viewRow(row) {
  detailRow.value = row
  detailVisible.value = true
}

function removeRow(row) {
  openDelete(row)
}

function openDelete(row) {
  deleteTarget.value = row
  deleteForm.time = '2026-10-26 15:00:00'
  deleteForm.operator = 'admin管理员'
  deleteForm.reason = '该历史版本已停止使用，相关数据结构已由V5.0版本完全替代。'
  deleteForm.count = 1
  deleteVisible.value = true
}

function confirmDelete() {
  if (!deleteValid.value) {
    ElMessage.error('请填写正确的删除信息')
    return
  }

  const target = deleteTarget.value
  deleteResult.value = {
    name: target ? `数据分享模型${target.version}` : '',
    operator: deleteForm.operator,
    time: deleteForm.time,
    reason: deleteForm.reason
  }

  if (target) {
    versions.value = versions.value.filter((item) => item.id !== target.id)
    selectedIds.value = selectedIds.value.filter((id) => id !== target.id)
  }

  deleteVisible.value = false
  deleteResultVisible.value = true
}

function closeDeleteResult() {
  deleteResultVisible.value = false
}

watch(page, () => {
  if (page.value > pageCount.value) {
    page.value = pageCount.value
  }
})

onMounted(() => {
  // 编号 27 演示「修改」流程：直接打开 V4.0 的修改弹窗，和截图一致
  if (featureNo.value === 27) {
    const row = versions.value.find((item) => item.id === 'v-share-4')
    if (row) {
      openEdit(row)
    }
  }

  // 编号 28 演示「删除」流程：直接打开 V2.0 的删除弹窗，和截图一致
  if (featureNo.value === 28) {
    const row = versions.value.find((item) => item.id === 'v-share-2')
    if (row) {
      openDelete(row)
    }
  }
})

/**
 * 26/27/28 合并为一个菜单入口后，三个编号共用同一个组件实例；
 * 在菜单/路由之间切换时需要先清掉上一个编号留下的弹窗，否则弹窗会带到下一个页面。
 */
watch(featureNo, (no) => {
  formVisible.value = false
  editVisible.value = false
  deleteVisible.value = false
  deleteResultVisible.value = false
  detailVisible.value = false
  resultVisible.value = false
  if (no === 27) {
    const row = versions.value.find((item) => item.id === 'v-share-4')
    if (row) openEdit(row)
  }
  if (no === 28) {
    const row = versions.value.find((item) => item.id === 'v-share-2')
    if (row) openDelete(row)
  }
})
</script>

<style scoped>
.nf-ops {
  white-space: nowrap;
}

.nf-form-date {
  width: 100%;
}

.nf-banner-sep {
  margin: 0 10px;
  color: #dcdfe6;
}

:deep(.nf-form-control .el-input__wrapper),
:deep(.nf-form-control .el-textarea__inner) {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: none;
}

:deep(.nf-form-control .el-input__wrapper) {
  min-height: 34px;
  height: 34px;
}

:deep(.nf-form-control .el-input__wrapper.is-focus),
:deep(.nf-form-control .el-textarea__inner:focus) {
  border-color: #1677ff;
  box-shadow: none;
}

:deep(.nf-form-control .el-input.is-disabled .el-input__wrapper) {
  background: #f5f7fa;
}

:deep(.nf-form-control .el-input__inner),
:deep(.nf-form-control .el-textarea__inner) {
  font-size: 13px;
}

:deep(.nf-form-date .el-input__wrapper) {
  padding-left: 12px;
}
</style>