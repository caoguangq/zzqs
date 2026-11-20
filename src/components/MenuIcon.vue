<template>
  <svg
    class="menu-icon"
    viewBox="0 0 20 20"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    stroke-width="1.4"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'home'">
      <path d="M3.2 8.7 10 3.1l6.8 5.6V17h-4.5v-4.7H7.7V17H3.2z" />
    </template>
    <template v-else-if="name === 'globe'">
      <circle cx="10" cy="10" r="6.6" />
      <circle cx="10" cy="10" r="2.1" />
    </template>
    <template v-else-if="name === 'briefcase'">
      <rect x="2" y="5.8" width="16" height="11" rx="1.8" />
      <path d="M7 5.8V4.4c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6v1.4" />
      <path d="M2 9.8h16" />
    </template>
    <template v-else-if="name === 'download'">
      <path d="M10 2.6v7.6" />
      <path d="m6.8 7.2 3.2 3.2 3.2-3.2" />
      <path d="M4 12.2v2.3c0 .9.7 1.6 1.6 1.6h8.8c.9 0 1.6-.7 1.6-1.6v-2.3" stroke-width="2.4" />
    </template>
    <template v-else-if="name === 'clipboard'">
      <rect x="4" y="3.4" width="12" height="14.2" rx="2" />
      <rect x="7.2" y="2.1" width="5.6" height="2.7" rx="1" />
      <path d="M7.4 8.7h5.2M7.4 11.7h5.2M7.4 14.7h3.4" />
    </template>
    <template v-else-if="name === 'nut'">
      <path d="m10 2.4 6.1 3.5v8.2L10 17.6l-6.1-3.5V5.9z" />
      <circle cx="10" cy="10" r="2.7" />
    </template>
    <template v-else-if="name === 'monitor'">
      <rect x="2.2" y="3.6" width="15.6" height="10.6" rx="1.6" />
      <path d="M10 14.2v3.2M6.6 17.4h6.8" />
    </template>
    <template v-else-if="name === 'layers'">
      <path d="m10 2.6-6.6 3.6L10 9.8l6.6-3.6z" />
      <path d="m3.4 10 6.6 3.6 6.6-3.6" />
      <path d="m3.4 13.6 6.6 3.6 6.6-3.6" />
    </template>
    <template v-else-if="name === 'badge'">
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="2.3" />
      <path d="M10 3.4v1.5M10 15.1v1.5M3.4 10h1.5M15.1 10h1.5" />
    </template>
    <template v-else-if="name === 'gear'">
      <circle cx="10" cy="10" r="6.9" />
      <circle cx="10" cy="10" r="2.5" />
      <path d="M10 3.1v1.6M10 15.3v1.6M3.1 10h1.6M15.3 10h1.6" />
    </template>
    <template v-else-if="name === 'chart-badge'">
      <circle cx="10" cy="10" r="7" />
      <path d="M6.9 12.7V9.4M10 12.7V7.3M13.1 12.7v-2" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M10 2.6 16 5v5.1c0 3.5-2.4 6.1-6 7.3-3.6-1.2-6-3.8-6-7.3V5z" />
      <path d="m7.3 9.8 1.8 1.8 3.5-3.5" />
    </template>
  </svg>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>
