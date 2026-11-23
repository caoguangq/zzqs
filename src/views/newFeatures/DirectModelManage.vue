<template>
  <div class="nf-page nf-direct-page">
    <div class="nf-direct-steps">
      <div class="nf-direct-step-wrap">
        <div class="nf-direct-step" :class="{ active: view === 'create' }">
          <span class="nf-direct-step-no" :class="{ done: view === 'fields' }">
            <svg v-if="view === 'fields'" viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 10.5 3.5 3.5 7.5-8" /></svg>
            <template v-else>1</template>
          </span>
          <span>数据库表新增</span>
        </div>
        <div class="nf-direct-step" :class="{ active: view === 'fields' }">
          <span class="nf-direct-step-no">2</span>
          <span>字段配置</span>
        </div>
      </div>
    </div>

    <!-- 步骤 1：数据库表新增 -->
    <section v-if="view === 'create'" class="nf-direct-form">
      <div class="nf-direct-row">
        <div class="nf-direct-field">
          <span class="nf-direct-label">归属数据库：</span>
          <el-select v-model="form.database" class="nf-direct-select">
            <el-option label="PG数据源" value="PG数据源" />
            <el-option label="Oracle数据源" value="Oracle数据源" />
          </el-select>
          <span class="nf-direct-star">*</span>
        </div>
        <div class="nf-direct-field nf-direct-field-right">
          <span class="nf-direct-label">归属业务分类：</span>
          <el-select v-model="form.businessType" class="nf-direct-select">
            <el-option label="客户基础信息" value="客户基础信息" />
            <el-option label="产品信息" value="产品信息" />
          </el-select>
          <span class="nf-direct-star">*</span>
        </div>
      </div>

      <div class="nf-direct-row">
        <div class="nf-direct-field">
          <span class="nf-direct-label">数据表名称：</span>
          <el-input v-model="form.tableName" class="nf-direct-select nf-direct-input-active" />
          <span class="nf-direct-star">*</span>
          <button type="button" class="nf-direct-inline-btn" @click="ElMessage.info('已查询到数据表 ' + form.tableName)">点击查询数据表</button>
        </div>
        <div class="nf-direct-field nf-direct-field-right">
          <span class="nf-direct-label">数据更新日期：</span>
          <el-input v-model="form.updateDate" class="nf-direct-select" />
          <span class="nf-direct-star">*</span>
          <a class="nf-direct-link" @click="ElMessage.info('设置查询时间')">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8" /><path d="M10 9v5" stroke-linecap="round" /><circle cx="10" cy="6.4" r="0.9" fill="currentColor" stroke="none" /></svg>
            设置查询时间
          </a>
        </div>
      </div>

      <div class="nf-direct-row">
        <div class="nf-direct-field">
          <span class="nf-direct-label">中文表名称：</span>
          <el-input v-model="form.cnName" class="nf-direct-select" />
          <span class="nf-direct-star">*</span>
        </div>
        <div class="nf-direct-field nf-direct-field-right">
          <span class="nf-direct-label">汇总表：</span>
          <el-select v-model="form.summary" class="nf-direct-select">
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
          <span class="nf-direct-star">*</span>
        </div>
      </div>

      <div class="nf-direct-row">
        <div class="nf-direct-field">
          <span class="nf-direct-label">数据表存储类型：</span>
          <el-select v-model="form.storeType" class="nf-direct-select">
            <el-option label="其他" value="其他" />
            <el-option label="Hive" value="Hive" />
          </el-select>
          <span class="nf-direct-star">*</span>
        </div>
        <div class="nf-direct-field nf-direct-field-right">
          <span class="nf-direct-label">是否用来创建客户群：</span>
          <el-select v-model="form.customerGroup" class="nf-direct-select">
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </div>
      </div>

      <div class="nf-direct-row">
        <div class="nf-direct-field">
          <span class="nf-direct-label">是否金库数据：</span>
          <el-select v-model="form.vault" class="nf-direct-select">
            <el-option label="不需要金库认证" value="不需要金库认证" />
            <el-option label="需要金库认证" value="需要金库认证" />
          </el-select>
        </div>
      </div>

      <div class="nf-direct-row">
        <div class="nf-direct-field">
          <span class="nf-direct-label">分表存储类型：</span>
          <el-select v-model="form.partitionType" class="nf-direct-select">
            <el-option label="不是分表" value="不是分表" />
            <el-option label="按日期分表" value="按日期分表" />
          </el-select>
          <span class="nf-direct-star">*</span>
        </div>
      </div>

      <div class="nf-direct-row nf-direct-row-wide">
        <span class="nf-direct-label">模型业务负责人：</span>
        <el-input v-model="form.owner" class="nf-direct-wide-input nf-direct-owner-input" />
        <span class="nf-direct-star">*</span>
      </div>

      <div class="nf-direct-row nf-direct-row-wide nf-direct-row-textarea">
        <span class="nf-direct-label">描述：</span>
        <el-input v-model="form.description" type="textarea" :rows="3" resize="none" class="nf-direct-wide-input nf-direct-textarea" />
      </div>

      <div class="nf-direct-row nf-direct-row-wide nf-direct-row-textarea">
        <span class="nf-direct-label">用途：</span>
        <el-input v-model="form.purpose" type="textarea" :rows="3" resize="none" class="nf-direct-wide-input nf-direct-textarea" />
      </div>

      <div class="nf-direct-row nf-direct-row-wide">
        <span class="nf-direct-label">适用客户群：</span>
        <el-input v-model="form.crowd" type="textarea" :rows="4" resize="none" class="nf-direct-wide-input nf-direct-textarea" />
      </div>

      <div class="nf-direct-foot">
        <button type="button" class="nf-direct-next" @click="view = 'fields'">下一步</button>
      </div>
    </section>

    <!-- 步骤 2：字段配置 -->
    <section v-else class="nf-direct-fields">
      <div class="nf-card nf-direct-field-card">
        <div class="nf-direct-field-head">
          <h2>字段配置</h2>
          <button type="button" class="nf-direct-add" @click="addField">+ 新增字段</button>
        </div>
        <table class="nf-table nf-direct-table">
          <colgroup>
            <col style="width: 5.8%" />
            <col style="width: 12.4%" />
            <col style="width: 12.3%" />
            <col style="width: 11.6%" />
            <col style="width: 9.9%" />
            <col style="width: 8%" />
            <col style="width: 9.1%" />
            <col style="width: 8.9%" />
            <col style="width: 9.3%" />
            <col style="width: 12.7%" />
          </colgroup>
          <thead>
            <tr>
              <th>序号</th>
              <th>字段名称</th>
              <th>中文名称</th>
              <th class="nf-direct-left">数据类型</th>
              <th>长度</th>
              <th>主键</th>
              <th>允许为空</th>
              <th>敏感字段</th>
              <th class="nf-direct-left">字段说明</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(field, index) in fields" :key="index">
              <td>{{ index + 1 }}</td>
              <td class="nf-direct-left">{{ field.name }}</td>
              <td class="nf-direct-left">{{ field.cnName }}</td>
              <td class="nf-direct-left">
                <el-select v-model="field.type" class="nf-direct-cell-select">
                  <el-option label="bigint" value="bigint" />
                  <el-option label="varchar" value="varchar" />
                  <el-option label="timestamp" value="timestamp" />
                </el-select>
              </td>
              <td>
                <span v-if="field.length === '—'">—</span>
                <el-input v-else v-model="field.length" class="nf-direct-length" />
              </td>
              <td>
                <el-select v-model="field.primary" class="nf-direct-cell-select">
                  <el-option label="是" value="是" />
                  <el-option label="否" value="否" />
                </el-select>
              </td>
              <td>
                <el-select v-model="field.nullable" class="nf-direct-cell-select">
                  <el-option label="是" value="是" />
                  <el-option label="否" value="否" />
                </el-select>
              </td>
              <td>
                <el-select v-model="field.sensitive" class="nf-direct-cell-select">
                  <el-option label="是" value="是" />
                  <el-option label="否" value="否" />
                </el-select>
              </td>
              <td class="nf-direct-left">{{ field.remark }}</td>
              <td class="nf-direct-actions">
                <a class="nf-direct-edit" title="编辑" @click="ElMessage.info('编辑字段 ' + field.name)">
                  <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m13.5 3.5 3 3L7 16H4v-3z" /></svg>
                </a>
                <a class="nf-direct-del" title="删除" @click="removeField(index)">
                  <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h12M8 3h4l1 3H7zM6 6l1 11h6l1-11" /></svg>
                </a>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="nf-direct-btns">
          <button type="button" class="nf-direct-btn" @click="view = 'create'">上一步</button>
          <button type="button" class="nf-direct-btn nf-direct-btn-primary" @click="saved = true">保存</button>
        </div>
      </div>
    </section>

    <el-dialog v-model="saved" width="496px" class="nf-dialog nf-direct-dialog" :close-on-click-modal="false">
      <div class="nf-direct-success">
        <span class="nf-direct-success-icon">
          <svg viewBox="0 0 48 48" width="66" height="66"><circle cx="24" cy="24" r="22" fill="#4cd964" /><path d="m14 24.5 7 7 13-14" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
        <p class="nf-direct-success-title">保存成功</p>
        <p class="nf-direct-success-text">数据库表及字段配置已成功保存</p>
        <button type="button" class="nf-direct-success-btn" @click="saved = false">确定</button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const view = ref('create')
