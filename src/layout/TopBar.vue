<template>
  <header class="topbar">
    <div class="topbar-left">
      <button type="button" class="collapse-btn" title="收起菜单" @click="$emit('toggle')">
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
          <path d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13" />
        </svg>
      </button>
      <div class="breadcrumb">
        <template v-for="(crumb, index) in breadcrumb" :key="crumb">
          <span class="crumb">{{ crumb }}</span>
          <span v-if="index < breadcrumb.length - 1" class="crumb-sep">/</span>
        </template>
      </div>
    </div>

    <div class="topbar-right">
      <button type="button" class="icon-btn bell-btn" title="消息">
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 2.8a4.6 4.6 0 0 0-4.6 4.6c0 4.2-1.7 5.5-1.7 5.5h12.6s-1.7-1.3-1.7-5.5A4.6 4.6 0 0 0 10 2.8z" />
          <path d="M8.4 15.7a1.8 1.8 0 0 0 3.2 0" />
        </svg>
        <span v-if="unreadCount" class="bell-badge">{{ unreadCount }}</span>
      </button>

      <span class="topbar-divider"></span>

      <div class="user-info">
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#7fa7d9" stroke-width="1.4" stroke-linecap="round">
          <circle cx="10" cy="6.6" r="3.1" />
          <path d="M4.2 16.2c.6-2.7 2.9-4.4 5.8-4.4s5.2 1.7 5.8 4.4" />
        </svg>
        <span class="welcome">欢迎您：</span>
        <a class="user-name" href="javascript:void(0)">{{ userName }}</a>
      </div>

      <span class="topbar-divider"></span>

      <button type="button" class="logout" @click="logout">
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#9aa4b4" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 2.8v7" />
          <path d="M5.9 5.4a7 7 0 1 0 8.2 0" />
        </svg>
        <span>退出</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { findMenu } from '../config/menus.js'
import { manualBreadcrumb } from '../config/breadcrumb.js'

defineEmits(['toggle'])

const route = useRoute()
const userName = ref('唐...')

const breadcrumb = computed(() => {
  if (manualBreadcrumb.value) {
    return manualBreadcrumb.value
  }
  if (route.meta.breadcrumb) {
    return route.meta.breadcrumb
  }
  const menu = findMenu(route.params.key)
  return menu ? [menu.label] : ['首页']
})

/** 35 模型异常消息提醒：截图里铃铛带 5 条未读红点 */
const unreadCount = computed(() => (String(route.params?.no || '') === '35' ? 5 : 0))

onMounted(async () => {
  try {
    const response = await fetch('/api/user')
    if (response.ok) {
      const data = await response.json()
      userName.value = data.userName || userName.value
    }
  } catch (error) {
    // 保持默认展示名，不影响页面
  }
})

function logout() {
  window.alert('演示环境，退出功能未接入')
}
</script>
