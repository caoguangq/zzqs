<script setup>
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import PtIcon from '../components/PtIcon.vue'

const activeTab = ref('notice')
const keyword = ref('')
const levelFilter = ref('全部')
const levelOptions = ['全部', '普通', '重要', '紧急']

const notices = ref([
  {
    id: 'n-1',
    title: '关于2026年3月账期数据延迟发布的公告',
    level: '重要',
    category: '系统公告',
    publisher: '数据平台运维组',
    date: '2026-03-14 09:30',
    unread: true,
    summary: '受上游计费系统月结影响，3月账期数据预计延迟至3月16日 08:00 完成入库，请合理安排取数与报表发布计划。',
    content: [
      '各数据使用单位：',
      '受上游计费系统月结处理影响，2026年3月账期数据入库时间将由原定 3月15日 02:00 延迟至 3月16日 08:00。延迟期间，数据平台中涉及 3 月账期的模型、报表与自助取数任务可能出现数据为空或数据不完整的情况。',
      '请各单位提前调整取数任务与报表发布计划，避免在数据补齐前对外发布经营数据。账期数据完成入库后，平台将通过 5G消息与系统公告同步通知。',
      '如有疑问，请联系数据平台运维组（短号 6612）。'
    ],
    attachment: { name: '2026年3月账期数据调整说明.pdf', size: '386 KB' },
    views: 428
  },
  {
    id: 'n-2',
    title: '数据平台 V3.6 版本升级公告',
    level: '普通',
    category: '版本更新',
    publisher: '数据平台产品组',
    date: '2026-03-12 18:00',
    unread: true,
    summary: 'V3.6 版本新增取数模板市场、任务编排、报表订阅能力，并优化模型扫描与敏感字段访问审计。',
    content: [
      '各位同事：',
      '数据平台已于 2026年3月12日完成 V3.6 版本升级。本次升级新增自助取数模板市场、定时任务编排、报表订阅推送三项能力；同时优化模型扫描策略，支持按账期自动识别异常任务。',
      '升级后首次登录如遇页面样式异常，请按 Ctrl + F5 强制刷新浏览器缓存。历史任务、报表与收藏数据均不受影响。',
      '欢迎大家在使用过程中通过「我的首页 - 常用功能 - 问题反馈」提交建议。'
    ],
    attachment: null,
    views: 612
  },
  {
    id: 'n-3',
    title: '【紧急】3月15日凌晨数据平台停机维护通知',
    level: '紧急',
    category: '停机维护',
    publisher: '数据平台运维组',
    date: '2026-03-11 16:20',
    unread: true,
    summary: '3月15日 00:00 - 04:00 将对数据平台存储集群进行扩容，期间查询、取数与报表服务暂停。',
    content: [
      '各数据使用单位：',
      '为保障账期高峰期平台稳定运行，计划于 2026年3月15日 00:00 至 04:00 对存储集群进行扩容升级。维护期间，数据平台查询、自助取数、手写SQL 与报表服务将全部暂停。',
      '请提前保存正在编辑的取数任务与 SQL 脚本，避免因服务中断造成内容丢失。维护完成后平台将自动恢复服务，不再另行通知。',
      '因停机给您带来的不便，敬请谅解。'
    ],
    attachment: { name: '存储集群扩容维护方案.docx', size: '642 KB' },
    views: 896
  },
  {
    id: 'n-4',
    title: '关于加强敏感数据查询管理的通知',
    level: '重要',
    category: '安全通知',
    publisher: '数据安全管理部',
    date: '2026-03-10 10:15',
    unread: false,
    summary: '即日起，涉及用户号码、证件号等敏感字段的查询须说明用途，系统将全程留痕并定期审计。',
    content: [
      '各部门、各地市公司：',
      '为进一步落实数据安全责任制，自即日起，数据平台对涉及用户号码、证件号码、家庭住址等敏感字段的查询实行用途登记。查询人须在发起取数时填写使用场景与保留期限，系统将全程记录访问日志。',
      '严禁将敏感数据用于与工作无关的场景，严禁通过即时通信工具违规传输。数据安全管理部将按月开展审计，对违规行为按公司相关制度处理。',
      '请各单位组织相关人员认真学习《敏感数据查询管理规范》，并于 3月31日前完成线上承诺书签署。'
    ],
    attachment: { name: '敏感数据查询管理规范.pdf', size: '1.2 MB' },
    views: 1024
  },
  {
    id: 'n-5',
    title: '自助取数模板市场正式上线',
    level: '普通',
    category: '版本更新',
    publisher: '数据平台产品组',
    date: '2026-03-08 11:00',
    unread: false,
    summary: '首批上线 48 个高频取数模板，覆盖渠道、家庭、政企与客服场景，支持一键引用与个性化调整。',
    content: [
      '各位同事：',
      '自助取数模板市场已正式上线，首批提供 48 个高频取数模板，覆盖渠道日销量、宽带装维、政企成员、投诉工单等常用场景。',
      '在「自助取数 - 模板市场」中可按业务域筛选模板，一键引用后仅需调整时间范围与地市参数即可执行。模板由各业务部门数据专员维护，欢迎持续补充。',
      '模板使用过程中如有问题，可在模板详情页提交反馈。'
    ],
    attachment: null,
    views: 758
  },
  {
    id: 'n-6',
    title: '数据模型负责人变更流程说明',
    level: '普通',
    category: '系统公告',
    publisher: '数据治理办公室',
    date: '2026-03-06 14:40',
    unread: false,
    summary: '模型负责人调整需由原负责人在平台发起申请，经部门数据管理员审批后生效，历史赋权同步迁移。',
    content: [
      '各数据模型责任单位：',
      '为规范数据模型负责人管理，平台已上线负责人变更线上流程。变更须由原负责人在「数据模型管理 - 负责人变更」中发起，说明变更原因并指定接任人，经部门数据管理员审批后生效。',
      '审批通过后，原负责人的模型管理权限自动回收，数据集赋权同步迁移至接任人，历史操作日志保留可查。',
      '涉及跨部门调整的，需由双方部门数据管理员共同确认。'
    ],
    attachment: null,
    views: 486
  },
  {
    id: 'n-7',
    title: '5G消息服务接入试运行公告',
    level: '普通',
    category: '系统公告',
    publisher: '消息运营中心',
    date: '2026-03-04 09:20',
    unread: false,
    summary: '5G消息服务已在数据平台完成接入，试运行期间支持任务通知、告警提醒与营销素材预览。',
    content: [
      '各位同事：',
      '5G消息服务已完成与数据平台的对接，进入试运行阶段。试运行期间，平台将通过 5G消息推送取数任务完成通知、模型异常告警与营销活动提醒。',
      '可在「5G消息」页面查看消息详情、标记已读或回复。当前仅开放省公司及南昌、赣州、九江三个地市试用，后续将逐步扩大范围。',
      '试运行期间如遇消息延迟或展示异常，请联系消息运营中心。'
    ],
    attachment: null,
    views: 402
  },
  {
    id: 'n-8',
    title: '关于规范取数任务命名的提醒',
    level: '普通',
    category: '系统公告',
    publisher: '数据平台运维组',
    date: '2026-03-02 10:05',
    unread: false,
    summary: '请按「业务域-地市-主题-频次」规范命名取数任务，便于任务检索、权限管理与资源统计。',
    content: [
      '各位同事：',
      '近期发现部分取数任务命名不规范，存在重复、含义不明等情况，影响任务检索与资源统计。请按「业务域-地市-主题-频次」的规则命名，例如：渠道-南昌-门店日销量-日。',
      '平台将于 3月20日起对连续 90 天未执行且命名不规范的任务进行归档提醒，请及时清理或重命名。',
      '感谢配合。'
    ],
    attachment: null,
    views: 356
  }
])

