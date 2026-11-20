<script setup>
import { computed, defineAsyncComponent, watch } from 'vue'
import { useRoute } from 'vue-router'
import { featureViews, featureBreadcrumbs } from './registry.js'
const route = useRoute()
watch(() => route.params.no, (no) => {
  route.meta.breadcrumb = featureBreadcrumbs[no] || ['功能未实现']
}, { immediate: true })
const view = computed(() => featureViews[route.params.no] ? defineAsyncComponent(featureViews[route.params.no]) : null)
</script>
<template>
  <component :is="view" v-if="view" :key="route.params.no" />
  <el-empty v-else description="该编号尚未实现或不存在" />
</template>
