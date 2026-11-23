<template>
  <div class="nf-page nf-clean-page" :class="{ 'nf-clean-page-detail': view === 'detail' }">
    <!-- 数据预处理 -->
    <template v-if="view === 'preprocess'">
      <h1 class="nf-clean-title">数据预处理</h1>

      <div class="nf-clean-steps">
        <div v-for="(step, index) in steps" :key="step" class="nf-clean-step" :class="{ active: index === 1 }">
          <span class="nf-clean-step-no">{{ index + 1 }}</span>
          <span>{{ step }}</span>
        </div>
      </div>

      <section class="nf-card nf-clean-card">
        <h2>数据去重</h2>
        <label class="nf-clean-check">
          <input v-model="dedup" type="checkbox" class="nf-checkbox" />
          过滤重复数据
        </label>
        <p class="nf-clean-warn">
          <svg viewBox="0 0 20 20" width="16" height="16"><circle cx="10" cy="10" r="9" fill="#ffb02e" /><path d="M10 5.5v5.2" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" /><circle cx="10" cy="14.2" r="1.1" fill="#ffffff" /></svg>
          启用后将过滤结果中的重复记录，可能影响数据预览或生成效率。
        </p>
      </section>

      <section class="nf-card nf-clean-filter">
        <h2>条件过滤</h2>
        <div class="nf-clean-filter-row">
          <el-select v-model="filter.field" class="nf-clean-field">
            <el-option label="用户状态" value="用户状态" />
            <el-option label="用户ID" value="用户ID" />
          </el-select>
          <div class="nf-clean-segmented">
            <button type="button" class="active">精准查询</button>
            <button type="button">模糊查询</button>
            <button type="button">是否为空</button>
          </div>
        </div>
        <div class="nf-clean-filter-row">
          <el-radio-group v-model="filter.mode">
            <el-radio value="包含">精确包含</el-radio>
            <el-radio value="排除">精确排除</el-radio>
          </el-radio-group>
          <el-input v-model="filter.value" class="nf-clean-value" placeholder="请输入筛选值" />
          <button type="button" class="nf-clean-add" @click="addCondition">添加</button>
        </div>
        <div class="nf-clean-chips">
          <span v-for="(chip, index) in conditions" :key="chip" class="nf-clean-chip">
            {{ chip }} <a @click="conditions.splice(index, 1)">×</a>
          </span>
        </div>
      </section>

      <section class="nf-card nf-clean-fields">
        <div class="nf-clean-fields-head">
          <h2>字段处理</h2>
          <div class="nf-clean-formula">
            <el-input v-model="formula" class="nf-clean-formula-input" />
            <el-input v-model="columnName" class="nf-clean-column-name" />
            <button type="button" class="nf-clean-generate" @click="ElMessage.success('函数生成')">函数生成</button>
          </div>
        </div>
        <table class="nf-table nf-clean-table">
          <colgroup>
            <col style="width: 24.5%" />
            <col style="width: 23%" />
            <col style="width: 25.5%" />
            <col style="width: 27%" />
          </colgroup>
          <thead>
            <tr>
              <th>A　用户ID</th>
              <th>B　用户名称</th>
              <th>C　手机号码</th>
              <th>
                D　自定义列
                <el-dropdown class="nf-clean-col-dropdown" trigger="click" @command="handleColumnCommand">
                  <a class="nf-clean-col-menu">···</a>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="left">左侧添加列</el-dropdown-item>
                      <el-dropdown-item command="right">右侧添加列</el-dropdown-item>
                      <el-dropdown-item command="delete">删除此列</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><td>10001</td><td>张伟</td><td>138****2356</td><td>10001张伟</td></tr>
            <tr><td>10002</td><td>李娜</td><td>139****5721</td><td>10002李娜</td></tr>
            <tr><td>10003</td><td>王强</td><td>186****8042</td><td>10003王强</td></tr>
          </tbody>
        </table>
      </section>

      <div class="nf-clean-foot">
        <button type="button" class="nf-clean-btn" @click="ElMessage.info('上一步')">上一步</button>
        <button type="button" class="nf-clean-btn nf-clean-primary" @click="goDetail">下一步</button>
      </div>
    </template>

    <!-- 清洗执行详情 -->
    <template v-else>
      <h1 class="nf-cleandetail-title">模型数据清洗执行详情 <span>以下任务、时间及统计均为示例数据</span></h1>

      <section class="nf-card nf-cleandetail-card">
        <h2>基本信息（示例）</h2>
        <table class="nf-table nf-cleandetail-table">
          <tbody>
            <tr>
              <td class="label">任务名称</td><td>用户信息清洗（示例）</td>
              <td class="label">任务编号</td><td>CLEAN-DEMO-001</td>
            </tr>
            <tr>
              <td class="label">输入文件</td><td>用户信息表.csv（示例）</td>
              <td class="label">操作人</td><td>测试用户（示例）</td>
            </tr>
            <tr>
              <td class="label">操作时间</td><td>2026-10-26 10:00:00</td>
              <td class="label">清洗描述</td><td>去除完全重复记录，保留用户状态正常的数据，并拼接用户ID和用户名称。</td>
            </tr>
          </tbody>
        </table>
        <p class="nf-cleandetail-rules">
          <span><b>去重规则：</b>全部字段完全相同</span>
          <span><b>过滤条件：</b>用户状态 = 正常</span>
          <span><b>字段加工：</b>自定义列 = $A+$B</span>
        </p>
      </section>

      <section class="nf-card nf-cleandetail-card">
        <div class="nf-cleandetail-head">
          <h2>执行结果（示例）</h2>
          <span class="nf-cleandetail-badge">
            <svg viewBox="0 0 20 20" width="15" height="15"><circle cx="10" cy="10" r="9" fill="#ffffff" /><path d="m6 10.3 2.7 2.7 5.3-5.5" fill="none" stroke="#00b42a" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" /></svg>
            已完成（示例）
          </span>
        </div>
        <table class="nf-table nf-cleandetail-table">
          <tbody>
            <tr>
              <td class="label">清洗是否完成</td><td>是</td>
              <td class="label">清洗是否异常</td><td>否</td>
              <td class="label">异常理由</td><td>无</td>
            </tr>
            <tr>
              <td class="label">清洗开始时间</td><td>2026-10-26 10:00:01</td>
              <td class="label">清洗结束时间</td><td>2026-10-26 10:00:09</td>
              <td class="label">执行耗时</td><td>8秒</td>
            </tr>
          </tbody>
        </table>

        <div class="nf-cleandetail-stats">
          <div class="nf-cleandetail-stat">
            <span class="nf-cleandetail-stat-icon is-blue"><svg viewBox="0 0 20 20" width="24" height="24" fill="none" stroke="#1677ff" stroke-width="1.5"><path d="M5 2.5h7l4 4v11H5z" /><path d="M7 11h6M7 14h4" stroke-linecap="round" /></svg></span>
            <div><span>输入记录 数</span><b class="blue">12000</b></div>
          </div>
          <span class="nf-cleandetail-arrow">→</span>
          <div class="nf-cleandetail-stat">
            <span class="nf-cleandetail-stat-icon is-orange"><svg viewBox="0 0 20 20" width="24" height="24" fill="none" stroke="#ff7d00" stroke-width="1.5"><path d="M4 6h12M8 3h4l1 3H7zM6 6l1 11h6l1-11" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
            <div><span>去除重复记录</span><b class="orange">500</b></div>
          </div>
          <span class="nf-cleandetail-arrow">→</span>
          <div class="nf-cleandetail-stat">
            <span class="nf-cleandetail-stat-icon is-purple"><svg viewBox="0 0 20 20" width="24" height="24" fill="none" stroke="#722ed1" stroke-width="1.6"><path d="M3 4h14l-5.5 6.5V17l-3-1.5V10.5z" stroke-linejoin="round" /></svg></span>
            <div><span>去重后过滤记录</span><b class="purple">1500</b></div>
          </div>
          <span class="nf-cleandetail-arrow">→</span>
          <div class="nf-cleandetail-stat">
            <span class="nf-cleandetail-stat-icon is-green"><svg viewBox="0 0 20 20" width="24" height="24" fill="none" stroke="#00b42a" stroke-width="1.5"><path d="M5 2.5h7l4 4v11H5z" /><path d="M7 11h6M7 14h4" stroke-linecap="round" /></svg></span>
            <div><span>输出记录数</span><b class="green">10000</b></div>
          </div>
        </div>
      </section>

      <section class="nf-card nf-cleandetail-card nf-cleandetail-preview-card">
        <h2>清洗结果预览（示例）</h2>
        <table class="nf-table nf-cleandetail-table nf-cleandetail-preview">
          <colgroup>
            <col style="width: 18%" />
            <col style="width: 22%" />
            <col style="width: 20%" />
            <col style="width: 16%" />
            <col style="width: 24%" />
          </colgroup>
          <thead>
            <tr>
              <th>用户ID</th><th>用户名称</th><th>手机号码</th><th>用户状态</th><th>自定义列</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>DEMO001</td><td>测试用户A</td><td>138****0001</td><td>正常</td><td>DEMO001测试用户A</td></tr>
            <tr><td>DEMO002</td><td>测试用户B</td><td>139****0002</td><td>正常</td><td>DEMO002测试用户B</td></tr>
            <tr><td>DEMO003</td><td>测试用户C</td><td>186****0003</td><td>正常</td><td>DEMO003测试用户C</td></tr>
          </tbody>
        </table>
      </section>

      <div class="nf-cleandetail-foot">
        <span>共10000条，仅预览前3条（示例）</span>
        <div>
          <button type="button" class="nf-cleandetail-btn" @click="ElMessage.info('查看执行日志')">查看执行日志</button>
          <button type="button" class="nf-cleandetail-btn nf-cleandetail-primary" @click="ElMessage.info('下载清洗结果')">下载清洗结果</button>
          <button type="button" class="nf-cleandetail-btn" @click="backToPreprocess">返回</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { manualBreadcrumb } from '../../config/breadcrumb.js'