const docs = [
  {
    id: 'd-1',
    title: '数据资产平台操作手册 V3.6',
    category: '操作指南',
    desc: '覆盖模型管理、自助取数、数据可视化、手写SQL与权限管理的完整操作说明。',
    fileName: '数据资产平台操作手册_V3.6.pdf',
    size: '8.6 MB',
    downloads: 1286,
    updated: '2026-03-10',
    outline: ['平台登录与工作台介绍', '数据模型检索与申请', '自助取数任务配置', '仪表板制作与分享', '常见问题与故障处理']
  },
  {
    id: 'd-2',
    title: '自助取数快速入门',
    category: '快速入门',
    desc: '面向业务人员的 15 分钟上手文档，含即时取数、定时任务与结果下载示例。',
    fileName: '自助取数快速入门.pdf',
    size: '3.2 MB',
    downloads: 986,
    updated: '2026-03-08',
    outline: ['取数入口与权限说明', '选择数据模型', '配置筛选条件', '预览与下载结果', '定时任务设置']
  },
  {
    id: 'd-3',
    title: '数据模型设计规范',
    category: '规范制度',
    desc: '规定模型分层、命名、字段口径与负责人管理要求，适用于全省数据模型建设。',
    fileName: '数据模型设计规范_V2.1.pdf',
    size: '2.4 MB',
    downloads: 764,
    updated: '2026-02-26',
    outline: ['模型分层与主题域划分', '表与字段命名规范', '指标口径管理', '模型上下线流程', '负责人职责']
  },
  {
    id: 'd-4',
    title: '手写SQL使用指南',
    category: '操作指南',
    desc: '介绍 SQL 工作台的数据源接入、脚本调试、结果导出与模板复用方法。',
    fileName: '手写SQL使用指南.pdf',
    size: '1.8 MB',
    downloads: 652,
    updated: '2026-02-20',
    outline: ['数据源与库表浏览', '编辑器快捷键', '执行计划查看', '结果导出与订阅', '脚本模板管理']
  },
  {
    id: 'd-5',
    title: '数据安全与脱敏白皮书',
    category: '安全合规',
    desc: '阐述数据分级分类、动态脱敏、访问审计与应急响应的整体框架。',
    fileName: '数据安全与脱敏白皮书.pdf',
    size: '5.1 MB',
    downloads: 518,
    updated: '2026-01-18',
    outline: ['数据安全治理框架', '数据分级分类标准', '动态脱敏策略', '访问审计与告警', '安全事件应急响应']
  }
]

