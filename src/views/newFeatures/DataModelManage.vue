<template>
  <div class="nf-page nf-page-compact">
    <p class="nf-section-label">过滤条件</p>

    <section class="nf-card">
      <div class="nf-filter-row compact nf-search-row">
        <div class="nf-search-box">
          <input v-model="keyword" class="nf-search-input" placeholder="请输入中文表名称" @keyup.enter="doSearch" />
          <button type="button" class="nf-search-btn" title="查询" @click="doSearch">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#8a9099" stroke-width="1.8" stroke-linecap="round">
              <circle cx="9" cy="9" r="5.4" />
              <path d="m13 13 4 4" />
            </svg>
          </button>
        </div>
        <button type="button" class="nf-pill-btn" @click="addModel">
          添加数据模型
          <span class="nf-pill-icon">
            <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round">
              <path d="M10 4.5v11M4.5 10h11" />
            </svg>
          </span>
        </button>
      </div>

      <div class="nf-filter-row compact nf-type-row">
        <span class="nf-filter-label">业务类型</span>
        <div class="nf-type-list">
          <span
            v-for="city in cities"
            :key="city"
            class="nf-type-item"
            :class="{ active: selectedCities.includes(city) }"
            @click="toggleCity(city)"
          >
            {{ city }}
          </span>
        </div>
        <button type="button" class="nf-mini-btn" @click="toggleAllCities">
          {{ selectedCities.length === cities.length ? '清空' : '多选' }}
        </button>
      </div>

      <div class="nf-filter-row compact">
        <span class="nf-filter-label">升降排序</span>
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

    <div class="nf-toolbar">
      <a class="nf-link nf-doc-link">取数据操作文档</a>
      <button type="button" class="nf-view-toggle active" title="列表视图">
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="6" height="6" rx="1" />
          <rect x="11" y="3" width="6" height="6" rx="1" />
          <rect x="3" y="11" width="6" height="6" rx="1" />
          <rect x="11" y="11" width="6" height="6" rx="1" />
        </svg>
      </button>
      <button type="button" class="nf-view-toggle" title="表格视图">
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
    </div>

    <section class="nf-card nf-model-card">
      <div class="nf-table-wrap">
        <table class="nf-table nf-model-table">
          <colgroup>
            <col style="width: 2.6%" />
            <col style="width: 27%" />
            <col style="width: 12%" />
            <col style="width: 10%" />
            <col style="width: 12.4%" />
            <col style="width: 8.6%" />
            <col style="width: 27.4%" />
          </colgroup>
          <thead>
            <tr>
              <th class="nf-col-check">
                <input type="checkbox" class="nf-checkbox" :checked="allSelected" @change="toggleAll" />
              </th>
              <th>中文表名称</th>
              <th>更新时间</th>
              <th>模型发布人</th>
              <th>模型业务负责人</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in visibleRows" :key="row.id">
              <td class="nf-col-check">
                <input
                  type="checkbox"
                  class="nf-checkbox"
                  :checked="selectedIds.includes(row.id)"
                  @change="toggleRow(row.id)"
                />
              </td>
              <td>{{ row.tableName }}</td>
              <td class="nf-cell-nowrap">{{ row.updateTime }}</td>
              <td>{{ row.publisher }}</td>
              <td>{{ row.owner }}</td>
              <td>{{ row.state }}</td>
              <td class="nf-model-ops">
                <span class="nf-order-actions">
                  <button type="button" class="nf-order-btn" title="升级顺序" @click="moveUp(row.id)">↑</button>
                  <button type="button" class="nf-order-btn" title="降级顺序" @click="moveDown(row.id)">↓</button>
                </span>
                <a class="nf-link" @click="viewRow(row)">查看</a><span class="nf-sep">/</span><a class="nf-link" @click="authorizeRow(row)">赋权</a><span class="nf-sep">/</span><a class="nf-link" @click="editRow(row)">修改</a><span class="nf-sep">/</span><a class="nf-link" @click="removeRow(row)">删除</a>
              </td>
            </tr>
            <tr v-if="!visibleRows.length" class="nf-empty">
              <td colspan="7">暂无数据</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <el-dialog v-model="detailVisible" title="数据模型详情" width="620px" class="nf-dialog">
      <div v-if="detailRow" class="nf-desc-grid">
        <div class="nf-desc-row"><span class="nf-desc-label">中文表名称：</span>{{ detailRow.tableName }}</div>
        <div class="nf-desc-row"><span class="nf-desc-label">更新时间：</span>{{ detailRow.updateTime }}</div>
        <div class="nf-desc-row"><span class="nf-desc-label">模型发布人：</span>{{ detailRow.publisher }}</div>
        <div class="nf-desc-row"><span class="nf-desc-label">模型业务负责人：</span>{{ detailRow.owner }}</div>
        <div class="nf-desc-row"><span class="nf-desc-label">状态：</span>{{ detailRow.state }}</div>
        <div class="nf-desc-row"><span class="nf-desc-label">业务类型：</span>{{ detailRow.city }}</div>
      </div>
      <template #footer>
        <div class="nf-dialog-footer">
          <button type="button" class="nf-btn" @click="detailVisible = false">关闭</button>
        </div>
      </template>
    </el-dialog>

    <!-- 38 负责人关联数据集新增赋权：用户选择 -->
    <el-dialog
      v-model="userSelectVisible"
      width="958px"
      class="nf-dialog nf-user-dialog"
      :close-on-click-modal="false"
    >
      <template #header>
        <span class="nf-user-title">用户选择</span>
      </template>

      <div class="nf-user-tabs">
        <button
          type="button"
          class="nf-user-tab"
          :class="{ active: userTab === 'user' }"
          @click="userTab = 'user'"
        >
          用户选择
        </button>
        <button
          type="button"
          class="nf-user-tab"
          :class="{ active: userTab === 'role' }"
          @click="userTab = 'role'"
        >
          角色选择
        </button>
      </div>

      <div class="nf-user-filter">
        <span class="nf-user-flabel">用户名称：</span>
        <input v-model="userKeyword" class="nf-user-input" placeholder="请输入用户名称..." />
        <span class="nf-user-flabel nf-user-flabel2">部门名称：</span>
        <input v-model="deptKeyword" class="nf-user-input" placeholder="请输入部门名称..." />
        <button type="button" class="nf-user-search" @click="searchUsers">
          <span>搜索</span>
          <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round">
            <circle cx="9" cy="9" r="5.2" />
            <path d="m13 13 4 4" />
          </svg>
        </button>
      </div>

      <div class="nf-user-panels">
        <section class="nf-user-panel nf-user-panel-left">
          <header class="nf-user-panel-head">
            <span>{{ userTab === 'user' ? '未赋权的用户' : '未赋权的角色' }}</span>
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="M8.6 2.2h2.8l.3 1.7 1.2.5 1.4-1 2 2-1 1.4.5 1.2 1.7.3v2.8l-1.7.3-.5 1.2 1 1.4-2 2-1.4-1-1.2.5-.3 1.7H8.6l-.3-1.7-1.2-.5-1.4 1-2-2 1-1.4-.5-1.2-1.7-.3V8.6l1.7-.3.5-1.2-1-1.4 2-2 1.4 1 1.2-.5z" fill="#2b3a55" />
              <circle cx="10" cy="10" r="2.2" fill="#ffffff" />
            </svg>
          </header>

          <div class="nf-user-scroll nf-user-scroll-left">
            <table class="nf-user-table">
              <colgroup>
                <col style="width: 9.5%" />
                <col style="width: 9.3%" />
                <col style="width: 39.7%" />
                <col style="width: 41.5%" />
              </colgroup>
              <thead>
                <tr>
                  <th></th>
                  <th><input type="checkbox" class="nf-checkbox" :checked="allLeftSelected" @change="toggleAllLeft" /></th>
                  <th>{{ userTab === 'user' ? '用户名称' : '角色名称' }}</th>
                  <th>{{ userTab === 'user' ? '部门' : '角色描述' }}</th>
                </tr>
              </thead>
              <tbody v-if="userTab === 'user'">
                <tr v-for="(item, index) in filteredLeftUsers" :key="item.id">
                  <td class="nf-user-center">{{ index + 1 }}</td>
                  <td class="nf-user-center">
                    <input
                      type="checkbox"
                      class="nf-checkbox"
                      :checked="leftSelected.includes(item.id)"
                      @change="toggleLeft(item.id)"
                    />
                  </td>
                  <td class="nf-user-name">{{ item.name }}</td>
                  <td>{{ item.dept }}</td>
                </tr>
                <tr v-if="!filteredLeftUsers.length">
                  <td class="nf-user-empty" colspan="4">暂无数据</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td class="nf-user-empty" colspan="4">暂无数据</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="nf-user-pager">
            <div class="nf-user-pager-ctrls">
              <button type="button" class="nf-user-page-icon" disabled>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M4 3.5v9M12 3.8 8.2 8l3.8 4.2" /></svg>
              </button>
              <button type="button" class="nf-user-page-icon" disabled>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M9.5 3.8 5.7 8l3.8 4.2M13 3.8 9.2 8l3.8 4.2" /></svg>
              </button>
              <span class="nf-user-page-num">1</span>
              <span class="nf-user-page-total">共 1 页</span>
              <button type="button" class="nf-user-page-icon" disabled>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M6.5 3.8 10.3 8l-3.8 4.2M3 3.8 6.8 8 3 12.2" /></svg>
              </button>
              <button type="button" class="nf-user-page-icon" disabled>
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M12 3.5v9M4 3.8 7.8 8 4 12.2" /></svg>
              </button>
            </div>
            <span class="nf-user-range">1 - 10 共 {{ totalLabel }} 条</span>
          </div>
        </section>

        <div class="nf-user-arrows">
          <button type="button" class="nf-user-arrow" title="赋权" @click="assignSelected">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1677ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3.5 12h16M14 6.5l5.5 5.5L14 17.5" />
            </svg>
          </button>
          <button type="button" class="nf-user-arrow" title="取消赋权" @click="unassignSelected">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1677ff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.5 12h-16M10 6.5 4.5 12l5.5 5.5" />
            </svg>
          </button>
        </div>

        <section class="nf-user-panel nf-user-panel-right">
          <header class="nf-user-panel-head">
            <span>{{ userTab === 'user' ? '已赋权的用户' : '已赋权的角色' }}</span>
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="M8.6 2.2h2.8l.3 1.7 1.2.5 1.4-1 2 2-1 1.4.5 1.2 1.7.3v2.8l-1.7.3-.5 1.2 1 1.4-2 2-1.4-1-1.2.5-.3 1.7H8.6l-.3-1.7-1.2-.5-1.4 1-2-2 1-1.4-.5-1.2-1.7-.3V8.6l1.7-.3.5-1.2-1-1.4 2-2 1.4 1 1.2-.5z" fill="#2b3a55" />
              <circle cx="10" cy="10" r="2.2" fill="#ffffff" />
            </svg>
          </header>

          <div class="nf-user-scroll nf-user-scroll-right">
            <table class="nf-user-table">
              <colgroup>
                <col style="width: 9.5%" />
                <col style="width: 9%" />
                <col style="width: 43.9%" />
                <col style="width: 37.6%" />
              </colgroup>
              <thead>
                <tr>
                  <th></th>
                  <th><input type="checkbox" class="nf-checkbox" :checked="allRightSelected" @change="toggleAllRight" /></th>
                  <th>{{ userTab === 'user' ? '用户名称' : '角色名称' }}</th>
                  <th>{{ userTab === 'user' ? '部门' : '角色描述' }}</th>
                </tr>
              </thead>
              <tbody v-if="userTab === 'user'">
                <tr v-for="(item, index) in assignedUsers" :key="item.id">
                  <td class="nf-user-center">{{ index + 1 }}</td>
                  <td class="nf-user-center">
                    <input
                      type="checkbox"
                      class="nf-checkbox"
                      :checked="rightSelected.includes(item.id)"
                      @change="toggleRight(item.id)"
                    />
                  </td>
                  <td class="nf-user-name">{{ item.name }}</td>
                  <td>{{ item.dept }}</td>
                </tr>
                <tr v-if="!assignedUsers.length && showRightEmpty">
                  <td class="nf-user-result-empty" colspan="4">没有查询到结果数据！</td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td class="nf-user-empty" colspan="4">暂无数据</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <template #footer>
        <div class="nf-user-footer">
          <button type="button" class="nf-user-cancel" @click="userSelectVisible = false">取消</button>
          <button type="button" class="nf-user-confirm" @click="openSaveConfirm">确定</button>
        </div>
      </template>
    </el-dialog>

    <!-- 38 保存确认 -->
    <el-dialog
      v-model="saveConfirmVisible"
      width="421px"
      class="nf-dialog nf-save-dialog"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <template #header>
        <span class="nf-save-title">选择保存</span>
      </template>
      <div class="nf-save-body">
        <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
          <circle cx="20" cy="20" r="20" fill="#fec400" />
          <path d="M20 9v14" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" />
          <circle cx="20" cy="29.5" r="2" fill="#ffffff" />
        </svg>
        <span>您确定需要保存吗？</span>
      </div>
      <template #footer>
        <div class="nf-save-footer">
          <button type="button" class="nf-save-cancel" @click="saveConfirmVisible = false">取消</button>
          <button type="button" class="nf-save-confirm" @click="saveUsers">确定</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
