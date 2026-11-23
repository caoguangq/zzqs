<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { addModel } from '../../data/modelCatalog.js'

const router = useRouter()
const step = ref(1)
const form = reactive({
  database: '地市集市新库',
  table: 'mart796.dim_2026cunl_zfkr_23lei_r',
  name: '运维twl',
  storage: '其他',
  sensitive: '涉敏',
  shard: '不是分表',
  owner: 'crm运维平台(CRMOP)',
  business: '吉安-存量运营类',
  updated: '2026-03-14 00:00:00',
  summary: '否',
  customer: '否',
  description: '',
  purpose: '',
  audience: ''
})

const fieldSeed = [
  ['KR_OFFER', '指标', 'decimal(25,0)', '数值间隔'],
  ['KR_NAME', '维度', 'varchar(200)', '模糊查询'],
  ['KR_ORG', '指标', 'decimal(25,0)', '数值间隔'],
  ['KR_OP', '指标', 'decimal(25,0)', '数值间隔'],
  ['KR_TEAM', '维度', 'varchar(30)', '模糊查询'],
  ['KR_WG', '维度', 'varchar(30)', '模糊查询'],
  ['KR_WWG', '维度', 'varchar(30)', '模糊查询'],
  ['FLAG_HMD', '指标', 'number', '数值间隔'],
  ['FLAG_ABJT', '指标', 'number', '数值间隔']
]
const fields = ref(fieldSeed.map(([name, attribute, type, method], index) => ({
  index: 60 + index,
  name,
  label: name,
  group: '默认属性组',
  attribute,
  type,
  method,
  mask: '不模糊',
  meaning: '--请选择--',
  enabled: true,
  filterOnly: false
})))
const allEnabled = computed({
  get: () => fields.value.every((field) => field.enabled),
  set: (value) => fields.value.forEach((field) => { field.enabled = value })
})

const previewColumns = ['GP_DATE', 'PZ_TYPE', 'CITY_ID', 'CITY_NAME', 'COUNTY_ID', 'COUNTY_NAME', 'USER_ID', 'PHONE_NO', 'CREATE_DATE_RW', 'KR_OFFER', 'KR_NAME', 'KR_ORG', 'KR_OP', 'KR_TEAM', 'KR_WG']
const previewRows = Array.from({ length: 12 }, (_, row) => previewColumns.map((column, col) => {
  if (col === 1) return ['资费类型', '资费类型', '套餐类型'][row % 3]
  if (col === 3) return ['吉安地区', '赣州地区', '南昌地区'][row % 3]
  if (col === 5) return ['永新县', '泰和县', '吉安县'][row % 3]
  return String(20 + ((row * 31 + col * 17) % 79)) + (col === 0 ? '2026' : '.0')
}))
const page = ref(1)
const jump = ref('')