const unreadCount = computed(() => notices.value.filter((item) => item.unread).length)

const filteredNotices = computed(() => {
  const query = keyword.value.trim()
  return notices.value.filter((item) => {
    if (levelFilter.value !== '全部' && item.level !== levelFilter.value) return false
    if (!query) return true
    return item.title.includes(query) || item.summary.includes(query) || item.publisher.includes(query)
  })
})

const filteredDocs = computed(() => {
  const query = keyword.value.trim()
  if (!query) return docs
  return docs.filter((item) => item.title.includes(query) || item.desc.includes(query) || item.category.includes(query))
})

const selectedNotice = ref(notices.value[0])
const selectedDoc = ref(docs[0])

const switchTab = (key) => {
  activeTab.value = key
  keyword.value = ''
  levelFilter.value = '全部'
}

const openNotice = (item) => {
  selectedNotice.value = item
  if (item.unread) {
    item.unread = false
  }
}

const openDoc = (item) => {
  selectedDoc.value = item
}

watch(filteredNotices, (list) => {
  if (activeTab.value !== 'notice') return
  if (!list.length) return
  if (!list.some((item) => item.id === selectedNotice.value?.id)) {
    selectedNotice.value = list[0]
  }
})

watch(filteredDocs, (list) => {
  if (activeTab.value !== 'doc') return
  if (!list.length) return
  if (!list.some((item) => item.id === selectedDoc.value?.id)) {
    selectedDoc.value = list[0]
  }
})

const markAllRead = () => {
  if (!unreadCount.value) {
    ElMessage.info('当前没有未读公告')
    return
  }
  notices.value.forEach((item) => {
    item.unread = false
  })
  ElMessage({ message: '已将全部公告标记为已读', type: 'success' })
}

const downloadAttachment = (file) => {
  ElMessage({ message: `已创建下载任务：${file.name}`, type: 'success' })
}

const downloadDoc = () => {
  ElMessage({ message: `已创建下载任务：${selectedDoc.value.fileName}`, type: 'success' })
}

const levelClass = (level) => {
  if (level === '紧急') return 'pt-badge pt-badge-red'
  if (level === '重要') return 'pt-badge pt-badge-orange'
  return 'pt-badge pt-badge-gray'
}

const goAdjacent = (offset) => {
  const list = filteredNotices.value
  const index = list.findIndex((item) => item.id === selectedNotice.value?.id)
  const target = list[index + offset]
  if (target) {
    selectedNotice.value = target
    if (target.unread) target.unread = false
  }
}
</script>

