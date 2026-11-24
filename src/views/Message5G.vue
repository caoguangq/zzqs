<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import PtIcon from '../components/PtIcon.vue'

const messages = ref([
  {
    id: 'm-1',
    title: '【重要】关于2026年3月账期数据延迟发布的提醒',
    summary: '受上游计费系统月结影响，3月账期数据预计延迟至3月16日 08:00 完成入库。',
    type: '系统通知',
    icon: 'bell',
    color: '#0b81e7',
    sender: '数据平台运维组',
    time: '2026-03-14 09:35',
    unread: true,
    important: true,
    content: [
      '各位同事：',
      '受上游计费系统月结处理影响，2026年3月账期数据入库时间将由原定 3月15日 02:00 延迟至 3月16日 08:00。延迟期间，涉及 3 月账期的模型、报表与自助取数任务可能出现数据为空或数据不完整的情况。',
      '请提前调整取数任务与报表发布计划，避免在数据补齐前对外发布经营数据。账期数据完成入库后，平台将通过 5G消息与系统公告同步通知。'
    ],
    sign: '数据平台运维组\n2026年3月14日'
  },
  {
    id: 'm-2',
    title: '春日焕新 · 5G专享套餐推荐',
    summary: '办理指定 5G 套餐，立享 20GB 专属流量与视频会员权益，活动仅剩 17 天。',
    type: '营销消息',
    icon: 'lightning',
    color: '#f0a12b',
    sender: '消息运营中心',
    time: '2026-03-14 08:10',
    unread: true,
    important: false,
    content: [
      '您好，唐雯丽：',
      '春回赣鄱，焕新出发。即日起至 3月31日，办理指定 5G 套餐可立享 20GB 专属流量、热门视频会员月卡，以及营业厅优先办理权益。',
      '本活动仅限江西移动用户参与，名额有限，先到先得。点击下方卡片即可查看活动详情并在线办理。'
    ],
    sign: '中国移动通信集团江西有限公司\n2026年3月14日',
    preview: {
      kicker: '中国移动 · 5G消息',
      title: '春日焕新 · 5G专享',
      lead: '办理指定 5G 套餐，立享 20GB 专属流量与视频会员权益。',
      body: '活动时间：2026年3月15日 - 3月31日。本活动仅限江西移动用户参与，具体资费以办理页面为准。',
      actions: ['立即办理', '了解详情']
    }
  },
  {
    id: 'm-3',
    title: '自助取数任务「渠道日销量汇总」执行成功',
    summary: '任务于 18:22 执行完成，共返回 12,864 行，结果文件已生成。',
    type: '任务通知',
    icon: 'check',
    color: '#22b8a7',
    sender: '任务调度中心',
    time: '2026-03-13 18:22',
    unread: true,
    important: false,
    content: [
      '您好：',
      '您订阅的自助取数任务「渠道日销量汇总」已于 2026-03-13 18:22:16 执行完成，共返回 12,864 行数据，耗时 4.82 秒。',
      '结果文件已生成并保存至「离线文件下载」，文件保留 7 天，请及时下载。'
    ],
    sign: '任务调度中心'
  },
  {
    id: 'm-4',
    title: '【紧急】模型扫描发现账期异常任务，请及时处理',
    summary: '模型「宽带用户日发展」连续 2 个账期无数据产出，请负责人于今日内确认。',
    type: '告警消息',
    icon: 'warning',
    color: '#e5484d',
    sender: '模型扫描中心',
    time: '2026-03-13 16:05',
    unread: true,
    important: true,
    content: [
      '您好：',
      '模型扫描发现「宽带用户日发展」模型连续 2 个账期无数据产出，最近一次成功产出时间为 2026-03-10，已触发账期异常告警。',
      '请模型负责人尹满珍于今日 18:00 前登录「模型扫描管理」确认异常原因；如为上游数据延迟，请在平台登记预计恢复时间。逾期未处理的模型将被自动挂起。'
    ],
    sign: '模型扫描中心\n2026年3月13日'
  },
  {
    id: 'm-5',
    title: '数据安全合规培训通知',
    summary: '请于 3月20日前完成 2026 年第一季度数据安全线上培训与考试。',
    type: '安全通知',
    icon: 'shield',
    color: '#7b61ff',
    sender: '数据安全管理部',
    time: '2026-03-12 10:30',
    unread: false,
    important: true,
    content: [
      '各部门、各地市公司：',
      '2026 年第一季度数据安全线上培训已开放，内容涵盖数据分级分类、敏感数据脱敏与违规案例解析，学习时长约 40 分钟。',
      '请全体数据使用人员于 3月20日前完成课程学习并通过结业考试，考试成绩将纳入部门数据安全考核。'
    ],
    sign: '数据安全管理部'
  },
  {
    id: 'm-6',
    title: '手写SQL模板库更新公告',
    summary: '本次新增渠道、宽带、政企等 12 个 SQL 模板，支持一键引用。',
    type: '系统通知',
    icon: 'code',
    color: '#2a7fd4',
    sender: '数据平台产品组',
    time: '2026-03-11 15:40',
    unread: false,
    important: false,
    content: [
      '各位同事：',
      '手写SQL模板库完成本季度第二次更新，新增渠道日销量、宽带装维、政企成员、投诉分类等 12 个常用模板。',
      '在「手写SQL - 取数模板」中可直接引用模板，替换时间与地市参数后执行。欢迎大家提交高频脚本，共同完善模板库。'
    ],
    sign: '数据平台产品组'
  }
])

