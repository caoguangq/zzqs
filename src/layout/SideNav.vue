<template>
  <aside class="sider" :class="{ 'is-collapsed': collapsed }">
    <div class="sider-logo">
      <span class="logo-crop">
        <img src="/logo-menu.png" alt="Data Discovery" />
      </span>
    </div>

    <nav class="sider-menu">
      <div
        v-for="menu in menus"
        :key="menu.key"
        class="menu-entry"
        @mouseenter="handleMenuEnter(menu)"
        @mouseleave="handleMenuLeave(menu)"
      >
        <button
          type="button"
          class="menu-item"
          :class="{ active: isActive(menu), 'is-open': isOpen(menu) }"
          :title="menu.label"
          :aria-expanded="menu.children ? isOpen(menu) : undefined"
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

        <!-- 二级/三级菜单：侧栏只有 159px，用右侧浮层避免文字被截断（悬停或点击展开，同一时间只开一个） -->
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
              @click="openMenu(child, menu)"
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
                :aria-current="isActive(leaf) ? 'page' : undefined"
                @click="openMenu(leaf, menu)"
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

/** 当前显示的浮层 key；同一时间只允许一个浮层，避免多个菜单的浮层叠在一起 */
const openKey = ref(null)
/** 通过点击固定展开的菜单 key；仅悬停展开时为空 */
const pinnedKey = ref(null)
/** 刚点击收起的菜单；本次停留期间不再被悬停重新展开，鼠标移出后解除 */
const suppressedKey = ref(null)

function isOpen(menu) {
  return openKey.value === menu.key
}

/** 悬停到顶部菜单：同一时间只保留一个浮层；刚点击收起的那一项等鼠标移出后再响应 */
function handleMenuEnter(menu) {
  if (suppressedKey.value === menu.key) return
  if (openKey.value !== menu.key) {
    openKey.value = menu.key
    pinnedKey.value = null
  }
}

function handleMenuLeave(menu) {
  if (suppressedKey.value === menu.key) {
    suppressedKey.value = null
  }
  if (pinnedKey.value === menu.key) return
  if (openKey.value === menu.key) {
    openKey.value = null
  }
}

/** 点击顶部菜单：第一次固定展开，再次点击立即收起 */
function toggleOpen(menu) {
  if (openKey.value === menu.key && pinnedKey.value === menu.key) {
    openKey.value = null
    pinnedKey.value = null
    suppressedKey.value = menu.key
    return
  }
  openKey.value = menu.key
  pinnedKey.value = menu.key
  suppressedKey.value = null
}

function closeFlyout(menu) {
  openKey.value = null
  pinnedKey.value = null
  suppressedKey.value = menu?.key ?? null
}

/**
 * 当前路由命中的第一条菜单链。
 * 使用 registry 的精确匹配 + aliases，避免 /new/2 前缀误命中 /new/21、/new/22；
 * 重复挂载的同一路由（如 41 的设置列表/规则配置）只高亮第一条。
 */
const activeTrail = computed(() => findMenuPathByRoute(route.path) || [])

function isActive(menu) {
  if (route.name === 'placeholder' && route.params.key === menu.key) {
    return true
  }
  return activeTrail.value.includes(menu)
}

function openMenu(menu, parent) {
  if (menu.children) {
    toggleOpen(menu)
    return
  }
  closeFlyout(parent)
  if (menu.route) {
    if (route.path !== menu.route) {
      router.push(menu.route)
    }
    return
  }
  router.push({ name: 'placeholder', params: { key: menu.key } })
}

function closeAll(event) {
  const sider = event.target.closest?.('.sider')
  if (!sider && openKey.value) {
    openKey.value = null
    pinnedKey.value = null
    suppressedKey.value = null
  }
}

/** 路由变化（含浏览器前进/后退）时收起浮层，避免浮层停在旧菜单上 */
watch(
  () => route.fullPath,
  () => {
    openKey.value = null
    pinnedKey.value = null
    suppressedKey.value = null
  }
)

onMounted(() => {
  document.addEventListener('click', closeAll)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeAll)
})
</script>
