<template>
  <div class="nf-page nf-des-page">
    <!-- 规则配置 -->
    <template v-if="view === 'form'">
      <h1 class="nf-des-title">脱敏设置管理 / 规则配置</h1>

      <section class="nf-card nf-des-form-card">
        <div class="nf-des-form-row">
          <div class="nf-des-field">
            <span class="nf-des-field-label">数据集名称</span>
            <el-input v-model="draft.datasetName" class="nf-des-input" />
          </div>
          <div class="nf-des-field">
            <span class="nf-des-field-label nf-des-field-label-sm">敏感内容名称</span>
            <el-input v-model="draft.sensitiveName" class="nf-des-input nf-des-input-wide" />
          </div>
        </div>

        <div class="nf-des-form-row">
          <div class="nf-des-field">
            <span class="nf-des-field-label">敏感内容分级</span>
            <el-select v-model="draft.level" class="nf-des-input">
              <el-option label="敏感" value="敏感" />
              <el-option label="一般" value="一般" />
              <el-option label="公开" value="公开" />
            </el-select>
          </div>
          <div class="nf-des-field nf-des-field-top">
            <span class="nf-des-field-label nf-des-field-label-sm">敏感内容描述</span>
            <div class="nf-des-textarea-wrap">
              <el-input
                v-model="draft.description"
                type="textarea"
                maxlength="200"
                :rows="4"
                resize="vertical"
                class="nf-des-textarea"
              />
              <span class="nf-des-counter">{{ descriptionCount }}/200</span>
            </div>
          </div>
        </div>

        <div class="nf-des-form-row nf-des-form-row-last">
          <div class="nf-des-field">
            <span class="nf-des-field-label">启用脱敏</span>
            <div class="nf-des-switch-wrap">
              <button
                type="button"
                class="nf-toggle"
                :class="{ on: draft.enabled }"
                @click="draft.enabled = !draft.enabled"
              >
                <span></span>
              </button>
              <span class="nf-des-switch-text">{{ draft.enabled ? '已启用' : '未启用' }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="nf-card nf-des-rules-card">
        <h2 class="nf-des-card-title">脱敏规则配置</h2>

        <div class="nf-des-table-wrap">
          <table class="nf-table nf-des-rules-table">
            <colgroup>
              <col style="width: 4.7%" />
              <col style="width: 17.82%" />
              <col style="width: 22.19%" />
              <col style="width: 32.18%" />
              <col style="width: 23.11%" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>字段名称</th>
                <th>脱敏方式</th>
                <th>规则说明</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rule, index) in draft.rules" :key="rule.field">
                <td class="nf-des-check-cell">
                  <input type="checkbox" class="nf-checkbox" :checked="rule.checked" @change="rule.checked = !rule.checked" />
                </td>
                <td class="nf-des-left">{{ rule.field }}</td>
                <td>
                  <el-select v-model="rule.method" class="nf-des-method">
                    <el-option label="部分掩码" value="部分掩码" />
                    <el-option label="完全掩码" value="完全掩码" />
                    <el-option label="哈希脱敏" value="哈希脱敏" />
                  </el-select>
                </td>
                <td class="nf-des-left">{{ rule.desc }}</td>
                <td>
                  <div class="nf-des-rule-status">
                    <button
                      type="button"
                      class="nf-toggle nf-toggle-sm"
                      :class="{ on: rule.enabled }"
                      @click="rule.enabled = !rule.enabled"
                    >
                      <span></span>
                    </button>
                    <span>{{ rule.enabled ? '启用' : '停用' }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="nf-des-rules-foot">
          <p class="nf-des-count">
            已配置脱敏字段： <b>{{ draft.rules.length }}</b>个
          </p>
          <div class="nf-des-rules-actions">
            <button type="button" class="nf-des-btn" @click="cancelForm">取消</button>
            <button type="button" class="nf-des-btn nf-des-btn-primary" @click="saveForm">保存</button>
          </div>
        </div>
      </section>
    </template>

    <!-- 设置列表 -->
    <template v-else>
      <h1 class="nf-des-title">脱敏设置管理 / 设置列表</h1>

      <section class="nf-card nf-des-filter-card">
        <span class="nf-des-filter-label">敏感内容名称</span>
        <el-input v-model="filterName" class="nf-des-filter-input" />
        <span class="nf-des-filter-label nf-des-filter-label-gap">敏感内容分级</span>
        <el-select v-model="filterLevel" class="nf-des-filter-select">
          <el-option label="敏感" value="敏感" />
          <el-option label="一般" value="一般" />
          <el-option label="公开" value="公开" />
        </el-select>
        <span class="nf-des-filter-label nf-des-filter-label-gap">状态</span>
        <el-select v-model="filterState" class="nf-des-filter-state">
          <el-option label="已启用" value="已启用" />
          <el-option label="未启用" value="未启用" />
        </el-select>
        <button type="button" class="nf-des-search" @click="doSearch">
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round">
            <circle cx="9" cy="9" r="5.4" />
            <path d="m13 13 4 4" />
          </svg>
          <span>查询</span>
        </button>
      </section>

      <section class="nf-card nf-des-list-card">
        <div class="nf-des-list-head">
          <h2 class="nf-des-list-title">脱敏配置列表（示例）</h2>
          <button type="button" class="nf-des-add" @click="openForm">
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"><path d="M10 4v12M4 10h12" /></svg>
            新增配置
          </button>
        </div>

        <div class="nf-des-table-wrap">
          <table class="nf-table nf-des-list-table">
            <colgroup>
              <col style="width: 3.52%" />
              <col style="width: 10.1%" />
              <col style="width: 9.51%" />
              <col style="width: 21.82%" />
              <col style="width: 24.36%" />
              <col style="width: 9.97%" />
              <col style="width: 10.23%" />
              <col style="width: 10.49%" />
            </colgroup>
            <thead>
              <tr>
                <th></th>
                <th>敏感内容名称</th>
                <th>敏感内容分级</th>
                <th>敏感内容描述</th>
                <th>关联数据集</th>
                <th>脱敏字段数量</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="listVisible">
                <td class="nf-des-radio-cell"><span class="nf-des-radio"></span></td>
                <td class="nf-des-left">{{ saved.sensitiveName }}</td>
                <td class="nf-des-center">{{ saved.level }}</td>
                <td class="nf-des-left">{{ saved.description }}</td>
                <td class="nf-des-left">{{ saved.datasetName }}</td>
                <td class="nf-des-center">{{ enabledRuleCount }}</td>
                <td>
                  <div class="nf-des-rule-status nf-des-center-wrap">
                    <button
                      type="button"
                      class="nf-toggle nf-toggle-sm"
                      :class="{ on: saved.enabled }"
                      @click="saved.enabled = !saved.enabled"
                    >
                      <span></span>
                    </button>
                    <span>{{ saved.enabled ? '已启用' : '未启用' }}</span>
                  </div>
                </td>
                <td class="nf-des-actions">
                  <a class="nf-link" @click="previewVisible = true">查看</a>
                  <a class="nf-link nf-des-edit" @click="openForm">编辑</a>
                </td>
              </tr>
              <tr v-else>
                <td class="nf-des-empty" colspan="8">暂无数据</td>
              </tr>
            </tbody>
          </table>
        </div>

        <section class="nf-des-detail-card">
          <div class="nf-des-detail-head">
            <h3>已保存配置详情（示例）</h3>
            <span class="nf-des-detail-note">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1677ff" stroke-width="1.5" stroke-linecap="round">
                <circle cx="10" cy="10" r="8" />
                <path d="M10 9v5" />
                <circle cx="10" cy="6.3" r="0.9" fill="#1677ff" stroke="none" />
              </svg>
              此处展示保存后重新打开的配置样式
            </span>
          </div>

          <table class="nf-table nf-des-detail-table">
            <colgroup>
              <col style="width: 33.1%" />
              <col style="width: 66.9%" />
            </colgroup>
            <thead>
              <tr>
                <th>字段名称</th>
                <th>脱敏规则说明</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rule in saved.rules" :key="rule.field">
                <td>{{ rule.field }}</td>
                <td>{{ rule.desc }}</td>
              </tr>
            </tbody>
          </table>

          <div class="nf-des-detail-foot">
            <span>是否脱敏： <b>{{ saved.enabled ? '是' : '否' }}</b></span>
            <span class="nf-des-detail-sep"></span>
            <span>脱敏字段数量： <b>{{ enabledRuleCount }}</b></span>
          </div>
        </section>
      </section>
    </template>

    <!-- 已脱敏结果预览 -->
    <el-dialog
      v-model="previewVisible"
      width="734px"
      class="nf-dialog nf-des-preview"
      :close-on-click-modal="false"
    >
      <template #header>
        <span class="nf-des-preview-title">取数结果预览（已脱敏）</span>
      </template>

      <div class="nf-des-preview-badge">
        <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
          <circle cx="10" cy="10" r="9" fill="#00b42a" />
          <path d="m6 10.3 2.7 2.7 5.3-5.5" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        校验成功
      </div>

      <table class="nf-table nf-des-preview-table">
        <colgroup>
          <col style="width: 12.17%" />
          <col style="width: 25.22%" />
          <col style="width: 33.87%" />
          <col style="width: 28.74%" />
        </colgroup>
        <thead>
          <tr>
            <th>姓名</th>
            <th>手机号</th>
            <th>身份证号</th>
            <th>地址</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>张*</td>
            <td>139****5678</td>
            <td>3601*********1234</td>
            <td>南昌市红谷滩区****</td>
          </tr>
          <tr>
            <td>李*</td>
            <td>139****2468</td>
            <td>3601*********5678</td>
            <td>赣州市章贡区****</td>
          </tr>
          <tr>
            <td>王*</td>
            <td>186****9087</td>
            <td>3601*********9012</td>
            <td>九江市濂溪区****</td>
          </tr>
        </tbody>
      </table>

      <p class="nf-des-preview-note">
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1677ff" stroke-width="1.5" stroke-linecap="round">
          <circle cx="10" cy="10" r="8" />
          <path d="M10 9v5" />
          <circle cx="10" cy="6.3" r="0.9" fill="#1677ff" stroke="none" />
        </svg>
        敏感字段已按规则完成脱敏处理
      </p>

      <template #footer>
        <div class="nf-des-preview-footer">
          <button type="button" class="nf-des-preview-close" @click="previewVisible = false">关闭</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { manualBreadcrumb } from '../../config/breadcrumb.js'
import { ElMessage } from 'element-plus'

const FORM_CRUMB = ['参数配置', '脱敏设置管理', '规则配置']

function baseConfig() {
  return {
    datasetName: '城市路口大数据分析表-用户报表（示例）',
    sensitiveName: '个人身份信息',
    level: '敏感',
    description: '姓名、手机号、身份证号及详细地址',
    enabled: true,
    rules: [
      { field: '姓名', method: '部分掩码', desc: '保留姓氏，其余替换为星号', enabled: true, checked: false },
      { field: '手机号', method: '部分掩码', desc: '保留前3位和后4位', enabled: true, checked: false },
      { field: '身份证号', method: '部分掩码', desc: '保留前4位和后4位', enabled: true, checked: false },
      { field: '地址', method: '部分掩码', desc: '保留市区，其余替换为星号', enabled: true, checked: false }
    ]
  }
}

const view = ref('list')
const saved = reactive(baseConfig())
const draft = reactive(baseConfig())

const filterName = ref('个人身份信息')
const filterLevel = ref('敏感')
const filterState = ref('已启用')
const appliedFilter = reactive({ name: '', level: '敏感', state: '已启用' })

const previewVisible = ref(false)

const enabledRuleCount = computed(() => saved.rules.filter((rule) => rule.enabled).length)

// 与参考图一致：计数器不计标点（「姓名、手机号、身份证号及详细地址」显示 14/200）
const descriptionCount = computed(
  () => draft.description.replace(/[^一-龥a-zA-Z0-9]/g, '').length
)

const listVisible = computed(() => {
  if (appliedFilter.name && !saved.sensitiveName.includes(appliedFilter.name)) return false
  if (appliedFilter.level !== saved.level) return false
  const state = saved.enabled ? '已启用' : '未启用'
  if (appliedFilter.state !== state) return false
  return true
})

function doSearch() {
  appliedFilter.name = filterName.value.trim()
  appliedFilter.level = filterLevel.value
  appliedFilter.state = filterState.value
}

function copyConfig(source) {
  return {
    datasetName: source.datasetName,
    sensitiveName: source.sensitiveName,
    level: source.level,
    description: source.description,
    enabled: source.enabled,
    rules: source.rules.map((rule) => ({ ...rule }))
  }
}

function openForm() {
  const next = copyConfig(saved)
  Object.assign(draft, next)
  view.value = 'form'
  manualBreadcrumb.value = FORM_CRUMB
}

function cancelForm() {
  view.value = 'list'
  manualBreadcrumb.value = null
}

function saveForm() {
  if (!draft.datasetName.trim() || !draft.sensitiveName.trim()) {
    ElMessage.warning('请填写数据集名称和敏感内容名称')
    return
  }
  Object.assign(saved, copyConfig(draft))
  view.value = 'list'
  manualBreadcrumb.value = null
  ElMessage.success('保存成功')
}

onBeforeUnmount(() => {
  manualBreadcrumb.value = null
})
</script>

<style scoped>
.nf-des-page {
  width: calc(100% + 16px);
  max-width: none;
  /* 参考图内容区：卡片左右边距 38 / 27px（现有外壳左侧 31、右侧 43） */
  margin: 0;
  padding: 0 0 0 7px;
}

.nf-des-title {
  margin: 0 0 14px;
  color: #1f2329;
  font-size: 28px;
  font-weight: 700;
  line-height: 38px;
}

/* ---------- 规则配置 ---------- */
.nf-des-form-card {
  padding: 28px 26px 26px;
}

.nf-des-form-row {
  display: flex;
  align-items: flex-start;
  gap: 33px;
  margin-bottom: 22px;
}

.nf-des-form-row:first-child {
  margin-bottom: 22px;
}

/* 第二行为「描述」多行文本框，其后紧跟启用脱敏一行，间距按参考图收紧 */
.nf-des-form-row:nth-child(2) {
  margin-bottom: 6px;
}

.nf-des-form-row-last {
  margin-bottom: 0;
}

.nf-des-field {
  display: flex;
  align-items: center;
}

.nf-des-field-top {
  align-items: flex-start;
}

.nf-des-field-label {
  flex: none;
  width: 173px;
  color: #606266;
  font-size: 17px;
}

.nf-des-field-label-sm {
  width: 139px;
}

.nf-des-input {
  width: 546px;
}

.nf-des-input-wide {
  width: 641px;
}

.nf-des-textarea-wrap {
  position: relative;
  width: 641px;
}

.nf-des-textarea-wrap :deep(.el-textarea__inner) {
  height: 94px;
  min-height: 94px !important;
  padding: 8px 12px 22px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-size: 17px;
  line-height: 24px;
}

.nf-des-counter {
  position: absolute;
  right: 10px;
  bottom: 6px;
  color: #a8abb2;
  font-size: 12px;
}

.nf-des-switch-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nf-des-switch-text {
  color: #1f2329;
  font-size: 17px;
}

.nf-toggle {
  position: relative;
  flex: none;
  width: 60px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 16px;
  background: #c8c9cc;
  cursor: pointer;
  transition: background 0.2s ease;
}

.nf-toggle.on {
  background: #1677ff;
}

.nf-toggle span {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #ffffff;
  transition: left 0.2s ease;
}

.nf-toggle.on span {
  left: 31px;
}

.nf-toggle-sm {
  width: 48px;
  height: 26px;
  border-radius: 13px;
}

.nf-toggle-sm span {
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
}

.nf-toggle-sm.on span {
  left: 25px;
}

.nf-des-rules-card {
  margin-top: 11px;
  padding: 24px 26px 31px;
}

.nf-des-card-title {
  margin: 0 0 17px;
  color: #1f2329;
  font-size: 20px;
  font-weight: 700;
  line-height: 27px;
}

.nf-des-table-wrap {
  width: 100%;
}

.nf-des-rules-table th,
.nf-des-list-table th,
.nf-des-detail-table th {
  background: #fafafa;
  color: #1f2329;
  font-weight: 600;
  text-align: center;
}

.nf-des-rules-table th {
  height: 49px;
  font-size: 17px;
}

.nf-des-rules-table td {
  height: 52px;
  border-color: #ebeef5;
  color: #1f2329;
  font-size: 17px;
  text-align: center;
}

.nf-des-rules-table .nf-des-left {
  padding-left: 23px;
  text-align: left;
}

.nf-des-check-cell {
  text-align: center;
}

.nf-des-method {
  width: 128px;
}

.nf-des-method :deep(.el-select__wrapper) {
  min-height: 37px;
}

.nf-des-rule-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #1f2329;
  font-size: 17px;
}

