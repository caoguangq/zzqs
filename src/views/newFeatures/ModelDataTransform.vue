<template>
  <div class="nf-page nf-trans-page">
    <!-- 数据扩展与透视 -->
    <template v-if="view === 'main'">
      <h1 class="nf-trans-title">数据扩展与透视能力<span v-if="action === 'func'"> / 函数生成列</span></h1>

      <div class="nf-trans-tabs">
        <button type="button" class="active">数据扩展</button>
        <button type="button" @click="ElMessage.info('透视表格（示例）')">透视表格</button>
      </div>

      <!-- 函数生成列 -->
      <div v-if="action === 'func'" class="nf-trans-layout">
        <div class="nf-trans-left">
          <div class="nf-trans-toolbar">
            <button type="button" class="nf-trans-tool" @click="ElMessage.info('文件追加')">
              <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 2.5h7l4 4v11H5z" /><path d="M9 9v5M6.5 11.5h5" stroke-linecap="round" /></svg>
              文件追加
            </button>
            <button type="button" class="nf-trans-tool" @click="ElMessage.info('数据关联')">
              <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 12 12 8M6.5 14.5l-1 1a3 3 0 0 1-4-4l3-3a3 3 0 0 1 4 0M13.5 5.5l1-1a3 3 0 0 1 4 4l-3 3a3 3 0 0 1-4 0" stroke-linecap="round" /></svg>
              数据关联
            </button>
            <button type="button" class="nf-trans-tool" :class="{ active: action === 'func' }" @click="action = 'func'">
              <b class="nf-trans-fx">fx</b>
              函数生成列
            </button>
            <button type="button" class="nf-trans-tool" @click="action = 'rowcol'">
              <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="14" height="14" rx="1" /><path d="M3 8h14M8 3v14" /></svg>
              列转行
            </button>
          </div>

          <section class="nf-card nf-trans-config">
            <h2>函数生成列配置（示例）</h2>
            <div class="nf-trans-row">
              <span>源数据集：</span>
              <el-select v-model="func.source" class="nf-trans-input">
                <el-option label="月度地区销售表_列转行（示例）" value="月度地区销售表_列转行（示例）" />
              </el-select>
            </div>
            <div class="nf-trans-row">
              <span>新增字段名称：</span>
              <el-input v-model="func.name" class="nf-trans-input" />
            </div>
            <div class="nf-trans-row">
              <span>字段类型：</span>
              <el-select v-model="func.type" class="nf-trans-input">
                <el-option label="数值（保留2位小数）" value="数值（保留2位小数）" />
                <el-option label="文本" value="文本" />
              </el-select>
            </div>
            <div class="nf-trans-row">
              <span>计算表达式：</span>
              <el-input v-model="func.formula" class="nf-trans-input" />
            </div>
            <div class="nf-trans-row">
              <span>扩展描述：</span>
              <el-input v-model="func.description" class="nf-trans-input" />
            </div>
            <div class="nf-trans-btns">
              <button type="button" class="nf-trans-btn" @click="resetFunc">重置</button>
              <button type="button" class="nf-trans-btn nf-trans-primary" @click="ElMessage.success('执行扩展')">执行扩展</button>
            </div>
          </section>

          <section class="nf-card nf-trans-result">
            <h2>执行及保存结果</h2>
            <table class="nf-trans-kv">
              <tbody>
                <tr><td>任务编号：</td><td>EXT-DEMO-001</td><td>操作人：</td><td>测试用户（示例）</td></tr>
                <tr><td>操作时间：</td><td>2026-10-26 10:05:00</td><td>转换开始时间：</td><td>2026-10-26 10:05:01</td></tr>
                <tr><td>转换结束时间：</td><td>2026-10-26 10:05:02</td><td>转换是否完成：</td><td class="green">是</td></tr>
                <tr><td>转换是否异常：</td><td class="green">否</td><td>转换异常理由：</td><td>无</td></tr>
                <tr><td>输出数据集：</td><td>月度地区销售表_金额扩展（示例）</td><td>保存状态：</td><td class="green">已保存（示例）</td></tr>
              </tbody>
            </table>
          </section>
        </div>

        <div class="nf-trans-right">
          <section class="nf-card nf-trans-preview">
            <h2>扩展前后对照（示例）</h2>
            <p class="nf-trans-band">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1677ff" stroke-width="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 9v5" stroke-linecap="round" /><circle cx="10" cy="6.4" r="0.9" fill="#1677ff" stroke="none" /></svg>
              扩展前：9 行 × 3 列　→　扩展后：9 行 × 4 列
            </p>
            <table class="nf-table nf-trans-table">
              <thead>
                <tr>
                  <th>地区</th><th>月份</th><th>销售金额</th>
                  <th>销售金额_万元<span class="nf-trans-new">NEW</span></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in rows" :key="row.month + row.region">
                  <td>{{ row.region }}</td>
                  <td>{{ row.month }}</td>
                  <td>{{ row.amount }}</td>
                  <td class="nf-trans-newcol">{{ row.wan }}</td>
                </tr>
              </tbody>
            </table>
            <p class="nf-trans-note">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1677ff" stroke-width="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 9v5" stroke-linecap="round" /><circle cx="10" cy="6.4" r="0.9" fill="#1677ff" stroke="none" /></svg>
              新增1个计算字段，原字段及记录数保持不变。
            </p>
            <div class="nf-trans-btns nf-trans-btns-right">
              <button type="button" class="nf-trans-btn" @click="ElMessage.info('查看执行日志')">查看执行日志</button>
              <button type="button" class="nf-trans-btn nf-trans-primary" @click="ElMessage.info('查看输出数据集')">查看输出数据集</button>
              <button type="button" class="nf-trans-btn" @click="ElMessage.info('返回')">返回</button>
            </div>
          </section>
        </div>
      </div>

      <!-- 列转行 -->
      <div v-else class="nf-trans-layout">
        <div class="nf-trans-left nf-trans-leftwrap">
          <p class="nf-trans-section">数据扩展</p>
          <div class="nf-trans-toolbar">
            <button type="button" class="nf-trans-tool" @click="ElMessage.info('文件追加')">
              <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 2.5h7l4 4v11H5z" /><path d="M9 9v5M6.5 11.5h5" stroke-linecap="round" /></svg>
              文件追加
            </button>
            <button type="button" class="nf-trans-tool" @click="ElMessage.info('数据关联')">
              <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 12 12 8M6.5 14.5l-1 1a3 3 0 0 1-4-4l3-3a3 3 0 0 1 4 0M13.5 5.5l1-1a3 3 0 0 1 4 4l-3 3a3 3 0 0 1-4 0" stroke-linecap="round" /></svg>
              数据关联
            </button>
            <button type="button" class="nf-trans-tool" @click="action = 'func'">
              <b class="nf-trans-fx">fx</b>
              函数生成列
            </button>
            <button type="button" class="nf-trans-tool" :class="{ active: action === 'rowcol' }" @click="action = 'rowcol'">
              <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="14" height="14" rx="1" /><path d="M3 8h14M8 3v14" /></svg>
              列转行
            </button>
          </div>

          <section class="nf-card nf-trans-config">
            <h2>列转行配置</h2>
            <div class="nf-trans-row">
              <span>源数据集：</span>
              <el-select v-model="rowcol.source" class="nf-trans-input">
                <el-option label="月度地区销售表" value="月度地区销售表" />
              </el-select>
            </div>
            <div class="nf-trans-row">
              <span>保留列：</span>
              <div class="nf-trans-tags"><span class="nf-trans-tag">地区 ×</span></div>
            </div>
            <div class="nf-trans-row">
              <span>待转换列：</span>
              <div class="nf-trans-tags">
                <span class="nf-trans-tag">2026-07 ×</span>
                <span class="nf-trans-tag">2026-08 ×</span>
                <span class="nf-trans-tag">2026-09 ×</span>
              </div>
            </div>
            <div class="nf-trans-row">
              <span>属性字段名：</span>
              <el-input v-model="rowcol.attr" class="nf-trans-input" />
            </div>
            <div class="nf-trans-row">
              <span>数值字段名：</span>
              <el-input v-model="rowcol.value" class="nf-trans-input" />
            </div>
            <div class="nf-trans-actions">
              <label class="nf-trans-check">
                <input v-model="rowcol.ignoreEmpty" type="checkbox" class="nf-checkbox" />
                忽略空值
              </label>
              <div class="nf-trans-btns">
                <button type="button" class="nf-trans-btn" @click="resetRowcol">重置</button>
                <button type="button" class="nf-trans-btn nf-trans-primary" @click="ElMessage.success('执行转换')">执行转换</button>
              </div>
            </div>
          </section>

          <section class="nf-card nf-trans-result">
            <h2>转换前（宽表）</h2>
            <table class="nf-table nf-trans-table">
              <thead><tr><th>地区</th><th>2026-07</th><th>2026-08</th><th>2026-09</th></tr></thead>
              <tbody>
                <tr><td>华东</td><td>¥128,600</td><td>¥146,200</td><td>¥153,800</td></tr>
                <tr><td>华南</td><td>¥96,300</td><td>¥122,500</td><td>¥134,700</td></tr>
                <tr><td>华北</td><td>¥78,200</td><td>¥101,600</td><td>¥121,400</td></tr>
              </tbody>
            </table>
          </section>
        </div>

        <div class="nf-trans-right">
          <section class="nf-card nf-trans-preview">
            <h2>转换结果预览</h2>
            <p class="nf-trans-band">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1677ff" stroke-width="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 9v5" stroke-linecap="round" /><circle cx="10" cy="6.4" r="0.9" fill="#1677ff" stroke="none" /></svg>
              3 个数值列　→　2 个字段
            </p>
            <table class="nf-table nf-trans-table">
              <thead><tr><th>地区</th><th>月份</th><th>销售金额</th></tr></thead>
              <tbody>
                <tr v-for="row in rows" :key="'t' + row.month + row.region">
                  <td>{{ row.region }}</td><td>{{ row.month }}</td><td>{{ row.amount }}</td>
                </tr>
              </tbody>
            </table>
            <div class="nf-trans-footrow">
              <p class="nf-trans-plainnote">原 3 行 × 4 列，转换后 9 行 × 3 列</p>
              <button type="button" class="nf-trans-btn nf-trans-primary" @click="goDetail">保存为新数据集</button>
            </div>
            <p class="nf-trans-note nf-trans-note-tip">
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1677ff" stroke-width="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 9v5" stroke-linecap="round" /><circle cx="10" cy="6.4" r="0.9" fill="#1677ff" stroke="none" /></svg>
              列转行会将多个列名转换为属性值，并把对应单元格内容汇总到新的数值字段中。
            </p>
          </section>
        </div>
      </div>
    </template>

    <!-- 转换执行详情 -->
    <template v-else>
      <h1 class="nf-transdetail-title">模型数据扩展和行列转换 / 转换执行详情</h1>
      <p class="nf-transdetail-sub">以下任务、时间及状态均为示例数据</p>

      <div class="nf-transdetail-grid">
        <section class="nf-card nf-transdetail-card nf-d-basic">
          <h2>基本信息</h2>
          <table class="nf-trans-kv nf-transdetail-kv">
            <tbody>
              <tr><td>任务名称</td><td>月度地区销售表列转行</td></tr>
              <tr><td>任务编号</td><td>TRANS-DEMO-001</td></tr>
              <tr><td>源数据集</td><td>月度地区销售表</td></tr>
              <tr><td>转换类型</td><td>列转行</td></tr>
              <tr><td>操作人</td><td>测试用户</td></tr>
              <tr><td>操作时间</td><td>2026-10-26 10:00:00</td></tr>
              <tr><td>转换描述</td><td>将2026年7月至9月的销售金额列转换为月份和销售金额字段。</td></tr>
            </tbody>
          </table>
        </section>

        <section class="nf-card nf-transdetail-card nf-d-rules">
          <h2>转换规则配置</h2>
          <table class="nf-trans-kv nf-transdetail-kv">
            <tbody>
              <tr><td>保留列</td><td>地区</td></tr>
              <tr><td>待转换列</td><td>2026-07、2026-08、2026-09</td></tr>
              <tr><td>属性字段</td><td>月份</td></tr>
              <tr><td>数值字段</td><td>销售金额</td></tr>
              <tr><td>忽略空值</td><td>是</td></tr>
            </tbody>
          </table>
        </section>

        <div class="nf-d-right">
          <section class="nf-card nf-transdetail-card nf-d-preview">
            <h2>转换后数据预览</h2>
            <table class="nf-table nf-trans-table nf-transdetail-preview">
              <thead><tr><th>地区</th><th>月份</th><th>销售金额</th></tr></thead>
              <tbody>
                <tr v-for="row in rows" :key="'d' + row.month + row.region">
                  <td>{{ row.region }}</td><td>{{ row.month }}</td><td>{{ row.amount }}</td>
                </tr>
              </tbody>
            </table>
          </section>
          <div class="nf-transdetail-foot">
            <button type="button" class="nf-trans-btn" @click="ElMessage.info('查看执行日志')">查看执行日志</button>
            <button type="button" class="nf-trans-btn" @click="ElMessage.info('查看输出数据集')">查看输出数据集</button>
            <button type="button" class="nf-trans-btn nf-trans-primary" @click="backToMain">返回</button>
          </div>
        </div>

        <section class="nf-card nf-transdetail-card nf-d-result">
          <h2>执行结果</h2>
          <table class="nf-trans-kv nf-transdetail-kv">
            <tbody>
              <tr><td>转换是否完成</td><td><span class="nf-trans-pill">是</span></td></tr>
              <tr><td>转换是否异常</td><td><span class="nf-trans-pill">否</span></td></tr>
              <tr><td>转换异常理由</td><td>无</td></tr>
              <tr><td>转换开始时间</td><td>2026-10-26 10:00:01</td></tr>
              <tr><td>转换结束时间</td><td>2026-10-26 10:00:03</td></tr>
              <tr><td>执行耗时</td><td>2 秒</td></tr>
            </tbody>
          </table>
          <p class="nf-transdetail-band">转换前：3 行 × 4 列 → 转换后：9 行 × 3 列</p>
        </section>

        <section class="nf-card nf-transdetail-card nf-d-output">
          <h2>输出数据集</h2>
          <table class="nf-trans-kv nf-transdetail-kv">
            <tbody>
              <tr><td>名称</td><td>月度地区销售表_列转行</td></tr>
              <tr><td>保存状态</td><td><span class="nf-trans-pill">已保存</span></td></tr>
              <tr><td>字段</td><td>地区、月份、销售金额</td></tr>
              <tr><td>数据记录数</td><td>9</td></tr>
            </tbody>
          </table>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { manualBreadcrumb } from '../../config/breadcrumb.js'

