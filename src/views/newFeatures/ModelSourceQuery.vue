<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { modelSourceTypes } from '../../data/modelSource.js'

const draftType = ref('逻辑模型')
const appliedType = ref('逻辑模型')
const selected = ref([])
const view = ref('list')
const detail = ref(null)

const rows = computed(() => modelSourceTypes[appliedType.value].rows)
const queryTime = computed(() => modelSourceTypes[appliedType.value].time)
const all = computed({
  get: () => rows.value.length > 0 && selected.value.length === rows.value.length,
  set: (value) => { selected.value = value ? rows.value.map((row) => row.id) : [] }
})

function query() {
  appliedType.value = draftType.value
  selected.value = []
}
function reset() {
  draftType.value = '逻辑模型'
  appliedType.value = '逻辑模型'
  selected.value = []
}
function openDetail(row) { detail.value = row }
</script>

<template>
  <div class="nf-feature-22">
    <h2 class="nf-page-title">过滤条件</h2>
    <section class="nf-filter-card">
      <div class="nf-query-row">
        <span class="nf-cond-label">查询条件：</span>
        <label class="nf-type-label" for="nf-source-type">模型类型：</label>
        <span class="nf-select">
          <select id="nf-source-type" v-model="draftType" aria-label="模型类型">
            <option>逻辑模型</option>
            <option>物理模型</option>
          </select>
          <i aria-hidden="true" />
        </span>
        <button type="button" class="nf-query-btn" @click="query">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8" /><path d="m13 13 4.2 4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
          查询
        </button>
        <button type="button" class="nf-reset-btn" @click="reset">重置</button>
      </div>
      <div class="nf-cond-grid">
        <p><span>模型名称:</span><b>不限</b></p>
        <p><span>模型编码:</span><b>不限</b></p>
        <p><span>模型标识:</span><b>不限</b></p>
        <p><span>模型标签:</span><b>不限</b></p>
        <p><span>模型分类:</span><b>不限</b></p>
        <p><span>模型类型:</span><b>{{ appliedType }}</b></p>
      </div>
    </section>

    <section class="nf-result-card">
      <div class="nf-result-head">
        <h2>模型来源查询结果</h2>
        <div class="nf-view-toggle" role="group" aria-label="结果视图">
          <button type="button" :class="{ active: view === 'grid' }" aria-label="卡片视图" @click="view = 'grid'">
            <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="1.5" width="5" height="5" /><rect x="9.5" y="1.5" width="5" height="5" /><rect x="1.5" y="9.5" width="5" height="5" /><rect x="9.5" y="9.5" width="5" height="5" /></svg>
          </button>
          <button type="button" :class="{ active: view === 'list' }" aria-label="列表视图" @click="view = 'list'">
            <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2" width="2.4" height="2.4" /><rect x="6" y="2.6" width="8.5" height="1.3" /><rect x="1.5" y="6.8" width="2.4" height="2.4" /><rect x="6" y="7.4" width="8.5" height="1.3" /><rect x="1.5" y="11.6" width="2.4" height="2.4" /><rect x="6" y="12.2" width="8.5" height="1.3" /></svg>
          </button>
        </div>
      </div>
      <p class="nf-result-meta">
        <span>查询时间：<b>{{ queryTime }}</b></span><i>|</i>
        <span>查询结果行数：<b>{{ rows.length }}</b></span><i>|</i>
        <span>查询人名称：<b>admin管理员</b></span><i>|</i>
        <span>查询人编码：<b>U000001</b></span>
      </p>

      <template v-if="view === 'list'">
        <div class="nf-table-block">
          <h3 class="nf-table-title">模型基础信息表</h3>
          <div class="nf-table-wrap">
            <table>
              <colgroup><col style="width:4%" /><col style="width:16%" /><col style="width:11%" /><col style="width:12%" /><col style="width:11%" /><col style="width:10%" /><col style="width:11%" /><col style="width:14%" /><col style="width:11%" /></colgroup>
              <thead>
                <tr><th><input v-model="all" :indeterminate="selected.length > 0 && !all" type="checkbox" aria-label="全选模型" /></th><th>模型名称</th><th>模型编码</th><th>模型标识</th><th>模型类型</th><th>模型标签</th><th>模型分类</th><th>模型来源</th><th>操作</th></tr>
              </thead>
              <tbody>
                <tr v-for="row in rows" :key="row.id">
                  <td><input v-model="selected" type="checkbox" :value="row.id" :aria-label="'选择' + row.name" /></td>
                  <td>{{ row.name }}</td>
                  <td>{{ row.code }}</td>
                  <td>{{ row.mark }}</td>
                  <td>{{ row.type }}</td>
                  <td>{{ row.tag }}</td>
                  <td>{{ row.category }}</td>
                  <td>{{ row.source }}</td>
                  <td class="nf-ops"><button type="button" @click="openDetail(row)">查看</button> / <button type="button" @click="openDetail(row)">详情</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <div v-else class="nf-source-cards">
        <article v-for="row in rows" :key="row.id" @click="openDetail(row)">
          <header><b>{{ row.name }}</b><span>{{ row.code }}</span></header>
          <p><span>模型标识：</span>{{ row.mark }}</p>
          <p><span>模型类型：</span>{{ row.type }}</p>
          <p><span>模型分类：</span>{{ row.category }}</p>
          <p><span>模型来源：</span>{{ row.source }}</p>
        </article>
      </div>

      <div class="nf-result-footer">
        <span class="nf-total">共 <b>{{ rows.length }}</b> 条记录 <em>每页 5 条；仅按所选条件读取模型基础信息。</em></span>
        <nav class="nf-pager" aria-label="模型来源分页">
          <button type="button" disabled>上一页</button>
          <button type="button" class="page active">1</button>
          <button type="button" disabled>下一页</button>
          <span>前往</span><input aria-label="前往页码" value="1" /><span>页</span>
          <button type="button" class="nf-pager-ok" @click="ElMessage.info('当前仅一页')">确定</button>
        </nav>
      </div>
    </section>

    <el-dialog :model-value="!!detail" title="模型详情" width="560px" @close="detail = null">
      <template v-if="detail">
        <p>模型名称：{{ detail.name }}</p>
        <p>模型编码：{{ detail.code }}</p>
        <p>模型标识：{{ detail.mark }}</p>
        <p>模型类型：{{ detail.type }}</p>
        <p>模型标签：{{ detail.tag }}</p>
        <p>模型分类：{{ detail.category }}</p>
        <p>模型来源：{{ detail.source }}</p>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.nf-feature-22 { margin: -33px -43px -40px -31px; padding: 24px 36px 40px; min-height: calc(100vh - 51px); background: #f5f7fc; color: #333; font-size: 14px; }
.nf-page-title { margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #303133; }
.nf-filter-card { background: #fff; border: 1px solid #e4eaf2; border-radius: 2px; }
.nf-query-row { display: flex; align-items: center; height: 90px; padding: 0 40px; }
.nf-cond-label { width: 182px; flex: none; color: #606266; font-size: 16px; }
.nf-type-label { flex: none; margin-right: 12px; color: #606266; font-size: 16px; }
.nf-select { position: relative; width: 322px; flex: none; }
.nf-select select { width: 100%; height: 42px; padding: 0 34px 0 14px; border: 1px solid #dfe5ee; border-radius: 4px; background: #fff; color: #303133; font: inherit; appearance: none; outline: none; cursor: pointer; }
.nf-select i { position: absolute; right: 15px; top: 16px; width: 8px; height: 8px; border-right: 1px solid #a8b3c2; border-bottom: 1px solid #a8b3c2; transform: rotate(45deg); pointer-events: none; }
.nf-query-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 42px; margin-left: 56px; padding: 0 18px; border: 0; border-radius: 4px; background: #1677ff; color: #fff; font: inherit; cursor: pointer; }
.nf-query-btn svg { width: 17px; height: 17px; }
.nf-query-btn:hover { background: #4096ff; }
.nf-reset-btn { height: 42px; margin-left: 36px; padding: 0 20px; border: 1px solid #dcdfe6; border-radius: 4px; background: #fff; color: #303133; font: inherit; cursor: pointer; }
.nf-cond-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: 20px; padding: 2px 46px 26px; }
.nf-cond-grid p { display: flex; gap: 18px; margin: 0; }
.nf-cond-grid span { color: #606266; font-size: 15px; }
.nf-cond-grid b { color: #1681d7; font-weight: 400; font-size: 15px; }
.nf-result-card { margin-top: 20px; padding: 0 16px; background: #fff; border: 1px solid #e4eaf2; border-radius: 2px; }
.nf-result-head { display: flex; align-items: center; justify-content: space-between; height: 64px; }
.nf-result-head h2 { margin: 0; font-size: 18px; font-weight: 600; color: #303133; }
.nf-view-toggle { display: flex; gap: 0; }
.nf-view-toggle button { width: 30px; height: 30px; border: 1px solid #e4e8ef; background: #fff; color: #5d6b7d; font-size: 14px; line-height: 1; cursor: pointer; }
.nf-view-toggle button.active { color: #1681d7; border-color: #b9d4f3; background: #f5f9ff; }
.nf-result-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 16px; margin: 0; padding: 0 0 15px; border-bottom: 1px solid #edf0f5; color: #606266; }
.nf-result-meta b { color: #1681d7; font-weight: 400; }
.nf-result-meta i { color: #e1e5ec; font-style: normal; }
.nf-table-block { margin-top: 16px; }
.nf-table-title { margin: 0; padding: 11px 14px; border: 1px solid #e8edf5; border-bottom: 0; background: #fff; font-size: 15px; font-weight: 600; color: #303133; }
.nf-table-wrap { overflow-x: auto; border: 1px solid #e8edf5; border-top: 0; }
.nf-table-wrap table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.nf-table-wrap th { height: 46px; background: #fff; border: 1px solid #e8edf5; color: #303133; font-size: 14px; font-weight: 600; }
.nf-table-wrap td { height: 46px; border: 1px solid #e8edf5; text-align: center; color: #1681d7; font-size: 14px; padding: 0 4px; }
.nf-table-wrap tbody tr:hover { background: #f7faff; }
.nf-ops { color: #1681d7 !important; }
.nf-ops button { border: 0; background: none; padding: 0; color: #1681d7; font: inherit; cursor: pointer; }
.nf-source-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; padding: 4px 0 18px; }
.nf-source-cards article { border: 1px solid #e8edf5; padding: 14px 16px; cursor: pointer; }
.nf-source-cards article:hover { box-shadow: 0 2px 10px rgba(22, 119, 255, 0.08); }
.nf-source-cards header { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.nf-source-cards header b { font-size: 14px; font-weight: 500; }
.nf-source-cards header span { color: #7d8a9c; font-size: 12px; }
.nf-source-cards p { margin: 8px 0 0; font-size: 12px; }
.nf-source-cards p span { color: #7d8a9c; }
.nf-result-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 62px; }
.nf-total { color: #303133; }
.nf-total b { font-weight: 600; }
.nf-total em { margin-left: 18px; color: #8b95a5; font-style: normal; font-size: 13px; }
.nf-pager { display: flex; align-items: center; gap: 9px; color: #606266; white-space: nowrap; }
.nf-pager button { height: 34px; padding: 0 10px; border: 0; background: none; color: #a0a8b4; font: inherit; cursor: default; }
.nf-pager button.page { width: 34px; padding: 0; border-radius: 2px; background: #1677ff; color: #fff; }
.nf-pager button.nf-pager-ok { padding: 0 16px; border-radius: 2px; background: #1677ff; color: #fff; cursor: pointer; }
.nf-pager input { width: 42px; height: 32px; border: 1px solid #dcdfe6; border-radius: 2px; text-align: center; color: #303133; font: inherit; }
@media (max-width: 1400px) {
  .nf-query-row { padding: 0 24px; }
  .nf-cond-label { width: 100px; }
  .nf-cond-grid { padding-left: 24px; padding-right: 24px; gap: 12px; }
  .nf-result-meta { gap: 10px; }
}
@media (max-width: 1100px) {
  .nf-query-row { height: auto; min-height: 64px; flex-wrap: wrap; gap: 10px; padding: 12px 20px; }
  .nf-cond-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); padding: 4px 20px 18px; }
  .nf-result-footer { align-items: flex-start; flex-direction: column; padding-bottom: 12px; }
  .nf-source-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px) {
  .nf-cond-grid { grid-template-columns: minmax(0, 1fr); }
  .nf-source-cards { grid-template-columns: minmax(0, 1fr); }
  .nf-pager { flex-wrap: wrap; }
}
</style>