.nf-des-rules-foot {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 23px;
}

.nf-des-count {
  margin: 0;
  color: #1f2329;
  font-size: 17px;
  line-height: 24px;
  padding-top: 4px;
}

.nf-des-count b {
  color: #1677ff;
  font-size: 20px;
  font-weight: 600;
}

.nf-des-rules-actions {
  display: flex;
  gap: 15px;
  padding-top: 8px;
}

.nf-des-btn {
  min-width: 110px;
  height: 47px;
  padding: 0 24px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #ffffff;
  color: #333333;
  font-size: 17px;
  cursor: pointer;
}

.nf-des-btn:hover {
  border-color: #a9c8f5;
  color: #1677ff;
}

.nf-des-btn-primary {
  min-width: 110px;
  border-color: #1677ff;
  background: #1677ff;
  color: #ffffff;
}

.nf-des-btn-primary:hover {
  border-color: #4096ff;
  background: #4096ff;
  color: #ffffff;
}

/* ---------- 设置列表 ---------- */
.nf-des-filter-card {
  display: flex;
  align-items: center;
  height: 105px;
  padding: 0 26px;
}

.nf-des-filter-label {
  flex: none;
  color: #606266;
  font-size: 17px;
}

.nf-des-filter-label-gap {
  margin-left: 42px;
}