/** 编号 29 = 顺序结构升级，30 = 顺序结构降级，共用这个页面 */
const featureNo = computed(() => Number(route.params.no) || 29)

const cities = ['景德镇', '省公司', '吉安', '赣州', '九江', '南昌', '萍乡', '宜春', '抚州', '新余', '上饶', '鹰潭']
const sortOptions = ['最近更新时间', '热度等级', '创建时间']

const MOVE_TIME = '2026-03-16 00:00:00'

const baseRows = [
  {
    id: 'm-1',
    tableName: '运维twl_new',
    updateTime: '2026-03-14 00:00:00',
    publisher: '唐雯丽',
    owner: 'crm运维平台',
    state: '已发布',
    city: '南昌'
  },
  {
    id: 'm-2',
    tableName: '取数_信息化支撑中心_邢星_ITS智慧运维',
    updateTime: '2026-01-17 00:00:00',
    publisher: '刘康',
    owner: '邢星',
    state: '已发布',
    city: '省公司'
  },
  {
    id: 'm-3',
    tableName: '运维唐雯丽',
    updateTime: '2026-03-16 00:00:00',
    publisher: '唐雯丽',
    owner: 'crm运维平台',
    state: '已发布',
    city: '南昌'
  },
  {
    id: 'm-4',
    tableName: 'ITS运维产品收入',
    updateTime: '2026-03-14',
    publisher: '刘鹏',
    owner: '邢星',
    state: '已发布',
    city: '赣州'
  },
  {
    id: 'm-5',
    tableName: 'ITS运维产品收入-测试',
    updateTime: '2025-09-01 00:00:00',
    publisher: '徐南屏',
    owner: '邢星',
    state: '已发布',
    city: '九江'
  },
  {
    id: 'm-6',
    tableName: '取数_集客部_邢星_ITS运维产品',
    updateTime: '2025-07-31 00:00:00',
    publisher: '徐南屏',
    owner: '邢星',
    state: '已发布',
    city: '吉安'
  }
]

