<script setup>
/**
 * 门户页面通用线性图标（我的首页 / 数据可视化 / 公告 / 手写SQL / 5G消息）。
 * 统一 24×24 视图，颜色继承 currentColor，避免为每个页面重复内联 SVG。
 */
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 },
  strokeWidth: { type: [Number, String], default: 1.8 }
})
</script>

<template>
  <svg
    class="pt-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'search'">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4.5 4.5" />
    </template>
    <template v-else-if="name === 'eye'">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </template>
    <template v-else-if="name === 'star'">
      <path d="m12 3 2.9 6 6.4.8-4.7 4.6 1.2 6.4L12 17.6 6.2 20.8l1.2-6.4L2.7 9.8 9.1 9z" />
    </template>
    <template v-else-if="name === 'star-fill'">
      <path d="m12 3 2.9 6 6.4.8-4.7 4.6 1.2 6.4L12 17.6 6.2 20.8l1.2-6.4L2.7 9.8 9.1 9z" fill="currentColor" />
    </template>
    <template v-else-if="name === 'chevron-left'"><path d="M15 5 8 12l7 7" /></template>
    <template v-else-if="name === 'chevron-right'"><path d="m9 5 7 7-7 7" /></template>
    <template v-else-if="name === 'chevron-down'"><path d="m5 9 7 7 7-7" /></template>
    <template v-else-if="name === 'grid'">
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.4" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.4" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.4" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.4" />
    </template>
    <template v-else-if="name === 'chart-bar'">
      <path d="M3 20h18" />
      <path d="M6 20v-6M11 20V7M16 20v-4M21 20V10" />
    </template>
    <template v-else-if="name === 'chart-line'">
      <path d="M3 20h18" />
      <path d="m4 16 4.5-5 4 3 7-8" />
      <circle cx="8.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="14" r="1" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'pie'">
      <path d="M21 12a9 9 0 1 1-9-9v9z" />
      <path d="M12 3a9 9 0 0 1 9 9h-9z" />
    </template>
    <template v-else-if="name === 'database'">
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
      <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </template>
    <template v-else-if="name === 'table'">
      <rect x="3" y="5" width="18" height="15" rx="2" />
      <path d="M3 10h18M9.5 10v10" />
    </template>
    <template v-else-if="name === 'doc'">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </template>
    <template v-else-if="name === 'message'">
      <path d="M4 5h16v11H8l-4 4z" />
      <path d="M8 9h8M8 12.5h5" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </template>
    <template v-else-if="name === 'gear'">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2 7.3 7.3M16.7 16.7l2.1 2.1M18.8 5.2 16.7 7.3M7.3 16.7l-2.1 2.1" />
    </template>
    <template v-else-if="name === 'bell'">
      <path d="M18 8.5a6 6 0 0 0-12 0c0 7-3 8.5-3 8.5h18s-3-1.5-3-8.5" />
      <path d="M10 21h4" />
    </template>
    <template v-else-if="name === 'download'">
      <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
    </template>
    <template v-else-if="name === 'upload'">
      <path d="M12 21V9M7 14l5-5 5 5M4 3h16" />
    </template>
    <template v-else-if="name === 'plus'"><path d="M12 5v14M5 12h14" /></template>
    <template v-else-if="name === 'play'"><path d="M7 4.5 20 12 7 19.5z" /></template>
    <template v-else-if="name === 'save'">
      <path d="M5 3h11l3 3v15H5z" />
      <path d="M8 3v6h8V3M8 14h8v7H8z" />
    </template>
    <template v-else-if="name === 'wand'">
      <path d="M3 21 14 10" />
      <path d="m16.5 2 .9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9zM20 14l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" />
    </template>
    <template v-else-if="name === 'help'">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.2a2.5 2.5 0 1 1 3.6 2.3c-.7.4-1.2 1-1.2 1.8M12 17h.01" />
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.4 2" />
    </template>
    <template v-else-if="name === 'check'"><path d="m5 12 4.5 4.5L19 7" /></template>
    <template v-else-if="name === 'close'"><path d="M6 6l12 12M18 6 6 18" /></template>
    <template v-else-if="name === 'filter'"><path d="M3 5h18l-7 8v6l-4 2v-8z" /></template>
    <template v-else-if="name === 'refresh'">
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 3.5v5h-5" />
    </template>
    <template v-else-if="name === 'more'">
      <circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'send'">
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </template>
    <template v-else-if="name === 'link'">
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </template>
    <template v-else-if="name === 'user'">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M12 3l8 3v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6z" />
      <path d="m8.5 12 2.4 2.4 4.6-4.8" />
    </template>
    <template v-else-if="name === 'folder'">
      <path d="M3 6h6l2 2h10v11H3z" />
    </template>
    <template v-else-if="name === 'code'">
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
    </template>
    <template v-else-if="name === 'lightning'"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></template>
    <template v-else-if="name === 'calendar'">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </template>
    <template v-else-if="name === 'arrow-right'"><path d="M4 12h16M14 6l6 6-6 6" /></template>
    <template v-else-if="name === 'layers'">
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </template>
    <template v-else-if="name === 'copy'">
      <rect x="9" y="9" width="11" height="11" rx="1.5" />
      <path d="M5 15V4h11" />
    </template>
    <template v-else-if="name === 'external'">
      <path d="M14 4h6v6M20 4 10 14" />
      <path d="M18 14v6H4V6h6" />
    </template>
    <template v-else-if="name === 'warning'">
      <path d="M12 3 22 21H2z" />
      <path d="M12 9v5M12 17h.01" />
    </template>
    <template v-else-if="name === 'inbox'">
      <path d="M4 4h16v16H4z" />
      <path d="M4 14h4l2 3h4l2-3h4" />
    </template>
    <template v-else>
      <circle cx="12" cy="12" r="8" />
    </template>
  </svg>
</template>

<style scoped>
.pt-icon {
  display: inline-block;
  flex: none;
  vertical-align: middle;
}
</style>
