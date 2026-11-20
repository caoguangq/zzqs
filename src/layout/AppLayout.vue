<template>
  <div class="app-shell" :class="{ 'sider-collapsed': collapsed }">
    <SideNav :collapsed="collapsed" />
    <div class="app-main">
      <TopBar @toggle="collapsed = !collapsed" />
      <main class="app-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SideNav from './SideNav.vue'
import TopBar from './TopBar.vue'

const collapsed = ref(false)
</script>
