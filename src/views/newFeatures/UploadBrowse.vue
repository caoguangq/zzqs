<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { uploadRows } from '../../data/uploadFiles.js'
import AppendUploadDialog from './AppendUploadDialog.vue'

const filters = reactive({ name: '', creator: '', purpose: '全部', field: '', page: 1 })
const applied = ref({ name: '', creator: '', purpose: '全部', field: '' })
const page = ref(1)
const selected = ref([])
const detail = ref(null)
const pageInput = ref('')
const appendVisible = ref(false)
const editingRow = ref(null)

function openAppend(row) {
  editingRow.value = row
  appendVisible.value = true
}

function applyAppend(payload) {
  if (editingRow.value) {
    editingRow.value.records = String(Number(editingRow.value.records) + payload.recordCount)
    editingRow.value.database = payload.database
    editingRow.value.field = payload.field
  } else {
    const now = new Date()
    const pad = (value) => String(value).padStart(2, '0')
    uploadRows.unshift({
      id: 'UPLOADAPPEND' + Date.now(),
      name: payload.name,
      state: '成功',
      records: String(payload.recordCount),
      field: payload.field,
      database: payload.database,
      creator: '邱艳',
      uploadedAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      validDays: '15天'
    })
  }
}

const rows = computed(() => uploadRows.filter((row) =>
  (!applied.value.name || row.name.includes(applied.value.name)) &&
  (!applied.value.creator || row.creator.includes(applied.value.creator)) &&
  (!applied.value.field || row.field.includes(applied.value.field))
))
const pageRows = computed(() => {
  if (page.value !== 1) return []
  const all = rows.value
  const pages = Math.max(1, Math.ceil(all.length / 10))
  return all.slice(0, 10).length && pages >= 1 ? all.slice(0, 10) : all
})
const all = computed({
  get: () => pageRows.value.length > 0 && selected.value.length === pageRows.value.length,
  set: (value) => { selected.value = value ? pageRows.value.map((row) => row.id) : [] }
})

function search() {
  applied.value = { name: filters.name.trim(), creator: filters.creator.trim(), purpose: filters.purpose, field: filters.field.trim() }
  page.value = 1
  selected.value = []
}
async function remove(row) {
  try { await ElMessageBox.confirm('确定删除该上传文件吗？', '询问', { confirmButtonText: '确定', cancelButtonText: '取消' }) } catch { return }
  const index = uploadRows.findIndex((item) => item.id === row.id)
  if (index >= 0) uploadRows.splice(index, 1)
  selected.value = selected.value.filter((id) => id !== row.id)
  ElMessage.success('删除成功')
}
async function removeSelected() {
  if (!selected.value.length) return ElMessage.warning('请先选择文件')
  try { await ElMessageBox.confirm('确定删除所选上传文件吗？', '询问', { confirmButtonText: '确定', cancelButtonText: '取消' }) } catch { return }
  for (let index = uploadRows.length - 1; index >= 0; index--) {
    if (selected.value.includes(uploadRows[index].id)) uploadRows.splice(index, 1)
  }
  selected.value = []
  ElMessage.success('删除成功')
}
function setPage(value) {
  const number = Number(value)
  if (!Number.isInteger(number) || number < 1 || number > 1736) return ElMessage.warning('请输入有效页码')
  page.value = number
}
function unavailable(text) { ElMessage.info(text + '暂不可用') }
</script>

