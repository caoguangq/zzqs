<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { noticeRows, noticeTaskRows } from '../../data/fileDownload.js'

const router = useRouter()
const view = ref('download')
const keyword = ref('')
const applied = ref('')
const selected = ref([])
const rows = ref(noticeTaskRows.map((row) => ({ ...row })))
const filtered = computed(() => rows.value.filter((row) => !applied.value || row.name.includes(applied.value)))
const all = computed({
  get: () => filtered.value.length > 0 && selected.value.length === filtered.value.length,
  set: (value) => { selected.value = value ? filtered.value.map((row) => row.id) : [] }
})
const modal = ref(false)
const form = reactive({
  userCode: 'U20260018',
  userName: '王玉洁',
  region: '吉林省 / 长春市',
  docCode: 'DOC20261026001',
  scene: '即时任务'
})
const complete = computed(() => [form.userCode, form.userName, form.region, form.docCode].every((value) => String(value || '').trim()))

function search() { applied.value = keyword.value.trim(); selected.value = [] }
function openNotice() { modal.value = true }
function saveNotice() {
  if (!complete.value) return ElMessage.warning('请填写四项必填信息')
  const row = noticeRows.find((item) => item.code === form.docCode)
  if (row) {
    row.userCode = form.userCode
    row.userName = form.userName
  }
  modal.value = false
  view.value = 'notice'
  ElMessage.success('下载提示信息已生成')
}
async function remove(row) {
  try {
    await ElMessageBox.confirm('确定删除该下载记录吗？', '询问', { confirmButtonText: '确定', cancelButtonText: '取消' })
  } catch { return }
  rows.value = rows.value.filter((item) => item.id !== row.id)
  selected.value = selected.value.filter((id) => id !== row.id)
  ElMessage.success('删除成功')
}
function removeSelected() {
  if (!selected.value.length) return ElMessage.warning('请先选择文件')
  rows.value = rows.value.filter((item) => !selected.value.includes(item.id))
  selected.value = []
  ElMessage.success('删除成功')
}
</script>