const DETAIL_CRUMB = ['业务数据管理', '数据模型准备', '清洗执行详情']

const steps = ['选择文件', '数据处理', '字段设置', '完成']
const view = ref('preprocess')
const dedup = ref(true)
const formula = ref('$A+$B')
const conditions = ref(['正常'])
const columnName = ref('')

const filter = reactive({ field: '用户状态', mode: '包含', value: '' })

function addCondition() {
  if (!filter.value.trim()) {
    ElMessage.warning('请输入筛选值')
    return
  }
  conditions.value.push(filter.value.trim())
  filter.value = ''
}

function handleColumnCommand(command) {
  const labels = { left: '左侧添加列', right: '右侧添加列', delete: '删除此列' }
  ElMessage.info(labels[command] || command)
}

function goDetail() {
  view.value = 'detail'
  manualBreadcrumb.value = DETAIL_CRUMB
}

function backToPreprocess() {
  view.value = 'preprocess'
  manualBreadcrumb.value = null
}

onBeforeUnmount(() => {
  manualBreadcrumb.value = null
})
</script>

<style scoped>
.nf-clean-page {
  max-width: none;
  padding: 2px 10px 20px;
}

.nf-clean-page-detail {
  padding-top: 60px;
}

.nf-clean-page .nf-card + .nf-card {
  margin-top: 0;
}

