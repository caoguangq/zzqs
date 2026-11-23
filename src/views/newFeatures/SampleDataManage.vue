<template>
  <div class="nf-page nf-sample-page">
    <div class="nf-sample-toolbar">
      <div class="nf-sample-search">
        <input v-model="keyword" aria-label="搜索" />
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#6b7480" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="9" r="5.4" /><path d="m13 13 4 4" /></svg>
      </div>
      <button type="button" class="nf-sample-add" @click="ElMessage.info('示例页面：添加数据模型')">
        添加数据模型
        <span class="nf-sample-add-icon">＋</span>
      </button>
    </div>

    <section class="nf-sample-filter">
      <div class="nf-sample-filter-row">
        <span class="nf-sample-filter-label">业务类型：</span>
        <div class="nf-sample-cities">
          <a
            v-for="city in cities"
            :key="city"
            class="nf-sample-city"
            :class="{ active: activeCity === city }"
            @click="activeCity = activeCity === city ? '' : city"
          >{{ city }}</a>
        </div>
        <button type="button" class="nf-sample-multi" @click="ElMessage.info('多选')">多选</button>
      </div>
      <div class="nf-sample-filter-row nf-sample-sort-row">
        <span class="nf-sample-filter-label">浏览排序：</span>
        <a class="nf-sample-sort" @click="toggleSort">升降排序</a>
      </div>
    </section>

    <div class="nf-sample-gap">
      <div class="nf-sample-views">
        <button type="button" class="nf-sample-view" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'" aria-label="宫格视图">
          <svg viewBox="0 0 16 16" width="15" height="15" fill="#25303f"><rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" /><rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" /></svg>
        </button>
        <button type="button" class="nf-sample-view" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'" aria-label="列表视图">
          <svg viewBox="0 0 16 16" width="15" height="15" fill="#25303f"><rect x="1" y="2" width="2" height="2" /><rect x="5" y="2" width="10" height="2" /><rect x="1" y="7" width="2" height="2" /><rect x="5" y="7" width="10" height="2" /><rect x="1" y="12" width="2" height="2" /><rect x="5" y="12" width="10" height="2" /></svg>
        </button>
      </div>
    </div>

    <section class="nf-sample-list">
      <table class="nf-sample-table">
        <colgroup>
          <col style="width: 2.2%" />
          <col style="width: 24.7%" />
          <col style="width: 14.9%" />
          <col style="width: 11.8%" />
          <col style="width: 11.8%" />
          <col style="width: 10%" />
          <col style="width: 24.6%" />
        </colgroup>
        <thead>
          <tr>
            <th><input v-model="allChecked" type="checkbox" class="nf-sample-check" @change="toggleAll" /></th>
            <th>模板维护人</th>
            <th>模板维护时间</th>
            <th>模板描述</th>
            <th>样例状态</th>
            <th>样例负责人</th>
            <th>样例描述</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in filteredRows" :key="row.name">
            <td><input v-model="checked" type="checkbox" class="nf-sample-check" :value="row.name" /></td>
            <td>{{ row.name }}</td>
            <td>{{ row.time }}</td>
            <td>{{ row.desc }}</td>
            <td>{{ row.state }}</td>
            <td>{{ row.owner }}</td>
            <td class="nf-sample-actions">
              <a class="nf-link" @click="ElMessage.info('查看 ' + row.name)">查看</a>
              <span class="nf-sample-sep">/</span>
              <a class="nf-link" @click="ElMessage.info('赋权 ' + row.name)">赋权</a>
              <span class="nf-sample-sep">/</span>
              <a class="nf-link" @click="ElMessage.info('修改 ' + row.name)">修改</a>
              <span class="nf-sample-sep">/</span>
              <a class="nf-link" @click="removeRow(row)">删除</a>
            </td>
          </tr>
          <tr v-if="!filteredRows.length">
            <td class="nf-sample-empty" colspan="7">暂无数据</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const cities = ['景德镇', '省公司', '吉安', '赣州', '九江', '南昌', '萍乡', '宜春', '抚州', '新余', '上饶', '鹰潭']
const activeCity = ref('')
const keyword = ref('')
const ascending = ref(true)
const viewMode = ref('grid')
const checked = ref([])
const allChecked = ref(false)

const rows = ref([
  { name: 'CRM例网质克壮', time: '2026-03-16 00:00:00', desc: '左帅', state: 'cm运筹平台', owner: '已发布' },
  { name: '2024年存量运营日报', time: '2026-03-16 00:00:00', desc: '罗月余艺', state: '刘石坚', owner: '已发布' },
  { name: '资费维系（新）', time: '2026-03-16 00:00:00', desc: '张程仓', state: 'cm运筹平台', owner: '已发布' },
  { name: '出账客户份额异化报表', time: '2026-03-16 00:00:00', desc: '张福仓', state: 'cm运筹平台', owner: '已发布' },
  { name: '2024年新业务发展日报', time: '2026-03-16 00:00:00', desc: '张理仓', state: 'cm运筹平台', owner: '已发布' }
])