/** 29 的初始顺序按 image194，30 的初始顺序按 image192 */
function initialRows() {
  const list = baseRows.map((row) => ({ ...row }))
  if (featureNo.value === 30) {
    const first = list.find((row) => row.id === 'm-3')
    return [first, ...list.filter((row) => row.id !== 'm-3')]
  }
  return list
}

const rows = ref(initialRows())

const keyword = ref('运维')
const appliedKeyword = ref('')
const selectedCities = ref([])
const sortBy = ref('创建时间')
const selectedIds = ref([])

const detailVisible = ref(false)
const detailRow = ref(null)

const visibleRows = computed(() =>
  rows.value.filter((row) => {
    const hitKeyword = !appliedKeyword.value || row.tableName.includes(appliedKeyword.value)
    const hitCity = !selectedCities.value.length || selectedCities.value.includes(row.city)
    return hitKeyword && hitCity
  })
)

const allSelected = computed(
  () => visibleRows.value.length > 0 && visibleRows.value.every((row) => selectedIds.value.includes(row.id))
)

function doSearch() {
  appliedKeyword.value = keyword.value.trim()
  selectedIds.value = []
}

function toggleCity(city) {
  selectedCities.value = selectedCities.value.includes(city)
    ? selectedCities.value.filter((item) => item !== city)
    : [...selectedCities.value, city]
}

