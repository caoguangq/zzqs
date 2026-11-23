<template>
  <aside class="sider" :class="{ 'is-collapsed': collapsed }">
    <div class="sider-logo">
      <span class="logo-crop">
        <img src="/logo-menu.png" alt="Data Discovery" />
      </span>
    </div>

    <nav class="sider-menu">
      <template v-for="menu in menus" :key="menu.key">
      <button
        type="button"
        class="menu-item"
        :class="{ active: isActive(menu) }"
        :title="menu.label"
        :aria-expanded="menu.children ? expanded === menu.key : undefined"
        @click="openMenu(menu)"
      >
        <MenuIcon :name="menu.icon" />
        <span class="menu-label">{{ menu.label }}</span>
        <svg v-if="menu.chevron !== false" class="menu-arrow" :class="{ expanded: menu.children && expanded === menu.key }" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m8 4.5 5.5 5.5L8 15.5" />
        </svg>
      </button>
      <div v-if="menu.children && expanded === menu.key && !collapsed" class="query-submenu">
        <div v-for="group in menu.children" :key="group.key">
          <button class="task-group" :class="{ selected: group.children.some(child => isLeafActive(child)) }" :aria-expanded="tasksExpanded === group.key" @click="tasksExpanded = tasksExpanded === group.key ? null : group.key">
            <span>{{ group.label }}</span><span class="group-arrow" :class="{ expanded: tasksExpanded === group.key }">›</span>
          </button>
          <div v-if="tasksExpanded === group.key" class="task-pages">
            <button v-for="child in group.children" :key="child.route" :class="{ selected: isLeafActive(child) }" :aria-current="isLeafActive(child) ? 'page' : undefined" @click="router.push(child.route)">{{ child.label }}</button>
          </div>
        </div>
      </div>
      </template>
    </nav>

    <div class="sider-copyright">© 亚信科技 版权所有</div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MenuIcon from '../components/MenuIcon.vue'
import { menus } from '../config/menus.js'

defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const expanded = ref(null)
const tasksExpanded = ref(null)
const route = useRoute()
const router = useRouter()

watch(() => route.path, (path) => {
  for (const menu of menus) {
    const group = menu.children?.find(group => group.children.some(child => isLeafActive(child)))
    if (group) { expanded.value = menu.key; tasksExpanded.value = group.key; return }
  }
}, { immediate: true })

function isLeafActive(child) {
  return child.route === route.path || (child.aliases || []).includes(route.path)
}

function isActive(menu) {
  if (menu.route) {
    return menu.children
      ? menu.children.some(group => group.children.some(child => isLeafActive(child)))
      : route.path === menu.route
  }
  return route.name === 'placeholder' && route.params.key === menu.key
}

function openMenu(menu) {
  if (menu.children) { expanded.value = expanded.value === menu.key ? null : menu.key; return }
  if (menu.route) {
    router.push(menu.route)
    return
  }
  router.push({ name: 'placeholder', params: { key: menu.key } })
}
</script>

<style scoped>
.sider-menu { min-height: 0; overflow-y: auto; flex-shrink: 1; }
.sider-menu > .menu-item, .sider-menu .query-submenu { flex: none; }
.sider-copyright { flex-shrink: 0; padding-top: 16px; }
.menu-arrow, .group-arrow { transition: transform 0.15s ease; }
.menu-arrow.expanded, .group-arrow.expanded { transform: rotate(90deg); }
.query-submenu { background: #1f232e; padding: 4px 0; }
.query-submenu button {
  display: block;
  width: 100%;
  padding: 10px 10px 10px 36px;
  text-align: left;
  border: 0;
  background: none;
  color: #c3c8d2;
  cursor: pointer;
  font-size: 12px;
}
.query-submenu button:hover { background: #262e3d; }
.query-submenu .task-group { display: flex; justify-content: space-between; align-items: center; }
.group-arrow { font-size: 18px; line-height: 16px; }
.task-pages button { padding-left: 44px; line-height: 20px; }
.task-pages button.selected { color: #409eff; background: #182535; border-right: 3px solid #2b87ff; }
</style>
