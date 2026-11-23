<template>
  <div class="nf-page nf-sampletask-page">
    <!-- 新建取数任务 -->
    <template v-if="view === 'task'">
      <div class="nf-sampletask-head">
        <h1>新建取数任务</h1>
        <button type="button" class="nf-sampletask-save" @click="dialogVisible = true">保存取数任务</button>
      </div>

      <section class="nf-sampletask-card">
        <div class="nf-sampletask-info">
          <p><span>数据源：</span>用户信息表</p>
          <p><span>结果字段（已选 5 个）：</span><a class="nf-link">用户ID、用户名、性别、手机号、注册时间</a></p>
          <p><span>筛选条件（1 个）：</span><a class="nf-link">性别 = '男'</a></p>
          <p><span>排序字段（0 个）：</span><a class="nf-link">未设置</a></p>
        </div>

        <div class="nf-sampletask-toolbar">
          <input v-model="keyword" class="nf-sampletask-search" placeholder="请输入字段名称查找..." />
          <a class="nf-sampletask-more" @click="ElMessage.info('更多')">更多 ▾</a>
        </div>

        <table class="nf-sampletask-table">
          <colgroup>
            <col style="width: 4%" />
            <col style="width: 70%" />
            <col style="width: 10.1%" />
            <col style="width: 15.9%" />
          </colgroup>
          <thead>
            <tr>
              <th><input type="checkbox" class="nf-checkbox" /></th>
              <th>字段名称</th>
              <th>字段类型</th>
              <th>字段描述</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in filteredFields" :key="field.name">
              <td><input v-model="field.checked" type="checkbox" class="nf-checkbox" /></td>
              <td>{{ field.name }}</td>
              <td>{{ field.type }}</td>
              <td>{{ field.desc }}</td>
            </tr>
          </tbody>
        </table>

        <div class="nf-sampletask-foot">
          <span>已选择 {{ selectedCount }} 个字段</span>
          <div class="nf-sampletask-pager">
            <button type="button" class="nf-sampletask-arrow" disabled>‹</button>
            <button type="button" class="nf-sampletask-page active">1</button>
            <button type="button" class="nf-sampletask-page">2</button>
            <button type="button" class="nf-sampletask-page">3</button>
            <button type="button" class="nf-sampletask-arrow">›</button>
          </div>
        </div>
      </section>
    </template>

    <!-- 采样执行详情 -->
    <template v-else>
      <h1 class="nf-sampledetail-title">模型数据采样执行详情</h1>
      <p class="nf-sampledetail-note">
        <svg viewBox="0 0 20 20" width="19" height="19" fill="none" stroke="#1677ff" stroke-width="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 9v5" stroke-linecap="round" /><circle cx="10" cy="6.4" r="0.9" fill="#1677ff" stroke="none" /></svg>
        以下为示例数据
      </p>

      <section class="nf-sampledetail-card">
        <h2>基本信息（示例）</h2>
        <table class="nf-sampledetail-table nf-sampledetail-info">
          <colgroup>
            <col style="width: 10.7%" /><col style="width: 21.9%" />
            <col style="width: 12.1%" /><col style="width: 22.2%" />
            <col style="width: 10.9%" /><col style="width: 22.2%" />
          </colgroup>
          <tbody>
            <tr>
              <td class="label">任务名称</td><td>用户信息随机抽取</td>
              <td class="label">任务编号</td><td>SAMPLE-DEMO-001</td>
              <td class="label">数据来源</td><td>用户信息表</td>
            </tr>
            <tr>
              <td class="label">取数用途</td><td>模型训练数据准备</td>
              <td class="label">操作人</td><td>测试用户（示例）</td>
              <td class="label">采样方式</td><td>随机采样</td>
            </tr>
            <tr>
              <td class="label">采样条件</td><td>性别 = 男</td>
              <td class="label">采样数量上限</td><td>10000条</td>
              <td class="label">任务描述</td><td>抽取模型训练样本数据</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="nf-sampledetail-card">
        <h2>执行结果（示例）</h2>
        <table class="nf-sampledetail-table nf-sampledetail-result">
          <colgroup>
            <col style="width: 10.7%" /><col style="width: 21.9%" />
            <col style="width: 12.1%" /><col style="width: 22.2%" />
            <col style="width: 10.9%" /><col style="width: 22.2%" />
          </colgroup>
          <tbody>
            <tr>
              <td class="label">执行状态</td>
              <td><span class="nf-sampledetail-badge">
                <svg viewBox="0 0 20 20" width="16" height="16"><circle cx="10" cy="10" r="9" fill="#24b263" /><path d="m6 10.3 2.7 2.7 5.3-5.5" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                已完成</span></td>
              <td class="label">采样是否完成</td><td>是</td>
              <td class="label">采样是否异常</td><td>否</td>
            </tr>
            <tr>
              <td class="label">异常理由</td><td>无</td>
              <td class="label">采样开始时间</td><td>2026-10-26 10:00:00</td>
              <td class="label">采样结束时间</td><td>2026-10-26 10:00:08</td>
            </tr>
            <tr>
              <td class="label">执行耗时</td><td>8秒</td>
              <td class="label">实际采样记录数</td><td>10000条</td>
              <td class="label">生成文件格式</td><td>CSV</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="nf-sampledetail-card">
        <h2>采样结果预览（示例）</h2>
        <table class="nf-sampledetail-table nf-sampledetail-preview">
          <colgroup>
            <col style="width: 19.4%" />
            <col style="width: 23%" />
            <col style="width: 15.8%" />
            <col style="width: 23.7%" />
            <col style="width: 18.1%" />
          </colgroup>
          <thead>
            <tr>
              <th>用户ID</th>
              <th>用户名</th>
              <th>性别</th>
              <th>手机号</th>
              <th>注册时间</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>DEMO001</td><td>测试用户A</td><td>男</td><td>139****0001</td><td>2025-01-01</td></tr>
            <tr><td>DEMO002</td><td>测试用户B</td><td>男</td><td>139****0002</td><td>2025-02-01</td></tr>
            <tr><td>DEMO003</td><td>测试用户C</td><td>男</td><td>139****0003</td><td>2025-03-01</td></tr>
          </tbody>
        </table>
        <div class="nf-sampledetail-foot">
          <span>共10000条，仅预览前3条（示例）</span>
          <div>
            <button type="button" class="nf-sampledetail-btn" @click="ElMessage.info('查看执行日志')">查看执行日志</button>
            <button type="button" class="nf-sampledetail-btn nf-sampledetail-primary" @click="ElMessage.info('下载采样文件')">下载采样文件</button>
          </div>
        </div>
      </section>
    </template>

    <!-- 保存取数任务弹窗 -->
    <el-dialog v-model="dialogVisible" width="775px" class="nf-dialog nf-sampletask-dialog" :close-on-click-modal="false">
      <template #header><span class="nf-sampletask-dialog-title">保存取数任务</span></template>
      <div class="nf-sampletask-dialog-row">
        <span class="nf-sampletask-dialog-label">查询任务名称 <i>*</i></span>
        <el-input v-model="dialog.taskName" />
      </div>
      <div class="nf-sampletask-dialog-row">
        <span class="nf-sampletask-dialog-label">取数用途 <i>*</i></span>
        <el-select v-model="dialog.purpose" style="width: 100%">
          <el-option label="模型训练数据准备" value="模型训练数据准备" />
          <el-option label="数据分析" value="数据分析" />
        </el-select>
      </div>
      <div class="nf-sampletask-dialog-row">
        <span class="nf-sampletask-dialog-label">限制最多生成条数 <i>*</i></span>
        <el-radio-group v-model="dialog.limit">
          <el-radio value="否">否</el-radio>
          <el-radio value="是">是</el-radio>
        </el-radio-group>
      </div>
      <div class="nf-sampletask-dialog-row">
        <span class="nf-sampletask-dialog-label">最多生成条数 <i>*</i></span>
        <div class="nf-sampletask-dialog-field">
          <el-input v-model="dialog.maxRows" />
          <p class="nf-sampletask-dialog-hint">不能超过100000</p>
        </div>
      </div>
      <div class="nf-sampletask-dialog-row">
        <span class="nf-sampletask-dialog-label">生成离线下载文件 <i>*</i></span>
        <el-select v-model="dialog.fileType" style="width: 100%">
          <el-option label="生成CSV文件格式" value="生成CSV文件格式" />
          <el-option label="生成Excel文件格式" value="生成Excel文件格式" />
        </el-select>
      </div>
      <div class="nf-sampletask-dialog-row nf-sampletask-dialog-row-last">
        <span class="nf-sampletask-dialog-label">任务描述</span>
        <el-input v-model="dialog.description" type="textarea" resize="none" />
      </div>
      <p class="nf-sampletask-dialog-info">
        <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="#1677ff" stroke-width="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 9v5" stroke-linecap="round" /><circle cx="10" cy="6.4" r="0.9" fill="#1677ff" stroke="none" /></svg>
        未设置排序字段时随机抽取；设置排序字段后按排序结果截取。
      </p>
      <template #footer>
        <div class="nf-sampletask-dialog-footer">
          <button type="button" class="nf-sampletask-dialog-cancel" @click="dialogVisible = false">取消</button>
          <button type="button" class="nf-sampletask-dialog-save" @click="submitTask">保存并执行</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { manualBreadcrumb } from '../../config/breadcrumb.js'

