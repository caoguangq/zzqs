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
        :ref="(el) => setEntryEl(el, menu.key)"
        class="menu-entry"
        @mouseenter="onEnter(menu)"
        @mouseleave="onLeave(menu)"
      >
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

        <!-- 二级/三级菜单：侧栏只有 159px，用右侧浮层避免文字被截断（同一时间只开一个） -->
        <div
          v-if="menu.children && !collapsed"
          class="menu-flyout"
          :class="{ 'is-open': isOpen(menu) }"
          :style="flyoutStyles[menu.key]"
        >
          <div
            v-for="(column, columnIndex) in flyoutColumns(menu)"
            :key="columnIndex"
            class="flyout-column"
          >
            <div v-for="child in column" :key="child.key" class="flyout-group">
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
                  :key="leaf.key || leaf.route"
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
      </div>
    </nav>

    <div class="sider-copyright">© 亚信科技 版权所有</div>
  </aside>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MenuIcon from '../components/MenuIcon.vue'
import { findMenuPathByRoute, menus } from '../config/menus.js'

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()

/** 当前展示的浮层；pinnedKey 记录点击固定的菜单 */
const openKey = ref(null)
const pinnedKey = ref(null)

/** 每个菜单浮层的定位与限高 */
const flyoutStyles = reactive({})

const entryEls = new Map()

function setEntryEl(el, key) {
  if (el) {
    entryEls.set(key, el)
  } else {
    entryEls.delete(key)
  }
}

function isOpen(menu) {
  return openKey.value === menu.key
}

function isActive(menu) {
  return activeTrail.value.includes(menu)
}

/** 把分组按列切开：业务数据管理 3 列，其余多分组 2 列，单分组 1 列 */
function flyoutColumns(menu) {
  const groups = menu.children || []
  const columnCount = menu.wide ? 3 : groups.length > 1 ? 2 : 1
  const perColumn = Math.ceil(groups.length / columnCount)
  const columns = []
  for (let index = 0; index < groups.length; index += perColumn) {
    columns.push(groups.slice(index, index + perColumn))
  }
  return columns
}

/** 当前路由命中的第一条菜单链（含 aliases），重复挂载的同一路由只高亮第一条 */
const activeTrail = ref([])
watch(
  () => route.path,
  (path) => {
    activeTrail.value = findMenuPathByRoute(path) || []
  },
  { immediate: true }
)

/**
 * 按视口计算浮层位置：默认贴着菜单项顶部；
 * 下方空间不够时整体上移，并限制最大高度，保证任何窗口高度都不被截断。
 */
function positionFlyout(key) {
  const entry = entryEls.get(key)
  const flyout = entry?.querySelector('.menu-flyout')
  if (!flyout) {
    return
  }
  const rect = entry.getBoundingClientRect()
  const margin = 12
  const viewport = window.innerHeight
  const natural = flyout.scrollHeight
  let top = 0

  const available = viewport - rect.top - margin
  if (natural > available) {
    const maxShift = Math.max(0, rect.top - margin)
    top = -Math.min(natural - available, maxShift)
  }

  const finalAvailable = viewport - (rect.top + top) - margin
  flyoutStyles[key] = {
    top: `${top}px`,
    maxHeight: `${Math.max(180, Math.min(natural, finalAvailable))}px`
  }
}

async function showFlyout(menu, pin = false) {
  openKey.value = menu.key
  if (pin) {
    pinnedKey.value = menu.key
  }
  await nextTick()
  positionFlyout(menu.key)
}

function hideFlyout() {
  openKey.value = null
  pinnedKey.value = null
}

function onEnter(menu) {
  if (!menu.children || props.collapsed) {
    return
  }
  showFlyout(menu)
}

function onLeave(menu) {
  if (!menu.children || openKey.value !== menu.key) {
    return
  }
  // 鼠标移出时回到点击固定的那个浮层（如果有）
  openKey.value = pinnedKey.value
  if (openKey.value) {
    nextTick(() => positionFlyout(openKey.value))
  }
}

function openMenu(menu) {
  if (menu.children) {
    if (pinnedKey.value === menu.key) {
      hideFlyout()
      return
    }
    showFlyout(menu, true)
    return
  }
  hideFlyout()
  if (menu.route) {
    router.push(menu.route)
    return
  }
  router.push({ name: 'placeholder', params: { key: menu.key } })
}

function closeAll(event) {
  const sider = event.target.closest?.('.sider')
  if (!sider && openKey.value) {
    hideFlyout()
  }
}

function repositionOpen() {
  if (openKey.value) {
    positionFlyout(openKey.value)
  }
}

onMounted(() => {
  document.addEventListener('click', closeAll)
  window.addEventListener('resize', repositionOpen)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeAll)
  window.removeEventListener('resize', repositionOpen)
})

watch(
  () => props.collapsed,
  (collapsed) => {
    if (collapsed) {
      hideFlyout()
    }
  }
)
</script>