const DETAIL_CRUMB = ['业务数据管理', '数据模型准备', '数据扩展与透视', '转换执行详情']

const view = ref('main')
const action = ref('func')

const func = reactive({
  source: '月度地区销售表_列转行（示例）',
  name: '销售金额_万元',
  type: '数值（保留2位小数）',
  formula: 'ROUND(销售金额 / 10000, 2)',
  description: '在原数据基础上新增以万元为单位的销售金额列。'
})

const rowcol = reactive({
  source: '月度地区销售表',
  attr: '月份',
  value: '销售金额',
  ignoreEmpty: true
})

const rows = [
  { region: '华东', month: '2026-07', amount: '¥128,600', wan: '12.86' },
  { region: '华东', month: '2026-08', amount: '¥146,200', wan: '14.62' },
  { region: '华东', month: '2026-09', amount: '¥153,800', wan: '15.38' },
  { region: '华南', month: '2026-07', amount: '¥96,300', wan: '9.63' },
  { region: '华南', month: '2026-08', amount: '¥122,500', wan: '12.25' },
  { region: '华南', month: '2026-09', amount: '¥134,700', wan: '13.47' },
  { region: '华北', month: '2026-07', amount: '¥78,200', wan: '7.82' },
  { region: '华北', month: '2026-08', amount: '¥101,600', wan: '10.16' },
  { region: '华北', month: '2026-09', amount: '¥121,400', wan: '12.14' }
]