const DETAIL_CRUMB = ['自助取数', '取数任务', '采样执行详情']

const view = ref('task')
const dialogVisible = ref(false)
const keyword = ref('')

const fields = ref([
  { name: '用户ID', type: 'string', desc: '用户唯一标识', checked: true },
  { name: '用户名', type: 'string', desc: '用户登录名称', checked: true },
  { name: '性别', type: 'string', desc: '用户性别', checked: true },
  { name: '手机号', type: 'string', desc: '手机号码', checked: true },
  { name: '注册时间', type: 'timestamp', desc: '注册时间', checked: true },
  { name: '邮箱', type: 'string', desc: '邮箱地址', checked: false },
  { name: '所属地区', type: 'string', desc: '所属地区', checked: false },
  { name: '用户状态', type: 'string', desc: '账号状态', checked: false },
  { name: '创建时间', type: 'timestamp', desc: '创建时间', checked: false },
  { name: '最后登录时间', type: 'timestamp', desc: '最后登录时间', checked: false }
])

const dialog = reactive({
  taskName: '用户信息随机抽取',
  purpose: '模型训练数据准备',
  limit: '是',
  maxRows: '10000',
  fileType: '生成CSV文件格式',
  description: '抽取模型训练样本数据'
})

const filteredFields = computed(() =>
  fields.value.filter((field) => !keyword.value || field.name.includes(keyword.value.trim()))
)
const selectedCount = computed(() => fields.value.filter((field) => field.checked).length)