.nf-clean-title {
  margin: 0 0 12px 6px;
  color: #1f2329;
  font-size: 22px;
  font-weight: 700;
}

.nf-clean-steps {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 10px 0 16px;
}

.nf-clean-steps::before {
  content: '';
  position: absolute;
  top: 25px;
  right: 11%;
  left: 11%;
  height: 1px;
  background: #e5e6eb;
}

.nf-clean-step {
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #909399;
  font-size: 14px;
}

.nf-clean-step.active {
  color: #1677ff;
}

.nf-clean-step-no {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #dcdfe6;
  color: #ffffff;
  font-size: 15px;
}

.nf-clean-step.active .nf-clean-step-no {
  background: #1677ff;
}

.nf-clean-card,
.nf-clean-filter,
.nf-clean-fields {
  margin-bottom: 17px;
  padding: 16px 24px;
}

.nf-clean-card h2,
.nf-clean-filter h2,
.nf-clean-fields h2 {
  margin: 0;
  color: #1f2329;
  font-size: 17px;
  font-weight: 700;
}

.nf-clean-card h2 {
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.nf-clean-check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  color: #1f2329;
  font-size: 15px;
}

.nf-clean-warn {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 8px 0 0;
  color: #ff7d00;
  font-size: 14px;
}

.nf-clean-filter h2 {
  margin-bottom: 12px;
}

.nf-clean-filter-row {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 12px;
}

.nf-clean-filter-row + .nf-clean-filter-row {
  gap: 16px;
  padding-left: 349px;
}

.nf-clean-filter-row + .nf-clean-filter-row :deep(.el-radio-group) {
  margin-right: 28px;
}

.nf-clean-field {
  width: 324px;
}

.nf-clean-segmented {
  display: flex;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.nf-clean-segmented button {
  height: 38px;
  padding: 0 26px;
  border: 0;
  border-left: 1px solid #dcdfe6;
  background: #ffffff;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
}

.nf-clean-segmented button:first-child {
  border-left: 0;
}

.nf-clean-segmented button.active {
  background: #1677ff;
  color: #ffffff;
}

.nf-clean-value {
  width: 566px;
}

.nf-clean-add {
  width: 92px;
  height: 36px;
  border: 0;
  border-radius: 4px;
  background: #1677ff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-clean-chips {
  display: flex;
  gap: 10px;
  padding-left: 355px;
  margin-top: 2px;
}

.nf-clean-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 12px;
  border-radius: 4px;
  background: #f2f3f5;
  color: #1f2329;
  font-size: 14px;
}

.nf-clean-chip a {
  color: #909399;
  cursor: pointer;
}

.nf-clean-fields {
  padding-bottom: 45px;
}

