<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import MiniChart from '../components/MiniChart.vue'
import PtIcon from '../components/PtIcon.vue'

const filters = [
  { key: 'all', label: '全部' },
  { key: 'latest', label: '最新仪表板' },
  { key: 'recent', label: '最近访问' },
  { key: 'visit', label: '访问最多' },
  { key: 'focus', label: '我最关注' }
]
const activeFilter = ref('all')
const activeTag = ref('全部')
const keyword = ref('')
const previewVisible = ref(false)
const selectedDashboard = ref(null)

const tags = ['全部', '经营分析', '渠道运营', '客户运营', '政企专题', '服务品质']

const palette = [
  { color: '#0b81e7', secondary: '#22b8a7' },
  { color: '#17a08f', secondary: '#58b4f8' },
  { color: '#6b4ce6', secondary: '#38c9b5' },
  { color: '#e2941b', secondary: '#7fb3e8' },
  { color: '#2a7fd4', secondary: '#8fd0ff' },
  { color: '#d9558b', secondary: '#f2a65a' },
  { color: '#3f8f6b', secondary: '#9ad46f' },
  { color: '#5b6ee1', secondary: '#4fc3d9' }
]

const dashboards = ref([
  {
    id: 'viz-1',
    title: '全省5G发展作战地图',
    desc: '省公司 / 市场经营部 · 11 个地市 5G 规模与价值全景',
    type: 'bar',
    typeLabel: '柱状图',
    tag: '经营分析',
    creator: '唐雯丽',
    updated: '2026-03-12 09:20',
    updatedAt: 202603120920,
    views: 3268,
    recent: true
  },
  {
    id: 'viz-2',
    title: '渠道效能监测看板',
    desc: '渠道运营中心 · 门店产能、酬金与业务结构监控',
    type: 'hbar',
    typeLabel: '条形图',
    tag: '渠道运营',
    creator: '何浩',
    updated: '2026-03-12 08:45',
    updatedAt: 202603120845,
    views: 2874,
    recent: true
  },
  {
    id: 'viz-3',
    title: '家庭宽带用户健康度',
    desc: '家庭市场部 · 装机、在网与离网预警一体化分析',
    type: 'line',
    typeLabel: '折线图',
    tag: '客户运营',
    creator: '尹满珍',
    updated: '2026-03-11 17:32',
    updatedAt: 202603111732,
    views: 2618,
    recent: true
  },
  {
    id: 'viz-4',
    title: '政企重点项目管理驾驶舱',
    desc: '政企客户部 · 项目签约、回款与交付进度跟踪',
    type: 'donut',
    typeLabel: '环形图',
    tag: '政企专题',
    creator: '章立萍',
    updated: '2026-03-11 16:08',
    updatedAt: 202603111608,
    views: 2396,
    recent: false
  },
  {
    id: 'viz-5',
    title: '客户投诉实时监控',
    desc: '客户服务部 · 投诉量、热点问题与处理时效监控',
    type: 'area',
    typeLabel: '面积图',
    tag: '服务品质',
    creator: '吴建增',
    updated: '2026-03-11 14:26',
    updatedAt: 202603111426,
    views: 2175,
    recent: true
  },
  {
    id: 'viz-6',
    title: '存量客户价值分层洞察',
    desc: '市场经营部 · 客户价值分层、迁转与保有策略',
    type: 'mix',
    typeLabel: '组合图',
    tag: '客户运营',
    creator: '郭红敏',
    updated: '2026-03-10 19:04',
    updatedAt: 202603101904,
    views: 1984,
    recent: false
  },
  {
    id: 'viz-7',
    title: '校园市场营销专题',
    desc: '渠道运营中心 · 高校迎新、套餐渗透与权益运营',
    type: 'bar',
    typeLabel: '柱状图',
    tag: '经营分析',
    creator: '刘恒媛',
    updated: '2026-03-10 15:41',
    updatedAt: 202603101541,
    views: 1762,
    recent: false
  },
  {
    id: 'viz-8',
    title: '网格经营日报看板',
    desc: '渠道运营中心 · 网格收入、用户与业务量每日跟踪',
    type: 'scatter',
    typeLabel: '散点图',
    tag: '渠道运营',
    creator: '唐雯丽',
    updated: '2026-03-10 09:12',
    updatedAt: 202603100912,
    views: 1543,
    recent: true
  }
].map((item, index) => ({ ...item, ...palette[index % palette.length] })))