function submitTask() {
  dialogVisible.value = false
  view.value = 'detail'
  manualBreadcrumb.value = DETAIL_CRUMB
}

function backToTask() {
  view.value = 'task'
  manualBreadcrumb.value = null
}

onBeforeUnmount(() => {
  manualBreadcrumb.value = null
})
</script>

<style scoped>
.nf-sampletask-page {
  max-width: none;
  padding: 24px 10px 40px;
}

.nf-sampletask-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.nf-sampletask-head h1 {
  margin: 0;
  color: #1f2329;
  font-size: 24px;
  font-weight: 700;
}

.nf-sampletask-save {
  width: 148px;
  height: 35px;
  border: 0;
  border-radius: 4px;
  background: #1677ff;
  color: #ffffff;
  font-size: 15px;
  cursor: pointer;
}

.nf-sampletask-card {
  border: 1px solid #f0f0f2;
  border-radius: 4px;
  background: #ffffff;
}

.nf-sampletask-info {
  padding: 0 21px;
}

.nf-sampletask-info p {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 45px;
}

.nf-sampletask-info span {
  display: inline-block;
  margin-right: 12px;
}

.nf-sampletask-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 21px;
  margin: 8px 18px 16px 0;
}

.nf-sampletask-search {
  width: 283px;
  height: 34px;
  padding: 0 14px;
  border: 1px solid #dcdfe6;
  border-radius: 17px;
  color: #1f2329;
  font-size: 14px;
  outline: none;
}

.nf-sampletask-more {
  color: #333333;
  font-size: 14px;
  cursor: pointer;
}

.nf-sampletask-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.nf-sampletask-table th,
.nf-sampletask-table td {
  border-top: 1px solid #f4f4f4;
  border-right: 1px solid #f4f4f4;
  text-align: left;
  font-size: 14px;
}

.nf-sampletask-table th:first-child,
.nf-sampletask-table td:first-child {
  text-align: center;
}

.nf-sampletask-table th:nth-child(2),
.nf-sampletask-table td:nth-child(2) {
  padding-left: 26px;
}

.nf-sampletask-table th:nth-child(3),
.nf-sampletask-table td:nth-child(3) {
  padding-left: 23px;
}

.nf-sampletask-table th:nth-child(4),
.nf-sampletask-table td:nth-child(4) {
  padding-left: 19px;
}

.nf-sampletask-table thead th {
  height: 36px;
  background: #f7f7f7;
  color: #1f2329;
  font-weight: 700;
}

.nf-sampletask-table tbody td {
  height: 35px;
  color: #333333;
}

.nf-sampletask-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  padding: 0 18px 0 21px;
  color: #606266;
  font-size: 14px;
}

