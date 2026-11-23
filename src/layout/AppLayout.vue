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

/** 26-51 新开发功能（及功能索引）在参考图里是白底内容区，与 1-25 的浅灰底不同 */
const isPlainPage = computed(() => {
  if (route.name === 'new-feature-index') return true
  if (route.name !== 'new-feature') return false
  const no = Number(route.params.no)
  return no >= 26 && no <= 51
})
</script>