.nf-clean-fields-head {
  display: flex;
  align-items: center;
  height: 57px;
  margin-bottom: 0;
  padding-right: 2px;
}

.nf-clean-fields-head h2 {
  flex: none;
  width: 277px;
}

.nf-clean-formula {
  display: flex;
  flex: 1;
  align-items: center;
}

.nf-clean-formula-input {
  width: 305px;
}

.nf-clean-column-name {
  width: 50px;
  margin-left: auto;
}

.nf-clean-generate {
  width: 117px;
  height: 32px;
  margin-left: 25px;
  border: 0;
  border-radius: 4px;
  background: #1677ff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-clean-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.nf-clean-table th {
  height: 40px;
  font-size: 14px;
  background: #fafafa;
}

.nf-clean-table td {
  height: 37px;
  font-size: 14px;
  text-align: left;
  padding-left: 32px;
}

.nf-clean-table th {
  padding-left: 32px;
  text-align: left;
}

.nf-clean-col-menu {
  margin-left: 8px;
  color: #606266;
  cursor: pointer;
}

.nf-clean-foot {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 10px;
}

.nf-clean-btn {
  min-width: 96px;
  height: 38px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #ffffff;
  color: #333333;
  font-size: 14px;
  cursor: pointer;
}

.nf-clean-primary {
  border-color: #1677ff;
  background: #1677ff;
  color: #ffffff;
}

/* 详情 */
.nf-cleandetail-title {
  margin: 0 0 16px 6px;
  color: #1f2329;
  font-size: 24px;
  font-weight: 700;
}

.nf-cleandetail-title span {
  margin-left: 14px;
  color: #909399;
  font-size: 14px;
  font-weight: 400;
}

.nf-cleandetail-card {
  margin-bottom: 12px;
  padding: 16px 22px;
}

.nf-cleandetail-card h2 {
  margin: 0 0 7px;
  color: #1f2329;
  font-size: 17px;
  font-weight: 700;
}

.nf-cleandetail-table th {
  height: 34px;
  font-size: 14px;
}

.nf-cleandetail-table td {
  height: 40px;
  font-size: 14px;
  text-align: left;
  padding-left: 18px;
}

.nf-cleandetail-table .label {
  width: 13%;
  background: #f7f9fc;
  color: #606266;
  text-align: center;
  padding-left: 0;
}

.nf-cleandetail-rules {
  display: flex;
  align-items: center;
  gap: 34px;
  margin: 8px 0 0;
  padding: 12px 18px;
  border-radius: 4px;
  background: #fafbfc;
  color: #1f2329;
  font-size: 14px;
}

.nf-cleandetail-rules b {
  color: #606266;
  font-weight: 400;
}

.nf-cleandetail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}

.nf-cleandetail-head h2 {
  margin: 0;
}

.nf-cleandetail-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 14px;
  border-radius: 15px;
  background: #00b42a;
  color: #ffffff;
  font-size: 14px;
}

.nf-cleandetail-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 8px 26px;
  border-radius: 4px;
  background: #fafbfc;
}

.nf-cleandetail-stat {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nf-cleandetail-stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.nf-cleandetail-stat-icon.is-blue { background: #e8f3ff; }
.nf-cleandetail-stat-icon.is-orange { background: #fff2e6; }
.nf-cleandetail-stat-icon.is-purple { background: #f2ecff; }
.nf-cleandetail-stat-icon.is-green { background: #e8f8ec; }

.nf-cleandetail-stat div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #606266;
  font-size: 13px;
}

.nf-cleandetail-stat b {
  font-size: 28px;
  font-weight: 700;
}

.nf-cleandetail-stat .blue { color: #1677ff; }
.nf-cleandetail-stat .orange { color: #ff7d00; }
.nf-cleandetail-stat .purple { color: #722ed1; }
.nf-cleandetail-stat .green { color: #00b42a; }

.nf-cleandetail-arrow {
  color: #c0c4cc;
  font-size: 20px;
}

.nf-cleandetail-preview-card {
  padding: 12px 22px 4px;
}

.nf-cleandetail-preview-card h2 {
  margin-bottom: 4px;
}

.nf-cleandetail-preview td {
  height: 33px;
}

.nf-cleandetail-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  color: #606266;
  font-size: 14px;
}

.nf-cleandetail-btn {
  height: 38px;
  padding: 0 20px;
  border: 1px solid #1677ff;
  border-radius: 4px;
  background: #ffffff;
  color: #1677ff;
  font-size: 14px;
  cursor: pointer;
}

.nf-cleandetail-btn + .nf-cleandetail-btn {
  margin-left: 12px;
}

.nf-cleandetail-primary {
  background: #1677ff;
  color: #ffffff;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 36px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-size: 14px;
}
</style>