function toggleAllCities() {
  selectedCities.value = selectedCities.value.length === cities.length ? [] : [...cities]
}

function toggleRow(id) {
  selectedIds.value = selectedIds.value.includes(id)
    ? selectedIds.value.filter((item) => item !== id)
    : [...selectedIds.value, id]
}

function toggleAll() {
  if (allSelected.value) {
    selectedIds.value = selectedIds.value.filter((id) => !visibleRows.value.some((row) => row.id === id))
  } else {
    const merged = new Set(selectedIds.value)
    visibleRows.value.forEach((row) => merged.add(row.id))
    selectedIds.value = [...merged]
  }
}

/** 升级：提升到列表首位，并刷新更新时间 */
function moveUp(id) {
  const list = [...rows.value]
  const index = list.findIndex((row) => row.id === id)
  if (index <= 0) {
    ElMessage.info('已经是第一位，无需升级')
    return
  }
  const [target] = list.splice(index, 1)
  target.updateTime = MOVE_TIME
  list.unshift(target)
  rows.value = list
  ElMessage.success(`「${target.tableName}」顺序已升级`)
}

/** 降级：下移一位，并刷新更新时间 */
function moveDown(id) {
  const list = [...rows.value]
  const index = list.findIndex((row) => row.id === id)
  if (index === -1 || index >= list.length - 1) {
    ElMessage.info('已经是最后一位，无需降级')
    return
  }
  const [target] = list.splice(index, 1)
  target.updateTime = MOVE_TIME
  list.splice(index + 1, 0, target)
  rows.value = list
  ElMessage.success(`「${target.tableName}」顺序已降级`)
}