.nf-sampletask-pager {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nf-sampletask-arrow,
.nf-sampletask-page {
  min-width: 32px;
  height: 30px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  background: #ffffff;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
}

.nf-sampletask-page.active {
  border-color: #1677ff;
  background: #1677ff;
  color: #ffffff;
}

/* 详情 */
.nf-sampledetail-title {
  margin: 0 0 8px;
  color: #1f2329;
  font-size: 24px;
  font-weight: 700;
}

.nf-sampledetail-note {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  color: #1677ff;
  font-size: 15px;
}

.nf-sampledetail-card {
  margin-bottom: 19px;
  padding: 0 16px;
  border: 1px solid #f1f1f4;
  border-radius: 4px;
  background: #ffffff;
}

.nf-sampledetail-card h2 {
  margin: 0;
  padding: 14px 0 13px 5px;
  color: #1f2329;
  font-size: 17px;
  font-weight: 700;
}

.nf-sampledetail-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.nf-sampledetail-table th,
.nf-sampledetail-table td {
  border-top: 1px solid #eeeff1;
  border-right: 1px solid #eeeff1;
  font-size: 15px;
  text-align: left;
}

.nf-sampledetail-table td:last-child,
.nf-sampledetail-table th:last-child {
  border-right: 0;
}

.nf-sampledetail-info td,
.nf-sampledetail-result td {
  height: 44px;
  padding-left: 20px;
  color: #333333;
}

.nf-sampledetail-table .label {
  background: #fcfcfc;
  color: #333333;
  text-align: center;
  padding-left: 0;
}

.nf-sampledetail-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px;
  border-radius: 13px;
  background: #e6f8ea;
  color: #24a148;
  font-size: 14px;
  font-weight: 600;
}

.nf-sampledetail-preview thead th {
  height: 34px;
  color: #1f2329;
  font-weight: 700;
}

.nf-sampledetail-preview tbody td {
  height: 33px;
  padding-left: 20px;
  color: #333333;
}

.nf-sampledetail-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 61px;
  color: #606266;
  font-size: 15px;
}

.nf-sampledetail-btn {
  height: 36px;
  min-width: 144px;
  padding: 0 18px;
  border: 1px solid #1677ff;
  border-radius: 4px;
  background: #ffffff;
  color: #1677ff;
  font-size: 15px;
  cursor: pointer;
}

.nf-sampledetail-btn + .nf-sampledetail-btn {
  margin-left: 23px;
}

.nf-sampledetail-primary {
  border-color: #1677ff;
  background: #1677ff;
  color: #ffffff;
}

/* 弹窗 */
:global(.nf-sampletask-dialog) {
  margin-top: 140px;
  padding: 0;
}

:global(.nf-sampletask-dialog .el-dialog__header) {
  padding: 17px 26px 16px;
}

:global(.nf-sampletask-dialog .el-dialog__body) {
  max-height: none;
  padding: 17px 32px 6px 34px;
}

:global(.nf-sampletask-dialog .el-dialog__footer) {
  padding: 44px 20px 24px;
}

.nf-sampletask-dialog-title {
  color: #1f2329;
  font-size: 18px;
  font-weight: 600;
}

.nf-sampletask-dialog-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 22px;
}

.nf-sampletask-dialog-row-last {
  margin-bottom: 0;
}

.nf-sampletask-dialog-label {
  flex: none;
  width: 183px;
  padding-top: 8px;
  color: #1f2329;
  font-size: 14px;
  font-weight: 400;
}

.nf-sampletask-dialog-label i {
  color: #f5222d;
  font-style: normal;
}

.nf-sampletask-dialog-field {
  flex: 1;
}

.nf-sampletask-dialog-row > :deep(.el-input),
.nf-sampletask-dialog-row > :deep(.el-select),
.nf-sampletask-dialog-row > :deep(.el-textarea),
.nf-sampletask-dialog-row > :deep(.el-radio-group) {
  flex: 1;
}

.nf-sampletask-dialog-hint {
  margin: 10px 0 0;
  color: #909399;
  font-size: 12px;
}

.nf-sampletask-dialog-info {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 26px 0 0;
  color: #606266;
  font-size: 14px;
}

.nf-sampletask-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
}

.nf-sampletask-dialog-cancel,
.nf-sampletask-dialog-save {
  height: 35px;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
}

.nf-sampletask-dialog-cancel {
  width: 84px;
  border: 1px solid #dcdfe6;
  background: #ffffff;
  color: #333333;
}

.nf-sampletask-dialog-save {
  width: 128px;
  border: 0;
  background: #1677ff;
  color: #ffffff;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 35px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-size: 14px;
}

.nf-sampletask-dialog-row :deep(.el-textarea__inner) {
  height: 80px;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-size: 14px;
}

.nf-sampletask-dialog-row :deep(.el-radio) {
  margin-right: 48px;
  font-size: 14px;
}
</style>