const favoriteIds = ref(['viz-2', 'viz-6'])

const isFavorite = (id) => favoriteIds.value.includes(id)

const toggleFavorite = (dashboard) => {
  if (isFavorite(dashboard.id)) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== dashboard.id)
    ElMessage({ message: `已取消关注《${dashboard.title}》`, type: 'info' })
  } else {
    favoriteIds.value = [...favoriteIds.value, dashboard.id]
    ElMessage({ message: `已关注《${dashboard.title}》`, type: 'success' })
  }
}

const filteredDashboards = computed(() => {
  let list = [...dashboards.value]
  if (activeTag.value !== '全部') {
    list = list.filter((item) => item.tag === activeTag.value)
  }
  const query = keyword.value.trim()
  if (query) {
    list = list.filter((item) => item.title.includes(query) || item.tag.includes(query) || item.creator.includes(query))
  }
  if (activeFilter.value === 'focus') {
    list = list.filter((item) => favoriteIds.value.includes(item.id))
  } else if (activeFilter.value === 'recent') {
    list = list.filter((item) => item.recent)
  } else if (activeFilter.value === 'visit') {
    list = list.sort((a, b) => b.views - a.views)
  } else if (activeFilter.value === 'latest') {
    list = list.sort((a, b) => b.updatedAt - a.updatedAt)
  }
  return list
})

const openPreview = (dashboard) => {
  selectedDashboard.value = dashboard
  previewVisible.value = true
}

const openEditor = () => {
  ElMessage({ message: '仪表板编辑器加载中，请稍候…', type: 'success' })
}

const formatViews = (value) => value.toLocaleString()

const kpis = [
  { label: '发展用户', value: '128.6万', delta: '+8.2%' },
  { label: '业务收入', value: '3.42亿', delta: '+5.6%' },
  { label: '5G渗透率', value: '68.4%', delta: '+3.1pt' },
  { label: '离网率', value: '0.82%', delta: '-0.06pt' }
]
</script>