.nf-des-filter-input {
  flex: none;
  width: 376px;
  margin-left: 66px;
}

.nf-des-filter-select {
  flex: none;
  width: 267px;
  margin-left: 43px;
}

.nf-des-filter-state {
  flex: none;
  width: 231px;
  margin-left: 40px;
}

.nf-des-search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 156px;
  height: 44px;
  margin-left: auto;
  border: 0;
  border-radius: 4px;
  background: #1677ff;
  color: #ffffff;
  font-size: 17px;
  cursor: pointer;
}

.nf-des-search:hover {
  background: #4096ff;
}

.nf-des-list-card {
  margin-top: 16px;
  padding: 18px 26px 20px;
}

.nf-des-list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.nf-des-list-title {
  margin: 0;
  color: #1f2329;
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;
}

.nf-des-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 156px;
  height: 42px;
  border: 0;
  border-radius: 4px;
  background: #1677ff;
  color: #ffffff;
  font-size: 17px;
  cursor: pointer;
}

.nf-des-add:hover {
  background: #4096ff;
}

.nf-des-list-table th {
  height: 53px;
  font-size: 17px;
}

.nf-des-list-table td {
  height: 62px;
  border-color: #ebeef5;
  color: #1f2329;
  font-size: 17px;
  text-align: left;
}

