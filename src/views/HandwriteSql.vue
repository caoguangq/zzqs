<script setup>
import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PtIcon from '../components/PtIcon.vue'

const initialSql = `-- 渠道日销量汇总（账期：2026-03）
SELECT
    t.stat_month              AS 账期,
    t.city_name               AS 地市,
    t.channel_code            AS 渠道编码,
    t.channel_name            AS 渠道名称,
    SUM(t.user_cnt)           AS 用户数,
    SUM(t.new_user_cnt)       AS 新增用户,
    ROUND(SUM(t.flow_gb), 2)  AS 业务量_GB,
    ROUND(SUM(t.income), 2)   AS 收入_元
FROM dw_jiangxi.dws_channel_sales t
WHERE t.stat_month = '2026-03'
  AND t.city_name IN ('南昌', '赣州', '九江', '上饶')
GROUP BY t.stat_month, t.city_name, t.channel_code, t.channel_name
ORDER BY 收入_元 DESC
LIMIT 100;`

const queryTabs = ref([
  { id: 1, name: '查询1', sql: initialSql },
  { id: 2, name: '查询2', sql: '-- 查询2\nSELECT stat_month, city_name, COUNT(*) AS user_cnt\nFROM dw_jiangxi.dws_5g_package\nWHERE stat_month = \'2026-03\'\nGROUP BY stat_month, city_name;' }
])
const activeTabId = ref(1)
const activeQuery = computed(() => queryTabs.value.find((tab) => tab.id === activeTabId.value) || queryTabs.value[0])
const sql = computed({
  get: () => activeQuery.value?.sql || '',
  set: (value) => {
    if (activeQuery.value) activeQuery.value.sql = value
  }
})

const databases = ref([
  {
    name: 'dw_jiangxi',
    label: '经营分析库',
    tables: ['dws_user_daily', 'dws_5g_package', 'dws_broadband_user', 'dws_channel_sales', 'dws_cust_value', 'dws_complaint_daily']
  },
  {
    name: 'ods_jiangxi',
    label: '贴源数据层',
    tables: ['ods_cust_market_wish_ds', 'ods_user_base_daily', 'ods_order_detail']
  },
  {
    name: 'dm_jiangxi',
    label: '数据集市层',
    tables: ['dm_channel_target', 'dm_grid_perf', 'dm_5g_terminal']
  }
])
const dbKeyword = ref('')
const openDbs = ref(['dw_jiangxi'])

const isDbOpen = (db) => (dbKeyword.value.trim() ? true : openDbs.value.includes(db.name))

const toggleDb = (db) => {
  if (dbKeyword.value.trim()) return
  if (openDbs.value.includes(db.name)) {
    openDbs.value = openDbs.value.filter((name) => name !== db.name)
  } else {
    openDbs.value = [...openDbs.value, db.name]
  }
}

const filteredDatabases = computed(() => {
  const query = dbKeyword.value.trim().toLowerCase()
  if (!query) return databases.value
  return databases.value
    .map((db) => ({
      ...db,
      tables: db.tables.filter((table) => table.includes(query) || db.name.includes(query))
    }))
    .filter((db) => db.tables.length)
})

const templates = [
  { name: '渠道日销量汇总', desc: '按地市 / 渠道汇总销量与收入', sql: initialSql },
  {
    name: '宽带装维工单明细',
    desc: '近 30 天装移机工单处理明细',
    sql: `-- 宽带装维工单明细\nSELECT t.order_id, t.city_name, t.grid_name,\n       t.accept_time, t.finish_time, t.status\nFROM dw_jiangxi.dws_broadband_user t\nWHERE t.accept_time >= date_sub(current_date, 30)\nORDER BY t.accept_time DESC\nLIMIT 500;`
  },
  {
    name: '5G套餐净增趋势',
    desc: '按月统计 5G 套餐净增用户',
    sql: `-- 5G套餐净增趋势\nSELECT stat_month,\n       SUM(net_add_cnt) AS net_add_cnt,\n       SUM(net_add_cnt) - lag(SUM(net_add_cnt)) OVER (ORDER BY stat_month) AS mom\nFROM dw_jiangxi.dws_5g_package\nGROUP BY stat_month\nORDER BY stat_month;`
  },
  {
    name: '投诉工单分类统计',
    desc: '按投诉类型统计工单量与处理时效',
    sql: `-- 投诉工单分类统计\nSELECT complaint_type,\n       COUNT(1) AS order_cnt,\n       ROUND(AVG(handle_hours), 1) AS avg_hours\nFROM dw_jiangxi.dws_complaint_daily\nWHERE stat_date >= '2026-03-01'\nGROUP BY complaint_type\nORDER BY order_cnt DESC;`
  }
]

