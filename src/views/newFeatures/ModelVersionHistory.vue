<script setup>
import { computed, ref } from 'vue'
import { shareVersions, authVersions } from '../../data/modelSource.js'

const draftDesc = ref('数据分享')
const appliedDesc = ref('数据分享')

const rows = computed(() => (appliedDesc.value === '数据授权' ? authVersions : shareVersions))

function query() { appliedDesc.value = draftDesc.value }
function reset() { draftDesc.value = '数据分享'; appliedDesc.value = '数据分享' }
</script>

<template>
  <div class="nf-feature-25">
    <h2 class="nf-page-title">过滤条件</h2>
    <section class="nf-filter-card">
      <div class="nf-query-row">
        <label class="nf-type-label" for="nf-version-desc">模型版本描述：</label>
        <span class="nf-select">
          <select id="nf-version-desc" v-model="draftDesc" aria-label="模型版本描述">
            <option>数据分享</option>
            <option>数据授权</option>
          </select>
          <i aria-hidden="true" />
        </span>
        <button type="button" class="nf-query-btn" @click="query">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8" /><path d="m13 13 4.2 4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
          查询
        </button>
        <button type="button" class="nf-reset-btn" @click="reset">重置</button>
      </div>
    </section>

    <section class="nf-result-card">
      <div class="nf-result-head">
        <h2>模型历史版本查询结果</h2>
        <span class="nf-head-note">每次查询固定返回5条记录</span>
      </div>
      <p class="nf-query-line">查询条件：模型版本描述 = {{ appliedDesc }}</p>
      <p class="nf-data-line">数据来源：模型历史信息基础表</p>

      <div class="nf-table-wrap">
        <table>
          <colgroup><col style="width:30%" /><col style="width:24%" /><col style="width:26%" /><col style="width:20%" /></colgroup>
          <thead>
            <tr><th>版本名称</th><th>版本编码</th><th>版本更新时间</th><th>版本操作人</th></tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.code }}</td>
              <td>{{ row.updated }}</td>
              <td>{{ row.operator }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="nf-result-footer">
        <span class="nf-total">共 <b>{{ rows.length }}</b> 条记录</span>
        <span class="nf-page-summary">第 <b>1</b> / 1 页 <em>每次返回 5 条</em></span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.nf-feature-25 { margin: -33px -43px -40px -31px; padding: 24px 36px 40px; min-height: calc(100vh - 51px); background: #f5f7fc; color: #333; font-size: 14px; }
.nf-page-title { margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #303133; }
.nf-filter-card { background: #fff; border: 1px solid #e4eaf2; border-radius: 2px; }
.nf-query-row { display: flex; align-items: center; height: 88px; padding: 0 40px 0 59px; }
.nf-type-label { flex: none; margin-right: 20px; color: #606266; font-size: 15px; }
.nf-select { position: relative; width: 456px; flex: none; }
.nf-select select { width: 100%; height: 44px; padding: 0 34px 0 14px; border: 1px solid #dfe5ee; border-radius: 4px; background: #fff; color: #303133; font: inherit; appearance: none; outline: none; cursor: pointer; }
.nf-select i { position: absolute; right: 15px; top: 17px; width: 8px; height: 8px; border-right: 1px solid #a8b3c2; border-bottom: 1px solid #a8b3c2; transform: rotate(45deg); pointer-events: none; }
.nf-query-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 44px; margin-left: 50px; padding: 0 20px; border: 0; border-radius: 4px; background: #1677ff; color: #fff; font: inherit; cursor: pointer; }
.nf-query-btn svg { width: 17px; height: 17px; }
.nf-query-btn:hover { background: #4096ff; }
.nf-reset-btn { height: 44px; margin-left: 20px; padding: 0 20px; border: 1px solid #dcdfe6; border-radius: 4px; background: #fff; color: #303133; font: inherit; cursor: pointer; }
.nf-result-card { margin-top: 24px; padding: 0 16px; background: #fff; border: 1px solid #e4eaf2; border-radius: 2px; }
.nf-result-head { display: flex; align-items: center; justify-content: space-between; height: 80px; }
.nf-result-head h2 { margin: 0; font-size: 18px; font-weight: 600; color: #303133; }
.nf-head-note { color: #5b7fa6; font-size: 14px; }
.nf-query-line { margin: 0 0 10px; color: #1681d7; font-size: 17px; }
.nf-data-line { margin: 0 0 14px; color: #8b95a5; font-size: 15px; }
.nf-table-wrap { overflow-x: auto; border: 1px solid #e8edf5; }
.nf-table-wrap table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.nf-table-wrap th { height: 58px; background: #fff; border: 1px solid #e8edf5; color: #303133; font-size: 15px; font-weight: 600; }
.nf-table-wrap td { height: 58px; border: 1px solid #e8edf5; text-align: center; color: #1681d7; font-size: 15px; padding: 0 6px; }
.nf-table-wrap tbody tr:hover { background: #f7faff; }
.nf-result-footer { display: flex; align-items: center; justify-content: space-between; min-height: 80px; color: #303133; }
.nf-total b { font-weight: 600; }
.nf-page-summary { color: #606266; }
.nf-page-summary b { color: #1681d7; font-weight: 400; }
.nf-page-summary em { margin-left: 18px; color: #8b95a5; font-style: normal; font-size: 13px; }
@media (max-width: 1400px) {
  .nf-query-row { padding: 0 24px; }
  .nf-cond-label { width: 100px; }
}
@media (max-width: 1100px) {
  .nf-query-row { height: auto; min-height: 64px; flex-wrap: wrap; gap: 10px; padding: 12px 20px; }
}
</style>
