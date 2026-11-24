<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MiniChart from '../components/MiniChart.vue'
import PtIcon from '../components/PtIcon.vue'

const router = useRouter()

const tabs = [
  { key: 'dts', label: '数说工厂' },
  { key: 'metric', label: '指标探索' },
  { key: 'self', label: '自助取数' }
]
const activeTab = ref('dts')
const keyword = ref('')
const previewVisible = ref(false)
const selectedReport = ref(null)

const heroSlides = [
  {
    tag: '平台公告',
    title: '数据平台 V3.6 版本升级通知',
    desc: '优化取数任务编排与报表订阅流程，升级期间平台正常访问。',
    meta: '平台运营组 · 2026-03-12'
  },
  {
    tag: '新功能上线',
    title: '取数模板市场正式开放',
    desc: '首批上线 48 个高频取数模板，覆盖主要业务场景并支持一键引用。',
    meta: '数据管理部 · 2026-03-10'
  },
  {
    tag: '安全提醒',
    title: '加强敏感数据查询管理',
    desc: '敏感字段查询需填写用途说明，系统全程留痕并定期审计。',
    meta: '信息安全室 · 2026-03-06'
  }
]
const heroIndex = ref(0)
let heroTimer = null

onMounted(() => {
  heroTimer = window.setInterval(() => {
    heroIndex.value = (heroIndex.value + 1) % heroSlides.length
  }, 6000)
})
onBeforeUnmount(() => {
  if (heroTimer) window.clearInterval(heroTimer)
})

const heroSlide = computed(() => heroSlides[heroIndex.value])

const reportSource = {
  dts: [
    { title: '南昌高校市场5G套餐渗透分析', tag: '经营分析', type: 'line', creator: '唐雯丽', date: '2026-03-12', views: 1286 },
    { title: '全省渠道效能月度监控', tag: '渠道运营', type: 'bar', creator: '何浩', date: '2026-03-11', views: 986 },
    { title: '家庭宽带用户发展质量看板', tag: '家庭市场', type: 'donut', creator: '尹满珍', date: '2026-03-10', views: 874 },
    { title: '赣州乡镇市场用户增长洞察', tag: '区域洞察', type: 'area', creator: '章立萍', date: '2026-03-09', views: 762 },
    { title: '存量客户价值分层运营报告', tag: '客户运营', type: 'mix', creator: '吴建增', date: '2026-03-08', views: 698 },
    { title: '九江工业互联网专线业务分析', tag: '政企业务', type: 'scatter', creator: '郭红敏', date: '2026-03-07', views: 612 },
    { title: '上饶文旅场景流量经营专题', tag: '流量经营', type: 'line', creator: '刘恒媛', date: '2026-03-06', views: 580 },
    { title: '全省投诉热点与服务质量周报', tag: '服务品质', type: 'hbar', creator: '唐雯丽', date: '2026-03-05', views: 536 }
  ],
  metric: [
    { title: '5G套餐用户净增指标', tag: '规模指标', type: 'quad', creator: '何浩', date: '2026-03-12', views: 1142 },
    { title: '宽带离网率预警指标', tag: '风险指标', type: 'quad', creator: '尹满珍', date: '2026-03-12', views: 1016 },
    { title: '渠道单店产能指标', tag: '效能指标', type: 'quad', creator: '章立萍', date: '2026-03-11', views: 932 },
    { title: 'ARPU 同比变化指标', tag: '价值指标', type: 'quad', creator: '吴建增', date: '2026-03-11', views: 887 },
    { title: '流量饱和度监控指标', tag: '网络指标', type: 'quad', creator: '郭红敏', date: '2026-03-10', views: 794 },
    { title: '权益产品订购指标', tag: '产品指标', type: 'quad', creator: '刘恒媛', date: '2026-03-10', views: 721 },
    { title: '集团客户收入贡献指标', tag: '政企指标', type: 'quad', creator: '何浩', date: '2026-03-09', views: 655 },
    { title: '重点业务渗透率指标', tag: '结构指标', type: 'quad', creator: '唐雯丽', date: '2026-03-09', views: 603 }
  ],
  self: [
    { title: '渠道日销量取数任务', tag: '渠道运营', type: 'table', creator: '唐雯丽', date: '2026-03-12', views: 468 },
    { title: '5G终端换机明细', tag: '终端业务', type: 'table', creator: '何浩', date: '2026-03-12', views: 452 },
    { title: '宽带装维工单明细', tag: '家庭市场', type: 'table', creator: '尹满珍', date: '2026-03-11', views: 421 },
    { title: '客户投诉工单汇总', tag: '服务品质', type: 'table', creator: '章立萍', date: '2026-03-11', views: 398 },
    { title: '集团客户成员清单', tag: '政企业务', type: 'table', creator: '吴建增', date: '2026-03-10', views: 366 },
    { title: '套餐资费订购明细', tag: '产品运营', type: 'table', creator: '郭红敏', date: '2026-03-10', views: 341 },
    { title: '网格经理业绩明细', tag: '网格运营', type: 'table', creator: '刘恒媛', date: '2026-03-09', views: 318 },
    { title: '校园市场用户清单', tag: '校园市场', type: 'table', creator: '唐雯丽', date: '2026-03-09', views: 297 }
  ]
}