.nf-des-list-table .nf-des-left {
  padding-left: 26px;
}

.nf-des-list-table .nf-des-center {
  padding-left: 0;
  text-align: center;
}

.nf-des-radio-cell {
  text-align: center;
}

.nf-des-radio {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
  background: #ffffff;
  vertical-align: middle;
}

.nf-des-center-wrap {
  justify-content: center;
}

.nf-des-actions {
  text-align: center;
}

.nf-des-actions .nf-link {
  font-size: 17px;
}

.nf-des-edit {
  margin-left: 20px;
}

.nf-des-empty {
  height: 120px;
  color: #909399;
  text-align: center !important;
}

/* ---------- 已保存配置详情 ---------- */
.nf-des-detail-card {
  margin-top: 24px;
  padding: 16px 23px 18px;
  border: 1px solid #e5eaf2;
  border-radius: 4px;
  background: #ffffff;
}

.nf-des-detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.nf-des-detail-head h3 {
  margin: 0;
  color: #1f2329;
  font-size: 20px;
  font-weight: 700;
  line-height: 27px;
}

.nf-des-detail-note {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #606266;
  font-size: 15px;
}

.nf-des-detail-note svg {
  flex: none;
}

.nf-des-detail-table th {
  height: 37px;
  padding-left: 30px;
  font-size: 17px;
  text-align: left;
}