function clickQueryTable() { ElMessage.info('已按数据表名称查询，字段以当前表结构为准') }
function next() {
  if (step.value === 1) {
    if (!form.database || !form.table.trim() || !form.name.trim() || !form.owner.trim()) {
      return ElMessage.warning('请填写归属数据库、数据表名称、中文表名称和模型业务负责人')
    }
    step.value = 2
    return
  }
  if (step.value === 2) {
    if (!fields.value.some((field) => field.enabled)) return ElMessage.warning('请至少选择一个使用字段')
    step.value = 3
  }
}
function download() {
  const csv = '﻿' + [['列名称', '字段名称', '中文字段名称', '字段属性', '字段类型', '是否使用'], ...fields.value.map((field) => [field.index, field.name, field.label, field.attribute, field.type, field.enabled ? '是' : '否'])]
    .map((row) => row.map((value) => '"' + String(value).replaceAll('"', '""') + '"').join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = '字段配置.csv'
  link.click()
  URL.revokeObjectURL(url)
}
function setPage(value) {
  const number = Number(value)
  if (!Number.isInteger(number) || number < 1 || number > 9) return ElMessage.warning('请输入有效页码')
  page.value = number
}
async function save() {
  try {
    await ElMessageBox.confirm('您确定需要保存数据吗？', '数据保存', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', showClose: false, customClass: 'nf-save-confirm' })
  } catch { return }
  addModel({ name: form.name, updated: form.updated, publisher: '唐雯丽', owner: form.owner.replace(/[（(][^）)]*[）)]/g, '') })
  ElMessage.success('保存成功')
  router.push('/new/11')
}
</script>

<template>
  <div class="nf-feature-12">
    <ol class="nf-steps">
      <li :class="{ current: step === 1, done: step > 1 }"><b>1</b><span>数据库表新增</span></li>
      <li :class="{ current: step === 2, done: step > 2 }"><b>2</b><span>字段配置</span></li>
      <li :class="{ current: step === 3 }"><b>3</b><span>预览</span></li>
    </ol>

    <template v-if="step === 1">
      <div class="nf-basic-form">
        <div class="nf-col">
          <label><span>归属数据库：</span><select v-model="form.database" aria-label="归属数据库"><option>地市集市新库</option><option>新集市库取数库</option></select><b>*</b></label>
          <label><span>数据表名称：</span><input v-model="form.table" aria-label="数据表名称" /><b>*</b><button type="button" class="nf-link" @click="clickQueryTable">点击查询数据表</button></label>
          <label><span>中文表名称：</span><input v-model="form.name" aria-label="中文表名称" /><b>*</b></label>
          <label><span>数据表存储类型：</span><select v-model="form.storage" aria-label="数据表存储类型"><option>其他</option><option>Hive</option><option>Oracle</option></select><b>*</b></label>
          <label><span>是否涉敏</span><select v-model="form.sensitive" aria-label="是否涉敏"><option>涉敏</option><option>不涉敏</option></select></label>
          <label><span>分表存储类型：</span><select v-model="form.shard" aria-label="分表存储类型"><option>不是分表</option><option>月分表</option><option>日分表</option></select><b>*</b></label>
        </div>
        <div class="nf-col">
          <label><span>归属业务分类：</span><select v-model="form.business" aria-label="归属业务分类"><option>吉安-存量运营类</option><option>赣州-存量运营类</option><option>省公司-集客类</option></select><b>*</b></label>
          <label><span>数据更新日期：</span><input v-model="form.updated" aria-label="数据更新日期" /><b>*</b><button type="button" class="nf-link" @click="ElMessage.info('设置查询时间暂不可用')">⚙ 设置查询时间</button></label>
          <label><span>汇总表：</span><select v-model="form.summary" aria-label="汇总表"><option>否</option><option>是</option></select><b>*</b></label>
          <label><span>是否用来创建客户群：</span><select v-model="form.customer" aria-label="是否用来创建客户群"><option>否</option><option>是</option></select></label>
        </div>
        <label class="nf-span"><span>模型业务负责人：</span><input v-model="form.owner" aria-label="模型业务负责人" /><b>*</b></label>
        <label class="nf-span nf-area nf-area-desc"><span>描述：</span><textarea v-model="form.description" aria-label="描述" placeholder="请输入描述..." /></label>
        <label class="nf-span nf-area"><span>用途：</span><textarea v-model="form.purpose" aria-label="用途" placeholder="请输入用途..." /></label>
        <label class="nf-span nf-area"><span>适用客户群：</span><textarea v-model="form.audience" aria-label="适用客户群" placeholder="请输入适用客户群..." /></label>
      </div>
      <p class="nf-note">说明：1、定义分表时，表名使用“$”指明分表标示的位置。</p>
      <p class="nf-note">2、分表查询SQL结果为1列或2列的数据，1列结果使用于月表存储月数据情况，2列结果适用于月表存储日数据或周表存储日数据等情况。</p>
      <div class="nf-step-footer"><button class="nf-primary" @click="next">下一步</button></div>
    </template>

    <template v-else-if="step === 2">
      <div class="nf-field-scroll">
        <table class="nf-field-table">
          <colgroup><col style="width:70" /><col style="width:150" /><col style="width:220" /><col style="width:210" /><col style="width:90" /><col style="width:120" /><col style="width:140" /><col style="width:120" /><col style="width:90" /><col style="width:120" /><col style="width:140" /><col style="width:140" /><col style="width:150" /></colgroup>
          <thead>
            <tr><th>列名称</th><th>字段名称</th><th>中文字段名称</th><th>指标分组</th><th>字段属性</th><th>字段类型</th><th>默认展现方式</th><th>维度设置</th><th>口径设置</th><th>字段模糊方式</th><th>设置字段含义</th><th>是否使用 (全选:<input v-model="allEnabled" type="checkbox" aria-label="全部使用字段" />)</th><th>仅展现默认筛选条件</th></tr>
          </thead>
          <tbody>
            <tr v-for="field in fields" :key="field.name">
              <td>{{ field.index }}</td>
              <td class="nf-field-name"><span>☞</span>{{ field.name }}</td>
              <td><input v-model="field.label" :aria-label="field.name + '中文字段名称'" /></td>
              <td><select v-model="field.group" :aria-label="field.name + '指标分组'"><option>默认属性组</option><option>系统属性组</option></select></td>
              <td><select v-model="field.attribute" :aria-label="field.name + '字段属性'"><option>指标</option><option>维度</option></select></td>
              <td>{{ field.type }}</td>
              <td><select v-model="field.method" :aria-label="field.name + '默认展现方式'"><option>数值间隔</option><option>模糊查询</option><option>精确查询</option></select></td>
              <td></td>
              <td><button class="nf-mini" :aria-label="field.name + '口径设置'" @click="ElMessage.info('口径设置暂不可用')">▧</button><button class="nf-mini" :aria-label="field.name + '清除口径'" @click="ElMessage.success('已清除')">▤</button></td>
              <td><select v-model="field.mask" :aria-label="field.name + '字段模糊方式'"><option>不模糊</option><option>左模糊</option><option>中间模糊</option><option>右模糊</option><option>全模糊</option></select></td>
              <td><select v-model="field.meaning" :aria-label="field.name + '设置字段含义'"><option>--请选择--</option><option>日期</option><option>地市</option><option>用户标识</option></select></td>
              <td><input v-model="field.enabled" type="checkbox" :aria-label="field.name + '是否使用'" /></td>
              <td><input v-model="field.filterOnly" type="checkbox" :aria-label="field.name + '仅展现默认筛选条件'" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="nf-step-footer nf-footer-step2">
        <button class="nf-text" @click="step = 1">上一步</button>
        <button class="nf-primary" @click="download">下载</button>
        <button class="nf-primary" @click="ElMessage.info('上传功能暂不可用')">上传</button>
        <button class="nf-primary" @click="next">下一步</button>
      </div>
    </template>

    <template v-else>
      <div class="nf-preview-scroll">
        <table class="nf-preview-table">
          <thead><tr><th class="nf-row-no"></th><th v-for="column in previewColumns" :key="column">{{ column }}</th></tr></thead>
          <tbody>
            <tr v-for="(row, index) in previewRows" :key="index">
              <td class="nf-row-no">{{ index + 1 }}</td>
              <td v-for="(cell, col) in row" :key="col">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="nf-pager">
        <span>共 90 条记录</span>
        <nav>
          <button :disabled="page === 1" @click="page--">上一页</button>
          <button v-for="n in 9" :key="n" :class="{ active: page === n }" @click="page = n">{{ n }}</button>
          <button @click="page = 9">尾页</button>
          <span>跳转</span><input v-model="jump" aria-label="跳转页码" /><button @click="setPage(jump)">确定</button>
        </nav>
      </div>
      <div class="nf-step-footer nf-footer-step3">
        <button class="nf-text" @click="step = 2">上一步</button>
        <button class="nf-primary" @click="save">暂存</button>
        <button class="nf-primary" @click="save">下一步</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.nf-feature-12 { margin: -33px -43px -40px -31px; color: #606266; font-size: 12px; background: #fff; min-height: 760px; }
.nf-steps { display: flex; list-style: none; margin: 0; padding: 0; height: 43px; align-items: center; border-bottom: 1px solid #c9cfd8; }
.nf-steps li { width: 33.333%; display: flex; align-items: center; justify-content: center; gap: 14px; height: 43px; border-bottom: 2px solid transparent; color: #606266; font-size: 14px; }
.nf-steps li.current { border-bottom-color: #1681d7; }
.nf-steps b { width: 25px; height: 25px; border-radius: 50%; background: #b9bec7; color: #fff; font-weight: 400; line-height: 25px; text-align: center; }
.nf-steps .current b, .nf-steps .done b { background: #1681d7; }
.nf-basic-form { display: grid; grid-template-columns: 1fr 1fr; column-gap: 200px; width: 960px; max-width: none; margin: 0 0 0 181px; padding: 23px 0 0; }
.nf-col { display: flex; flex-direction: column; min-width: 0; }
.nf-basic-form label { display: flex; align-items: center; gap: 8px; margin-bottom: 17px; color: #606266; position: relative; flex-wrap: nowrap; min-width: 0; }
.nf-basic-form label > span { width: 130px; text-align: right; flex-shrink: 0; }
.nf-basic-form label > b { color: #f5222d; font-weight: 400; margin-left: 10px; }
.nf-basic-form input, .nf-basic-form select { width: 222px; flex-shrink: 0; height: 32px; border: 1px solid #dfe6ef; border-radius: 18px; padding: 0 14px; color: #606266; font: inherit; background: #fff; min-width: 0; }
.nf-basic-form .nf-span, .nf-basic-form .nf-area { grid-column: 1 / -1; }
.nf-basic-form .nf-span:not(.nf-area) { margin-bottom: 0; }
.nf-basic-form .nf-span input, .nf-basic-form .nf-span textarea { width: auto; flex: 1; }
.nf-basic-form .nf-area { align-items: flex-start; margin-bottom: 21px; }
.nf-basic-form .nf-area:last-of-type { margin-bottom: 0; }
.nf-basic-form textarea { flex: 1; height: 79px; border: 1px solid #dfe6ef; padding: 8px 14px; font: inherit; color: #606266; resize: none; }
.nf-basic-form .nf-area-desc textarea { height: 88px; }
.nf-basic-form textarea::placeholder { color: #c0c6cf; }
.nf-link { border: 0; background: none; color: #1681d7; font: inherit; white-space: nowrap; cursor: pointer; }
.nf-note { max-width: 900px; margin: 0 auto 13px; padding-left: 30px; color: #f5222d; line-height: 22px; }
.nf-note:first-of-type { margin-top: 29px; }
.nf-note:last-of-type { margin-bottom: 0; }
.nf-step-footer { display: flex; justify-content: center; align-items: center; gap: 22px; padding: 11px 0 0; }
.nf-step-footer.nf-footer-step2 { padding-top: 53px; }
.nf-step-footer.nf-footer-step3 { padding-top: 50px; }
.nf-step-footer button { height: 38px; min-width: 96px; border: 0; border-radius: 20px; background: #1681d7; color: #fff; font: inherit; cursor: pointer; }
.nf-step-footer .nf-text { background: none; color: #606266; }
.nf-field-scroll { overflow: auto; padding: 6px 0 0; }
.nf-field-table { width: 1900px; border-collapse: collapse; table-layout: fixed; }
.nf-field-table th { height: 36px; background: #fafbfe; color: #606874; font-weight: 500; border: 1px solid #e4ebf5; }
.nf-field-table td { height: 49px; border: 1px solid #e4ebf5; text-align: center; padding: 0 4px; white-space: nowrap; overflow: hidden; }
.nf-field-table input:not([type=checkbox]), .nf-field-table select { width: 100%; height: 30px; border: 1px solid #dfe5ee; color: #30475f; font: inherit; background: #fff; }
.nf-field-table .nf-field-name { text-align: left; padding-left: 10px; }
.nf-field-name span { color: #409eff; font-size: 22px; margin-right: 10px; }
.nf-mini { border: 0; background: none; cursor: pointer; color: #76867e; }
.nf-preview-scroll { overflow: auto; margin: 2px 0 0; height: 447px; }
.nf-preview-table { border-collapse: collapse; table-layout: fixed; min-width: 1900px; }
.nf-preview-table th, .nf-preview-table td { border: 1px solid #e4ebf5; height: 34px; padding: 0 8px; white-space: nowrap; text-align: left; color: #7f8a99; }
.nf-preview-table th { height: 34px; background: #fafbfe; color: #606874; }
.nf-preview-table .nf-row-no { width: 60px; text-align: center; }
.nf-pager { display: flex; align-items: center; justify-content: space-between; padding: 8px 24px; border: 1px solid #e4ebf5; border-top: 0; }
.nf-feature-12 .nf-pager { height: 57px; padding: 10px 24px; }
.nf-pager nav { display: flex; align-items: center; gap: 8px; }
.nf-pager button { min-width: 30px; height: 28px; border: 1px solid #e4ebf5; background: #fff; color: #606266; font: inherit; cursor: pointer; }
.nf-feature-12 .nf-pager button { min-width: 36px; height: 36px; }
.nf-pager button.active { background: #1681d7; color: #fff; border-color: #1681d7; }
.nf-pager input { width: 44px; height: 26px; border: 1px solid #e4ebf5; text-align: center; }
:global(.nf-save-confirm) { width: 420px; max-width: 92%; border-radius: 4px; padding: 0; position: fixed; top: 33px; left: 50%; transform: translateX(-50%); margin: 0 !important; }
:global(.nf-save-confirm .el-message-box__header) { height: 57px; text-align: center; border-bottom: 1px solid #eee; padding: 0 15px; display: flex; align-items: center; justify-content: center; }
:global(.nf-save-confirm .el-message-box__title) { font-size: 16px; font-weight: 700; color: #303133; justify-content: center; }
:global(.nf-save-confirm .el-message-box__content) { padding: 28px 24px 22px; }
:global(.nf-save-confirm .el-message-box__status) { font-size: 40px; color: #ffbf00; }
:global(.nf-save-confirm .el-message-box__message) { font-size: 14px; color: #333; }
:global(.nf-save-confirm .el-message-box__btns) { padding: 0 22px 16px; justify-content: flex-end; }
:global(.nf-save-confirm .el-button) { min-width: 56px; height: 30px; border-radius: 15px; padding: 0 16px; font-size: 14px; }
:global(.nf-save-confirm .el-message-box__btns .el-button:first-child) { border: none; background: transparent; box-shadow: none; color: #606266; }
:global(.nf-save-confirm .el-message-box__btns .el-button--primary) { background: #2f7cf6; border-color: #2f7cf6; }
@media (max-width: 1500px) {
  .nf-basic-form { width: auto; margin-left: 24px; margin-right: 24px; column-gap: 32px; }
  .nf-basic-form label > span { width: 120px; }
}
@media (max-width: 1300px) {
  .nf-basic-form { column-gap: 24px; padding-right: 20px; }
  .nf-basic-form label > span { width: 110px; }
}
@media (max-width: 900px) {
  .nf-basic-form { grid-template-columns: 1fr; }
  .nf-note { margin-left: 20px; }
}
</style>