const resultRows = [
  ['2026-03', '南昌', '3601000231', '南昌八一大道营业厅', '128,640', '8,624', '54,218.36', '1,268,420.55'],
  ['2026-03', '赣州', '3607000118', '章贡区长征大道营业厅', '98,632', '6,120', '41,236.80', '986,412.30'],
  ['2026-03', '九江', '3604000076', '浔阳区庐山南路营业厅', '76,420', '4,286', '32,109.55', '764,208.66'],
  ['2026-03', '上饶', '3611000142', '信州区带湖路营业厅', '68,954', '3,972', '28,640.12', '698,452.18'],
  ['2026-03', '宜春', '3609000035', '袁州区明月北路营业厅', '58,216', '3,186', '24,980.44', '602,145.72'],
  ['2026-03', '吉安', '3608000091', '吉州区井冈山大道营业厅', '53,780', '2,964', '22,156.90', '548,620.36'],
  ['2026-03', '抚州', '3610000064', '临川区赣东大道营业厅', '46,892', '2,541', '19,286.35', '476,912.84'],
  ['2026-03', '景德镇', '3602000027', '珠山区新厂路营业厅', '38,654', '2,186', '16,458.72', '412,680.25']
]
const columns = ['账期', '地市', '渠道编码', '渠道名称', '用户数', '新增用户', '业务量_GB', '收入_元']

const resultTab = ref('result')
const running = ref(false)
const hasRun = ref(true)
const elapsed = ref('0.68')
const scanned = ref('4')
const editorRef = ref(null)
const gutterRef = ref(null)

const lineNumbers = computed(() => {
  const total = Math.max(sql.value.split('\n').length, 1)
  return Array.from({ length: total }, (_, index) => index + 1)
})

const statusText = computed(() => {
  if (running.value) return '正在执行查询…'
  if (!hasRun.value) return '尚未执行'
  return `执行成功 · 耗时 ${elapsed.value}s · 共 ${resultRows.length} 行（预览）`
})

const syncScroll = () => {
  if (editorRef.value && gutterRef.value) {
    gutterRef.value.scrollTop = editorRef.value.scrollTop
  }
}

const runSql = () => {
  if (running.value) return
  running.value = true
  resultTab.value = 'result'
  window.setTimeout(() => {
    running.value = false
    hasRun.value = true
    elapsed.value = (0.61 + Math.random() * 0.18).toFixed(2)
    scanned.value = String(3 + Math.floor(Math.random() * 3))
    ElMessage({ message: `执行成功，返回 1,286 行，耗时 ${elapsed.value}s`, type: 'success' })
  }, 900)
}

const formatSql = () => {
  const formatted = sql.value
    .replace(/[ \t]+/g, ' ')
    .replace(/\s+(FROM|WHERE|GROUP BY|ORDER BY|LIMIT)\s+/gi, '\n$1 ')
    .replace(/\n{2,}/g, '\n')
    .trim()
  sql.value = formatted
  ElMessage({ message: 'SQL 已格式化', type: 'success' })
}

const saveTask = () => {
  ElMessage({ message: '任务已保存至「我的取数任务」', type: 'success' })
}

const saveTemplate = () => {
  ElMessage({ message: '已保存为个人模板，可在取数模板中引用', type: 'success' })
}

const insertTable = async (dbName, table) => {
  const textarea = editorRef.value
  if (!textarea) return
  const pos = textarea.selectionStart ?? sql.value.length
  const needsSpace = pos > 0 && !/\s/.test(sql.value[pos - 1])
  const insert = `${needsSpace ? ' ' : ''}${dbName}.${table}`
  sql.value = sql.value.slice(0, pos) + insert + sql.value.slice(pos)
  await nextTick()
  textarea.focus()
  textarea.selectionStart = textarea.selectionEnd = pos + insert.length
}