<template>
  <div class="nf-feature-15">
    <form class="nf-upload-filters" @submit.prevent="search">
      <label>文件名称<input v-model="filters.name" aria-label="文件名称" placeholder="请输入名称..." /></label>
      <label>创建人<input v-model="filters.creator" aria-label="创建人" placeholder="请输入创建人..." /></label>
      <label>取数用途<select v-model="filters.purpose" aria-label="取数用途"><option>全部</option><option>运维</option><option>业务分析</option><option>数据核查</option></select></label>
      <label>设定的关联字段<input v-model="filters.field" aria-label="设定的关联字段" placeholder="请输入关联字段..." /></label>
      <button class="nf-query" type="submit">查询 <span>⌕</span></button>
    </form>

    <section class="nf-card">
      <header>
        <h2>文件上传浏览</h2>
        <aside>
          <button class="nf-outline" @click="removeSelected">批量删除</button>
          <button class="nf-primary" @click="unavailable('共享数据查看')">共享数据查看</button>
          <button class="nf-primary" @click="openAppend(null)">新建导入</button>
        </aside>
      </header>
      <div class="nf-table-scroll">
        <table>
          <colgroup><col style="width:2.7%" /><col style="width:11.1%" /><col style="width:5.6%" /><col style="width:5.6%" /><col style="width:12.2%" /><col style="width:12.2%" /><col style="width:12.2%" /><col style="width:12.2%" /><col style="width:8.9%" /><col style="width:17.3%" /></colgroup>
          <thead><tr><th><input v-model="all" :indeterminate="selected.length > 0 && !all" type="checkbox" aria-label="全选上传文件" /></th><th>文件名称</th><th>状态</th><th>记录数</th><th>设定的关联字段</th><th>数据库</th><th>创建人</th><th>文件上传时间</th><th>有效天数</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="row in pageRows" :key="row.id">
              <td><input v-model="selected" type="checkbox" :value="row.id" :aria-label="'选择' + row.name" /></td>
              <td>{{ row.name }}</td>
              <td>{{ row.state }}</td>
              <td>{{ row.records }}</td>
              <td>{{ row.field }}</td>
              <td>{{ row.database }}</td>
              <td>{{ row.creator }}</td>
              <td>{{ row.uploadedAt }}</td>
              <td>{{ row.validDays }}</td>
              <td class="nf-ops"><button @click="detail = row">查看</button>/<button @click="unavailable('修改')">修改</button>/<button @click="remove(row)">删除</button>/<button @click="openAppend(row)">追加</button>/<button @click="unavailable('更新')">更新</button></td>
            </tr>
            <tr v-if="!pageRows.length"><td colspan="10">暂无数据</td></tr>
          </tbody>
        </table>
      </div>
      <div class="nf-pager">
        <span>共 17351 条记录,1736页</span>
        <nav>
          <button :disabled="page === 1" @click="page > 1 && page--">上一页</button>
          <button v-for="n in 6" :key="n" :class="{ active: page === n }" @click="page = n">{{ n }}</button>
          <span>...</span><button @click="page = 1736">1736</button>
          <button :disabled="page === 1736" @click="page < 1736 && page++">下一页</button>
          <span>至第</span><input v-model="pageInput" aria-label="至第几页" /><span>页</span><button @click="setPage(pageInput)">确定</button>
        </nav>
      </div>
    </section>

    <AppendUploadDialog v-model:visible="appendVisible" :row="editingRow" @save="applyAppend" />

    <el-dialog :model-value="!!detail" title="上传文件详情" width="600px" @close="detail = null">
      <template v-if="detail">
        <p>文件名称：{{ detail.name }}</p>
        <p>状态：{{ detail.state }}</p>
        <p>记录数：{{ detail.records }}</p>
        <p>设定的关联字段：{{ detail.field }}</p>
        <p>数据库：{{ detail.database }}</p>
        <p>创建人：{{ detail.creator }}</p>
        <p>文件上传时间：{{ detail.uploadedAt }}</p>
        <p>有效天数：{{ detail.validDays }}</p>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.nf-feature-15 { margin: -33px -43px -40px -31px; padding: 12px 0 50px 31px; color: #6b7a87; font-size: 12px; }
.nf-upload-filters { display: flex; align-items: flex-end; gap: 0; margin: 16px 74px 45px 29px; }
.nf-upload-filters label { display: flex; flex-direction: column; gap: 10px; color: #30475f; flex: 0 0 18.3%; max-width: none; }
.nf-upload-filters label:nth-child(2), .nf-upload-filters label:nth-child(3) { flex-basis: 23.5%; }
.nf-upload-filters label:nth-child(4) { flex-basis: 23.7%; }
.nf-upload-filters input, .nf-upload-filters select { width: 296px; max-width: 100%; height: 36px; border: 1px solid #e7ecf3; border-radius: 20px; padding: 0 14px; color: #8b949e; font: inherit; background: #fff; }
.nf-query { height: 36px; width: 96px; border: 0; border-radius: 20px; background: #35a9e0; color: #fff; font: inherit; cursor: pointer; flex-shrink: 0; }
.nf-query span { margin-left: 10px; font-size: 17px; }
.nf-card { background: #fff; border: 1px solid #eee; margin-left: 29px; margin-right: 74px; padding: 12px 20px 0; }
.nf-card > header { display: flex; align-items: center; justify-content: space-between; height: 45px; }
.nf-card h2 { font-size: 16px; font-weight: 400; color: #30475f; margin: 0; }
.nf-card aside { display: flex; gap: 12px; }
.nf-card button { font: inherit; cursor: pointer; }
.nf-outline { height: 36px; padding: 0 18px; border: 1px solid #e4ebf5; border-radius: 20px; background: #fff; color: #606266; }
.nf-primary { height: 36px; padding: 0 18px; border: 0; border-radius: 20px; background: #1681d7; color: #fff; }
.nf-table-scroll { overflow: auto; }
table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 12px; }
th { height: 50px; background: #fafbfe; color: #30475f; font-weight: 400; border: 1px solid #eee; }
td { height: 37px; border: 1px solid #eee; text-align: center; padding: 0 4px; overflow-wrap: anywhere; }
tbody tr:hover { background: #f4f8fd; }
.nf-ops button { border: 0; background: none; color: #1681d7; padding: 0; font: inherit; cursor: pointer; }
.nf-pager { display: flex; align-items: center; justify-content: space-between; height: 40px; color: #30475f; }
.nf-pager nav { display: flex; align-items: center; gap: 8px; }
.nf-pager button { min-width: 30px; height: 28px; border: 1px solid #e4ebf5; background: #fff; color: #606266; font: inherit; cursor: pointer; }
.nf-pager button.active { background: #1681d7; color: #fff; border-color: #1681d7; }
.nf-pager input { width: 40px; height: 26px; border: 1px solid #e4ebf5; text-align: center; }
@media (max-width: 1400px) {
  .nf-upload-filters { flex-wrap: wrap; }
  .nf-table-scroll table { min-width: 1200px; }
}
</style>
