<template>
  <aside class="sider" :class="{ 'is-collapsed': collapsed }">
    <div class="sider-logo">
      <span class="logo-crop">
        <img src="/logo-menu.png" alt="Data Discovery" />
      </span>
    </div>

    <nav class="sider-menu">
      <div v-for="menu in menus" :key="menu.key" class="menu-entry">
        <button
          type="button"
          class="menu-item"
          :class="{ active: isActive(menu), 'is-open': isOpen(menu) }"
          :title="menu.label"
          @click="openMenu(menu)"
        >
          <MenuIcon :name="menu.icon" />
          <span class="menu-label">{{ menu.label }}</span>
          <svg
            v-if="menu.chevron !== false"
            class="menu-arrow"
            :class="{ rotated: isOpen(menu) }"
            viewBox="0 0 20 20"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m8 4.5 5.5 5.5L8 15.5" />
          </svg>
        </button>

        <!-- 二级/三级菜单：侧栏只有 159px，用右侧浮层避免文字被截断（悬停或点击展开） -->
        <div
          v-if="menu.children && !collapsed"
          class="menu-flyout"
          :class="{ 'is-open': isOpen(menu), 'is-wide': menu.wide }"
        >
          <div v-for="child in menu.children" :key="child.key" class="flyout-group">
            <button
              v-if="child.route"
              type="button"
              class="flyout-link"
              :class="{ active: isActive(child) }"
              @click="openMenu(child)"
            >
              {{ child.label }}
            </button>
            <span v-else class="flyout-title">{{ child.label }}</span>

            <div v-if="child.children" class="flyout-list">
              <button
                v-for="leaf in child.children"
                :key="leaf.key"
                type="button"
                class="flyout-leaf"
                :class="{ active: isActive(leaf) }"
                @click="openMenu(leaf)"
              >
                {{ leaf.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="sider-copyright">© 亚信科技 版权所有</div>
  </aside>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MenuIcon from '../components/MenuIcon.vue'
import { findMenuPathByRoute, menus } from '../config/menus.js'

defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()

/** 展开的菜单 key 集合 */
const expandedKeys = ref(new Set())

function isOpen(menu) {
  return expandedKeys.value.has(menu.key)
}

function toggleOpen(menu) {
  const next = new Set(expandedKeys.value)
  if (next.has(menu.key)) {
    next.delete(menu.key)
  } else {
    next.add(menu.key)
  }
  expandedKeys.value = next
}

/** 当前路由命中的第一条菜单链，重复挂载的同一路由只高亮第一条 */
const activeTrail = computed(() => findMenuPathByRoute(route.path) || [])

function isActive(menu) {
  if (menu.children) {
    return activeTrail.value.includes(menu)
  }
  if (!menu.route) {
    return false
  }
  if (menu.route.startsWith('/query')) {
    return route.path.startsWith('/query')
  }
  return route.path === menu.route
}

function openMenu(menu) {
  if (menu.children) {
    toggleOpen(menu)
    return
  }
  expandedKeys.value = new Set()
  if (menu.route) {
    router.push(menu.route)
    return
  }
  router.push({ name: 'placeholder', params: { key: menu.key } })
}

function closeAll(event) {
  const sider = event.target.closest?.('.sider')
  if (!sider && expandedKeys.value.size) {
    expandedKeys.value = new Set()
  }
}

onMounted(() => {
  document.addEventListener('click', closeAll)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeAll)
})
</script>