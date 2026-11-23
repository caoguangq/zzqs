<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { previewRows, previewTaskInfo } from '../../data/filePreview.js'

const selected = ref([])
const pageInput = ref('1')
const page = ref(1)
const rowsPerPage = ref(10)
const total = ref(previewTaskInfo.records)
const keyword = ref('')
const appliedKeyword = ref('')
const searchVisible = ref(false)
const action = reactive({ visible: false, type: '', title: '', value: '', option: '用户编码' })

const pages = computed(() => Math.max(1, Math.ceil(total.value / Number(rowsPerPage.value))))
const filtered = computed(() => previewRows.filter((row) => !appliedKeyword.value || row.code.includes(appliedKeyword.value)))
const pageRows = computed(() => (page.value === 1 ? filtered.value.slice(0, Number(rowsPerPage.value)) : []))
const all = computed({
  get: () => pageRows.value.length > 0 && selected.value.length === pageRows.value.length,
  set: (value) => { selected.value = value ? pageRows.value.map((row) => row.id) : [] }
})

function goPage() {
  const number = Number(pageInput.value)
  if (!Number.isInteger(number) || number < 1 || number > pages.value) {
    pageInput.value = String(page.value)
    return ElMessage.warning('请输入有效页码')
  }
  page.value = number
  selected.value = []
}
function step(delta) {
  page.value = Math.min(pages.value, Math.max(1, page.value + delta))
  pageInput.value = String(page.value)
  selected.value = []
}
function firstPage() { page.value = 1; pageInput.value = '1'; selected.value = [] }
function lastPage() { page.value = pages.value; pageInput.value = String(pages.value); selected.value = [] }
function changeRows() {
  page.value = 1
  pageInput.value = '1'
  selected.value = []
  ElMessage.success('行数已更新')
}
function refresh() {
  page.value = 1
  pageInput.value = '1'
  selected.value = []
  keyword.value = ''
  appliedKeyword.value = ''
  ElMessage.success('刷新成功')
}
function applySearch() {
  appliedKeyword.value = keyword.value.trim()
  searchVisible.value = false
  selected.value = []
}
function resetSearch() {
  keyword.value = ''
  appliedKeyword.value = ''
  searchVisible.value = false
  selected.value = []
}
async function removeSelected() {
  if (!selected.value.length) return ElMessage.warning('请先选择数据')
  try { await ElMessageBox.confirm('确定删除所选数据吗？', '询问', { confirmButtonText: '确定', cancelButtonText: '取消' }) } catch { return }
  const count = selected.value.length
  for (let index = previewRows.length - 1; index >= 0; index--) {
    if (selected.value.includes(previewRows[index].id)) previewRows.splice(index, 1)
  }
  total.value = Math.max(0, total.value - count)
  selected.value = []
  ElMessage.success('删除成功')
}
function escapeCell(value) {
  const text = String(value)
  return /[",\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text
}
function download() {
  const data = [['用户编码'], ...pageRows.value.map((row) => [row.code])]
  const content = '﻿' + data.map((line) => line.map(escapeCell).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = '编码.csv'
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('下载成功')
}
function openAction(type) {
  action.type = type
  action.value = type === 'save' ? previewTaskInfo.fileName : ''
  action.option = '用户编码'
  action.title = { save: '另存为', relate: '关联其他数据', share: '共享数据' }[type]
  action.visible = true
}
function confirmAction() {
  if (!action.value.trim()) return ElMessage.warning('请输入内容')
  action.visible = false
  ElMessage.success({ save: '另存为成功', relate: '关联成功', share: '共享成功' }[action.type])
}
</script>

<template>
  <div class="nf-feature-17">
    <div class="nf17-toolbar">
      <button type="button" aria-label="另存为" @click="openAction('save')">
        <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M6 3h12l5 5v16H6z" fill="none" stroke="#5b8c78" stroke-width="1.6"/><path d="M9 3v7h9V3" fill="none" stroke="#5b8c78" stroke-width="1.6"/><path d="M13.5 17v6m0 0-3-3m3 3 3-3" fill="none" stroke="#3aae7a" stroke-width="1.8"/></svg>
        <span>另存为</span>
      </button>
      <button type="button" aria-label="关联其他数据" @click="openAction('relate')">
        <svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3.5" y="4.5" width="13" height="17" rx="1.5" fill="none" stroke="#2aa8a8" stroke-width="1.7"/><rect x="11" y="9" width="13" height="15" rx="1.5" fill="#fff" stroke="#2aa8a8" stroke-width="1.7"/><circle cx="14" cy="12.5" r="1" fill="#2aa8a8"/><circle cx="18" cy="12.5" r="1" fill="#2aa8a8"/><path d="M14 18h7" stroke="#2aa8a8" stroke-width="1.5"/></svg>
        <span>关联其他数据</span>
      </button>
      <button type="button" aria-label="下载数据文件" @click="download">
        <svg viewBox="0 0 28 28" aria-hidden="true"><path d="M14 3v14m0 0-5.5-5.5M14 17l5.5-5.5" fill="none" stroke="#41a85f" stroke-width="2"/><path d="M4 20v4h20v-4" fill="none" stroke="#41a85f" stroke-width="2"/><path d="M4 17.5h20" stroke="#41a85f" stroke-width="3"/></svg>
        <span>下载数据文件</span>
      </button>
      <button type="button" aria-label="共享数据" @click="openAction('share')">
        <svg viewBox="0 0 28 28" aria-hidden="true"><ellipse cx="14" cy="6" rx="9" ry="3.4" fill="none" stroke="#e08c34" stroke-width="1.6"/><path d="M5 6v7c0 1.9 4 3.4 9 3.4s9-1.5 9-3.4V6" fill="none" stroke="#e08c34" stroke-width="1.6"/><path d="M5 13v7c0 1.9 4 3.4 9 3.4s9-1.5 9-3.4v-7" fill="none" stroke="#e08c34" stroke-width="1.6"/><path d="M10 10.5v2m8-2v2" stroke="#e08c34" stroke-width="1.5"/></svg>
        <span>共享数据</span>
      </button>
    </div>

    <div class="nf17-band">
      <strong>数据清单信息</strong>
      <button type="button" class="nf17-batch" @click="removeSelected">批量删除</button>
    </div>

    <div class="nf17-table-wrap">
      <table>
        <colgroup><col style="width:50px" /><col /></colgroup>
        <thead>
          <tr>
            <th class="nf17-check"><input v-model="all" :indeterminate="selected.length > 0 && !all" type="checkbox" aria-label="全选数据" /></th>
            <th class="nf17-code-head">
              <span>用户编码</span>
              <el-popover v-model:visible="searchVisible" placement="bottom-end" :width="240" trigger="click">
                <template #reference>
                  <button type="button" class="nf17-search" aria-label="查询用户编码">
                    <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="#7a8794" stroke-width="1.6"/><path d="m13 13 4 4" stroke="#7a8794" stroke-width="1.6"/></svg>
                  </button>
                </template>
                <div class="nf17-search-body">
                  <input v-model="keyword" placeholder="请输入用户编码" aria-label="用户编码关键字" @keyup.enter="applySearch" />
                  <div>
                    <button type="button" @click="resetSearch">重置</button>
                    <button type="button" class="primary" @click="applySearch">查询</button>
                  </div>
                </div>
              </el-popover>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in pageRows" :key="row.id">
            <td class="nf17-check"><input v-model="selected" type="checkbox" :value="row.id" :aria-label="'选择' + row.code" /></td>
            <td>{{ row.code }}</td>
          </tr>
          <tr v-if="!pageRows.length"><td colspan="2" class="empty">暂无数据</td></tr>
        </tbody>
      </table>
    </div>

    <div class="nf17-pager">
      <button type="button" :disabled="page === 1" aria-label="第一页" @click="firstPage">⏮</button>
      <button type="button" :disabled="page === 1" aria-label="上一页" @click="step(-1)">◀</button>
      <span>页数:</span>
      <input v-model="pageInput" aria-label="页数" @keyup.enter="goPage" @blur="goPage" />
      <span>（共{{ total }}条，{{ pages }}页）</span>
      <button type="button" :disabled="page === pages" aria-label="下一页" @click="step(1)">▶</button>
      <button type="button" :disabled="page === pages" aria-label="最后一页" @click="lastPage">⏭</button>
      <span class="nf17-rows-label">行数:</span>
      <select v-model="rowsPerPage" aria-label="行数" @change="changeRows"><option :value="10">10</option><option :value="20">20</option><option :value="50">50</option></select>
      <button type="button" class="nf17-refresh" aria-label="刷新" @click="refresh">⟳</button>
      <span v-if="appliedKeyword" class="nf17-filter-tip">筛选：{{ appliedKeyword }}</span>
    </div>

    <div class="nf17-band nf17-band-info"><strong>查询任务信息</strong></div>
    <div class="nf17-info">
      <div class="nf17-info-row">
        <span>文件名称：</span>
        <p><a href="javascript:void(0)" @click="openAction('save')">{{ previewTaskInfo.fileName }}</a></p>
        <span>文件上传时间：</span>
        <p>{{ previewTaskInfo.uploadedAt }}</p>
        <span>保存的数据库：</span>
        <p>{{ previewTaskInfo.database }}</p>
      </div>
      <div class="nf17-info-row">
        <span>文件上传员工：</span>
        <p>{{ previewTaskInfo.uploader }}</p>
        <span>文件保存有效期至：</span>
        <p>{{ previewTaskInfo.expireAt }}</p>
        <span>文件记录数：</span>
        <p>{{ previewTaskInfo.records }}</p>
      </div>
      <div class="nf17-info-row">
        <span>设定关联字段：</span>
        <p>{{ previewTaskInfo.field }}</p>
      </div>
      <div class="nf17-info-row">
        <span>取数用途描述：</span>
        <p>{{ previewTaskInfo.purpose }}</p>
      </div>
    </div>

    <el-dialog v-model="action.visible" :title="action.title" width="420px">
      <div class="nf17-action-form">
        <label v-if="action.type !== 'relate'">{{ action.type === 'save' ? '文件名称' : '共享对象' }}
          <input v-model="action.value" :placeholder="action.type === 'save' ? '请输入文件名称' : '请输入员工账号'" />
        </label>
        <label v-else>关联数据
          <select v-model="action.value">
            <option>用户编码</option><option>手机号码</option><option>区县</option>
          </select>
        </label>
      </div>
      <template #footer>
        <button type="button" class="nf17-plain" @click="action.visible = false">取消</button>
        <button type="button" class="nf17-primary" @click="confirmAction">确定</button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.nf-feature-17 { margin: -33px -43px -40px -31px; padding: 0 0 40px; background: #edf0f2; color: #333; font-size: 13px; min-height: 760px; }
.nf17-toolbar { display: flex; align-items: flex-start; gap: 0; padding: 6px 0 8px 0; background: #f9fafb; border-bottom: 1px solid #c0c0c0; }
.nf17-toolbar button { display: flex; flex-direction: column; align-items: center; gap: 9px; width: 97px; flex: none; border: 0; background: none; padding: 0; color: #333; font: inherit; cursor: pointer; }
.nf17-toolbar button span { white-space: nowrap; }
.nf17-toolbar svg { width: 30px; height: 30px; }
.nf17-band { display: flex; align-items: center; justify-content: space-between; height: 39px; padding: 0 14px 0 17px; background: #edf0f2; color: #333; }
.nf17-band strong { font-size: 14px; font-weight: 600; }
.nf17-band-info { border-bottom: 1px solid #a6c9e2; }
.nf17-batch { height: 26px; padding: 0 16px; border: 0; border-radius: 13px; background: #409eff; color: #fff; font: inherit; font-size: 12px; cursor: pointer; }
.nf17-table-wrap { background: #fff; }
table { width: 100%; border-collapse: collapse; table-layout: fixed; }
th, td { border-bottom: 1px solid #afcee5; text-align: left; }
thead th { height: 59px; padding-top: 10px; vertical-align: top; background: #fff; border-bottom: 2px solid #98bade; font-weight: 400; color: #2b88d6; }
.nf17-check { text-align: left; padding: 0 0 0 33px; }
.nf17-check input { width: 14px; height: 14px; }
thead .nf17-check { padding-top: 10px; }
.nf17-code-head { position: relative; }
.nf17-code-head > span { display: inline-block; padding-left: 30px; }
.nf17-search { position: absolute; right: 28%; top: 30px; width: 22px; height: 22px; border: 1px solid #c8d1da; border-radius: 0; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.nf17-search svg { width: 14px; height: 14px; }
tbody td { height: 30px; padding: 0 26px 0 30px; color: #606a78; }
tbody tr:first-child td { height: 36px; }
tbody tr:hover { background: #f5faff; }
tbody td.empty { height: 160px; text-align: center; color: #909399; }
.nf17-pager { display: flex; align-items: center; gap: 7px; height: 29px; padding: 0 8px; background: #eff5fa; border-top: 0; border-bottom: 1px solid #afcee5; font-size: 12px; color: #333; }
.nf17-pager > button { border: 0; background: none; color: #409eff; font: inherit; font-size: 13px; cursor: pointer; padding: 0 2px; }
.nf17-pager > button:disabled { color: #c0c4cc; cursor: default; }
.nf17-pager input { width: 38px; height: 22px; border: 1px solid #d9e2ec; text-align: center; font: inherit; }
.nf17-pager select { width: 52px; height: 22px; border: 1px solid #d9e2ec; color: #333; font: inherit; }
.nf17-rows-label { margin-left: 24px; }
.nf17-refresh { color: #409eff !important; font-size: 16px !important; }
.nf17-filter-tip { color: #909399; margin-left: 10px; }
.nf17-info { background: #f0f3f6; }
.nf17-info-row { display: grid; grid-template-columns: 13.4% 27.8% 5.2% 29% 4% minmax(0, 1fr); align-items: center; height: 31px; border-bottom: 1px solid #d0dde7; }
.nf17-info-row > span { justify-self: end; text-align: right; color: #2b88d6; white-space: nowrap; }
.nf17-info-row > p { margin: 0; padding-left: 14px; color: #4a5462; white-space: nowrap; }
.nf17-info-row a { color: #4a5462; text-decoration: none; }
.nf17-info-row a:hover { color: #1890ff; }
.nf17-action-form label { display: flex; align-items: center; gap: 12px; color: #606266; font-size: 13px; }
.nf17-action-form input, .nf17-action-form select { flex: 1; height: 32px; border: 1px solid #dcdfe6; border-radius: 4px; padding: 0 10px; font: inherit; }
.nf17-plain { height: 32px; padding: 0 16px; border: 1px solid #dcdfe6; background: #fff; border-radius: 4px; cursor: pointer; }
.nf17-primary { height: 32px; padding: 0 18px; margin-left: 10px; border: 0; border-radius: 4px; background: #409eff; color: #fff; cursor: pointer; }
@media (max-width: 1400px) {
  .nf17-toolbar { gap: 0; }
  .nf17-info-row { grid-template-columns: 15% 25% 6% 27% 5% minmax(0, 1fr); }
}
</style>