const filteredRows = computed(() => {
  const list = rows.value.filter((row) => !keyword.value || row.name.includes(keyword.value.trim()))
  return ascending.value ? list : [...list].reverse()
})

function toggleSort() {
  ascending.value = !ascending.value
}

function toggleAll() {
  checked.value = allChecked.value ? filteredRows.value.map((row) => row.name) : []
}

function removeRow(row) {
  rows.value = rows.value.filter((item) => item !== row)
}
</script>

<style scoped>
.nf-sample-page {
  width: auto;
  min-height: calc(100vh - 51px);
  margin: -33px -43px -40px -31px;
  padding: 0 37px 40px 33px;
  background: #f9fbfd;
}

.nf-sample-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 29px;
  height: 66px;
  padding: 8px 70px 0 0;
}

.nf-sample-search {
  position: relative;
  width: 253px;
}

.nf-sample-search input {
  width: 100%;
  height: 29px;
  padding: 0 34px 0 14px;
  border: 1px solid #d6d8d5;
  border-radius: 14.5px;
  background: #ffffff;
  color: #1f2329;
  font-size: 12px;
  outline: none;
}

.nf-sample-search svg {
  position: absolute;
  top: 7px;
  right: 12px;
}

.nf-sample-add {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 133px;
  height: 29px;
  padding: 0 5px 0 16px;
  border: 0;
  border-radius: 14.5px;
  background: #0b81e7;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
}

.nf-sample-add-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
  font-size: 13px;
  line-height: 1;
}

.nf-sample-filter {
  position: relative;
  border: 1px solid #d5d5d7;
  border-radius: 2px;
  background: #ffffff;
}

.nf-sample-filter-row {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 28px 0 39px;
}

.nf-sample-filter-row + .nf-sample-filter-row {
  height: 39px;
  border-top: 1px solid #e2e3e5;
}

.nf-sample-filter-label {
  flex: none;
  width: 96px;
  color: #6b7480;
  font-size: 12px;
}

.nf-sample-cities {
  display: flex;
  align-items: center;
  gap: 23px;
}

.nf-sample-city {
  color: #3c4f6b;
  font-size: 12px;
  cursor: pointer;
}

.nf-sample-city.active,
.nf-sample-city:hover {
  color: #0b81e7;
}

.nf-sample-multi {
  position: absolute;
  top: 10px;
  right: 134px;
  height: 19px;
  padding: 0 11px;
  border: 0;
  border-radius: 9.5px;
  background: #0b81e7;
  color: #ffffff;
  font-size: 11px;
  line-height: 19px;
  cursor: pointer;
}

.nf-sample-sort {
  color: #0b81e7;
  font-size: 12px;
  cursor: pointer;
}

.nf-sample-gap {
  position: relative;
  height: 61px;
}

.nf-sample-views {
  position: absolute;
  top: 2px;
  right: 0;
  display: flex;
  border: 1px solid #dfe3e8;
  border-radius: 2px;
  background: #ffffff;
}

.nf-sample-view {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 22px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.nf-sample-view.active {
  background: #edf1f6;
}

.nf-sample-list {
  border: 1px solid #ababab;
  background: #ffffff;
}

.nf-sample-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.nf-sample-table th,
.nf-sample-table td {
  border-right: 1px solid #dcdcdc;
  border-bottom: 1px solid #dcdcdc;
  text-align: center;
  font-size: 12px;
}

.nf-sample-table th:last-child,
.nf-sample-table td:last-child {
  border-right: 0;
}

.nf-sample-table thead th {
  height: 32px;
  border-bottom: 1px solid #929292;
  color: #1f2329;
  font-weight: 700;
}

.nf-sample-table tbody td {
  height: 27px;
  color: #465878;
}

.nf-sample-table tbody tr:last-child td {
  border-bottom: 0;
}

.nf-sample-check {
  width: 13px;
  height: 13px;
  margin: 0;
  accent-color: #0b81e7;
  vertical-align: middle;
}

.nf-sample-actions .nf-link {
  color: #1677ff;
  font-size: 12px;
  cursor: pointer;
}

.nf-sample-sep {
  margin: 0 4px;
  color: #1677ff;
}

.nf-sample-empty {
  height: 100px !important;
  color: #909399 !important;
}
</style>