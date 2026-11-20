<template>
  <div class="page">
    <section class="card placeholder-card">
      <div class="placeholder-icon">
        <MenuIcon :name="menu?.icon || 'layers'" />
      </div>
      <h2>{{ menu?.label || '功能模块' }}</h2>
      <p>该模块为占位页，当前版本仅复现「自助取数 / 即时取数浏览」页面。</p>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MenuIcon from '../components/MenuIcon.vue'
import { findMenu } from '../config/menus.js'

const route = useRoute()
const menu = computed(() => findMenu(route.params.key))
</script>