const activeFilter = ref('all')
const keyword = ref('')
const selectedId = ref('m-1')
const replyText = ref('')
const replies = ref({})

const filters = computed(() => [
  { key: 'all', label: '全部', count: messages.value.length },
  { key: 'unread', label: '未读', count: unreadCount.value, hot: true },
  { key: 'important', label: '重要', count: messages.value.filter((item) => item.important).length },
  { key: 'system', label: '系统消息', count: messages.value.filter((item) => item.type.includes('系统') || item.type.includes('安全')).length }
])

const unreadCount = computed(() => messages.value.filter((item) => item.unread).length)
const importantCount = computed(() => messages.value.filter((item) => item.important).length)

const filteredMessages = computed(() => {
  let list = messages.value
  if (activeFilter.value === 'unread') list = list.filter((item) => item.unread)
  else if (activeFilter.value === 'important') list = list.filter((item) => item.important)
  else if (activeFilter.value === 'system') list = list.filter((item) => item.type.includes('系统') || item.type.includes('安全'))
  const query = keyword.value.trim()
  if (query) {
    list = list.filter((item) => item.title.includes(query) || item.summary.includes(query) || item.sender.includes(query))
  }
  return list
})

const selectedMessage = computed(() => messages.value.find((item) => item.id === selectedId.value) || null)

const stats = computed(() => [
  { label: '未读消息', value: unreadCount.value, unit: '条', icon: 'mail' },
  { label: '今日消息', value: 4, unit: '条', icon: 'calendar' },
  { label: '重要消息', value: importantCount.value, unit: '条', icon: 'warning' },
  { label: '本月已发送', value: 12, unit: '条', icon: 'send' }
])

const openMessage = (item) => {
  selectedId.value = item.id
  if (item.unread) item.unread = false
}

const markAllRead = () => {
  if (!unreadCount.value) {
    ElMessage.info('当前没有未读消息')
    return
  }
  messages.value.forEach((item) => {
    item.unread = false
  })
  ElMessage({ message: '已将全部消息标记为已读', type: 'success' })
}

const toggleRead = () => {
  if (!selectedMessage.value) return
  selectedMessage.value.unread = !selectedMessage.value.unread
  ElMessage({ message: selectedMessage.value.unread ? '已标记为未读' : '已标记为已读', type: 'success' })
}

