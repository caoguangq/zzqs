<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { modelCities } from '../../data/modelCatalog.js'
import { overviewRows, pinnedModel } from '../../data/modelOverview.js'

const route = useRoute()
const router = useRouter()
const no = Number(route.params.no || 11)

const keyword = ref('')
const applied = ref('')
const cities = ref([])
const multi = ref(false)
const sort = ref('创建时间')
const view = ref(no === 19 ? 'cards' : 'list')
const selected = ref([])
const detail = ref(null)
const doc = ref(false)
const pendingId = ref(no === 24 ? 'MO15' : null)
const deleteTarget = computed(() => {
  if (!pendingId.value) return null
  if (pendingId.value === pinnedModel.id) return pinnedModel
  return overviewRows.find((row) => row.id === pendingId.value) || null
})
const pinnedId = ref(no === 20 ? pinnedModel.id : null)

const visibleRows = computed(() => {
  let list = overviewRows.filter((row) => (!applied.value || row.name.includes(applied.value)) && row.id !== pinnedId.value)
  if (cities.value.length) list = list.filter((row) => cities.value.includes(row.city))
  if (sort.value === '最近更新时间') list = [...list].sort((a, b) => String(b.updated).localeCompare(String(a.updated)))
  if (sort.value === '热度等级') list = [...list].sort((a, b) => b.heat - a.heat)
  return list
})
const pinnedRow = computed(() => {
  if (!pinnedId.value) return null
  if (pinnedId.value === pinnedModel.id) return pinnedModel
  return overviewRows.find((row) => row.id === pinnedId.value) || null
})
const rows = computed(() => (pinnedRow.value ? [pinnedRow.value, ...visibleRows.value] : visibleRows.value))
const all = computed({
  get: () => rows.value.length > 0 && selected.value.length === rows.value.length,
  set: (value) => { selected.value = value ? rows.value.map((row) => row.id) : [] }
})

function search() { applied.value = keyword.value.trim(); selected.value = [] }
function toggleCity(city) {
  if (multi.value) {
    cities.value = cities.value.includes(city) ? cities.value.filter((item) => item !== city) : [...cities.value, city]
  } else {
    cities.value = cities.value.length === 1 && cities.value[0] === city ? [] : [city]
  }
  selected.value = []
}
function togglePin(row) {
  pinnedId.value = pinnedId.value === row.id ? null : row.id
  selected.value = []
  ElMessage.success(pinnedId.value ? '置顶成功' : '已取消置顶')
}
function remove(row) { pendingId.value = row.id }
function cancelDelete() { pendingId.value = null }
function confirmDelete() {
  const row = deleteTarget.value
  if (!row) return
  if (row.id === pinnedModel.id) {
    pinnedId.value = null
  } else {
    const index = overviewRows.findIndex((item) => item.id === row.id)
    if (index >= 0) overviewRows.splice(index, 1)
  }
  selected.value = selected.value.filter((id) => id !== row.id)
  pendingId.value = null
  ElMessage.success('删除成功')
}
function edit(row) { router.push({ path: '/new/23', query: { row: row.id } }) }
function unavailable(text) { ElMessage.info(text + '暂不可用') }
</script>

