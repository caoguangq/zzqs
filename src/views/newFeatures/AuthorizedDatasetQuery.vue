<template>
  <div class="nf-page nf-auth-page">
    <!-- 列表 -->
    <template v-if="view === 'list'">
      <h1 class="nf-auth-title">已赋权数据集权限查询</h1>

      <div class="nf-auth-filters">
        <div class="nf-auth-field" style="width: 324px">
          <p class="nf-auth-label">所属部门</p>
          <el-select v-model="draftDept" class="nf-auth-select">
            <el-option v-for="item in deptOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="nf-auth-field" style="width: 324px">
          <p class="nf-auth-label">授权对象</p>
          <el-select v-model="draftObject" class="nf-auth-select">
            <el-option v-for="item in objectOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <div class="nf-auth-field" style="width: 312px">
          <p class="nf-auth-label">数据集名称/编码</p>
          <input v-model="draftKeyword" class="nf-auth-keyword" placeholder="请输入数据集名称或编码" />
        </div>
        <div class="nf-auth-field" style="width: 311px">
          <p class="nf-auth-label">权限类型</p>
          <el-select v-model="draftType" class="nf-auth-select">
            <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
        <button type="button" class="nf-auth-query" @click="doSearch">
          <span>查询</span>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round">
            <circle cx="9" cy="9" r="5.4" />
            <path d="m13 13 4 4" />
          </svg>
        </button>
      </div>

      <section class="nf-card nf-auth-card">
        <table class="nf-table nf-auth-table">
          <colgroup>
            <col style="width: 9.13%" />
            <col style="width: 12.22%" />
            <col style="width: 10.83%" />
            <col style="width: 8.75%" />
            <col style="width: 11.9%" />
            <col style="width: 8.5%" />
            <col style="width: 10.01%" />
            <col style="width: 10.39%" />
            <col style="width: 8.31%" />
            <col style="width: 9.96%" />
          </colgroup>
          <thead>
            <tr>
              <th>数据集编码</th>
              <th>数据集名称</th>
              <th>所属目录</th>
              <th>授权对象</th>
              <th>权限范围</th>
              <th>授权来源</th>
              <th>生效时间</th>
              <th>失效时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredRows" :key="row.code">
              <td>{{ row.code }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.dir }}</td>
              <td>{{ row.object }}</td>
              <td>{{ row.scope }}</td>
              <td>{{ row.source }}</td>
              <td class="nf-auth-nowrap">{{ row.start }}</td>
              <td class="nf-auth-nowrap">{{ row.end }}</td>
              <td class="nf-auth-center">{{ row.status }}</td>
              <td class="nf-auth-center"><a class="nf-link" @click="openDetail(row)">查看权限</a></td>
            </tr>
            <tr v-if="!filteredRows.length">
              <td class="nf-auth-empty" colspan="10">暂无数据</td>
            </tr>
          </tbody>
        </table>

        <div class="nf-auth-foot">
          <span class="nf-auth-total">共 {{ filteredRows.length }} 条记录</span>
          <div class="nf-auth-pager">
            <button type="button" class="nf-auth-pill" disabled>上一页</button>
            <button type="button" class="nf-auth-page-btn active">1</button>
            <button type="button" class="nf-auth-pill" disabled>下一页</button>
            <span class="nf-auth-jump">前往</span>
            <input v-model="jumpPage" class="nf-auth-page-input" />
            <span class="nf-auth-jump">页</span>
            <button type="button" class="nf-auth-confirm" @click="confirmJump">确定</button>
          </div>
        </div>
      </section>
    </template>

    <!-- 权限详情 -->
    <template v-else>
      <button type="button" class="nf-auth-back" @click="backToList">
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 10H4M9 5l-5 5 5 5" />
        </svg>
        返回列表
      </button>

      <h1 class="nf-auth-detail-title">数据集权限详情</h1>

      <section class="nf-auth-summary">
        <div class="nf-auth-sum-name">
          <p class="nf-auth-sum-label">数据集名称</p>
          <p class="nf-auth-sum-value">{{ currentDataset.name }}</p>
        </div>
        <div class="nf-auth-sum-code">
          <p class="nf-auth-sum-label">数据集编码</p>
          <p class="nf-auth-sum-value">{{ currentDataset.code }}</p>
        </div>
        <div class="nf-auth-sum-count">
          <span class="nf-auth-count-label">赋权用户数：</span>
          <b>{{ detailUsers.length }}</b>
          <span class="nf-auth-count-unit">人</span>
        </div>
      </section>

      <section class="nf-auth-detail-card">
        <table class="nf-table nf-auth-detail-table">
          <colgroup>
            <col style="width: 16.03%" />
            <col style="width: 17.24%" />
            <col style="width: 14.81%" />
            <col style="width: 14.3%" />
            <col style="width: 14.81%" />
            <col style="width: 22.81%" />
          </colgroup>
          <thead>
            <tr>
              <th>用户名称</th>
              <th>手机号（脱敏）</th>
              <th>是否赋权</th>
              <th>是否撤销</th>
              <th>是否变更</th>
              <th>权限范围</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in detailUsers" :key="user.phone">
              <td>{{ user.name }}</td>
              <td>{{ user.phone }}</td>
              <td>{{ user.granted }}</td>
              <td>{{ user.revoked }}</td>
              <td>{{ user.changed }}</td>
              <td>{{ user.scope }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { manualBreadcrumb } from '../../config/breadcrumb.js'

const DETAIL_CRUMB = ['权限管理', '数据集权限', '数据集权限详情']

const deptOptions = ['数据管理部', '市场经营部', '客户洞察部', '政企客户部']
const objectOptions = ['全部', '张伟', '李静', '王强', '数据管理部']
const typeOptions = ['全部', '查看', '查询', '下载', '行级权限', '字段级权限']

const draftDept = ref('数据管理部')
const draftObject = ref('全部')
const draftKeyword = ref('')
const draftType = ref('全部')

const appliedObject = ref('全部')
const appliedKeyword = ref('')
const appliedType = ref('全部')
const jumpPage = ref('')

const rows = [
  { code: 'DS001', name: '全省客户经营日报', dir: '市场经营', object: '张伟', scope: '查看、查询、下载', source: '角色授权', start: '2026-01-01', end: '2026-12-31', status: '有效' },
  { code: 'DS002', name: '渠道运营分析明细', dir: '渠道管理', object: '数据管理部', scope: '查看、行级权限', source: '组织授权', start: '2026-03-01', end: '长期有效', status: '有效' },
  { code: 'DS003', name: '用户画像标签库', dir: '客户洞察', object: '李静', scope: '查看、字段级权限', source: '申请审批', start: '2026-06-15', end: '2026-09-30', status: '即将到期' },
  { code: 'DS004', name: '营业厅服务质量月报', dir: '市场经营', object: '王强', scope: '查看、查询', source: '角色授权', start: '2026-02-01', end: '2026-12-31', status: '有效' },
  { code: 'DS005', name: '存量客户价值分析', dir: '客户洞察', object: '数据管理部', scope: '查看、下载', source: '组织授权', start: '2026-04-01', end: '长期有效', status: '有效' },
  { code: 'DS006', name: '重点产品发展日报', dir: '产品管理', object: '张伟', scope: '查看、查询、下载', source: '申请审批', start: '2026-05-10', end: '2026-12-31', status: '有效' },
  { code: 'DS007', name: '网络经营评价明细', dir: '市场经营', object: '李静', scope: '查看、字段权限', source: '角色授权', start: '2026-07-01', end: '2027-06-30', status: '有效' },
  { code: 'DS008', name: '客户投诉分析数据', dir: '客户洞察', object: '王强', scope: '查看、字段级权限', source: '组织授权', start: '2026-03-15', end: '2026-12-31', status: '有效' },
  { code: 'DS009', name: '政企客户收入月报', dir: '政企经营', object: '数据管理部', scope: '查看、查询', source: '申请审批', start: '2026-08-01', end: '长期有效', status: '有效' },
  { code: 'DS010', name: '营销活动效果评估', dir: '市场经营', object: '张伟', scope: '查看、下载', source: '角色授权', start: '2026-09-01', end: '2026-12-31', status: '有效' }
]

const filteredRows = computed(() =>
  rows.filter((row) => {
    if (appliedObject.value !== '全部' && row.object !== appliedObject.value) return false
    if (appliedType.value !== '全部' && !row.scope.includes(appliedType.value)) return false
    if (appliedKeyword.value) {
      const key = appliedKeyword.value
      if (!row.name.includes(key) && !row.code.includes(key)) return false
    }
    return true
  })
)

const view = ref('list')
const currentDataset = ref(rows[0])

const detailUsers = [
  { name: '张伟', phone: '138****0001', granted: '是', revoked: '否', changed: '否', scope: '查看、查询、下载' },
  { name: '李静', phone: '139****0002', granted: '是', revoked: '否', changed: '是', scope: '查看、查询' },
  { name: '王强', phone: '137****0003', granted: '否', revoked: '是', changed: '否', scope: '—' }
]

function doSearch() {
  appliedObject.value = draftObject.value
  appliedKeyword.value = draftKeyword.value.trim()
  appliedType.value = draftType.value
}

function confirmJump() {
  ElMessage.info('当前只有 1 页数据')
}

function openDetail(row) {
  currentDataset.value = row
  view.value = 'detail'
  manualBreadcrumb.value = DETAIL_CRUMB
}

function backToList() {
  view.value = 'list'
  manualBreadcrumb.value = null
}

onMounted(() => {
  manualBreadcrumb.value = null
})

onBeforeUnmount(() => {
  manualBreadcrumb.value = null
})
</script>

<style scoped>
.nf-auth-page {
  max-width: none;
  margin-top: -16px;
  padding: 0 10px;
}

.nf-auth-title {
  margin: 0 0 17px 8px;
  color: #1f2329;
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;
}

/* ---------- 筛选 ---------- */
.nf-auth-filters {
  display: flex;
  align-items: flex-end;
  gap: 34px;
  padding: 0 39px 0 5px;
}

.nf-auth-field {
  flex: none;
}

.nf-auth-label {
  margin: 0 0 9px 13px;
  color: #1f2329;
  font-size: 14px;
  line-height: 20px;
}

.nf-auth-keyword {
  width: 100%;
  height: 38px;
  padding: 0 18px;
  border: 1px solid #dcdfe6;
  border-radius: 19px;
  color: #1f2329;
  font-size: 13px;
  outline: none;
}

.nf-auth-keyword::placeholder {
  color: #b6bcc8;
}

.nf-auth-keyword:focus {
  border-color: #1677ff;
}

.nf-auth-query {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100px;
  height: 39px;
  margin-left: auto;
  padding: 0 13px 0 17px;
  border: 0;
  border-radius: 20px;
  background: #1677ff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-auth-query:hover {
  background: #4096ff;
}

.nf-auth-query svg {
  flex: none;
}

/* ---------- 列表 ---------- */
.nf-auth-card {
  margin-top: 30px;
  overflow: hidden;
}

.nf-auth-table th {
  height: 63px;
  background: #fafafa;
  color: #1f2329;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.nf-auth-table td {
  height: 42px;
  padding-left: 20px;
  border-color: #ebeef5;
  color: #5b6e9d;
  font-size: 14px;
  text-align: left;
}

.nf-auth-table .nf-auth-center {
  padding-left: 0;
  text-align: center;
}

.nf-auth-table .nf-auth-nowrap {
  white-space: nowrap;
}

.nf-auth-table .nf-auth-empty {
  height: 120px;
  color: #909399;
  text-align: center;
}

.nf-auth-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 43px;
  padding: 0 13px;
  border-top: 1px solid #ebeef5;
}

