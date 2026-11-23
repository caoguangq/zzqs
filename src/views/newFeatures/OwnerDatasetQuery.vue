<template>
  <div class="nf-page nf-owner-page">
    <h1 class="nf-owner-title">按负责人查询数据集</h1>

    <div class="nf-owner-filter">
      <div class="nf-owner-field">
        <p class="nf-owner-label">负责人名称</p>
        <el-select v-model="draftOwner" class="nf-owner-select">
          <el-option v-for="item in owners" :key="item.name" :label="item.name" :value="item.name" />
        </el-select>
      </div>
      <button type="button" class="nf-owner-query" @click="doSearch">
        <span>查询</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round">
          <circle cx="9" cy="9" r="5.4" />
          <path d="m13 13 4 4" />
        </svg>
      </button>
    </div>

    <div class="nf-owner-info">
      <span>负责人编码： <b>{{ currentOwner.code }}</b></span>
      <span>负责人手机号： <b>{{ currentOwner.phone }}</b></span>
    </div>

    <div class="nf-owner-info nf-owner-queryline">
      <span>查询条件： <b>负责人名称 = {{ appliedOwner }}</b></span>
      <span>数据来源： <b>模型负责人信息表</b></span>
    </div>

    <section class="nf-card nf-owner-card">
      <table class="nf-table nf-owner-table">
        <colgroup>
          <col style="width: 32.6%" />
          <col style="width: 27.7%" />
          <col style="width: 39.7%" />
        </colgroup>
        <thead>
          <tr>
            <th>负责人对应模型数据</th>
            <th>负责人对应模型类型</th>
            <th>负责人对应模型名称</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.code">
            <td>{{ row.code }}</td>
            <td>{{ row.type }}</td>
            <td>{{ row.name }}</td>
          </tr>
        </tbody>
      </table>

      <div class="nf-owner-foot">
        <div class="nf-owner-totals">
          <span>共 {{ rows.length }} 条记录</span>
          <span>每次返回 10 条</span>
        </div>

        <div class="nf-owner-pager">
          <button type="button" class="nf-owner-pill" disabled>上一页</button>
          <button type="button" class="nf-owner-page-btn active">1</button>
          <button type="button" class="nf-owner-pill" disabled>下一页</button>
          <span class="nf-owner-jump">前往</span>
          <input v-model="jumpPage" class="nf-owner-page-input" />
          <span class="nf-owner-jump">页</span>
          <button type="button" class="nf-owner-confirm" @click="confirmJump">确定</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const owners = [
  { name: '张伟', code: 'OWNER_ZW_001', phone: '138****1024' },
  { name: '李静', code: 'OWNER_LJ_002', phone: '139****2068' },
  { name: '王强', code: 'OWNER_WQ_003', phone: '137****3089' }
]

const draftOwner = ref('张伟')
const appliedOwner = ref('张伟')
const jumpPage = ref('')

const currentOwner = computed(() => owners.find((item) => item.name === appliedOwner.value) || owners[0])

const rows = [
  { code: 'DS202609001', type: '明细数据集', name: '用户基础信息数据集' },
  { code: 'DS202609002', type: '汇总数据集', name: '客户价值评估数据集' },
  { code: 'DS202609003', type: '主题数据集', name: '月度经营分析数据集' },
  { code: 'DS202609004', type: '明细数据集', name: '产品收入汇总数据集' },
  { code: 'DS202609005', type: '汇总数据集', name: '渠道运营统计数据集' },
  { code: 'DS202609006', type: '主题数据集', name: '欠费风险分析数据集' },
  { code: 'DS202609007', type: '明细数据集', name: '资费用户到达数据集' },
  { code: 'DS202609008', type: '汇总数据集', name: '流量使用分析数据集' },
  { code: 'DS202609009', type: '主题数据集', name: '客户流失预警数据集' },
  { code: 'DS202609010', type: '明细数据集', name: '区域经营指标数据集' }
]

function doSearch() {
  appliedOwner.value = draftOwner.value
}