function viewRow(row) {
  detailRow.value = row
  detailVisible.value = true
}

/* ---------- 38 用户选择 / 新增赋权 ---------- */
const USER_SEED = [
  { id: 'u1', name: '左小丽(ZUOXIAOLI)', dept: '吉安市_安福县' },
  { id: 'u2', name: '左荣芳(ZUORONGFANG)', dept: '鹰潭市' },
  { id: 'u3', name: '左家姝(ZUOJIASHU)', dept: '省公司' },
  { id: 'u4', name: '邹梓良(ZOUZILIANG)', dept: '赣州市_章贡区' },
  { id: 'u5', name: '邹子涵(ZOUZIHAN)', dept: '吉安市' },
  { id: 'u6', name: '邹志安(ZOUZHIAN)', dept: '南昌市' },
  { id: 'u7', name: '邹雨鑫(ZOUYUXIN)', dept: '上饶市' },
  { id: 'u8', name: '邹裕祥(ZOUYUXIANG)', dept: '宜春市' },
  { id: 'u9', name: '邹天宇(ZOUTIANYU)', dept: '抚州市' },
  { id: 'u10', name: '邹佳琪(ZOUJIAQI)', dept: '九江市' }
]

const userSelectVisible = ref(false)
const saveConfirmVisible = ref(false)
const userTab = ref('user')
const userKeyword = ref('')
const deptKeyword = ref('')
const appliedUserKeyword = ref('')
const appliedDeptKeyword = ref('')
const leftSelected = ref([])
const rightSelected = ref([])
const totalUsers = ref(2134)
const unassignedUsers = ref([...USER_SEED])
const assignedUsers = ref([])
const showRightEmpty = ref(false)

const totalLabel = computed(() => totalUsers.value.toLocaleString('en-US'))

const filteredLeftUsers = computed(() =>
  unassignedUsers.value.filter((item) => {
    const hitUser = !appliedUserKeyword.value || item.name.includes(appliedUserKeyword.value)
    const hitDept = !appliedDeptKeyword.value || item.dept.includes(appliedDeptKeyword.value)
    return hitUser && hitDept
  })
)

const allLeftSelected = computed(
  () =>
    filteredLeftUsers.value.length > 0 &&
    filteredLeftUsers.value.every((item) => leftSelected.value.includes(item.id))
)
const allRightSelected = computed(
  () =>
    assignedUsers.value.length > 0 &&
    assignedUsers.value.every((item) => rightSelected.value.includes(item.id))
)