const saved = ref(false)

const form = reactive({
  database: 'PG数据源',
  businessType: '客户基础信息',
  tableName: 'customer_info',
  updateDate: '每日更新',
  cnName: '客户信息表',
  summary: '否',
  storeType: '其他',
  customerGroup: '否',
  vault: '不需要金库认证',
  partitionType: '不是分表',
  owner: '数据管理员',
  description: '记录客户基础信息、联系方式及状态等核心数据',
  purpose: '用于客户画像、营销分析和客户服务',
  crowd: '企业客户'
})

const fields = ref([
  { name: 'customer_id', cnName: '客户ID', type: 'bigint', length: '20', primary: '是', nullable: '否', sensitive: '否', remark: '客户唯一标识' },
  { name: 'customer_name', cnName: '客户名称', type: 'varchar', length: '200', primary: '否', nullable: '否', sensitive: '否', remark: '客户主体名称' },
  { name: 'credit_code', cnName: '统一社会信用代码', type: 'varchar', length: '18', primary: '否', nullable: '是', sensitive: '是', remark: '企业统一信用代码' },
  { name: 'contact_name', cnName: '联系人', type: 'varchar', length: '100', primary: '否', nullable: '是', sensitive: '是', remark: '客户联系人姓名' },
  { name: 'contact_phone', cnName: '联系电话', type: 'varchar', length: '20', primary: '否', nullable: '是', sensitive: '是', remark: '客户联系人手机号' },
  { name: 'customer_status', cnName: '客户状态', type: 'varchar', length: '20', primary: '否', nullable: '否', sensitive: '否', remark: '正常、停用等状态' },
  { name: 'created_at', cnName: '创建时间', type: 'timestamp', length: '—', primary: '否', nullable: '否', sensitive: '否', remark: '数据创建时间' },
  { name: 'updated_at', cnName: '更新时间', type: 'timestamp', length: '—', primary: '否', nullable: '是', sensitive: '否', remark: '数据最后更新时间' }
])

