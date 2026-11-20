<template>
  <aside class="sider" :class="{ 'is-collapsed': collapsed }">
    <div class="sider-logo">
      <span class="logo-crop">
        <img src="/logo-menu.png" alt="Data Discovery" />
      </span>
    </div>

    <nav class="sider-menu">
      <button
        v-for="menu in menus"
        :key="menu.key"
        type="button"
        class="menu-item"
        :class="{ active: isActive(menu) }"
        :title="menu.label"
        @click="openMenu(menu)"
      >
        <MenuIcon :name="menu.icon" />
        <span class="menu-label">{{ menu.label }}</span>
        <svg v-if="menu.chevron !== false" class="menu-arrow" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m8 4.5 5.5 5.5L8 15.5" />
        </svg>
      </button>
    </nav>

    <div class="sider-copyright">© 亚信科技 版权所有</div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import MenuIcon from '../components/MenuIcon.vue'
import { menus } from '../config/menus.js'

defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()

function isActive(menu) {
  if (menu.route) {
    return route.path.startsWith('/query')
  }
  return route.name === 'placeholder' && route.params.key === menu.key
}

function openMenu(menu) {
  if (menu.route) {
    router.push(menu.route)
    return
  }
  router.push({ name: 'placeholder', params: { key: menu.key } })
}
</script>