function resetFunc() {
  func.source = '月度地区销售表_列转行（示例）'
  func.name = '销售金额_万元'
  func.type = '数值（保留2位小数）'
  func.formula = 'ROUND(销售金额 / 10000, 2)'
  func.description = '在原数据基础上新增以万元为单位的销售金额列。'
}

function resetRowcol() {
  rowcol.source = '月度地区销售表'
  rowcol.attr = '月份'
  rowcol.value = '销售金额'
  rowcol.ignoreEmpty = true
}

function goDetail() {
  view.value = 'detail'
  manualBreadcrumb.value = DETAIL_CRUMB
}

function backToMain() {
  view.value = 'main'
  manualBreadcrumb.value = null
}

onBeforeUnmount(() => {
  manualBreadcrumb.value = null
})
</script>

<style scoped>
.nf-trans-page {
  width: calc(100% + 31px);
  max-width: none;
  padding: 44px 10px 40px;
}

.nf-trans-title {
  margin: 0 0 20px 6px;
  color: #1f2329;
  font-size: 28px;
  font-weight: 700;
}

.nf-trans-tabs {
  display: flex;
  gap: 32px;
  margin: 0 0 16px 6px;
  border-bottom: 1px solid #e5e6eb;
}

.nf-trans-tabs button {
  position: relative;
  padding: 0 0 12px;
  border: 0;
  background: none;
  color: #606266;
  font-size: 16px;
  cursor: pointer;
}

