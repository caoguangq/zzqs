<template>
  <div class="nf-page nf-dim-root">
    <div class="nf-dim-filters">
      <div class="nf-dim-field">
        <p>维度名称</p>
        <input v-model="draftName" class="nf-dim-input" placeholder="请输入维度名称..." />
      </div>
      <div class="nf-dim-field">
        <p>维度描述</p>
        <input v-model="draftDesc" class="nf-dim-input" placeholder="请输入维度描述..." />
      </div>
      <button type="button" class="nf-dim-search" @click="doSearch">
        查询
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="5.4" /><path d="m13 13 4 4" /></svg>
      </button>
    </div>

    <section class="nf-card nf-dim-card">
      <div class="nf-dim-head">
        <h2>维度管理</h2>
        <button type="button" class="nf-dim-add" @click="ElMessage.info('新增维度')">新增</button>
      </div>

      <table class="nf-table nf-dim-table">
        <colgroup>
          <col style="width: 2.25%" />
          <col style="width: 17.4%" />
          <col style="width: 24.1%" />
          <col style="width: 8.05%" />
          <col style="width: 13.4%" />
          <col style="width: 10.7%" />
          <col style="width: 13.4%" />
          <col style="width: 10.7%" />
        </colgroup>
        <thead>
          <tr>
            <th></th>
            <th>维度名称</th>
            <th>上级维度</th>
            <th>维度记录条数</th>
            <th>维度描述</th>
            <th>创建人</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in filteredRows" :key="row.name + index">
            <td>{{ index + 1 }}</td>
            <td class="nf-dim-left">{{ row.name }}</td>
            <td class="nf-dim-left">{{ row.parent }}</td>
            <td class="nf-dim-left">{{ row.count }}</td>
            <td class="nf-dim-left">{{ row.desc }}</td>
            <td class="nf-dim-left">{{ row.creator }}</td>
            <td class="nf-dim-left nf-dim-nowrap">{{ row.time }}</td>
            <td class="nf-dim-actions">
              <a class="nf-link" @click="ElMessage.info('修改 ' + row.name)">修改</a>
              <span class="nf-sep">/</span>
              <a class="nf-link" @click="ElMessage.info('删除 ' + row.name)">删除</a>
            </td>
          </tr>
          <tr v-if="!filteredRows.length">
            <td class="nf-dim-empty" colspan="8">暂无数据</td>
          </tr>
        </tbody>
      </table>

      <div class="nf-dim-foot">
        <span>共 {{ filteredRows.length }} 条记录</span>
        <div class="nf-dim-pager">
          <button type="button" class="nf-dim-pill" disabled>上一页</button>
          <button type="button" class="nf-dim-page active">1</button>
          <button type="button" class="nf-dim-pill" disabled>下一页</button>
          <span class="nf-dim-jump">前往</span>
          <input v-model="jumpPage" class="nf-dim-jump-input" />
          <span class="nf-dim-jump">页</span>
          <button type="button" class="nf-dim-confirm" @click="ElMessage.info('当前只有 1 页数据')">确定</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const draftName = ref('')
const draftDesc = ref('')
const appliedName = ref('')
const appliedDesc = ref('')
const jumpPage = ref('')

const rows = [
  { name: '宽带上单状态', parent: '', count: '2', desc: '判定宽带是否激活', creator: '赣州管理员郭海东', time: '2019-07-09 10:51:38' },
  { name: '品牌', parent: '', count: '11', desc: '品牌维表', creator: '黄玲', time: '2019-03-27 18:19:45' },
  { name: '用户状态', parent: '', count: '10', desc: '用户状态维表', creator: '黄玲', time: '2019-03-27 18:17:55' },
  { name: '区县维表', parent: '地市维表', count: '138', desc: '区县维表', creator: '黄玲', time: '2019-02-28 17:11:10' },
  { name: '地市维表', parent: '', count: '13', desc: '地市维表', creator: '黄玲', time: '2019-02-28 17:09:43' },
  { name: '资费类型(集市)', parent: '', count: '7745', desc: '资费类型', creator: '黄玲', time: '2019-02-28 17:04:07' },
  { name: '鹰潭星级类型(集市)', parent: '', count: '7', desc: '星级', creator: '黄玲', time: '2019-02-28 17:02:52' },
  { name: '鹰潭网格类型(集市)', parent: '', count: '15', desc: '鹰潭网格类型', creator: '黄玲', time: '2019-02-28 16:37:55' },
  { name: '鹰潭区县(集市)', parent: '', count: '6', desc: '鹰潭区县', creator: '黄玲', time: '2019-02-28 16:31:23' },
  { name: '是否1否0', parent: '', count: '2', desc: '是否判定(780)', creator: '黄玲', time: '2019-02-28 15:45:08' }
]

