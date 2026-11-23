<template>
  <div class="nf-page nf-overview-page">
    <h1 class="nf-overview-title">负责人关联数据集总览列表</h1>

    <div class="nf-overview-filter">
      <span class="nf-overview-label">列表名称</span>
      <el-select v-model="draftList" class="nf-overview-select">
        <el-option v-for="item in lists" :key="item.name" :label="item.name" :value="item.name" />
      </el-select>
      <button type="button" class="nf-overview-query" @click="doSearch">
        <span>查询</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round">
          <circle cx="9" cy="9" r="5.4" />
          <path d="m13 13 4 4" />
        </svg>
      </button>
    </div>

    <div class="nf-overview-info">
      <span>列表数量： <b>{{ currentRows.length }}</b></span>
      <span>单页展示行数： <b>10</b></span>
    </div>

    <div class="nf-overview-info nf-overview-queryline">
      <span>查询条件： <b>列表名称 = {{ appliedList }}</b></span>
      <span>数据来源： <b>模型负责人信息表</b></span>
    </div>

    <section class="nf-card nf-overview-card">
      <table class="nf-table nf-overview-table">
        <colgroup>
          <col style="width: 43%" />
          <col style="width: 22.4%" />
          <col style="width: 34.6%" />
        </colgroup>
        <thead>
          <tr>
            <th>模型名称</th>
            <th>模型数量</th>
            <th>模型编码</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in currentRows" :key="row.code">
            <td>{{ row.name }}</td>
            <td class="nf-overview-center">{{ row.count }}</td>
            <td class="nf-overview-center">{{ row.code }}</td>
          </tr>
        </tbody>
      </table>

      <div class="nf-overview-foot">
        <div class="nf-overview-totals">
          <span>共 {{ currentRows.length }} 条记录</span>
        </div>

        <div class="nf-overview-pager">
          <button type="button" class="nf-overview-pill" disabled>上一页</button>
          <button type="button" class="nf-overview-page-btn active">1</button>
          <button type="button" class="nf-overview-pill" disabled>下一页</button>
          <span class="nf-overview-jump">前往</span>
          <input v-model="jumpPage" class="nf-overview-page-input" />
          <span class="nf-overview-jump">页</span>
          <button type="button" class="nf-overview-confirm" @click="confirmJump">确定</button>
          <span class="nf-overview-pagesize">每页 10 条</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const lists = [
  {
    name: '数据管理部关联数据集列表',
    rows: [
      { name: '用户基础信息模型', count: 1, code: 'MODEL_DM_001' },
      { name: '客户价值评估模型', count: 1, code: 'MODEL_DM_002' },
      { name: '月度经营分析模型', count: 1, code: 'MODEL_DM_003' },
      { name: '产品收入汇总模型', count: 1, code: 'MODEL_DM_004' },
      { name: '渠道运营统计模型', count: 1, code: 'MODEL_DM_005' },
      { name: '欠费风险分析模型', count: 1, code: 'MODEL_DM_006' },
      { name: '资费用户到达模型', count: 1, code: 'MODEL_DM_007' },
      { name: '流量使用分析模型', count: 1, code: 'MODEL_DM_008' },
      { name: '客户流失预警模型', count: 1, code: 'MODEL_DM_009' },
      { name: '区域经营指标模型', count: 1, code: 'MODEL_DM_010' }
    ]
  },
  {
    name: '经营分析部关联数据集列表',
    rows: [
      { name: '经营收入分析模型', count: 1, code: 'MODEL_JY_001' },
      { name: '业务发展监测模型', count: 1, code: 'MODEL_JY_002' },
      { name: '客户规模统计模型', count: 1, code: 'MODEL_JY_003' },
      { name: '渠道效能分析模型', count: 1, code: 'MODEL_JY_004' },
      { name: '产品销售分析模型', count: 1, code: 'MODEL_JY_005' },
      { name: '市场份额监测模型', count: 1, code: 'MODEL_JY_006' },
      { name: '成本费用分析模型', count: 1, code: 'MODEL_JY_007' },
      { name: '经营预算跟踪模型', count: 1, code: 'MODEL_JY_008' },
      { name: '收入趋势预测模型', count: 1, code: 'MODEL_JY_009' },
      { name: '经营绩效评估模型', count: 1, code: 'MODEL_JY_010' }
    ]
  }
]