function addField() {
  fields.value.push({
    name: '',
    cnName: '',
    type: 'varchar',
    length: '',
    primary: '否',
    nullable: '是',
    sensitive: '否',
    remark: ''
  })
}

function removeField(index) {
  fields.value.splice(index, 1)
}
</script>

<style scoped>
.nf-direct-page {
  max-width: none;
  margin-top: -33px;
  padding: 0;
}

/* 步骤条 */
.nf-direct-steps {
  position: relative;
  height: 56px;
  border-bottom: 1px solid #e5e6eb;
}

.nf-direct-step-wrap {
  display: flex;
  width: 1022px;
  height: 100%;
  margin-left: 8px;
}

.nf-direct-step {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #606266;
  font-size: 14px;
  font-weight: 600;
}

.nf-direct-step.active::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  background: #1677ff;
}

.nf-direct-step-no {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: #c9cdd4;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
}

.nf-direct-step.active .nf-direct-step-no {
  background: #1677ff;
}

.nf-direct-step.active {
  color: #1f2329;
}

.nf-direct-step-no.done {
  background: #8ec5ff;
}

/* 步骤 1 */
.nf-direct-form {
  width: 1188px;
  max-width: 100%;
  margin: 0 0 0 150px;
  padding: 33px 0 60px;
}

.nf-direct-row {
  display: flex;
  align-items: flex-start;
  gap: 104px;
  margin-bottom: 14px;
}

.nf-direct-row-wide {
  gap: 0;
  padding: 0;
  margin-bottom: 6px;
}

.nf-direct-row-textarea {
  margin-bottom: 24px;
}

.nf-direct-field {
  display: flex;
  align-items: center;
  width: 444px;
}

.nf-direct-field-right {
  width: auto;
}

.nf-direct-label {
  flex: none;
  width: 138px;
  margin-right: 16px;
  color: #1f2329;
  font-size: 14px;
  text-align: right;
  white-space: nowrap;
}

.nf-direct-field-right .nf-direct-label {
  width: 186px;
}

.nf-direct-row-wide .nf-direct-label {
  width: 138px;
  padding-top: 10px;
}

.nf-direct-select {
  flex: none;
  width: 261px;
}

.nf-direct-field-right .nf-direct-select {
  flex: none;
  width: 261px;
}

.nf-direct-wide-input {
  flex: none;
  width: 973px;
}

.nf-direct-owner-input {
  width: 941px;
}

.nf-direct-textarea {
  margin-top: 0;
}

.nf-direct-star {
  margin-left: 20px;
  color: #f5222d;
  font-size: 16px;
}

