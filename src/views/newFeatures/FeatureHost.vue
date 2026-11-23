<template>
  <div v-if="view && isNewBatch" class="nf51-scope">
    <component :is="view" :key="route.params.no" />
  </div>
  <component :is="view" v-else-if="view" :key="route.params.no" />
  <div v-else-if="isNewBatch" class="nf51-scope">
    <div class="nf-page">
      <section class="nf-card nf-pending-card">
        <h1>{{ feature ? feature.title : '功能点不存在' }}</h1>
        <p v-if="feature">
          编号 {{ feature.no }}「{{ feature.title }}」还没有实现，先到
          <router-link class="nf-link" to="/new">新开发功能索引</router-link>
          看看已经做好的部分。
        </p>
        <p v-else>请检查地址中的编号，范围是 26-51。</p>
      </section>
    </div>
  </div>
  <el-empty v-else description="该编号尚未实现或不存在" />
</template>

<script setup>
import { computed, defineAsyncComponent, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findFeature, loadFeatureView } from './registry.js'
import { resetPageBreadcrumb } from '../../config/pageBreadcrumb.js'

const route = useRoute()

const no = computed(() => Number(route.params.no))
/** 26-51 使用新开发功能的独立样式作用域，避免影响已验收的 1-25 页面 */
const isNewBatch = computed(() => no.value >= 26 && no.value <= 51)
const feature = computed(() => findFeature(no.value))

const view = computed(() => {
  const loader = loadFeatureView(no.value)
  return loader ? defineAsyncComponent(loader) : null
})

// 切换编号时清掉页面内临时面包屑；26-51 的默认面包屑由路由守卫按 registry 写入
watch(() => route.params.no, () => resetPageBreadcrumb(), { immediate: true })
</script>
