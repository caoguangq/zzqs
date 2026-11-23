<template>
  <div class="nf-page nf-dview-page">
    <div class="nf-dview-steps">
      <div
        v-for="(step, index) in steps"
        :key="step"
        class="nf-dview-step"
        :class="{ active: index === 0 }"
      >
        <span class="nf-dview-step-no">{{ index + 1 }}</span>
        <span class="nf-dview-step-label">{{ step }}</span>
      </div>
    </div>

    <section class="nf-dview-form">
      <div class="nf-dview-row">
        <span class="nf-dview-label">归属数据库</span>
        <el-select v-model="form.database" class="nf-dview-control" placeholder="请选择归属数据库">
          <el-option label="PG数据源" value="PG数据源" />
          <el-option label="Oracle数据源" value="Oracle数据源" />
        </el-select>
      </div>
      <div class="nf-dview-row">
        <span class="nf-dview-label">视图名称</span>
        <el-input v-model="form.name" class="nf-dview-control" placeholder="请输入视图名称..." />
      </div>
      <div class="nf-dview-row">
        <span class="nf-dview-label">业务分类</span>
        <el-select v-model="form.businessType" class="nf-dview-control" placeholder="请选择业务分类">
          <el-option label="客户基础信息" value="客户基础信息" />
          <el-option label="产品信息" value="产品信息" />
        </el-select>
      </div>
      <div class="nf-dview-row nf-dview-row-sm">
        <span class="nf-dview-label">是否用来创建客户群</span>
        <el-select v-model="form.customerGroup" class="nf-dview-control">
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
      </div>
      <div class="nf-dview-row nf-dview-row-sm">
        <span class="nf-dview-label">是否涉敏</span>
        <el-select v-model="form.sensitive" class="nf-dview-control">
          <el-option label="涉敏" value="涉敏" />
          <el-option label="不涉敏" value="不涉敏" />
        </el-select>
      </div>
      <div class="nf-dview-row nf-dview-row-area">
        <span class="nf-dview-label">描述</span>
        <el-input v-model="form.description" type="textarea" resize="none" class="nf-dview-control" placeholder="请输入视图描述..." />
      </div>
      <div class="nf-dview-row nf-dview-row-area">
        <span class="nf-dview-label">用途</span>
        <el-input v-model="form.purpose" type="textarea" resize="none" class="nf-dview-control" placeholder="请输入视图用途..." />
      </div>
      <div class="nf-dview-row nf-dview-row-last">
        <span class="nf-dview-label">适用客户群</span>
        <el-input v-model="form.crowd" type="textarea" resize="none" class="nf-dview-control" placeholder="请输入适用客户群..." />
      </div>
    </section>

    <div class="nf-dview-foot">
      <button type="button" class="nf-dview-next" @click="nextStep">下一步</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const steps = ['定义业务数据视图', '选择业务数据表', '设置业务数据表关系', '定义展现字段']

const form = reactive({
  database: '',
  name: '',
  businessType: '',
  customerGroup: '否',
  sensitive: '涉敏',
  description: '',
  purpose: '',
  crowd: ''
})

function nextStep() {
  ElMessage.info('示例页面：仅展示「定义业务数据视图」步骤')
}
</script>

<style scoped>
.nf-dview-page {
  width: auto;
  min-height: calc(100vh - 51px);
  margin: -33px -43px -40px -31px;
  padding: 0;
  background: #f5f6f9;
}

.nf-dview-steps {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding: 0 60px;
  border-bottom: 1px solid #abacac;
}

.nf-dview-step {
  position: relative;
  display: flex;
  flex: 0 0 315px;
  align-items: center;
  justify-content: center;
  gap: 17px;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
}

.nf-dview-step.active::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: #147bd1;
}

.nf-dview-step-no {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #cac1b3;
  color: #ffffff;
  font-size: 13px;
  font-weight: 400;
}

.nf-dview-step.active .nf-dview-step-no {
  background: #147bd1;
}

.nf-dview-form {
  width: 570px;
  margin: 0 auto;
  padding: 28px 0 0;
}

.nf-dview-row {
  position: relative;
  margin-bottom: 22px;
}

.nf-dview-row-sm {
  margin-bottom: 14px;
}

.nf-dview-row-area {
  margin-bottom: 29px;
}

.nf-dview-row-last {
  margin-bottom: 0;
}

.nf-dview-label {
  position: absolute;
  top: 50%;
  right: calc(100% + 16px);
  transform: translateY(-50%);
  color: #333333;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
}

.nf-dview-row-area .nf-dview-label,
.nf-dview-row-last .nf-dview-label {
  top: 8px;
  transform: none;
}

.nf-dview-control {
  width: 570px;
}

.nf-dview-control :deep(.el-input__wrapper),
.nf-dview-control :deep(.el-select__wrapper) {
  min-height: 35px;
  padding: 0 16px;
  border-radius: 17.5px;
  background: #ffffff;
  box-shadow: 0 0 0 1px #eaecf3 inset;
}

.nf-dview-control :deep(.el-input__inner) {
  font-size: 14px;
}

.nf-dview-control :deep(.el-input__inner::placeholder),
.nf-dview-control :deep(.el-select__placeholder) {
  color: #8a93a1;
}

.nf-dview-control :deep(.el-select__wrapper) {
  padding-right: 12px;
}

.nf-dview-control :deep(.el-select__caret svg) {
  display: none;
}

.nf-dview-control :deep(.el-select__caret::before) {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-top: 5px solid #888888;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
}

.nf-dview-row-area :deep(.el-textarea__inner),
.nf-dview-row-last :deep(.el-textarea__inner) {
  height: 80px;
  padding: 12px 16px;
  border-radius: 4px;
  background: #fafbff;
  box-shadow: 0 0 0 1px #eaecf3 inset;
  font-size: 14px;
  line-height: 22px;
}

.nf-dview-row-area :deep(.el-textarea__inner::placeholder),
.nf-dview-row-last :deep(.el-textarea__inner::placeholder) {
  color: #8a93a1;
}

.nf-dview-foot {
  display: flex;
  justify-content: center;
  padding: 122px 0 26px;
}

.nf-dview-next {
  width: 100px;
  height: 36px;
  border: 0;
  border-radius: 18px;
  background: #147bd1;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.nf-dview-next:hover {
  background: #2b8adf;
}
</style>