const deleteMessage = () => {
  if (!selectedMessage.value) return
  const list = filteredMessages.value
  const index = list.findIndex((item) => item.id === selectedMessage.value.id)
  const next = list[index + 1] || list[index - 1]
  messages.value = messages.value.filter((item) => item.id !== selectedMessage.value.id)
  selectedId.value = next?.id || messages.value[0]?.id || ''
  ElMessage({ message: '消息已删除', type: 'success' })
}

const forwardMessage = () => {
  ElMessage({ message: '转发链接已复制，可通过 5G消息发送给同事', type: 'success' })
}

const sendReply = () => {
  const text = replyText.value.trim()
  if (!text) {
    ElMessage.warning('请输入回复内容')
    return
  }
  if (!selectedMessage.value) return
  replies.value = {
    ...replies.value,
    [selectedMessage.value.id]: { text, time: '2026-03-14 10:32' }
  }
  replyText.value = ''
  ElMessage({ message: '回复已发送', type: 'success' })
}

const messageSettings = () => {
  ElMessage.info('消息设置：当前接收系统通知、任务通知与重要告警')
}
</script>

<template>
  <div class="pt-page m5-page">
    <header class="pt-head">
      <div>
        <h1>5G消息</h1>
        <p class="pt-sub">系统通知、任务结果与营销素材统一触达，支持站内已读状态与快捷回复。</p>
      </div>
      <div class="pt-head-actions">
        <button class="pt-btn pt-btn-ghost" type="button" @click="messageSettings">
          <PtIcon name="gear" :size="15" />
          消息设置
        </button>
        <button class="pt-btn pt-btn-primary" type="button" @click="markAllRead">
          <PtIcon name="check" :size="15" />
          全部标为已读
        </button>
      </div>
    </header>

    <div class="m5-stats">
      <div v-for="stat in stats" :key="stat.label" class="m5-stat">
        <span class="m5-stat-icon"><PtIcon :name="stat.icon" :size="17" /></span>
        <div>
          <div class="m5-stat-label">{{ stat.label }}</div>
          <div class="m5-stat-value">{{ stat.value }}<small>{{ stat.unit }}</small></div>
        </div>
      </div>
    </div>

    <section class="pt-card m5-body">
      <!-- 消息列表 -->
      <aside class="m5-side">
        <div class="m5-filters">
          <button
            v-for="item in filters"
            :key="item.key"
            class="m5-filter"
            :class="{ 'is-active': activeFilter === item.key }"
            type="button"
            @click="activeFilter = item.key"
          >
            {{ item.label }}<em v-if="item.hot && item.count">{{ item.count }}</em>
          </button>
        </div>
        <div class="m5-search">
          <el-input v-model="keyword" class="pt-search" placeholder="搜索消息标题或发送方" clearable>
            <template #prefix><PtIcon name="search" :size="13" /></template>
          </el-input>
        </div>

        <div class="m5-list">
          <article
            v-for="item in filteredMessages"
            :key="item.id"
            class="m5-item"
            :class="{ 'is-active': selectedId === item.id, 'is-read': !item.unread }"
            @click="openMessage(item)"
          >
            <span class="m5-item-icon" :style="{ background: item.color }">
              <PtIcon :name="item.icon" :size="16" />
            </span>
            <div class="m5-item-main">
              <div class="m5-item-title">{{ item.title }}</div>
              <div class="m5-item-desc">{{ item.summary }}</div>
              <div class="m5-item-time">{{ item.sender }} · {{ item.time.slice(5, 16) }}</div>
            </div>
            <span v-if="item.unread" class="m5-unread" />
          </article>
          <div v-if="!filteredMessages.length" class="pt-empty">
            <div class="pt-empty-icon"><PtIcon name="mail" :size="22" /></div>
            暂无符合条件的消息
          </div>
        </div>

        <div class="m5-side-foot">
          <span>共 {{ filteredMessages.length }} 条</span>
          <span class="pager">
            <button type="button" disabled><PtIcon name="chevron-left" :size="11" /></button>
            <span>1 / 1</span>
            <button type="button" disabled><PtIcon name="chevron-right" :size="11" /></button>
          </span>
        </div>
      </aside>

      <!-- 消息详情 -->
      <section v-if="selectedMessage" class="m5-detail">
        <div class="m5-detail-head">
          <div class="m5-detail-main">
            <div class="m5-detail-badges">
              <span class="pt-badge pt-badge-blue">{{ selectedMessage.type }}</span>
              <span v-if="selectedMessage.important" class="pt-badge pt-badge-red">重要</span>
              <span v-if="!selectedMessage.unread" class="pt-badge pt-badge-gray">已读</span>
            </div>
            <h2 class="m5-detail-title">{{ selectedMessage.title }}</h2>
            <div class="m5-detail-meta">
              <span><PtIcon name="user" :size="12" />{{ selectedMessage.sender }}</span>
              <span><PtIcon name="clock" :size="12" />{{ selectedMessage.time }}</span>
              <span><PtIcon name="message" :size="12" />接收方式：5G消息</span>
            </div>
          </div>
          <div class="m5-detail-actions">
            <button class="pt-text-btn" type="button" @click="toggleRead">
              <PtIcon name="mail" :size="13" />
              {{ selectedMessage.unread ? '标为已读' : '标为未读' }}
            </button>
            <button class="pt-text-btn" type="button" @click="forwardMessage">
              <PtIcon name="send" :size="13" />
              转发
            </button>
            <button class="pt-text-btn" type="button" @click="deleteMessage">
              <PtIcon name="close" :size="13" />
              删除
            </button>
          </div>
        </div>

        <div class="m5-detail-scroll">
          <div class="m5-content">
            <p v-for="(paragraph, index) in selectedMessage.content" :key="index">{{ paragraph }}</p>

            <div v-if="selectedMessage.preview" class="m5-preview">
              <div class="m5-preview-cover">
                <div class="m5-preview-kicker">{{ selectedMessage.preview.kicker }}</div>
                <h4>{{ selectedMessage.preview.title }}</h4>
                <p>{{ selectedMessage.preview.lead }}</p>
              </div>
              <div class="m5-preview-body">
                <p>{{ selectedMessage.preview.body }}</p>
                <div class="m5-preview-actions">
                  <button
                    v-for="(action, index) in selectedMessage.preview.actions"
                    :key="action"
                    :class="{ 'is-solid': index === 0 }"
                    type="button"
                    @click="ElMessage.success(`正在打开：${action}`)"
                  >
                    {{ action }}
                  </button>
                </div>
              </div>
              <div class="m5-preview-foot">
                <span>中国移动通信集团江西有限公司</span>
                <span>5G消息 · 富媒体卡片</span>
              </div>
            </div>

            <div class="m5-sign">
              <template v-for="(line, index) in selectedMessage.sign.split('\n')" :key="index">
                {{ line }}<br>
              </template>
            </div>

            <div v-if="replies[selectedMessage.id]" class="m5-reply-record">
              <div class="meta">我的回复 · {{ replies[selectedMessage.id].time }}</div>
              <div>{{ replies[selectedMessage.id].text }}</div>
            </div>
          </div>
        </div>

        <div class="m5-reply">
          <el-input
            v-model="replyText"
            type="textarea"
            :rows="1"
            resize="none"
            placeholder="回复该消息（Enter 发送，Shift + Enter 换行）"
            @keydown.enter.exact.prevent="sendReply"
          />
          <button class="pt-btn pt-btn-primary" type="button" @click="sendReply">
            <PtIcon name="send" :size="14" />
            发送
          </button>
        </div>
      </section>

      <div v-else class="pt-empty" style="grid-column: 2">
        <div class="pt-empty-icon"><PtIcon name="inbox" :size="22" /></div>
        请选择左侧消息查看详情
      </div>
    </section>
  </div>
</template>