const filteredRows = computed(() =>
  rows.filter((row) => {
    if (appliedName.value && !row.name.includes(appliedName.value)) return false
    if (appliedDesc.value && !row.desc.includes(appliedDesc.value)) return false
    return true
  })
)

function doSearch() {
  appliedName.value = draftName.value.trim()
  appliedDesc.value = draftDesc.value.trim()
}
</script>

<style scoped>
.nf-dim-root {
  max-width: none;
  margin-top: -16px;
  padding: 0;
}

.nf-dim-filters {
  display: flex;
  align-items: flex-end;
  gap: 39px;
  padding: 10px 6px 24px;
}

.nf-dim-field {
  width: 304px;
}

.nf-dim-field p {
  margin: 0 0 9px 13px;
  color: #606266;
  font-size: 14px;
}

.nf-dim-input {
  width: 100%;
  height: 34px;
  padding: 0 18px;
  border: 1px solid #dcdfe6;
  border-radius: 17px;
  color: #1f2329;
  font-size: 13px;
  outline: none;
}

.nf-dim-input::placeholder {
  color: #b6bcc8;
}

.nf-dim-input:focus {
  border-color: #1677ff;
}

.nf-dim-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 99px;
  height: 36px;
  margin-left: auto;
  padding: 0 13px 0 17px;
  border: 0;
  border-radius: 18px;
  background: #0b81e7;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-dim-card {
  padding: 0;
}

.nf-dim-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 12px;
}

.nf-dim-head h2 {
  margin: 0;
  color: #1f2329;
  font-size: 15px;
  font-weight: 600;
}

.nf-dim-add {
  width: 92px;
  height: 36px;
  border: 0;
  border-radius: 18px;
  background: #0b81e7;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-dim-table th {
  height: 42px;
  font-size: 13px;
  font-weight: 600;
}

.nf-dim-table td {
  height: 34px;
  color: #333333;
  font-size: 13px;
}

.nf-dim-table .nf-dim-left {
  text-align: left;
  padding-left: 14px;
}

.nf-dim-nowrap {
  white-space: nowrap;
}

.nf-dim-actions .nf-link {
  font-size: 13px;
}

.nf-dim-empty {
  height: 120px !important;
  color: #909399 !important;
  text-align: center;
}

.nf-dim-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 40px 0 8px;
  color: #606266;
  font-size: 13px;
}

.nf-dim-pager {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nf-dim-pill {
  height: 28px;
  padding: 0 12px;
  border: 0;
  border-radius: 14px;
  background: #f5f7fa;
  color: #c0c4cc;
  font-size: 13px;
}

.nf-dim-page {
  min-width: 33px;
  height: 28px;
  border: 0;
  border-radius: 3px;
  background: #0b81e7;
  color: #ffffff;
  font-size: 13px;
}

.nf-dim-jump {
  color: #606266;
  font-size: 13px;
}

.nf-dim-jump-input {
  width: 32px;
  height: 28px;
  padding: 0 4px;
  border: 1px solid #dcdfe6;
  border-radius: 3px;
  color: #1f2329;
  font-size: 13px;
  text-align: center;
  outline: none;
}

.nf-dim-confirm {
  height: 32px;
  padding: 0 14px;
  border: 1px solid #dcdfe6;
  border-radius: 16px;
  background: #ffffff;
  color: #333333;
  font-size: 13px;
  cursor: pointer;
}
</style>