<template>
  <div class="nf-feature-11 nf-model-overview">
    <div class="nf-filter-bar">
      <span>过滤条件</span>
      <form @submit.prevent="search">
        <input v-model="keyword" aria-label="工作表名称" placeholder="请输入工作表名称查找..." />
        <button class="nf-search" type="submit" aria-label="查询工作表">⌕</button>
        <button class="nf-add" type="button" @click="router.push('/new/12')">添加数据模型 <b>+</b></button>
      </form>
    </div>

    <section class="nf-options">
      <div class="nf-option-row">
        <span>业务类型：</span>
        <button v-for="city in modelCities" :key="city" :class="{ active: cities.includes(city) }" @click="toggleCity(city)">{{ city }}</button>
        <button class="nf-multi" :class="{ active: multi }" @click="multi = !multi">多选</button>
      </div>
      <div class="nf-option-row">
        <span>升降排序：</span>
        <button v-for="item in ['最近更新时间', '热度等级', '创建时间']" :key="item" :class="{ active: sort === item }" @click="sort = item">{{ item }}</button>
      </div>
    </section>

    <div class="nf-viewbar">
      <div class="nf-view-toggle">
        <button :class="{ active: view === 'cards' }" aria-label="卡片视图" @click="view = 'cards'">▦</button>
        <button :class="{ active: view === 'list' }" aria-label="列表视图" @click="view = 'list'">☷</button>
      </div>
      <button class="nf-doc" @click="doc = true">取数操作文档</button>
    </div>

    <div v-if="view === 'list'" class="nf-model-table">
      <table>
        <colgroup><col style="width:1.6%" /><col style="width:25%" /><col style="width:15.2%" /><col style="width:11.6%" /><col style="width:11.7%" /><col style="width:10.4%" /><col style="width:24.5%" /></colgroup>
        <thead>
          <tr><th><input v-model="all" :indeterminate="selected.length > 0 && !all" type="checkbox" aria-label="全选数据模型" /></th><th>中文表名称</th><th>更新时间</th><th>模型发布人</th><th>模型业务负责人</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" :class="{ 'pinned-row': row.id === pinnedId }">
            <td><input v-model="selected" type="checkbox" :value="row.id" :aria-label="'选择' + row.name" /></td>
            <td class="name-cell">
              <button type="button" class="pin-btn" :class="{ on: row.id === pinnedId }" :aria-label="row.id === pinnedId ? '取消置顶' : '置顶模型'" :title="row.id === pinnedId ? '取消置顶' : '置顶'" @click.stop="togglePin(row)">
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.2 1.3 14.7 6.8l-.5 1.6-2.7.4-2.3 3.5.2 2.4-1.1 1.1-2.9-2.9-3.7 3.7-.6-.6 3.7-3.7-2.9-2.9 1.1-1.1 2.4.2 3.5-2.3.4-2.7z" fill="currentColor"/></svg>
              </button>
              <span>{{ row.name }}</span>
            </td>
            <td>{{ row.updated }}</td>
            <td>{{ row.publisher }}</td>
            <td>{{ row.owner }}</td>
            <td>{{ row.status }}</td>
            <td class="nf-ops"><button @click="detail = row">查看</button> / <button @click="unavailable('授权')">授权</button> / <button @click="edit(row)">修改</button> / <button @click="remove(row)">删除</button></td>
          </tr>
          <tr v-if="!rows.length"><td colspan="7">暂无数据</td></tr>
        </tbody>
      </table>
    </div>

    <div v-else class="nf-model-cards">
      <article v-for="row in rows" :key="row.id" :class="{ 'pinned-card': row.id === pinnedId }" @click="detail = row">
        <button type="button" class="pin-btn" :class="{ on: row.id === pinnedId }" :aria-label="row.id === pinnedId ? '取消置顶' : '置顶模型'" :title="row.id === pinnedId ? '取消置顶' : '置顶'" @click.stop="togglePin(row)">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.2 1.3 14.7 6.8l-.5 1.6-2.7.4-2.3 3.5.2 2.4-1.1 1.1-2.9-2.9-3.7 3.7-.6-.6 3.7-3.7-2.9-2.9 1.1-1.1 2.4.2 3.5-2.3.4-2.7z" fill="currentColor"/></svg>
        </button>
        <span class="model-icon">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="20" fill="#1f8ed6" />
            <path d="M9 22.5c2.8-5.6 6.2-5.6 9 0s6.2 5.6 9 0" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" />
            <path d="M12 27c2.3-4.2 5-4.2 7.3 0s5 4.2 7.3 0" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" />
          </svg>
        </span>
        <div class="card-text">
          <h3 :title="row.name">{{ row.name }}</h3>
          <p>直连数据</p>
        </div>
      </article>
      <p v-if="!rows.length" class="empty">暂无数据</p>
    </div>

    <el-dialog :model-value="!!detail" title="数据模型详情" width="620px" @close="detail = null">
      <template v-if="detail">
        <p>中文表名称：{{ detail.name }}</p>
        <p>更新时间：{{ detail.updated }}</p>
        <p>模型发布人：{{ detail.publisher }}</p>
        <p>模型业务负责人：{{ detail.owner }}</p>
        <p>状态：{{ detail.status }}</p>
      </template>
    </el-dialog>
    <el-dialog v-model="doc" title="取数操作文档" width="620px">
      <p>1. 在数据模型管理中按业务类型或名称查找模型。</p>
      <p>2. 点击“查看”核对字段与更新时间，点击“授权”分配取数权限。</p>
      <p>3. 点击“添加数据模型”按数据库表新增、字段配置、预览三步完成建模。</p>
      <p>4. 发布后的模型可在自助取数中直接使用，删除前请确认无任务引用。</p>
    </el-dialog>

    <Teleport to="body">
      <div v-if="deleteTarget" class="nf-delete-mask">
        <section class="nf-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="nf-delete-title">
          <h2 id="nf-delete-title">提示</h2>
          <div class="nf-delete-body">
            <span class="nf-delete-icon" aria-hidden="true">!</span>
            <p>您确定需要删除“{{ deleteTarget.name }}”直连表数据吗？删除之后，基于该表做的任务将无法正常运行</p>
          </div>
          <footer>
            <button type="button" class="nf-delete-cancel" @click="cancelDelete">取消</button>
            <button type="button" class="nf-delete-ok" @click="confirmDelete">确定</button>
          </footer>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.nf-model-overview { margin: -33px -43px -40px -31px; padding: 24px 0 40px; color: #8293ab; font-size: 12px; }
.nf-filter-bar { margin: 4px 117px 22px 54px; display: flex; align-items: center; justify-content: space-between; height: 36px; color: #30475f; }
.nf-filter-bar > span { font-size: 14px; }
.nf-filter-bar form { display: flex; align-items: center; gap: 14px; }
.nf-filter-bar input { width: 346px; height: 36px; border: 1px solid #e7ecf3; border-radius: 20px; padding: 0 40px 0 14px; color: inherit; font: inherit; }
.nf-filter-bar input::placeholder { color: #a9b8c7; }
.nf-search { width: 36px; height: 36px; margin-left: -50px; border: 0; background: none; color: #9cacc1; font-size: 20px; cursor: pointer; }
.nf-add { height: 36px; padding: 0 30px; border: 0; border-radius: 20px; background: #409eff; color: #fff; font: inherit; cursor: pointer; }
.nf-add b { margin-left: 14px; font-weight: 400; font-size: 18px; }
.nf-options { margin: 0 52px 0 54px; border: 1px solid #eee; background: #fafafa; }
.nf-option-row { display: flex; align-items: center; height: 47px; padding: 0 48px; gap: 22px; border-bottom: 1px solid #eee; position: relative; }
.nf-option-row:last-child { border-bottom: 0; }
.nf-option-row > span { color: #9baec4; width: 78px; flex-shrink: 0; }
.nf-option-row button { border: 0; background: none; padding: 0; color: #30475f; font: inherit; cursor: pointer; }
.nf-option-row button.active { color: #008bff; }
.nf-option-row .nf-multi { position: absolute; right: 170px; height: 25px; padding: 0 14px; border-radius: 13px; background: #409eff; color: #fff; font-size: 12px; }
.nf-option-row .nf-multi.active { background: #2b7cd3; }
.nf-viewbar { height: 76px; padding: 10px 56px 0; text-align: right; }
.nf-view-toggle { display: flex; justify-content: flex-end; }
.nf-view-toggle button { width: 23px; height: 23px; border: 1px solid #e5e7eb; background: #fff; color: #657384; font-size: 13px; line-height: 1; cursor: pointer; }
.nf-view-toggle button.active { color: #1681d7; border-color: #a9c9ea; }
.nf-doc { margin-top: 10px; border: 0; background: none; color: #1681d7; font: inherit; cursor: pointer; }
.nf-model-table { margin: 0 54px; overflow: auto; border: 1px solid #e8e8e8; background: #fff; }
.nf-model-table table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.nf-model-table th { height: 36px; background: #fafafa; color: #333; font-weight: 600; font-size: 14px; border: 1px solid #e8e8e8; }
.nf-model-table td { height: 36px; border: 1px solid #e8e8e8; text-align: center; padding: 0 4px; color: #333; word-break: normal; overflow-wrap: break-word; }
.nf-model-table tbody tr:hover { background: #f4f8fd; }
.nf-model-table tbody tr.pinned-row td { background: #edf2f9; }
.nf-model-table tbody tr.pinned-row:hover td { background: #e7eef8; }
.name-cell { position: relative; }
.pin-btn { position: absolute; left: 6px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; border: 0; background: none; padding: 0; color: #9aa8b8; cursor: pointer; opacity: 0; transition: opacity 0.15s ease; }
.pin-btn svg { width: 13px; height: 13px; display: block; margin: auto; }
.pin-btn:hover, .pin-btn.on { color: #1681d7; }
.nf-model-table tbody tr:hover .pin-btn { opacity: 1; }
.nf-ops { text-align: center !important; color: #1681d7; }
.nf-ops button { border: 0; background: none; padding: 0; color: #1681d7; font: inherit; cursor: pointer; }
.nf-model-cards { margin: 0 54px; padding-top: 15px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 52px; row-gap: 35px; }
.nf-model-cards article { position: relative; min-width: 0; overflow: hidden; display: flex; align-items: center; gap: 22px; height: 87px; background: #fff; border: 1px solid #eee; padding: 0 22px 0 32px; cursor: pointer; }
.nf-model-cards article:hover { box-shadow: 0 2px 10px rgba(22, 119, 255, 0.08); }
.nf-model-cards article.pinned-card { background: #edf2f9; }
.model-icon { flex: none; width: 42px; height: 42px; }
.model-icon svg { width: 42px; height: 42px; display: block; }
.card-text { min-width: 0; flex: 1; position: relative; top: 9px; }
.nf-model-cards h3 { margin: 0; max-width: 170px; font-size: 14px; color: #333; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nf-model-cards p { margin: 12px 0 0; color: #999; font-size: 12px; }
.nf-model-cards .pin-btn { left: auto; right: 8px; top: 8px; transform: none; }
.nf-model-cards article:hover .pin-btn { opacity: 1; }
.nf-model-cards .empty { grid-column: 1 / -1; text-align: center; color: #909399; }
@media (max-width: 1500px) {
  .nf-option-row { gap: 14px; padding: 0 20px; }
  .nf-model-table table { min-width: 1200px; }
  .nf-model-cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 1100px) {
  .nf-model-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 900px) {
  .nf-filter-bar { height: auto; flex-wrap: wrap; gap: 12px; }
  .nf-options { overflow: auto; }
  .nf-option-row { min-width: 900px; }
  .nf-model-cards { grid-template-columns: minmax(0, 1fr); }
}
.nf-delete-mask { position: fixed; inset: 0; z-index: 3000; background: rgba(0, 0, 0, 0.35); }
.nf-delete-dialog { position: fixed; top: 33px; left: 50%; transform: translateX(-50%); width: 420px; max-width: calc(100vw - 32px); background: #fff; border-radius: 4px; box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18); overflow: hidden; color: #333; font-size: 14px; }
.nf-delete-dialog h2 { display: flex; align-items: center; justify-content: center; height: 59px; margin: 0; border-bottom: 1px solid #eee; font-size: 18px; font-weight: 600; color: #303133; }
.nf-delete-body { display: flex; gap: 30px; padding: 26px 25px 22px 44px; }
.nf-delete-icon { flex: none; width: 42px; height: 42px; border-radius: 50%; background: #ffd60a; color: #fff; font-size: 28px; font-weight: 600; line-height: 42px; text-align: center; }
.nf-delete-body p { flex: 1; margin: 0; line-height: 24px; font-size: 14px; color: #333; }
.nf-delete-dialog footer { display: flex; align-items: center; justify-content: flex-end; gap: 26px; padding: 0 24px 20px; }
.nf-delete-dialog footer button { height: 36px; border: 0; font: inherit; cursor: pointer; }
.nf-delete-cancel { padding: 0 8px; background: none; color: #606266; }
.nf-delete-ok { min-width: 62px; padding: 0 18px; border-radius: 18px; background: #2f7cf6; color: #fff; }
.nf-delete-cancel:hover { color: #1677ff; }
.nf-delete-ok:hover { background: #4096ff; }
@media (max-width: 520px) {
  .nf-delete-body { gap: 16px; padding: 20px 18px 18px 20px; }
  .nf-delete-dialog footer { gap: 12px; padding: 0 18px 16px; }
}
</style>