function confirmJump() {
  if (!jumpPage.value) {
    ElMessage.warning('请输入页码')
    return
  }
  ElMessage.info('当前只有 1 页数据')
}
</script>

<style scoped>
.nf-owner-page {
  max-width: none;
  margin-top: -16px;
  padding: 0 10px;
}

.nf-owner-title {
  margin: 0 0 17px;
  color: #1f2329;
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;
}

/* ---------- 筛选 ---------- */
.nf-owner-filter {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-right: 34px;
}

.nf-owner-label {
  margin: 0 0 8px 6px;
  color: #1f2329;
  font-size: 14px;
  line-height: 20px;
}

.nf-owner-select {
  width: 418px;
}

.nf-owner-query {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 102px;
  height: 39px;
  padding: 0 13px 0 18px;
  border: 0;
  border-radius: 20px;
  background: #1677ff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-owner-query:hover {
  background: #4096ff;
}

.nf-owner-query svg {
  flex: none;
}

/* ---------- 负责人信息 ---------- */
.nf-owner-info {
  display: grid;
  grid-template-columns: 430px 1fr;
  margin: 19px 0 0 6px;
  color: #1f2329;
  font-size: 14px;
  line-height: 22px;
}

.nf-owner-info b {
  color: #1f2329;
  font-weight: 400;
}

.nf-owner-queryline {
  margin-top: 15px;
}

/* ---------- 表格 ---------- */
.nf-owner-card {
  margin-top: 22px;
  overflow: hidden;
}

.nf-owner-table th {
  height: 59px;
  padding-left: 23px;
  background: #fafafa;
  color: #1f2329;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}

.nf-owner-table td {
  height: 38.5px;
  padding-left: 24px;
  border-color: #ebeef5;
  color: #5b6e9d;
  font-size: 14px;
  text-align: left;
}

.nf-owner-table th,
.nf-owner-table td {
  border-left: 0;
  border-right: 0;
}

.nf-owner-table th:not(:first-child),
.nf-owner-table td:not(:first-child) {
  border-left: 1px solid #eef2f6;
}

.nf-owner-table {
  border-bottom: 0;
}

/* ---------- 底部分页 ---------- */
.nf-owner-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 13px;
  border-top: 1px solid #ebeef5;
}

.nf-owner-totals {
  display: flex;
  align-items: center;
  gap: 22px;
  color: #606266;
  font-size: 13px;
}

.nf-owner-pager {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nf-owner-pill {
  height: 30px;
  padding: 0 14px;
  border: 0;
  border-radius: 16px;
  background: #f5f7fa;
  color: #c0c4cc;
  font-size: 13px;
  cursor: not-allowed;
}

.nf-owner-page-btn {
  min-width: 33px;
  height: 28px;
  padding: 0 8px;
  border: 0;
  border-radius: 3px;
  background: #ffffff;
  color: #606266;
  font-size: 13px;
  cursor: pointer;
}

.nf-owner-page-btn.active {
  background: #1677ff;
  color: #ffffff;
}

.nf-owner-jump {
  color: #606266;
  font-size: 13px;
}

.nf-owner-page-input {
  width: 30px;
  height: 28px;
  padding: 0 4px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  color: #1f2329;
  font-size: 13px;
  text-align: center;
  outline: none;
}

.nf-owner-page-input:focus {
  border-color: #1677ff;
}

.nf-owner-confirm {
  height: 32px;
  padding: 0 16px;
  border: 1px solid #dcdfe6;
  border-radius: 16px;
  background: #ffffff;
  color: #333333;
  font-size: 13px;
  cursor: pointer;
}

.nf-owner-confirm:hover {
  border-color: #a9c8f5;
  color: #1677ff;
}

/* ---------- Element 控件 ---------- */
:deep(.nf-owner-select .el-select__wrapper) {
  min-height: 38px;
  padding-left: 16px;
  border-radius: 19px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-size: 14px;
}

:deep(.nf-owner-select .el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #1677ff inset;
}
</style>