const applyTemplate = (template) => {
  sql.value = template.sql
  hasRun.value = false
  ElMessage({ message: `已引用模板：${template.name}`, type: 'success' })
}

const openHelp = () => {
  ElMessage.info('使用帮助：Ctrl + Enter 执行查询，Tab 插入两个空格')
}

const addQuery = () => {
  const nextId = Math.max(...queryTabs.value.map((tab) => tab.id)) + 1
  queryTabs.value.push({ id: nextId, name: `查询${queryTabs.value.length + 1}`, sql: '-- 新的查询\n' })
  activeTabId.value = nextId
}

const closeQuery = (tab) => {
  if (queryTabs.value.length === 1) {
    ElMessage.warning('至少保留一个查询页签')
    return
  }
  const index = queryTabs.value.findIndex((item) => item.id === tab.id)
  queryTabs.value.splice(index, 1)
  if (activeTabId.value === tab.id) {
    activeTabId.value = queryTabs.value[Math.max(0, index - 1)].id
  }
}

const handleEditorKeydown = (event) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    const textarea = event.target
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    sql.value = `${sql.value.slice(0, start)}  ${sql.value.slice(end)}`
    nextTick(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 2
    })
  }
  if (event.key === 'F8') {
    event.preventDefault()
    runSql()
  }
}

const executionPlan = `== Optimized Logical Plan ==
Aggregate [stat_month, city_name, channel_code, channel_name],
  [sum(user_cnt) AS user_cnt, sum(new_user_cnt) AS new_user_cnt,
   round(sum(flow_gb), 2) AS flow_gb, round(sum(income), 2) AS income]
+- Project [stat_month, city_name, channel_code, channel_name, user_cnt, new_user_cnt, flow_gb, income]
   +- Filter (stat_month = 2026-03 AND city_name IN (南昌, 赣州, 九江, 上饶))
      +- Relation dw_jiangxi.dws_channel_sales[stat_month, city_name, channel_code,
            channel_name, user_cnt, new_user_cnt, flow_gb, income] parquet

== Physical Plan ==
*(5) HashAggregate(keys=[...], functions=[sum(...), round(...)])
+- Exchange hashpartitioning(city_name, 64)
   +- *(4) HashAggregate(keys=[...], functions=[partial_sum(...)])
      +- *(4) Project [...]
         +- *(4) Filter (isnotnull(stat_month) AND (stat_month = 2026-03))
            +- *(4) ColumnarToRow
               +- FileScan parquet dw_jiangxi.dws_channel_sales
                     PartitionFilters: [stat_month IS NOT NULL]
                     PushedFilters: [IsNotNull(city_name), In(city_name, [南昌, 赣州, 九江, 上饶])]
                     ReadSchema: struct<city_name:string, channel_code:string,...>`

const messages = computed(() => [
  `执行开始时间：2026-03-14 10:26:${hasRun.value ? '18' : '00'}`,
  `执行引擎：Hive on Spark 3.3`,
  `扫描分区：${scanned.value} 个，命中 2,864,120 行`,
  `返回结果：1,286 行，本次预览前 100 行`,
  `执行耗时：${elapsed.value}s，任务 ID：job_202603141026_0086`,
  `状态：${hasRun.value ? 'SUCCEEDED（执行成功）' : 'READY（尚未执行）'}`
])

const setQueryTab = (id) => {
  activeTabId.value = id
}

const pageTip = () => {
  ElMessage.info('结果集较大，演示环境仅展示前 100 行')
}
</script>