<template>
  <div class="nf-feature-13">
    <form class="nf-dl-filter" @submit.prevent="search">
      <label>文件名称<input v-model="keyword" aria-label="文件名称" placeholder="请输入文件名称..." /></label>
      <button class="nf-query" type="submit">查询 <span>⌕</span></button>
    </form>

    <section v-if="view === 'download'" class="nf-dl-card">
      <header>
        <h2>文件下载</h2>
        <aside>
          <button class="nf-primary" @click="router.push('/new/14')">异常任务派发</button>
          <button class="nf-primary" @click="openNotice">下载提示信息登记</button>
          <button class="nf-plain" @click="removeSelected">删除</button>
        </aside>
      </header>
      <p class="nf-info"><b>i</b> 适用场景：即时任务、定时任务，下载并将时登记用户与文档信息，生成下载提示信息。</p>
      <div class="nf-table-scroll">
        <table>
          <colgroup><col style="width:3.6%" /><col style="width:14.1%" /><col style="width:8.5%" /><col style="width:7.8%" /><col style="width:11%" /><col style="width:11.2%" /><col style="width:10.7%" /><col style="width:8.4%" /><col style="width:8.4%" /><col style="width:16.3%" /></colgroup>
          <thead><tr><th><input v-model="all" :indeterminate="selected.length > 0 && !all" type="checkbox" aria-label="全选文件" /></th><th>文件名称</th><th>生成状态</th><th>操作人</th><th>操作时间</th><th>开始时间</th><th>结束时间</th><th>输出类型</th><th>下载耗时（秒）</th><th>操作</th></tr></thead>
          <tbody>
            <tr v-for="row in filtered" :key="row.id">
              <td><input v-model="selected" type="checkbox" :value="row.id" :aria-label="'选择' + row.name" /></td>
              <td>{{ row.name }}</td>
              <td>{{ row.state }}</td>
              <td>{{ row.operator }}</td>
              <td>{{ row.operateTime }}</td>
              <td>{{ row.startTime }}</td>
              <td>{{ row.endTime }}</td>
              <td>{{ row.outputType }}</td>
              <td>{{ row.seconds }}</td>
              <td class="nf-ops"><button @click="remove(row)">删除</button></td>
            </tr>
            <tr v-if="!filtered.length"><td colspan="10">暂无数据</td></tr>
          </tbody>
        </table>
      </div>
      <div class="nf-pager">
        <span>共 {{ filtered.length }} 条记录</span>
        <nav>
          <button disabled>上一页</button><button class="active">1</button><button disabled>下一页</button>
          <span>前往</span><input value="1" aria-label="前往页码" /><span>页</span><button>确定</button>
        </nav>
      </div>
    </section>

    <section v-else class="nf-dl-card">
      <header>
        <h2>下载提示信息表 <small>界面示意 · 示例数据</small></h2>
        <aside><button class="nf-outline" @click="view = 'download'">返回文件下载</button></aside>
      </header>
      <div class="nf-table-scroll">
        <table>
          <colgroup><col style="width:18%" /><col style="width:26%" /><col style="width:16%" /><col style="width:20%" /><col style="width:10%" /><col style="width:10%" /></colgroup>
          <thead><tr><th>下载文档编码</th><th>下载文档名称</th><th>下载文档权限</th><th>下载文档用户预览时间</th><th>用户编码</th><th>用户名</th></tr></thead>
          <tbody><tr v-for="row in noticeRows" :key="row.code"><td>{{ row.code }}</td><td>{{ row.name }}</td><td>{{ row.permission }}</td><td>{{ row.previewTime }}</td><td>{{ row.userCode }}</td><td>{{ row.userName }}</td></tr></tbody>
        </table>
      </div>
      <div class="nf-notice-box">
        <b>i</b>
        <div><p>即时任务：地域授权不匹配，暂无下载权限，请联系文档管理员申请授权。</p><p>定时任务：下载链接已过期，请重新生成文件后下载。</p></div>
      </div>
      <h3 class="nf-process-title">处理与入库说明（示例）</h3>
      <div class="nf-process">
        <div class="nf-process-row"><span>输入来源</span><p>文件下载请求；用户编码 U20260018，用户名 王玉洁，地域 吉林省/长春市，文档编码 DOC20261026001。</p></div>
        <div class="nf-process-row"><span>处理逻辑</span><ol><li>按用户编码关联用户信息，校验用户名与地域。</li><li>按文档编码关联文档名称、授权地域及用户最近预览时间。</li><li>对比用户地域与授权范围，生成失败原因并新增下载提示信息。</li></ol></div>
        <div class="nf-process-row"><span>写入变化（示例）</span>
          <table class="nf-write-table"><thead><tr><th>逻辑文件</th><th>操作</th><th>写入前</th><th>写入后</th></tr></thead><tbody><tr><td>下载提示信息表</td><td>新增</td><td>对应记录不存在</td><td>新增1条提示记录</td></tr></tbody></table>
        </div>
      </div>
    </section>

    <div v-if="modal" class="nf-mask">
      <section class="nf-notice-modal" role="dialog" aria-modal="true" aria-labelledby="notice-title">
        <header><h2 id="notice-title">下载提示信息登记</h2><button aria-label="关闭下载提示信息登记" @click="modal = false">×</button></header>
        <p class="nf-demo">界面示意 · 示例数据</p>
        <label><span><b>*</b> 下载文档用户编码</span><input v-model="form.userCode" aria-label="下载文档用户编码" /></label>
        <label><span><b>*</b> 下载文档用户名</span><input v-model="form.userName" aria-label="下载文档用户名" /></label>
        <label><span><b>*</b> 下载文档用户所在地域</span><select v-model="form.region" aria-label="下载文档用户所在地域"><option>吉林省 / 长春市</option><option>江西省 / 南昌市</option><option>江西省 / 吉安市</option></select></label>
        <label><span><b>*</b> 文档编码</span><input v-model="form.docCode" aria-label="文档编码" /></label>
        <div class="nf-scene"><span>下载场景</span><button :class="{ active: form.scene === '即时任务' }" @click="form.scene = '即时任务'">即时任务</button><button :class="{ active: form.scene === '定时任务' }" @click="form.scene = '定时任务'">定时任务</button></div>
        <p class="nf-scene-example">本次示例：{{ form.scene }}</p>
        <p class="nf-modal-info"><b>i</b> 校验用户与文档信息后，关联权限、地域及预览记录，生成并保存下载提示信息。</p>
        <footer>
          <span :class="{ ready: complete }">{{ complete ? '✓ 四项必填信息已填写' : '请填写四项必填信息' }}</span>
          <button class="nf-cancel" @click="modal = false">取消</button>
          <button class="nf-save" @click="saveNotice">保存并生成提示</button>
        </footer>
      </section>
    </div>
  </div>