<template>
  <div class="pt-page viz-page">
    <header class="pt-head">
      <div>
        <h1>数据可视化</h1>
        <p class="pt-sub">基于统一数据模型快速搭建仪表板，所见即所得地探索江西移动经营数据。</p>
      </div>
      <div class="pt-head-actions">
        <button class="pt-btn pt-btn-ghost" type="button" @click="ElMessage.info('模板中心：提供 36 套经营分析模板')">
          <PtIcon name="layers" :size="15" />
          模板中心
        </button>
        <button class="pt-btn pt-btn-primary" type="button" @click="openEditor">
          <PtIcon name="plus" :size="15" />
          仪表板制作
        </button>
      </div>
    </header>

    <section class="pt-card viz-toolbar">
      <div class="viz-toolbar-row">
        <div class="pt-tabs">
          <button
            v-for="item in filters"
            :key="item.key"
            class="pt-tab"
            :class="{ 'is-active': activeFilter === item.key }"
            type="button"
            @click="activeFilter = item.key"
          >
            {{ item.label }}
          </button>
        </div>
        <el-input v-model="keyword" class="pt-search" placeholder="请输入仪表板名称查找..." clearable>
          <template #prefix><PtIcon name="search" :size="14" /></template>
        </el-input>
      </div>
      <div class="viz-toolbar-row">
        <div class="viz-tags-wrap">
          <span class="viz-tags-label">标签：</span>
          <div class="viz-tags">
            <button
              v-for="tag in tags"
              :key="tag"
              class="viz-tag"
              :class="{ 'is-active': activeTag === tag }"
              type="button"
              @click="activeTag = tag"
            >
              {{ tag }}
            </button>
          </div>
        </div>
        <span class="viz-count">共 {{ filteredDashboards.length }} 个仪表板</span>
      </div>
    </section>

    <div v-if="filteredDashboards.length" class="viz-grid">
      <article
        v-for="dashboard in filteredDashboards"
        :key="dashboard.id"
        class="viz-card"
        @click="openPreview(dashboard)"
      >
        <div class="viz-cover">
          <span class="viz-cover-type">
            <PtIcon :name="dashboard.type === 'line' || dashboard.type === 'area' ? 'chart-line' : dashboard.type === 'donut' ? 'pie' : 'chart-bar'" :size="11" />
            {{ dashboard.typeLabel }}
          </span>
          <div class="viz-cover-hover">
            <span><PtIcon name="eye" :size="14" />查看仪表板</span>
          </div>
          <MiniChart :type="dashboard.type" :color="dashboard.color" :secondary="dashboard.secondary" :accent="'#f0a12b'" />
        </div>
        <div class="viz-card-body">
          <div class="viz-card-title-row">
            <h3 class="viz-card-title">{{ dashboard.title }}</h3>
            <button
              class="viz-fav"
              :class="{ 'is-active': isFavorite(dashboard.id) }"
              type="button"
              :title="isFavorite(dashboard.id) ? '取消关注' : '关注'"
              @click.stop="toggleFavorite(dashboard)"
            >
              <PtIcon :name="isFavorite(dashboard.id) ? 'star-fill' : 'star'" :size="15" />
            </button>
          </div>
          <p class="viz-card-desc">{{ dashboard.desc }}</p>
          <div class="viz-card-meta">
            <span><PtIcon name="user" :size="11" />{{ dashboard.creator }}</span>
            <span><PtIcon name="clock" :size="11" />{{ dashboard.updated.slice(5, 10) }}</span>
            <span class="spacer" />
            <span><PtIcon name="eye" :size="11" />{{ formatViews(dashboard.views) }}</span>
          </div>
        </div>
      </article>
    </div>
    <div v-else class="pt-card pt-empty" style="margin-top: 16px">
      <div class="pt-empty-icon"><PtIcon name="pie" :size="22" /></div>
      当前筛选条件下暂无仪表板
    </div>

    <div class="pt-pager">
      <span class="pt-pager-total">共 {{ filteredDashboards.length }} 条</span>
      <button class="pt-page-btn" type="button" disabled><PtIcon name="chevron-left" :size="12" /></button>
      <button class="pt-page-btn is-active" type="button">1</button>
      <button class="pt-page-btn" type="button" disabled><PtIcon name="chevron-right" :size="12" /></button>
    </div>

    <el-dialog v-model="previewVisible" class="pt-dialog" title="仪表板预览" width="920px" append-to-body>
      <template v-if="selectedDashboard">
        <h3 class="viz-preview-title">
          {{ selectedDashboard.title }}
          <span class="pt-badge pt-badge-blue">{{ selectedDashboard.typeLabel }}</span>
        </h3>
        <p class="viz-preview-sub">
          {{ selectedDashboard.desc }} · 最近更新 {{ selectedDashboard.updated }}
        </p>

        <div class="viz-kpis">
          <div v-for="kpi in kpis" :key="kpi.label" class="viz-kpi">
            <span>{{ kpi.label }}</span>
            <strong>{{ kpi.value }}<em>{{ kpi.delta }}</em></strong>
          </div>
        </div>

        <div class="viz-preview-charts">
          <div class="viz-chart-box">
            <h4>业务发展趋势 <small>近 12 个月</small></h4>
            <div class="viz-chart-canvas">
              <MiniChart type="line" :color="selectedDashboard.color" :secondary="selectedDashboard.secondary" />
            </div>
          </div>
          <div class="viz-chart-box">
            <h4>业务结构 <small>按渠道</small></h4>
            <div class="viz-chart-canvas">
              <MiniChart type="donut" :color="selectedDashboard.color" :secondary="selectedDashboard.secondary" />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div style="display: flex; align-items: center; justify-content: space-between">
          <span style="color: #86909c; font-size: 12px">
            <PtIcon name="user" :size="12" /> {{ selectedDashboard?.creator }} 创建 ·
            <PtIcon name="eye" :size="12" /> {{ selectedDashboard ? formatViews(selectedDashboard.views) : 0 }} 次访问
          </span>
          <div style="display: flex; gap: 10px">
            <button class="pt-btn" type="button" @click="previewVisible = false">关闭</button>
            <button class="pt-btn pt-btn-primary" type="button" @click="previewVisible = false; openEditor()">
              进入仪表板
            </button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