<template>
  <div class="pt-page notice-page">
    <header class="pt-head">
      <div>
        <h1>公告</h1>
        <p class="pt-sub">数据平台系统公告、版本更新、停机维护与帮助文档统一发布入口。</p>
      </div>
      <div class="pt-head-actions">
        <button class="pt-btn pt-btn-ghost" type="button" @click="markAllRead">
          <PtIcon name="check" :size="15" />
          全部标为已读
        </button>
        <button class="pt-btn" type="button" @click="ElMessage.info('公告订阅设置：当前已订阅系统公告与版本更新')">
          <PtIcon name="bell" :size="15" />
          公告订阅
        </button>
      </div>
    </header>

    <section class="pt-card notice-toolbar">
      <div class="notice-toolbar-left">
        <div class="pt-tabs">
          <button
            class="pt-tab"
            :class="{ 'is-active': activeTab === 'notice' }"
            type="button"
            @click="switchTab('notice')"
          >
            系统公告
          </button>
          <button
            class="pt-tab"
            :class="{ 'is-active': activeTab === 'doc' }"
            type="button"
            @click="switchTab('doc')"
          >
            帮助文档
          </button>
        </div>
        <span v-if="activeTab === 'notice'" style="color: #86909c; font-size: 12px">
          <b style="color: #d9363e">{{ unreadCount }}</b> 条未读
        </span>
      </div>
      <div class="notice-toolbar-right">
        <el-select v-if="activeTab === 'notice'" v-model="levelFilter" class="notice-filter" size="default">
          <el-option v-for="level in levelOptions" :key="level" :label="level === '全部' ? '全部级别' : level" :value="level" />
        </el-select>
        <el-input
          v-model="keyword"
          class="pt-search"
          :placeholder="activeTab === 'notice' ? '搜索公告标题、发布单位...' : '搜索文档名称...'"
          clearable
        >
          <template #prefix><PtIcon name="search" :size="14" /></template>
        </el-input>
      </div>
    </section>

    <div class="notice-layout">
      <!-- 列表 -->
      <section class="pt-card notice-list-card">
        <div class="notice-list-head">
          <span>{{ activeTab === 'notice' ? '全部公告' : '帮助文档' }}（{{ activeTab === 'notice' ? filteredNotices.length : filteredDocs.length }}）</span>
          <span>按发布时间倒序</span>
        </div>

        <div v-if="activeTab === 'notice'" class="notice-list">
          <article
            v-for="item in filteredNotices"
            :key="item.id"
            class="notice-item"
            :class="{ 'is-active': selectedNotice?.id === item.id, 'is-unread': item.unread, 'is-read': !item.unread }"
            @click="openNotice(item)"
          >
            <span class="notice-item-dot" />
            <div class="notice-item-main">
              <div class="notice-item-title">
                <span :class="levelClass(item.level)">{{ item.level }}</span>
                <span class="title-text">{{ item.title }}</span>
              </div>
              <div class="notice-item-desc">{{ item.summary }}</div>
              <div class="notice-item-meta">
                <span><PtIcon name="user" :size="11" />{{ item.publisher }}</span>
                <span><PtIcon name="clock" :size="11" />{{ item.date }}</span>
                <span v-if="item.attachment" class="att"><PtIcon name="link" :size="11" />含附件</span>
                <span class="spacer" style="margin-left: auto"><PtIcon name="eye" :size="11" />{{ item.views }}</span>
              </div>
            </div>
          </article>
          <div v-if="!filteredNotices.length" class="pt-empty">
            <div class="pt-empty-icon"><PtIcon name="inbox" :size="22" /></div>
            暂无符合条件的公告
          </div>
        </div>

        <div v-else class="notice-list">
          <article
            v-for="item in filteredDocs"
            :key="item.id"
            class="notice-item notice-doc-item"
            :class="{ 'is-active': selectedDoc?.id === item.id }"
            @click="openDoc(item)"
          >
            <span class="notice-doc-icon"><PtIcon name="doc" :size="19" /></span>
            <div class="notice-item-main">
              <div class="notice-item-title">
                <span class="pt-badge pt-badge-blue">{{ item.category }}</span>
                <span class="title-text">{{ item.title }}</span>
              </div>
              <div class="notice-item-desc">{{ item.desc }}</div>
              <div class="notice-item-meta">
                <span><PtIcon name="clock" :size="11" />更新于 {{ item.updated }}</span>
                <span><PtIcon name="download" :size="11" />{{ item.downloads }} 次下载</span>
                <span>{{ item.size }}</span>
              </div>
            </div>
          </article>
          <div v-if="!filteredDocs.length" class="pt-empty">
            <div class="pt-empty-icon"><PtIcon name="doc" :size="22" /></div>
            暂无匹配的帮助文档
          </div>
        </div>

        <div class="notice-list-foot">
          <span>共 {{ activeTab === 'notice' ? filteredNotices.length : filteredDocs.length }} 条</span>
          <span>每页 20 条 · 第 1 / 1 页</span>
        </div>
      </section>

      <!-- 详情 -->
      <section v-if="activeTab === 'notice' && selectedNotice" class="pt-card notice-detail-card">
        <div class="notice-detail-head">
          <div class="notice-detail-badges">
            <span :class="levelClass(selectedNotice.level)">{{ selectedNotice.level }}</span>
            <span class="pt-badge pt-badge-blue">{{ selectedNotice.category }}</span>
          </div>
          <h2 class="notice-detail-title">{{ selectedNotice.title }}</h2>
          <div class="notice-detail-meta">
            <span><PtIcon name="user" :size="12" />{{ selectedNotice.publisher }}</span>
            <span><PtIcon name="clock" :size="12" />{{ selectedNotice.date }}</span>
            <span><PtIcon name="eye" :size="12" />{{ selectedNotice.views }} 次浏览</span>
          </div>
        </div>
        <div class="notice-detail-body">
          <p v-for="(paragraph, index) in selectedNotice.content" :key="index">{{ paragraph }}</p>
          <div v-if="selectedNotice.attachment" class="notice-attach" @click="downloadAttachment(selectedNotice.attachment)">
            <span class="notice-attach-icon"><PtIcon name="doc" :size="16" /></span>
            <div class="notice-attach-main">
              <b>{{ selectedNotice.attachment.name }}</b>
              <span>{{ selectedNotice.attachment.size }} · 点击下载</span>
            </div>
            <PtIcon name="download" :size="16" />
          </div>
        </div>
        <div class="notice-detail-foot">
          <div style="display: flex; gap: 6px">
            <button class="pt-btn pt-btn-sm" type="button" @click="goAdjacent(-1)">
              <PtIcon name="chevron-left" :size="12" />上一篇
            </button>
            <button class="pt-btn pt-btn-sm" type="button" @click="goAdjacent(1)">
              下一篇<PtIcon name="chevron-right" :size="12" />
            </button>
          </div>
          <button v-if="selectedNotice.attachment" class="pt-btn pt-btn-sm pt-btn-primary" type="button" @click="downloadAttachment(selectedNotice.attachment)">
            <PtIcon name="download" :size="13" />
            下载附件
          </button>
        </div>
      </section>

      <section v-else-if="activeTab === 'doc' && selectedDoc" class="pt-card notice-detail-card">
        <div class="notice-detail-head">
          <div class="notice-detail-badges">
            <span class="pt-badge pt-badge-blue">{{ selectedDoc.category }}</span>
            <span class="pt-badge pt-badge-gray">{{ selectedDoc.size }}</span>
          </div>
          <h2 class="notice-detail-title">{{ selectedDoc.title }}</h2>
          <div class="notice-detail-meta">
            <span><PtIcon name="clock" :size="12" />更新于 {{ selectedDoc.updated }}</span>
            <span><PtIcon name="download" :size="12" />{{ selectedDoc.downloads }} 次下载</span>
          </div>
        </div>
        <div class="notice-detail-body">
          <div class="notice-doc-detail">
            <span class="notice-doc-detail-icon"><PtIcon name="doc" :size="26" /></span>
            <div>
              <h4>{{ selectedDoc.fileName }}</h4>
              <p>{{ selectedDoc.desc }}</p>
              <span class="pt-badge pt-badge-gray">{{ selectedDoc.size }} · PDF</span>
            </div>
          </div>
          <div class="pt-card-title" style="margin-top: 20px">文档目录</div>
          <ul class="notice-outline">
            <li v-for="(item, index) in selectedDoc.outline" :key="item">
              <em>{{ String(index + 1).padStart(2, '0') }}</em>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div class="notice-detail-foot">
          <span style="color: #a9aeb8; font-size: 11.5px">文档由数据平台产品组维护</span>
          <button class="pt-btn pt-btn-sm pt-btn-primary" type="button" @click="downloadDoc">
            <PtIcon name="download" :size="13" />
            下载文档
          </button>
        </div>
      </section>
    </div>
  </div>
</template>