<template>
  <div class="pt-page sql-page">
    <header class="pt-head">
      <div>
        <h1>手写SQL</h1>
        <p class="pt-sub">面向数据分析师的自助 SQL 工作台，支持库表浏览、脚本调试与结果导出。</p>
      </div>
      <div class="pt-head-actions">
        <button class="pt-btn pt-btn-ghost" type="button" @click="openHelp">
          <PtIcon name="help" :size="15" />
          使用帮助
        </button>
        <button class="pt-btn" type="button" @click="ElMessage.info('我的任务：共 12 个已保存任务')">
          <PtIcon name="folder" :size="15" />
          我的任务
        </button>
        <button class="pt-btn pt-btn-primary" type="button" @click="addQuery">
          <PtIcon name="plus" :size="15" />
          新建查询
        </button>
      </div>
    </header>

    <div class="sql-workbench">
      <!-- 左侧资源树 -->
      <aside class="pt-card sql-side">
        <div class="sql-side-head">
          <span>数据资源</span>
          <button class="pt-text-btn" type="button" title="刷新数据源" @click="ElMessage.success('数据源元数据已刷新')">
            <PtIcon name="refresh" :size="13" />
            刷新
          </button>
        </div>
        <div class="sql-side-search">
          <el-input v-model="dbKeyword" class="pt-search" placeholder="搜索库 / 表名" clearable>
            <template #prefix><PtIcon name="search" :size="13" /></template>
          </el-input>
        </div>
        <div class="sql-side-scroll">
          <div class="sql-section-title">
            <span>数据源 · Hive</span>
            <span>{{ databases.reduce((sum, db) => sum + db.tables.length, 0) }} 张表</span>
          </div>
          <div v-for="db in filteredDatabases" :key="db.name">
            <div class="sql-db-row" :class="{ 'is-open': isDbOpen(db) }" @click="toggleDb(db)">
              <PtIcon class="caret" name="chevron-down" :size="12" />
              <PtIcon name="database" :size="14" />
              <span>{{ db.name }}</span>
              <span class="count">{{ db.tables.length }}</span>
            </div>
            <template v-if="isDbOpen(db)">
              <div
                v-for="table in db.tables"
                :key="table"
                class="sql-table-row"
                :title="`插入 ${db.name}.${table}`"
                @click="insertTable(db.name, table)"
              >
                <PtIcon name="table" :size="12" />
                {{ table }}
              </div>
            </template>
          </div>

          <div class="sql-section-title" style="margin-top: 4px">
            <span>取数模板</span>
            <button type="button" @click="ElMessage.info('模板市场：共 48 个公共模板')">模板市场</button>
          </div>
          <div v-for="template in templates" :key="template.name" class="sql-tpl-row" @click="applyTemplate(template)">
            <PtIcon name="doc" :size="13" />
            <div class="sql-tpl-main">
              <b>{{ template.name }}</b>
              <span>{{ template.desc }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧编辑器 -->
      <div class="sql-main">
        <section class="pt-card sql-editor-card">
          <div class="sql-tabbar">
            <div
              v-for="tab in queryTabs"
              :key="tab.id"
              class="sql-file-tab"
              :class="{ 'is-active': activeTabId === tab.id }"
              @click="setQueryTab(tab.id)"
            >
              <PtIcon name="code" :size="12" />
              {{ tab.name }}
              <span class="close" @click.stop="closeQuery(tab)"><PtIcon name="close" :size="10" /></span>
            </div>
            <button class="pt-text-btn" type="button" title="新建查询" @click="addQuery">
              <PtIcon name="plus" :size="13" />
            </button>
            <span class="sql-tabbar-extra">自动保存已开启</span>
          </div>

          <div class="sql-toolbar">
            <button class="sql-tool-btn is-primary" type="button" :disabled="running" @click="runSql">
              <PtIcon name="play" :size="12" />
              {{ running ? '执行中…' : '执行' }}
              <span class="kbd">F8</span>
            </button>
            <button class="sql-tool-btn" type="button" :disabled="!running" @click="ElMessage.info('已请求终止查询')">
              <PtIcon name="close" :size="12" />
              停止
            </button>
            <span class="sql-tool-sep" />
            <button class="sql-tool-btn" type="button" @click="formatSql">
              <PtIcon name="wand" :size="13" />
              格式化
            </button>
            <button class="sql-tool-btn" type="button" @click="saveTask">
              <PtIcon name="save" :size="13" />
              保存任务
            </button>
            <button class="sql-tool-btn" type="button" @click="saveTemplate">
              <PtIcon name="copy" :size="13" />
              保存模板
            </button>
            <span class="sql-tool-sep" />
            <button class="sql-tool-btn" type="button" @click="resultTab = 'plan'">
              <PtIcon name="layers" :size="13" />
              执行计划
            </button>
            <button class="sql-tool-btn" type="button" @click="ElMessage.success('已创建结果导出任务，完成后将通过 5G消息通知')">
              <PtIcon name="download" :size="13" />
              导出结果
            </button>
            <div class="sql-toolbar-right">
              <button class="sql-tool-btn" type="button" @click="openHelp">
                <PtIcon name="help" :size="13" />
              </button>
              <button class="sql-tool-btn" type="button" @click="ElMessage.info('更多操作：另存为、格式化选项、快捷键说明')">
                <PtIcon name="more" :size="13" />
              </button>
            </div>
          </div>

          <div class="sql-editor">
            <div ref="gutterRef" class="sql-gutter">
              <div v-for="line in lineNumbers" :key="line">{{ line }}</div>
            </div>
            <textarea
              ref="editorRef"
              v-model="sql"
              class="sql-textarea"
              spellcheck="false"
              aria-label="SQL 编辑器"
              @scroll="syncScroll"
              @keydown="handleEditorKeydown"
              @keydown.ctrl.enter.prevent="runSql"
            />
          </div>

          <div class="sql-status">
            <span class="ok"><span style="width: 6px; height: 6px; border-radius: 50%; background: #2eb872; display: inline-block" />已连接 dw_jiangxi</span>
            <span>方言：Hive 3.1</span>
            <span>字符数：{{ sql.length }}</span>
            <span class="right">{{ statusText }}</span>
          </div>
        </section>

        <section class="pt-card sql-result">
          <div class="sql-result-head">
            <button class="sql-result-tab" :class="{ 'is-active': resultTab === 'result' }" type="button" @click="resultTab = 'result'">
              查询结果（1,286）
            </button>
            <button class="sql-result-tab" :class="{ 'is-active': resultTab === 'plan' }" type="button" @click="resultTab = 'plan'">
              执行计划
            </button>
            <button class="sql-result-tab" :class="{ 'is-active': resultTab === 'message' }" type="button" @click="resultTab = 'message'">
              消息
            </button>
            <div class="right">
              <button class="pt-text-btn" type="button" @click="ElMessage.success('结果已复制到剪贴板')">
                <PtIcon name="copy" :size="12" />复制
              </button>
              <button class="pt-text-btn" type="button" @click="ElMessage.success('已下载 CSV 文件：渠道日销量汇总_20260314.csv')">
                <PtIcon name="download" :size="12" />下载
              </button>
            </div>
          </div>

          <template v-if="resultTab === 'result'">
            <div class="sql-table-wrap">
              <table class="sql-result-table">
                <thead>
                  <tr>
                    <th v-for="column in columns" :key="column">{{ column }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in resultRows" :key="index">
                    <td v-for="(cell, cellIndex) in row" :key="cellIndex" :class="{ num: cellIndex >= 4 }">{{ cell }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="sql-result-foot">
              <span>查询成功 · 耗时 {{ elapsed }}s · 扫描 {{ scanned }} 个分区 · 返回 1,286 行</span>
              <span class="pager">
                <button type="button" disabled><PtIcon name="chevron-left" :size="11" /></button>
                <b>1</b>
                <button type="button" @click="pageTip">2</button>
                <button type="button" @click="pageTip">3</button>
                <span>…</span>
                <button type="button" @click="pageTip">129</button>
                <button type="button" @click="pageTip"><PtIcon name="chevron-right" :size="11" /></button>
              </span>
            </div>
          </template>

          <div v-else-if="resultTab === 'plan'" class="sql-message" style="overflow: auto; flex: 1">
            <pre style="margin-top: 0">{{ executionPlan }}</pre>
          </div>

          <div v-else class="sql-message" style="overflow: auto; flex: 1">
            <div class="ok-line"><PtIcon name="check" :size="14" />{{ hasRun ? '执行成功' : '尚未执行' }}</div>
            <pre>{{ messages.join('\n') }}</pre>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