const reports = computed(() =>
  reportSource[activeTab.value].map((item, index) => ({
    ...item,
    id: `${activeTab.value}-${index + 1}`,
    summary: `${item.title}按设区市、渠道与时间维度汇总最新经营数据，支持按需下钻查看明细，为地市公司提供决策参考。`
  }))
)

const filteredReports = computed(() => {
  const query = keyword.value.trim()
  if (!query) return reports.value
  return reports.value.filter((item) => item.title.includes(query) || item.tag.includes(query))
})

const favoriteIds = ref(['dts-2', 'dts-5', 'metric-1'])

const isFavorite = (id) => favoriteIds.value.includes(id)

const toggleFavorite = (report) => {
  if (isFavorite(report.id)) {
    favoriteIds.value = favoriteIds.value.filter((id) => id !== report.id)
    ElMessage({ message: `已取消收藏《${report.title}》`, type: 'info' })
  } else {
    favoriteIds.value = [...favoriteIds.value, report.id]
    ElMessage({ message: `已收藏《${report.title}》`, type: 'success' })
  }
}

const openPreview = (report) => {
  selectedReport.value = report
  previewVisible.value = true
}

const previewChartType = computed(() => {
  if (!selectedReport.value) return 'line'
  return selectedReport.value.type === 'table' ? 'bar' : selectedReport.value.type
})

const favoritesInDialog = computed(() => (selectedReport.value ? isFavorite(selectedReport.value.id) : false))

const toggleDialogFavorite = () => {
  if (!selectedReport.value) return
  toggleFavorite(selectedReport.value)
}

const focusItems = [
  { label: '全量客户视图', icon: 'chart-bar' },
  { label: '5G套餐分析', icon: 'layers' },
  { label: '宽带离网预警', icon: 'warning' },
  { label: '渠道效能', icon: 'grid' },
  { label: '收入看板', icon: 'chart-line' },
  { label: '投诉热点', icon: 'message' }
]

const quickLinks = [
  { label: '数据可视化', icon: 'pie', route: '/visual' },
  { label: '自助取数', icon: 'table', route: '/query/instant' },
  { label: '手写SQL', icon: 'code', route: '/sql' },
  { label: '5G消息', icon: 'message', route: '/message5g' },
  { label: '数据模型', icon: 'database', route: '/new/29' },
  { label: '文件下载', icon: 'download', route: '/new/7' },
  { label: '脱敏设置', icon: 'shield', route: '/new/40' },
  { label: '系统公告', icon: 'bell', route: '/notice' }
]