function toggleLeft(id) {
  leftSelected.value = leftSelected.value.includes(id)
    ? leftSelected.value.filter((item) => item !== id)
    : [...leftSelected.value, id]
}

function toggleRight(id) {
  rightSelected.value = rightSelected.value.includes(id)
    ? rightSelected.value.filter((item) => item !== id)
    : [...rightSelected.value, id]
}

function toggleAllLeft() {
  if (allLeftSelected.value) {
    leftSelected.value = []
  } else {
    leftSelected.value = filteredLeftUsers.value.map((item) => item.id)
  }
}

function toggleAllRight() {
  if (allRightSelected.value) {
    rightSelected.value = []
  } else {
    rightSelected.value = assignedUsers.value.map((item) => item.id)
  }
}

function searchUsers() {
  appliedUserKeyword.value = userKeyword.value.trim()
  appliedDeptKeyword.value = deptKeyword.value.trim()
  leftSelected.value = []
}

function assignSelected() {
  if (userTab.value === 'role') {
    ElMessage.info('角色赋权功能未接入')
    return
  }
  if (!leftSelected.value.length) {
    ElMessage.warning('请先选择需要赋权的用户')
    return
  }
  const moving = unassignedUsers.value.filter((item) => leftSelected.value.includes(item.id))
  assignedUsers.value = [...assignedUsers.value, ...moving]
  unassignedUsers.value = unassignedUsers.value.filter((item) => !leftSelected.value.includes(item.id))
  totalUsers.value = Math.max(totalUsers.value - moving.length, 0)
  leftSelected.value = []
  showRightEmpty.value = false
}

function unassignSelected() {
  if (userTab.value === 'role') {
    ElMessage.info('角色赋权功能未接入')
    return
  }
  if (!rightSelected.value.length) {
    ElMessage.warning('请先选择需要取消赋权的用户')
    return
  }
  const moving = assignedUsers.value.filter((item) => rightSelected.value.includes(item.id))
  unassignedUsers.value = [...moving, ...unassignedUsers.value]
  assignedUsers.value = assignedUsers.value.filter((item) => !rightSelected.value.includes(item.id))
  totalUsers.value += moving.length
  rightSelected.value = []
  showRightEmpty.value = assignedUsers.value.length === 0
}

function initUserSelection(no) {
  userTab.value = 'user'
  userKeyword.value = ''
  deptKeyword.value = ''
  appliedUserKeyword.value = ''
  appliedDeptKeyword.value = ''
  leftSelected.value = []
  rightSelected.value = []
  showRightEmpty.value = false
  if (Number(no) === 39) {
    unassignedUsers.value = USER_SEED.slice(1).map((item) => ({ ...item }))
    assignedUsers.value = [{ ...USER_SEED[0] }]
    totalUsers.value = 2133
  } else {
    unassignedUsers.value = USER_SEED.map((item) => ({ ...item }))
    assignedUsers.value = []
    totalUsers.value = 2134
  }
}

function openSaveConfirm() {
  saveConfirmVisible.value = true
}

function saveUsers() {
  saveConfirmVisible.value = false
  userSelectVisible.value = false
  leftSelected.value = []
  rightSelected.value = []
  ElMessage.success('保存成功')
}

function authorizeRow() {
  initUserSelection(29)
  userSelectVisible.value = true
}

onMounted(() => {
  /* 38 是合并后的菜单入口，进入后保持列表状态；39 走直接路由时自动打开撤销赋权弹窗，便于逐项核对 */
  if (featureNo.value === 39) {
    initUserSelection(featureNo.value)
    userSelectVisible.value = true
  }
})

/**
 * 29/30 与 38/39 共用同一个组件实例，菜单/路由切换时先恢复对应编号的初始状态，
 * 避免上一个编号的赋权弹窗或排序结果带到下一个页面。
 */
watch(featureNo, (no) => {
  userSelectVisible.value = false
  saveConfirmVisible.value = false
  rows.value = initialRows()
  if (no === 39) {
    initUserSelection(no)
    userSelectVisible.value = true
  }
})

function editRow(row) {
  ElMessage.info(`「${row.tableName}」修改功能未接入`)
}