</template>

<style scoped>
.nf-feature-13 { margin: -33px -43px -40px -31px; padding: 12px 0 50px 31px; color: #6b7a87; font-size: 12px; }
.nf-dl-filter { display: flex; align-items: flex-end; gap: 34px; margin: 6px 0 43px; }
.nf-dl-filter label { display: flex; flex-direction: column; gap: 24px; color: #30475f; }
.nf-dl-filter input { width: 285px; height: 36px; border: 1px solid #e7ecf3; border-radius: 20px; padding: 0 14px; color: #8b949e; font: inherit; }
.nf-query { height: 36px; width: 118px; border: 0; border-radius: 22px; background: #1681d7; color: #fff; font: inherit; cursor: pointer; }
.nf-query span { margin-left: 16px; font-size: 18px; }
.nf-dl-card { background: #fff; border: 1px solid #eee; margin-right: 41px; padding: 12px 20px 0; }
.nf-dl-card > header { display: flex; align-items: center; justify-content: space-between; height: 52px; }
.nf-dl-card h2 { font-size: 16px; font-weight: 400; color: #30475f; margin: 0; }
.nf-dl-card h2 small { margin-left: 12px; font-size: 12px; color: #9aa7b4; }
.nf-dl-card aside { display: flex; align-items: center; gap: 14px; }
.nf-dl-card button { font: inherit; cursor: pointer; }
.nf-primary { height: 36px; padding: 0 18px; border: 0; border-radius: 20px; background: #1681d7; color: #fff; }
.nf-plain { border: 0; background: none; color: #9aa7b4; }
.nf-outline { height: 36px; padding: 0 18px; border: 1px solid #1681d7; border-radius: 20px; background: #fff; color: #1681d7; }
.nf-info { color: #1681d7; margin: 6px 0 38px; display: flex; gap: 10px; align-items: center; }
.nf-info b { display: inline-block; width: 16px; height: 16px; border-radius: 50%; background: #1681d7; color: #fff; text-align: center; line-height: 16px; font-weight: 400; }
.nf-table-scroll { overflow: auto; }
table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 12px; }
th { height: 44px; background: #fafbfe; color: #30475f; font-weight: 400; border: 1px solid #eee; }
td { height: 46px; border: 1px solid #eee; text-align: center; padding: 0 4px; overflow-wrap: anywhere; }
tbody tr:hover { background: #f4f8fd; }
.nf-ops button { border: 0; background: none; color: #1681d7; font: inherit; cursor: pointer; }
.nf-pager { display: flex; align-items: center; justify-content: space-between; height: 46px; color: #30475f; }
.nf-pager nav { display: flex; align-items: center; gap: 10px; }
.nf-pager button { min-width: 30px; height: 28px; border: 1px solid #e4ebf5; background: #fff; color: #606266; font: inherit; cursor: pointer; }
.nf-pager button.active { background: #1681d7; color: #fff; border-color: #1681d7; }
.nf-pager input { width: 40px; height: 26px; border: 1px solid #e4ebf5; text-align: center; }
.nf-notice-box { display: flex; gap: 12px; border: 1px solid #e4ebf5; background: #f7faff; padding: 14px 16px; margin: 16px 0 30px; color: #1681d7; }
.nf-notice-box b { width: 18px; height: 18px; border-radius: 50%; background: #1681d7; color: #fff; text-align: center; line-height: 18px; font-weight: 400; flex-shrink: 0; }
.nf-notice-box p { margin: 2px 0; line-height: 22px; }
.nf-process-title { font-size: 15px; font-weight: 400; color: #30475f; margin: 0 0 12px; }
.nf-process { border: 1px solid #e4ebf5; }
.nf-process-row { display: flex; border-bottom: 1px solid #e4ebf5; padding: 12px 18px; gap: 60px; }
.nf-process-row:last-child { border-bottom: 0; }
.nf-process-row > span { width: 150px; color: #30475f; flex-shrink: 0; }
.nf-process-row p { margin: 0; line-height: 26px; }
.nf-process-row ol { margin: 0; padding-left: 0; line-height: 26px; list-style: none; counter-reset: step; }
.nf-process-row ol li { counter-increment: step; position: relative; padding-left: 28px; }
.nf-process-row ol li::before { content: counter(step); position: absolute; left: 0; top: 4px; width: 18px; height: 18px; line-height: 18px; text-align: center; border-radius: 50%; background: #d8e9fa; color: #1681d7; font-size: 12px; }
.nf-process-row ol li b { display: inline-block; width: 18px; height: 18px; border-radius: 50%; background: #1681d7; color: #fff; text-align: center; line-height: 18px; font-weight: 400; margin-right: 8px; }
.nf-write-table { width: 100%; border-collapse: collapse; }
.nf-write-table th, .nf-write-table td { border: 1px solid #e4ebf5; height: 34px; text-align: left; padding: 0 8px; color: #6b7a87; }
.nf-mask { position: fixed; inset: 0; background: rgba(0, 0, 0, .45); z-index: 60; }
.nf-notice-modal { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 590px; background: #fff; border-radius: 6px; padding-bottom: 18px; color: #606266; }
.nf-notice-modal header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 0; }
.nf-notice-modal h2 { font-size: 18px; font-weight: 500; color: #222; margin: 0; }
.nf-notice-modal header button { border: 0; background: none; font-size: 26px; color: #bbb; cursor: pointer; }
.nf-demo { margin: 6px 20px 16px; color: #9aa7b4; }
.nf-notice-modal label { display: flex; align-items: center; margin: 0 20px 14px; gap: 10px; }
.nf-notice-modal label > span { width: 170px; text-align: right; flex-shrink: 0; color: #30475f; }
.nf-notice-modal label b { color: #f5222d; font-weight: 400; margin-right: 4px; }
.nf-notice-modal input, .nf-notice-modal select { width: 340px; height: 34px; border: 1px solid #e7ecf3; border-radius: 4px; padding: 0 10px; color: #606266; font: inherit; }
.nf-scene { display: flex; align-items: center; gap: 16px; margin: 22px 20px 0 20px; }
.nf-scene > span { width: 170px; text-align: right; color: #30475f; }
.nf-scene button { height: 34px; min-width: 96px; border: 1px solid #e7ecf3; border-radius: 18px; background: #fff; color: #606266; font: inherit; cursor: pointer; }
.nf-scene button.active { background: #1681d7; color: #fff; border-color: #1681d7; }
.nf-scene-example { margin: 10px 0 20px 206px; color: #30475f; }
.nf-modal-info { display: flex; gap: 10px; margin: 0 20px 18px; padding: 12px; border: 1px solid #e4ebf5; background: #f7faff; color: #1681d7; line-height: 22px; }
.nf-modal-info b { width: 16px; height: 16px; border-radius: 50%; background: #1681d7; color: #fff; text-align: center; line-height: 16px; font-weight: 400; flex-shrink: 0; }
.nf-notice-modal footer { display: flex; align-items: center; gap: 14px; padding: 0 20px; }
.nf-notice-modal footer > span { flex: 1; color: #c0c4cc; }
.nf-notice-modal footer > span.ready { color: #1681d7; }
.nf-cancel { height: 36px; width: 80px; border: 0; background: none; color: #606266; font: inherit; cursor: pointer; }
.nf-save { height: 38px; padding: 0 20px; border: 0; border-radius: 20px; background: #1681d7; color: #fff; font: inherit; cursor: pointer; }
@media (max-width: 1200px) {
  .nf-dl-card { margin-right: 20px; }
  .nf-table-scroll table { min-width: 1100px; }
}
</style>