.nf-trans-tabs button.active {
  color: #1677ff;
  font-weight: 600;
}

.nf-trans-tabs button.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: #1677ff;
}

.nf-trans-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.nf-trans-tool {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-width: 146px;
  height: 46px;
  padding: 0 22px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  background: #ffffff;
  color: #1f2329;
  font-size: 15px;
  cursor: pointer;
}

.nf-trans-tool.active {
  border-color: #1677ff;
  background: #1677ff;
  color: #ffffff;
}

.nf-trans-fx {
  font-style: italic;
  font-size: 16px;
}

.nf-trans-layout {
  display: flex;
  gap: 16px;
  align-items: stretch;
}

.nf-trans-left {
  flex: 1;
  min-width: 0;
}

.nf-trans-right {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.nf-trans-leftwrap {
  padding: 18px 12px 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background: #ffffff;
}

.nf-trans-section {
  margin: 0 0 8px;
  color: #1f2329;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
}

.nf-trans-config,
.nf-trans-result,
.nf-trans-preview {
  padding: 16px 22px 14px;
}

.nf-trans-result {
  margin-top: 12px;
}

.nf-trans-left .nf-card + .nf-card {
  margin-top: 12px;
}

.nf-trans-preview {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  margin-top: 0;
}

.nf-trans-config h2,
.nf-trans-result h2,
.nf-trans-preview h2 {
  margin: 0 0 10px;
  color: #1f2329;
  font-size: 18px;
  font-weight: 700;
}

.nf-trans-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.nf-trans-row > span {
  flex: none;
  width: 108px;
  color: #1f2329;
  font-size: 14px;
  text-align: right;
  padding-right: 10px;
}

.nf-trans-input {
  flex: 1;
}

.nf-trans-tags {
  display: flex;
  gap: 8px;
}

.nf-trans-tag {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fafafa;
  color: #1f2329;
  font-size: 13px;
}

.nf-trans-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

.nf-trans-actions .nf-trans-btns {
  margin-top: 0;
}

.nf-trans-check {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 0;
  color: #1f2329;
  font-size: 14px;
}

.nf-trans-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.nf-trans-btns-right {
  justify-content: flex-end;
  margin-top: auto;
}

.nf-trans-btn {
  min-width: 96px;
  height: 38px;
  padding: 0 18px;
  border: 1px solid #1677ff;
  border-radius: 4px;
  background: #ffffff;
  color: #1677ff;
  font-size: 14px;
  cursor: pointer;
}

.nf-trans-primary {
  background: #1677ff;
  color: #ffffff;
}

.nf-trans-kv {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.nf-trans-kv td {
  height: 33px;
  padding: 0 12px;
  border: 1px solid #ebeef5;
  color: #1f2329;
  font-size: 13px;
  text-align: left;
}

.nf-trans-kv td:nth-child(odd) {
  width: 18%;
  background: #f7f9fc;
  color: #606266;
  text-align: center;
  white-space: nowrap;
}

.nf-trans-kv td {
  padding: 0 10px;
}

.nf-trans-kv .green {
  background: #f0f9eb;
  color: #00b42a;
}

.nf-trans-band {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  padding: 9px 14px;
  border-radius: 4px;
  background: #eef4ff;
  color: #1f2329;
  font-size: 14px;
}

.nf-trans-table th {
  height: 40px;
  font-size: 13px;
  font-weight: 600;
}

.nf-trans-table td {
  height: 36px;
  font-size: 13px;
}

.nf-trans-new {
  display: inline-block;
  margin-left: 4px;
  padding: 0 4px;
  border-radius: 2px;
  background: #1677ff;
  color: #ffffff;
  font-size: 9px;
  font-weight: 400;
  line-height: 14px;
  vertical-align: middle;
}

.nf-trans-newcol {
  background: #f7fbff;
}

.nf-trans-note {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: auto 0 0;
  padding: 9px 14px;
  border-radius: 4px;
  background: #eef4ff;
  color: #1f2329;
  font-size: 14px;
}

.nf-trans-footrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 14px;
}

.nf-trans-plainnote {
  margin: 0;
  color: #1f2329;
  font-size: 14px;
}

.nf-trans-note-tip {
  margin-top: auto;
}

/* 详情 */
.nf-transdetail-title {
  margin: 0 0 6px 6px;
  color: #1f2329;
  font-size: 24px;
  font-weight: 700;
}

.nf-transdetail-sub {
  margin: 0 0 16px 6px;
  color: #909399;
  font-size: 14px;
}

.nf-transdetail-grid {
  display: grid;
  grid-template-columns: 1.21fr 1fr 1.25fr;
  gap: 16px;
  align-items: start;
}

.nf-d-basic {
  grid-column: 1;
  grid-row: 1;
}

.nf-d-rules {
  grid-column: 2;
  grid-row: 1;
}

.nf-d-preview {
  grid-column: 3;
  grid-row: 1 / span 2;
}

.nf-d-right {
  grid-column: 3;
  grid-row: 1 / span 2;
  align-self: start;
}

.nf-d-result {
  grid-column: 1;
  grid-row: 2;
}

.nf-d-output {
  grid-column: 2;
  grid-row: 2;
}

.nf-transdetail-card {
  padding: 18px 20px 20px;
}

.nf-transdetail-card h2 {
  margin: 0 0 14px;
  color: #1f2329;
  font-size: 17px;
  font-weight: 700;
}

.nf-transdetail-kv td {
  height: 36px;
}

.nf-transdetail-kv td:nth-child(odd) {
  width: 30%;
}

.nf-trans-pill {
  display: inline-block;
  padding: 1px 14px;
  border-radius: 10px;
  background: #f0f9eb;
  color: #00b42a;
  font-size: 13px;
}

.nf-transdetail-preview th,
.nf-transdetail-preview td {
  height: 44px;
}

.nf-transdetail-band {
  margin: 14px 0 0;
  padding: 10px 14px;
  border-radius: 4px;
  background: #eef4ff;
  color: #1f2329;
  font-size: 14px;
}

.nf-transdetail-foot {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 36px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-size: 14px;
}
</style>