async function removeRow(row) {
  try {
    await ElMessageBox.confirm(`确认删除数据模型「${row.tableName}」吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
  } catch (error) {
    return
  }
  rows.value = rows.value.filter((item) => item.id !== row.id)
  ElMessage.success('删除成功')
}

function addModel() {
  ElMessage.info('添加数据模型功能未接入')
}
</script>

<style scoped>
.nf-search-row {
  justify-content: flex-end;
  padding-right: 125px;
}

.nf-search-box {
  position: relative;
  width: 332px;
  margin-right: 28px;
}

.nf-search-input {
  width: 100%;
  height: 40px;
  padding: 0 40px 0 18px;
  border: 1px solid #e5e6eb;
  border-radius: 20px;
  color: #1f2329;
  font-size: 14px;
  outline: none;
}

.nf-search-input:focus {
  border-color: #1677ff;
}

.nf-search-btn {
  position: absolute;
  right: 6px;
  top: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.nf-type-row {
  border-top: 1px solid #f0f0f0;
  padding-right: 200px;
}

.nf-type-list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 24px;
}

.nf-type-item {
  color: #606266;
  font-size: 14px;
  cursor: pointer;
}

.nf-type-item:hover,
.nf-type-item.active {
  color: #1677ff;
}

.nf-mini-btn {
  flex: none;
  height: 22px;
  padding: 0 14px;
  border: 0;
  border-radius: 11px;
  background: #1677ff;
  color: #ffffff;
  font-size: 11px;
  cursor: pointer;
}

.nf-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 0 10px;
}

.nf-doc-link {
  margin-right: 6px;
  font-size: 13px;
}

.nf-model-card {
  margin-top: 0;
}

.nf-model-table th {
  height: 43px;
}

.nf-model-table td {
  height: 35px;
}

.nf-model-table th,
.nf-model-table td {
  font-size: 13px;
}

.nf-model-ops {
  text-align: right;
  white-space: nowrap;
  padding-right: 18px !important;
}

.nf-order-actions {
  display: inline-flex;
  gap: 4px;
  margin-right: 14px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.nf-model-table tbody tr:hover .nf-order-actions {
  opacity: 1;
}

.nf-order-btn {
  width: 22px;
  height: 22px;
  border: 1px solid #d9e3f0;
  border-radius: 3px;
  background: #ffffff;
  color: #1677ff;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
}

.nf-order-btn:hover {
  border-color: #1677ff;
  background: #eaf3ff;
}

/* ---------- 38 用户选择 / 新增赋权 ---------- */
:global(.nf-user-dialog) {
  margin-top: 32px;
  padding: 0;
}

:global(.nf-user-dialog .el-dialog__header) {
  padding: 17px 24px 18px;
  border-bottom: 1px solid #ebeef5;
}

:global(.nf-user-dialog .el-dialog__body) {
  max-height: none;
  padding: 0 15px;
}

:global(.nf-user-dialog .el-dialog__footer) {
  padding: 24px 24px 30px;
}

.nf-user-title {
  display: block;
  color: #1f2329;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
}

.nf-user-tabs {
  display: flex;
  gap: 9px;
  margin-top: 9px;
}

.nf-user-tab {
  height: 34px;
  padding: 0 22px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: none;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
}

.nf-user-tab.active {
  border-bottom-color: #1677ff;
  color: #1677ff;
}

.nf-user-filter {
  display: flex;
  align-items: center;
  height: 35px;
  margin-top: 16px;
  padding-left: 20px;
}

.nf-user-flabel {
  flex: none;
  color: #606266;
  font-size: 14px;
}

.nf-user-flabel2 {
  margin-left: 62px;
}

.nf-user-input {
  flex: none;
  width: 190px;
  height: 35px;
  margin-left: 15px;
  padding: 0 16px;
  border: 1px solid #e6e9ef;
  border-radius: 18px;
  color: #1f2329;
  font-size: 13px;
  outline: none;
}

.nf-user-input::placeholder {
  color: #b6bcc8;
}

.nf-user-input:focus {
  border-color: #1677ff;
}

.nf-user-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90px;
  height: 36px;
  margin-left: 40px;
  padding: 0 13px 0 17px;
  border: 0;
  border-radius: 18px;
  background: #1677ff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-user-search:hover {
  background: #4096ff;
}

.nf-user-panels {
  display: flex;
  align-items: flex-start;
  margin-top: 12px;
}

.nf-user-panel {
  display: flex;
  flex: none;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #ebeef5;
  border-radius: 2px;
  background: #ffffff;
}

.nf-user-panel-left {
  width: 378px;
  height: 371px;
}

.nf-user-panel-right {
  width: 380px;
  height: 375px;
}

.nf-user-panel-head {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 37px;
  padding: 0 15px;
  border-bottom: 1px solid #ebeef5;
  color: #1f2329;
  font-size: 14px;
  font-weight: 600;
}

.nf-user-panel-head svg {
  flex: none;
}

.nf-user-scroll {
  scrollbar-color: #c8ccd4 #f7f7f7;
  scrollbar-width: thin;
}

.nf-user-scroll::-webkit-scrollbar {
  width: 8px;
}

.nf-user-scroll::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #c8ccd4;
}

.nf-user-scroll::-webkit-scrollbar-track {
  background: #f7f7f7;
}

.nf-user-scroll-left {
  height: 304px;
  overflow-y: auto;
}

.nf-user-scroll-right {
  height: 338px;
  overflow-y: auto;
}

.nf-user-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.nf-user-table th {
  position: sticky;
  top: 0;
  z-index: 1;
  height: 43px;
  padding: 0 4px;
  border: 1px solid #ebeef5;
  background: #fafafa;
  color: #1f2329;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.nf-user-table td {
  height: 35px;
  padding: 0 10px;
  border: 1px solid #ebeef5;
  color: #5b6e9d;
  font-size: 14px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
}

.nf-user-table .nf-user-center {
  padding: 0;
  text-align: center;
}

.nf-user-table .nf-user-empty {
  height: 120px;
  color: #909399;
  text-align: center;
}

.nf-user-table .nf-user-result-empty {
  height: 34px;
  color: #606266;
  text-align: center;
}

.nf-user-pager {
  flex: none;
  display: flex;
  align-items: center;
  height: 30px;
  padding: 0 8px;
  border-top: 1px solid #ebeef5;
  background: #ffffff;
  color: #7d8798;
  font-size: 12px;
}

.nf-user-pager-ctrls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nf-user-page-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  background: none;
  color: #aeb6c4;
  cursor: default;
}

.nf-user-page-num {
  min-width: 14px;
  color: #1677ff;
  text-align: center;
}

.nf-user-page-total {
  margin: 0 2px;
}

.nf-user-range {
  margin-left: 10px;
  padding-left: 10px;
  border-left: 1px solid #e5e6eb;
  white-space: nowrap;
  overflow: hidden;
}

.nf-user-arrows {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 107px;
  padding-top: 81px;
  gap: 87px;
}

.nf-user-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.nf-user-arrow:hover {
  opacity: 0.75;
}

.nf-user-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 35px;
  padding-right: 5px;
}

.nf-user-cancel {
  border: 0;
  background: none;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
}

.nf-user-confirm {
  width: 79px;
  height: 36px;
  border: 0;
  border-radius: 18px;
  background: #1677ff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-user-confirm:hover {
  background: #4096ff;
}

/* 保存确认 */
:global(.nf-save-dialog) {
  margin-top: 32px;
  padding: 0;
}

:global(.nf-save-dialog .el-dialog__header) {
  padding: 17px 24px 16px;
}

:global(.nf-save-dialog .el-dialog__body) {
  max-height: none;
  padding: 41px 24px 0;
}

:global(.nf-save-dialog .el-dialog__footer) {
  padding: 19px 24px 8px;
}

.nf-save-title {
  display: block;
  color: #1f2329;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
}

.nf-save-body {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 26px;
  color: #1f2329;
  font-size: 14px;
}

.nf-save-body svg {
  flex: none;
}

.nf-save-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 35px;
}

.nf-save-cancel {
  border: 0;
  background: none;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
}

.nf-save-confirm {
  width: 79px;
  height: 36px;
  border: 0;
  border-radius: 18px;
  background: #1677ff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-save-confirm:hover {
  background: #4096ff;
}
</style>