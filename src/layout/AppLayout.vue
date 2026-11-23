<template>
  <div class="app-shell" :class="{ 'sider-collapsed': collapsed }">
    <SideNav :collapsed="collapsed" />
    <div class="app-main">
      <TopBar @toggle="collapsed = !collapsed" />
      <main class="app-content" :class="{ 'app-content-plain': isPlainPage }">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import SideNav from './SideNav.vue'
import TopBar from './TopBar.vue'

const collapsed = ref(false)
const route = useRoute()

/** 新开发功能页面（编号 26-51）在参考图里是白底内容区，与「即时取数浏览」的浅灰底不同 */
const isPlainPage = computed(() => String(route.name || '').startsWith('new-feature'))
</script>