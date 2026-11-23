<template>
  <div class="nf-page nf-extract-page">
    <div class="nf-extract-frame">
      <h1 class="nf-extract-banner">模型数据抽取管理</h1>

      <div class="nf-extract-content">
        <h2 class="nf-extract-title">自助取数平台</h2>

        <div class="nf-extract-grid">
          <section class="nf-extract-box">
            <div class="nf-extract-row">
              <span class="nf-extract-label">抽取时间</span>
              <el-input v-model="form.extractTime" class="nf-extract-input" />
            </div>
            <div class="nf-extract-row">
              <span class="nf-extract-label">抽取描述</span>
              <el-input v-model="form.description" class="nf-extract-input" />
            </div>
            <div class="nf-extract-row nf-extract-row-top">
              <span class="nf-extract-label">操作人</span>
              <el-input v-model="form.operator" type="textarea" resize="none" class="nf-extract-input" />
            </div>
            <div class="nf-extract-row nf-extract-row-last">
              <span class="nf-extract-label">操作时间</span>
              <el-select v-model="form.operateTime" class="nf-extract-input" placeholder=" ">
                <el-option label="2026-10-26 10:00:00" value="2026-10-26 10:00:00" />
                <el-option label="2026-10-27 10:00:00" value="2026-10-27 10:00:00" />
              </el-select>
            </div>
          </section>

          <section class="nf-extract-box nf-extract-status-box">
            <h3 class="nf-extract-status-title">处理状态</h3>
            <el-select v-model="form.status" class="nf-extract-status">
              <el-option label="数据抽取存储”表创建" value="数据抽取存储”表创建" />
              <el-option label="数据抽取完成" value="数据抽取完成" />
            </el-select>
          </section>
        </div>

        <section class="nf-extract-output">
          <h2 class="nf-extract-title nf-extract-output-title">结果输出</h2>
          <table class="nf-extract-table">
            <colgroup>
              <col style="width: 33.34%" />
              <col style="width: 33.33%" />
              <col style="width: 33.33%" />
            </colgroup>
            <thead>
              <tr>
                <th>抽取是否完成</th>
                <th>抽取是否异常</th>
                <th>抽取异常理由</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="nf-extract-num">12</span><span>97</span></td>
                <td><span class="nf-extract-num">150</span><span>200</span></td>
                <td><span class="nf-extract-num">108</span><span>600</span></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  extractTime: '',
  description: '',
  operator: '',
  operateTime: '',
  status: '数据抽取存储”表创建'
})
</script>

<style scoped>
.nf-extract-page {
  width: auto;
  min-height: calc(100vh - 51px);
  margin: -33px -43px -40px -31px;
  padding: 0;
  background: #fbfefd;
}

.nf-extract-frame {
  width: 1000px;
  margin: 0 auto;
}

.nf-extract-banner {
  margin: 0;
  height: 56px;
  border-radius: 4px;
  background: linear-gradient(180deg, #8eb8f2 0%, #aaccfa 100%);
  color: #ffffff;
  font-size: 26px;
  font-weight: 700;
  line-height: 56px;
  text-align: center;
}

.nf-extract-content {
  padding: 0 33px;
}

.nf-extract-title {
  margin: 11px 0 13px;
  color: #161f3a;
  font-size: 21px;
  font-weight: 700;
  line-height: 26px;
}

.nf-extract-grid {
  display: flex;
  gap: 23px;
}

.nf-extract-box {
  flex: 1 1 455px;
  min-width: 0;
  padding: 23px 18px 22px 29px;
  border: 1px solid #add5f4;
  border-radius: 6px;
  background: #ffffff;
}

.nf-extract-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.nf-extract-row-last {
  margin-bottom: 0;
}

.nf-extract-row-top {
  align-items: flex-start;
  margin-bottom: 0;
}

.nf-extract-label {
  flex: none;
  width: 84px;
  margin-right: 21px;
  white-space: nowrap;
  color: #161f3a;
  font-size: 21px;
  font-weight: 500;
  line-height: 28px;
  text-align: right;
}

.nf-extract-row-top .nf-extract-label {
  padding-top: 4px;
}

.nf-extract-input {
  flex: 1;
  min-width: 0;
}

.nf-extract-input :deep(.el-input__wrapper),
.nf-extract-input :deep(.el-select__wrapper) {
  min-height: 37px;
  padding: 0 12px;
  border-radius: 8px;
  background: #fdfefe;
  box-shadow: 0 0 0 1px #e1e2e6 inset;
}

.nf-extract-input :deep(.el-input__inner) {
  font-size: 20px;
}

.nf-extract-row-top :deep(.el-textarea__inner) {
  height: 105px;
  padding: 6px 12px;
  border-radius: 8px;
  background: #fdfefe;
  box-shadow: 0 0 0 1px #e1e2e6 inset;
  font-size: 20px;
  line-height: 26px;
}

.nf-extract-status-box {
  padding: 14px 18px 22px;
}

.nf-extract-status-title {
  margin: 0 0 10px;
  color: #161f3a;
  font-size: 21px;
  font-weight: 700;
  line-height: 26px;
}

.nf-extract-status {
  width: 100%;
}

.nf-extract-status :deep(.el-select__wrapper) {
  min-height: 47px;
  padding: 0 14px;
  border-radius: 4px;
  background: #f7fdfd;
  box-shadow: none;
}

.nf-extract-status :deep(.el-select__placeholder),
.nf-extract-status :deep(.el-select__selected-item) {
  color: #161f3a;
  font-size: 21px;
}

.nf-extract-status :deep(.el-select__caret) {
  color: #2f7fe0;
}

.nf-extract-output {
  margin-top: 15px;
  padding: 13px 16px 24px 23px;
  border: 1px solid #add5f4;
  border-radius: 6px;
  background: #ffffff;
}

.nf-extract-output-title {
  margin: 0 0 13px;
}

.nf-extract-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.nf-extract-table th,
.nf-extract-table td {
  padding-left: 22px;
  border-top: 1px solid #e9ecef;
  border-bottom: 1px solid #e9ecef;
  text-align: left;
}

.nf-extract-table th + th,
.nf-extract-table td + td {
  border-left: 1px solid #e9ecef;
}

.nf-extract-table th {
  height: 50px;
  background: #f9fdfe;
  color: #0f1b2f;
  font-size: 21px;
  font-weight: 400;
}

.nf-extract-table td {
  height: 48px;
  color: #7e9ab5;
  font-size: 20px;
}

.nf-extract-num {
  display: inline-block;
  width: 124px;
}
</style>