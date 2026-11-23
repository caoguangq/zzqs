<script setup>
import { reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: { type: Boolean, default: false },
  row: { type: Object, default: null }
})
const emit = defineEmits(['update:visible', 'save'])

const filePicker = ref(null)
const splitVisible = ref(false)
const form = reactive({
  name: '',
  purpose: '运维',
  expire: '2026-03-30',
  database: '地市集市新库',
  description: '',
  fileName: '',
  recordCount: 0
})

function reset() {
  form.name = props.row ? props.row.name : ''
  form.purpose = '运维'
  form.expire = '2026-03-30'
  form.database = props.row ? props.row.database : '地市集市新库'
  form.description = ''
  form.fileName = ''
  form.recordCount = 0
  splitVisible.value = false
}
watch(() => [props.visible, props.row], ([visible]) => { if (visible) reset() })

function close() { emit('update:visible', false) }
function pickFile() { filePicker.value?.click() }
function onFileChange(event) {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return
  const extension = file.name.split('.').pop().toLowerCase()
  if (!['txt', 'csv', 'xls', 'xlsx'].includes(extension)) {
    ElMessage.warning('上传文件格式支持TXT、CSV、XLS格式文件')
    return
  }
  form.fileName = file.name
  form.recordCount = 10
  splitVisible.value = true
}
function downloadTemplate() {
  const content = '用户编码,手机号码\n197000384531,13800000000\n400008325560,13900000000\n'
  const url = URL.createObjectURL(new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = '上传模板.csv'
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('模板下载成功')
}

function confirmAppend() {
  if (!form.name.trim()) return ElMessage.warning('请输入文件名称')
  if (!form.expire) return ElMessage.warning('请选择文件保存有效期')
  if (!form.fileName) return ElMessage.warning('请选择上传文件')
  emit('save', {
    name: form.name.trim(),
    purpose: form.purpose,
    expire: form.expire,
    database: form.database,
    description: form.description,
    fileName: form.fileName,
    recordCount: form.recordCount,
    field: '用户编码'
  })
  splitVisible.value = false
  close()
  ElMessage.success('追加上传成功')
}
</script>

<template>
  <div>
    <input ref="filePicker" class="nf-file-input" type="file" accept=".txt,.csv,.xls,.xlsx" aria-label="选择上传文件" @change="onFileChange" />

    <el-dialog
      :model-value="visible"
      title="追加上传关联文件信息"
      width="737px"
      class="nf16-dialog"
      modal-class="nf16-overlay"
      :close-on-click-modal="false"
      @update:model-value="emit('update:visible', $event)"
    >
      <div class="nf16-form">
        <div class="nf16-row">
          <label class="w-file">文件名称</label>
          <input v-model="form.name" class="nf16-input" aria-label="追加文件名称" />
          <label class="w-purpose">取数用途</label>
          <select v-model="form.purpose" class="nf16-select" aria-label="追加取数用途">
            <option>运维</option><option>业务分析</option><option>数据核查</option>
          </select>
        </div>
        <div class="nf16-row">
          <label class="w-expire">文件保存有效期至</label>
          <el-date-picker
            v-model="form.expire"
            class="nf16-date"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :clearable="false"
            aria-label="文件保存有效期至"
          />
          <label class="w-database">选择存放数据库</label>
          <select v-model="form.database" class="nf16-select database" aria-label="选择存放数据库">
            <option>地市集市新库</option><option>新集市库取数库</option>
          </select>
        </div>
        <div class="nf16-row">
          <label class="w-upload">选择上传文件</label>
          <button type="button" class="nf16-file-btn" @click="pickFile">点击上传</button>
          <button type="button" class="nf16-file-btn template" @click="downloadTemplate">下载上传模板</button>
          <span v-if="form.fileName" class="nf16-file-name">已选择：{{ form.fileName }}</span>
        </div>
        <div class="nf16-row align-top">
          <label class="w-description">取数用途描述</label>
          <textarea v-model="form.description" class="nf16-textarea" aria-label="取数用途描述" placeholder="undefined"></textarea>
        </div>
        <div class="nf16-notes">
          <p>说明：上传文件格式支持TXT、CSV、XLS格式文件。</p>
          <p>TXT文件内容要求：首行为数据标题（支持中文），多列数据必须以英文逗号“,”分隔。</p>
          <p>XLS文件只读取第一个Sheet(工作表)数据！</p>
          <p class="danger">※上传文件的记录行数不能大于15000000!</p>
        </div>
      </div>
      <template #footer>
        <div class="nf16-footer">
          <button type="button" class="nf16-cancel" @click="close">取消</button>
          <button type="button" class="nf16-confirm" @click="confirmAppend">确定</button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="splitVisible" title="文档拆分预览" width="520px">
      <div class="nf16-preview">
        <p><span>文件名称：</span>{{ form.fileName }}</p>
        <p><span>文件格式：</span>{{ form.fileName.split('.').pop()?.toUpperCase() }}</p>
        <p><span>首行数据标题：</span>用户编码</p>
        <p><span>拆分结果：</span>1 个字段 / {{ form.recordCount }} 条记录</p>
        <p><span>拆分规则：</span>{{ form.fileName.toLowerCase().endsWith('.xls') || form.fileName.toLowerCase().endsWith('.xlsx') ? '读取第一个Sheet(工作表)数据' : '按英文逗号“,”分隔，首行作为数据标题' }}</p>
      </div>
      <template #footer>
        <button type="button" class="nf16-confirm" @click="splitVisible = false">确定</button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.nf-file-input { display: none; }
.nf16-form { padding: 6px 16px 0 22px; color: #333; font-size: 12px; }
.nf16-row { display: flex; align-items: center; margin-bottom: 26px; }
.nf16-row.align-top { align-items: flex-start; }
.nf16-row label { text-align: right; margin-right: 11px; flex: none; color: #333; }
.w-file { width: 57px; margin-left: 32px !important; margin-right: 12px !important; }
.w-purpose { width: 48px; margin-left: 57px !important; }
.w-expire { width: 99px; }
.w-database { width: 88px; margin-left: 12px !important; }
.w-upload { width: 78px; margin-right: 15px !important; }
.w-description { width: 81px; margin-right: 20px !important; line-height: 22px; }
.nf16-input { width: 305px; }
.nf16-input, .nf16-select { height: 32px; border: 1px solid #dcdfe6; border-radius: 4px; padding: 0 10px; color: #606266; font: inherit; background: #fff; box-sizing: border-box; }
.nf16-select { width: 177px; }
.nf16-select.database { width: 170px; }
:deep(.nf16-date) { width: 304px; }
:deep(.nf16-date .el-input__prefix) { display: none; }
:deep(.nf16-date .el-input__wrapper) { padding-left: 10px; padding-right: 24px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect x='2.2' y='3.2' width='11.6' height='10.6' rx='1.2' fill='none' stroke='%23c0c4cc'/%3E%3Cpath d='M2.2 6.4h11.6M5.2 1.8v2.8M10.8 1.8v2.8' stroke='%23c0c4cc'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; background-size: 14px 14px; }
.nf16-file-btn { height: 32px; padding: 0 14px; border: 1px solid #dcdfe6; border-radius: 2px; background: #fff; color: #333; font: inherit; cursor: pointer; }
.nf16-file-btn.template { margin-left: 14px; }
.nf16-file-name { margin-left: 12px; color: #606266; }
.nf16-textarea { width: 481px; height: 98px; border: 1px solid #dcdfe6; border-radius: 4px; padding: 8px 10px; color: #606266; font: inherit; resize: vertical; box-sizing: border-box; }
.nf16-textarea::placeholder { color: #a8abb2; }
.nf16-notes { margin: 10px 0 0 101px; color: #909399; line-height: 18px; }
.nf16-notes p { margin: 0; }
.nf16-notes .danger { color: #f5222d; }
.nf16-footer { display: flex; align-items: center; justify-content: flex-end; gap: 26px; padding-right: 4px; }
.nf16-cancel { border: 0; background: none; color: #333; font: inherit; cursor: pointer; }
.nf16-confirm { min-width: 76px; height: 36px; border: 0; border-radius: 18px; background: #409eff; color: #fff; font: inherit; cursor: pointer; }
.nf16-preview { color: #333; font-size: 13px; line-height: 30px; }
.nf16-preview span { color: #606266; }
:global(.nf16-dialog) { padding-left: 0; padding-right: 0; margin-top: 17vh; border-radius: 6px; }
:global(.nf16-overlay) { background-color: rgba(0, 0, 0, 0.72); }
:global(.nf16-dialog .el-dialog__header) { text-align: center; padding: 12px 20px 6px; }
:global(.nf16-dialog .el-dialog__title) { font-size: 18px; font-weight: 600; color: #1f2d3d; }
:global(.nf16-dialog .el-dialog__headerbtn) { top: 16px; right: 16px; }
:global(.nf16-dialog .el-dialog__body) { padding: 10px 0 4px; }
:global(.nf16-dialog .el-dialog__footer) { padding: 4px 20px 22px; }
@media (max-width: 1400px) {
  .nf16-form { padding-left: 24px; padding-right: 16px; }
  .nf16-input { width: 240px; }
  .w-purpose { margin-left: 24px !important; }
}
</style>
