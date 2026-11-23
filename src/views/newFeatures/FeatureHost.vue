<template>
  <component :is="view" v-if="view" :key="route.params.no" />

  <div v-else class="nf-page">
    <section class="nf-card nf-pending-card">
      <h1>{{ feature ? feature.title : '功能点不存在' }}</h1>
      <p v-if="feature">
        编号 {{ feature.no }}「{{ feature.title }}」还没有实现，先到
        <router-link class="nf-link" to="/new">新开发功能索引</router-link>
        看看已经做好的部分。
      </p>
      <p v-else>请检查地址中的编号，范围是 1-51。</p>
    </section>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findFeature, loadFeatureView } from './registry.js'
import { manualBreadcrumb } from '../../config/breadcrumb.js'
import { resetPageBreadcrumb } from '../../config/pageBreadcrumb.js'

const route = useRoute()

// 切换编号时清掉上一个页面临时覆盖的面包屑，避免顶栏显示残留内容
watch(
  () => route.params.no,
  () => {
    resetPageBreadcrumb()
    manualBreadcrumb.value = null
  },
  { immediate: true }
)

const feature = computed(() => findFeature(route.params.no))

const view = computed(() => {
  const loader = loadFeatureView(route.params.no)
  return loader ? defineAsyncComponent(loader) : null
})
</script>