.nf-direct-row-wide .nf-direct-star {
  margin-left: 12px;
}

.nf-direct-inline-btn {
  flex: none;
  margin-left: 46px;
  padding: 0;
  border: 0;
  background: none;
  color: #333333;
  font-size: 15px;
  white-space: nowrap;
  cursor: pointer;
}

.nf-direct-link {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: 46px;
  color: #1677ff;
  font-size: 15px;
  white-space: nowrap;
  cursor: pointer;
}

.nf-direct-foot {
  display: flex;
  justify-content: center;
  padding-top: 12px;
}

.nf-direct-next {
  width: 100px;
  height: 40px;
  border: 0;
  border-radius: 20px;
  background: #1677ff;
  color: #ffffff;
  font-size: 15px;
  cursor: pointer;
}

/* 步骤 2 */
.nf-direct-fields {
  padding: 27px 0 40px 24px;
}

.nf-direct-field-card {
  width: 1520px;
  max-width: 100%;
  padding: 0 0 24px;
}

.nf-direct-field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 20px;
}

.nf-direct-field-head h2 {
  margin: 0;
  color: #1f2329;
  font-size: 20px;
  font-weight: 700;
}

.nf-direct-add {
  min-width: 118px;
  height: 40px;
  border: 1px solid #1677ff;
  border-radius: 4px;
  background: #ffffff;
  color: #1677ff;
  font-size: 15px;
  cursor: pointer;
}

.nf-direct-table {
  width: calc(100% - 40px);
  margin: 0 20px;
}

.nf-direct-table th {
  height: 58px;
  padding: 0 6px 0 14px;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}

.nf-direct-table td {
  height: 57px;
  padding: 0 6px 0 14px;
  font-size: 14px;
  text-align: left;
}

.nf-direct-table .nf-direct-left {
  text-align: left;
}

.nf-direct-cell-select {
  width: 108px;
}

.nf-direct-length {
  width: 76px;
}

.nf-direct-length :deep(.el-input__wrapper) {
  min-height: 36px;
  border-radius: 18px;
}

.nf-direct-actions {
  padding-left: 0 !important;
  text-align: center !important;
}

.nf-direct-edit,
.nf-direct-del {
  display: inline-flex;
  cursor: pointer;
}

.nf-direct-edit {
  color: #1677ff;
}

.nf-direct-del {
  margin-left: 14px;
  color: #f5222d;
}

.nf-direct-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 22px;
}

.nf-direct-btn {
  min-width: 100px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #ffffff;
  color: #333333;
  font-size: 15px;
  cursor: pointer;
}

.nf-direct-btn-primary {
  border-color: #1677ff;
  background: #1677ff;
  color: #ffffff;
}

/* 成功弹窗 */
:global(.nf-direct-dialog) {
  margin-top: 297px;
  border-radius: 6px;
}

:global(.nf-direct-dialog .el-dialog__header) {
  padding: 0;
}

:global(.nf-direct-dialog .el-dialog__headerbtn) {
  top: 12px;
  right: 12px;
}

:global(.nf-direct-dialog .el-dialog__body) {
  padding: 30px 24px 10px;
}

.nf-direct-success {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nf-direct-success-title {
  margin: 22px 0 0;
  color: #1f2329;
  font-size: 26px;
  font-weight: 700;
}

.nf-direct-success-text {
  margin: 15px 0 26px;
  color: #606266;
  font-size: 17px;
}

.nf-direct-success-btn {
  width: 148px;
  height: 44px;
  border: 0;
  border-radius: 4px;
  background: #1677ff;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}

/* Element 控件 */
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 44px;
  border-radius: 22px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-size: 15px;
}

.nf-direct-select :deep(.el-select__wrapper) {
  padding-left: 20px;
}

:deep(.el-textarea__inner) {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  font-size: 15px;
}

.nf-direct-textarea :deep(.el-textarea__inner) {
  height: 95px;
  padding: 13px 20px;
}

.nf-direct-input-active :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1.5px #1677ff inset;
}

.nf-direct-table :deep(.el-input__wrapper) {
  min-height: 34px;
  border-radius: 4px;
}

.nf-direct-table :deep(.el-select__wrapper) {
  min-height: 34px;
  padding: 0 4px;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

/* 1366 窄屏：表单不再右移固定距离，宽输入框随行宽收缩 */
@media (max-width: 1500px) {
  .nf-direct-form {
    margin-left: 0;
  }

  .nf-direct-row {
    gap: 40px;
  }

  .nf-direct-wide-input {
    flex: 1 1 auto;
    width: auto;
    min-width: 0;
  }

  .nf-direct-owner-input {
    width: auto;
  }
}
</style>