const draftList = ref(lists[0].name)
const appliedList = ref(lists[0].name)
const jumpPage = ref('1')

const currentRows = computed(() => {
  const found = lists.find((item) => item.name === appliedList.value) || lists[0]
  return found.rows
})

function doSearch() {
  appliedList.value = draftList.value
}

function confirmJump() {
  if (!jumpPage.value || jumpPage.value === '1') {
    ElMessage.info('当前只有 1 页数据')
    return
  }
  ElMessage.info('当前只有 1 页数据')
}
</script>

<style scoped>
.nf-overview-page {
  max-width: none;
  margin-top: -16px;
  padding: 0 10px;
}

.nf-overview-title {
  margin: 0 0 47px 8px;
  color: #1f2329;
  font-size: 22px;
  font-weight: 700;
  line-height: 30px;
}

/* ---------- 筛选 ---------- */
.nf-overview-filter {
  display: flex;
  align-items: center;
  padding: 0 34px 0 16px;
}

.nf-overview-label {
  flex: none;
  margin-right: 40px;
  color: #1f2329;
  font-size: 14px;
  line-height: 20px;
}

.nf-overview-select {
  width: 329px;
}

.nf-overview-query {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100px;
  height: 39px;
  margin-left: auto;
  padding: 0 13px 0 17px;
  border: 0;
  border-radius: 20px;
  background: #1677ff;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-overview-query:hover {
  background: #4096ff;
}

.nf-overview-query svg {
  flex: none;
}

/* ---------- 列表信息 ---------- */
.nf-overview-info {
  display: grid;
  grid-template-columns: 132px 1fr;
  margin: 14px 0 0 16px;
  color: #1f2329;
  font-size: 14px;
  line-height: 22px;
}

.nf-overview-info b {
  font-weight: 400;
}

.nf-overview-queryline {
  grid-template-columns: 407px 1fr;
  margin-top: 15px;
}

/* ---------- 表格 ---------- */
.nf-overview-card {
  margin-top: 14px;
  overflow: hidden;
}

.nf-overview-table th {
  height: 59px;
  background: #fafafa;
  color: #1f2329;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.nf-overview-table td {
  height: 39px;
  padding-left: 22px;
  border-color: #ebeef5;
  color: #5b6e9d;
  font-size: 14px;
  text-align: left;
}

.nf-overview-table th,
.nf-overview-table td {
  border-left: 0;
  border-right: 0;
}

.nf-overview-table th:not(:first-child),
.nf-overview-table td:not(:first-child) {
  border-left: 1px solid #eef2f6;
}

.nf-overview-table .nf-overview-center {
  padding-left: 0;
  text-align: center;
}

.nf-overview-table {
  border-bottom: 0;
}

/* ---------- 底部分页 ---------- */
.nf-overview-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 13px;
  border-top: 1px solid #ebeef5;
}

.nf-overview-totals {
  color: #606266;
  font-size: 13px;
}

.nf-overview-pager {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nf-overview-pill {
  height: 30px;
  padding: 0 14px;
  border: 0;
  border-radius: 16px;
  background: #f5f7fa;
  color: #c0c4cc;
  font-size: 13px;
  cursor: not-allowed;
}

.nf-overview-page-btn {
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

.nf-overview-page-btn.active {
  background: #1677ff;
  color: #ffffff;
}

.nf-overview-jump {
  color: #606266;
  font-size: 13px;
}

.nf-overview-page-input {
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

.nf-overview-page-input:focus {
  border-color: #1677ff;
}

.nf-overview-confirm {
  height: 32px;
  padding: 0 16px;
  border: 1px solid #dcdfe6;
  border-radius: 16px;
  background: #ffffff;
  color: #333333;
  font-size: 13px;
  cursor: pointer;
}

.nf-overview-confirm:hover {
  border-color: #a9c8f5;
  color: #1677ff;
}

.nf-overview-pagesize {
  margin-left: 14px;
  color: #606266;
  font-size: 13px;
}

/* ---------- Element 控件 ---------- */
:deep(.nf-overview-select .el-select__wrapper) {
  min-height: 38px;
  padding-left: 16px;
  border-radius: 19px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-size: 14px;
}

:deep(.nf-overview-select .el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #1677ff inset;
}
</style>