.nf-des-detail-table td {
  height: 37px;
  padding-left: 30px;
  border-color: #ebeef5;
  color: #1f2329;
  font-size: 17px;
  text-align: left;
}

.nf-des-detail-foot {
  display: flex;
  align-items: center;
  margin-top: 18px;
  color: #1f2329;
  font-size: 17px;
}

.nf-des-detail-foot b {
  color: #1677ff;
  font-weight: 600;
}

.nf-des-detail-sep {
  width: 1px;
  height: 20px;
  margin: 0 28px;
  background: #e5e6eb;
}

/* ---------- 预览弹窗 ---------- */
:global(.nf-des-preview) {
  margin-top: 177px;
  padding: 0;
}

:global(.nf-des-preview .el-dialog__header) {
  padding: 19px 24px 14px;
}

:global(.nf-des-preview .el-dialog__body) {
  max-height: none;
  padding: 0 34px;
}

:global(.nf-des-preview .el-dialog__footer) {
  padding: 43px 34px 1px;
}

.nf-des-preview-title {
  color: #1f2329;
  font-size: 20px;
  font-weight: 600;
}

.nf-des-preview-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 158px;
  height: 44px;
  margin-bottom: 22px;
  padding: 0 16px;
  border: 1px solid #b7eb8f;
  border-radius: 23px;
  background: #f0f9eb;
  color: #52c41a;
  font-size: 17px;
  font-weight: 600;
}