.nf-auth-total {
  color: #606266;
  font-size: 13px;
}

.nf-auth-pager {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nf-auth-pill {
  height: 30px;
  padding: 0 14px;
  border: 0;
  border-radius: 16px;
  background: #f5f7fa;
  color: #c0c4cc;
  font-size: 13px;
  cursor: not-allowed;
}

.nf-auth-page-btn {
  min-width: 33px;
  height: 28px;
  padding: 0 8px;
  border: 0;
  border-radius: 3px;
  background: #ffffff;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
}

.nf-auth-page-btn.active {
  background: #1677ff;
  color: #ffffff;
}

.nf-auth-jump {
  color: #606266;
  font-size: 13px;
}

.nf-auth-page-input {
  width: 30px;
  height: 28px;
  padding: 0 4px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  color: #1f2329;
  font-size: 13px;
  text-align: center;
  outline: none;
}

.nf-auth-page-input:focus {
  border-color: #1677ff;
}

.nf-auth-confirm {
  height: 32px;
  padding: 0 16px;
  border: 1px solid #dcdfe6;
  border-radius: 16px;
  background: #ffffff;
  color: #333333;
  font-size: 13px;
  cursor: pointer;
}

.nf-auth-confirm:hover {
  border-color: #a9c8f5;
  color: #1677ff;
}

/* ---------- 详情 ---------- */
.nf-auth-back {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 42px;
  margin: 34px 0 0 8px;
  padding: 0 33px;
  border: 1px solid #1677ff;
  border-radius: 4px;
  background: #ffffff;
  color: #1677ff;
  font-size: 16px;
  cursor: pointer;
}

.nf-auth-back:hover {
  background: #f0f7ff;
}

.nf-auth-detail-title {
  margin: 48px 0 0 8px;
  color: #1f2329;
  font-size: 26px;
  font-weight: 700;
  line-height: 36px;
}

.nf-auth-summary {
  display: grid;
  grid-template-columns: 568px 490px 1fr;
  height: 136px;
  margin: 24px 0 0 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #ffffff;
}

.nf-auth-sum-name {
  padding: 34px 0 0 34px;
}

.nf-auth-sum-code {
  padding: 34px 0 0 33px;
}

.nf-auth-sum-label {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 20px;
}

.nf-auth-sum-value {
  margin: 18px 0 0;
  color: #1f2329;
  font-size: 22px;
  font-weight: 700;
  line-height: 28px;
}

.nf-auth-sum-count {
  display: flex;
  align-items: center;
  padding-left: 86px;
  border-left: 1px solid #ebeef5;
  color: #1f2329;
  font-size: 18px;
}

.nf-auth-count-label {
  white-space: nowrap;
}

.nf-auth-sum-count b {
  margin-left: 18px;
  color: #1677ff;
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
}

.nf-auth-count-unit {
  margin-left: 10px;
}

.nf-auth-detail-card {
  margin: 27px 0 0 8px;
  overflow: hidden;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.nf-auth-detail-table th {
  height: 67px;
  background: #fafafa;
  color: #1f2329;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.nf-auth-detail-table td {
  height: 80px;
  border-color: #ebeef5;
  color: #2b3a55;
  font-size: 16px;
  text-align: center;
}

/* ---------- Element 控件 ---------- */
:deep(.nf-auth-select .el-select__wrapper) {
  min-height: 38px;
  padding-left: 17px;
  border-radius: 19px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-size: 14px;
}

:deep(.nf-auth-select .el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #1677ff inset;
}
</style>