const hotReports = [
  { title: '2026年3月全省经营分析报告', views: 8426, dept: '市场经营部' },
  { title: '5G套餐升档专项营销复盘', views: 6712, dept: '渠道运营中心' },
  { title: '家庭宽带离网客户预警清单', views: 5928, dept: '家庭市场部' },
  { title: '一季度政企重点项目进展通报', views: 5104, dept: '政企客户部' }
]

const goQuick = (link) => {
  if (link.route) router.push(link.route)
}

const openHot = (item) => {
  ElMessage({ message: `正在打开《${item.title}》`, type: 'success' })
}

const switchTab = (key) => {
  activeTab.value = key
  keyword.value = ''
}

const formatViews = (value) => (value >= 10000 ? `${(value / 10000).toFixed(1)}万` : value.toLocaleString())
</script>

<template>
  <div class="pt-page home-page">
    <!-- 顶部轮播 -->
    <section class="home-hero">
      <div class="home-hero-inner">
        <span class="home-hero-tag">{{ heroSlide.tag }}</span>
        <h2>{{ heroSlide.title }}</h2>
        <p>{{ heroSlide.desc }}</p>
        <div class="home-hero-meta">{{ heroSlide.meta }}</div>
      </div>
      <div class="home-hero-dots">
        <button
          v-for="(slide, index) in heroSlides"
          :key="slide.title"
          class="home-hero-dot"
          :class="{ 'is-active': index === heroIndex }"
          type="button"
          :aria-label="`切换至第 ${index + 1} 张`"
          @click="heroIndex = index"
        />
      </div>
    </section>

    <div class="home-body">
      <!-- 左侧内容 -->
      <div class="home-main">
        <div class="home-list-head">
          <div class="pt-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="pt-tab"
              :class="{ 'is-active': activeTab === tab.key }"
              type="button"
              @click="switchTab(tab.key)"
            >
              {{ tab.label }}
            </button>
          </div>
          <div class="home-list-tools">
            <span class="home-list-count">共 {{ filteredReports.length }} 个{{ activeTab === 'self' ? '取数任务' : '报告' }}</span>
            <el-input
              v-model="keyword"
              class="pt-search home-search"
              placeholder="请输入报告名称..."
              clearable
            >
              <template #prefix><PtIcon name="search" :size="14" /></template>
            </el-input>
          </div>
        </div>

        <div v-if="filteredReports.length" class="home-report-grid">
          <article
            v-for="report in filteredReports"
            :key="report.id"
            class="home-report"
            @click="openPreview(report)"
          >
            <div class="home-report-head">
              <h3 class="home-report-title" :title="report.title">{{ report.title }}</h3>
              <div class="home-report-sub">
                <span class="home-report-tag">{{ report.tag }}</span>
                <span class="home-report-date">{{ report.date }}</span>
              </div>
            </div>
            <div class="home-report-cover">
              <img src="/report-default.png" alt="" loading="lazy" />
              <button
                class="home-report-fav"
                :class="{ 'is-fav': isFavorite(report.id) }"
                type="button"
                :title="isFavorite(report.id) ? '取消收藏' : '收藏'"
                @click.stop="toggleFavorite(report)"
              >
                <PtIcon :name="isFavorite(report.id) ? 'star-fill' : 'star'" :size="13" />
              </button>
            </div>
            <div class="home-report-foot">
              <span class="home-report-author" :title="`制作：${report.creator}`">制作：{{ report.creator }}</span>
              <span class="home-report-views">
                <PtIcon name="eye" :size="11" />
                {{ formatViews(report.views) }}
              </span>
            </div>
          </article>
        </div>
        <div v-else class="pt-empty">
          <div class="pt-empty-icon"><PtIcon name="search" :size="22" /></div>
          没有找到匹配的内容，换个关键字试试
        </div>

        <div class="pt-pager">
          <span class="pt-pager-total">共 {{ filteredReports.length }} 条记录，1 页</span>
          <button class="pt-page-btn" type="button" disabled><PtIcon name="chevron-left" :size="12" /></button>
          <button class="pt-page-btn is-active" type="button">1</button>
          <button class="pt-page-btn" type="button" disabled><PtIcon name="chevron-right" :size="12" /></button>
        </div>
      </div>

      <!-- 右侧栏 -->
      <aside class="home-side">
        <section class="home-side-card">
          <div class="home-side-head">
            <span>我的关注</span>
            <button type="button" @click="router.push('/visual')">管理</button>
          </div>
          <div class="home-focus-grid">
            <button v-for="item in focusItems" :key="item.label" class="home-focus" type="button" @click="router.push('/visual')">
              <span class="home-focus-icon"><PtIcon :name="item.icon" :size="16" /></span>
              <span>{{ item.label }}</span>
            </button>
          </div>
        </section>

        <section class="home-side-card">
          <div class="home-side-head">
            <span>常用功能</span>
            <button type="button" @click="router.push('/new')">全部</button>
          </div>
          <div class="home-quick-grid">
            <button v-for="link in quickLinks" :key="link.label" class="home-quick" type="button" @click="goQuick(link)">
              <span class="home-quick-icon"><PtIcon :name="link.icon" :size="14" /></span>
              <span>{{ link.label }}</span>
            </button>
          </div>
        </section>

        <section class="home-side-card">
          <div class="home-side-head">
            <span>热门报告</span>
            <button type="button" @click="router.push('/visual')">更多</button>
          </div>
          <div class="home-hot">
            <div v-for="(item, index) in hotReports" :key="item.title" class="home-hot-row" @click="openHot(item)">
              <span class="home-hot-rank">{{ index + 1 }}</span>
              <div class="home-hot-main">
                <div class="home-hot-title" :title="item.title">{{ item.title }}</div>
                <div class="home-hot-meta">{{ item.dept }}</div>
              </div>
              <span class="home-hot-views">{{ formatViews(item.views) }} 次</span>
            </div>
          </div>
        </section>
      </aside>
    </div>

    <!-- 报告预览 -->
    <el-dialog v-model="previewVisible" class="pt-dialog home-preview-dialog" title="报告预览" width="760px" append-to-body>
      <template v-if="selectedReport">
        <div class="home-preview-meta">
          <span><PtIcon name="user" :size="13" />{{ selectedReport.creator }}</span>
          <span><PtIcon name="calendar" :size="13" />{{ selectedReport.date }}</span>
          <span><PtIcon name="eye" :size="13" />{{ formatViews(selectedReport.views) }} 次访问</span>
          <span class="pt-badge pt-badge-blue">{{ selectedReport.tag }}</span>
        </div>
        <h3 class="viz-preview-title">{{ selectedReport.title }}</h3>
        <p class="viz-preview-sub">数说工厂 · 江西省数据资产分析报告</p>
        <div class="home-preview-chart">
          <MiniChart :type="previewChartType" color="#4b86b4" secondary="#93b8d3" accent="#c3d6e4" />
        </div>
        <p class="home-preview-text">
          {{ selectedReport.summary }}
        </p>
      </template>
      <template #footer>
        <div style="display: flex; align-items: center; justify-content: space-between">
          <button class="pt-btn pt-btn-ghost" type="button" @click="toggleDialogFavorite">
            <PtIcon :name="favoritesInDialog ? 'star-fill' : 'star'" :size="14" />
            {{ favoritesInDialog ? '已收藏' : '收藏报告' }}
          </button>
          <div style="display: flex; gap: 10px">
            <button class="pt-btn" type="button" @click="previewVisible = false">关闭</button>
            <button class="pt-btn pt-btn-primary" type="button" @click="previewVisible = false; ElMessage.success('报告已加载，可在数说工厂中继续查看')">
              打开报告
            </button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