.nf-des-preview-badge svg {
  flex: none;
}

.nf-des-preview-table {
  table-layout: fixed;
}

.nf-des-preview-table th {
  height: 46px;
  background: #fafafa;
  color: #1f2329;
  font-size: 17px;
  text-align: center;
}

.nf-des-preview-table td {
  height: 49px;
  border-color: #ebeef5;
  color: #2b3a55;
  font-size: 17px;
  text-align: center;
}

.nf-des-preview-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 22px 0 0;
  color: #1f2329;
  font-size: 16px;
}

.nf-des-preview-footer {
  display: flex;
  justify-content: flex-end;
}

.nf-des-preview-close {
  width: 76px;
  height: 37px;
  border: 0;
  border-radius: 4px;
  background: #1677ff;
  color: #ffffff;
  font-size: 17px;
  cursor: pointer;
}

.nf-des-preview-close:hover {
  background: #4096ff;
}

/* ---------- Element 控件 ---------- */
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 44px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__inner),
:deep(.el-select__selected-item) {
  font-size: 17px;
}

.nf-des-filter-card :deep(.el-input__wrapper),
.nf-des-filter-card :deep(.el-select__wrapper) {
  min-height: 44px;
  border-radius: 4px;
}

.nf-des-filter-card :deep(.el-input__inner),
.nf-des-filter-card :deep(.el-select__placeholder),
.nf-des-filter-card :deep(.el-select__selected-item) {
  font-size: 17px;
}

.nf-des-switch {
  --el-switch-on-color: #1677ff;
  --el-switch-off-color: #c8c9cc;
}

:deep(.el-select__wrapper.is-focused),
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #1677ff inset;
}
</style>