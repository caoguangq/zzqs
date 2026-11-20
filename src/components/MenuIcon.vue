<script setup>
import { computed } from 'vue'
const props = defineProps({ name: { type: String, required: true } })
// Original vc-icon-* mappings from the reference project's common.css.
const glyphs = {
  home: '\ue612', globe: '\ue611', download: '\ue616',
  briefcase: '\ue614', monitor: '\ue613', layers: '\ue60f',
  clipboard: '\ue618', nut: '\ue60f', gear: '\ue60f',
  badge: '\ue613', 'chart-badge': '\ue611', shield: '\ue617'
}
const glyph = computed(() => glyphs[props.name] || '\ue617')
</script>
<template><span class="menu-icon" aria-hidden="true">{{ glyph }}</span></template>
<style scoped>
@font-face {
  font-family: 'ReferenceMenuIcons';
  src: url('/fonts/reference-menu.woff2') format('woff2');
  font-display: block;
}
.menu-icon {
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  font-family: 'ReferenceMenuIcons';
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
