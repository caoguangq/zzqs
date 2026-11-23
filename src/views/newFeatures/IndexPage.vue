<template>
  <div class="nf51-scope">
  <div class="nf-page">
    <h1 class="nf-index-title">新开发功能（编号 26-51）</h1>
    <p class="nf-index-desc">
      依据后评估材料梳理出的 26 个功能点，逐条做最小可运行实现。已实现的点可直接进入，未实现的保持灰色占位。
    </p>

    <section v-for="group in featureGroups" :key="group.key" class="nf-index-group">
      <h2 class="nf-index-group-title">
        {{ group.label }}
        <span class="nf-index-count">（{{ group.items.length }} 项）</span>
      </h2>
      <div class="nf-index-grid">
        <button
          v-for="item in group.items"
          :key="item.no"
          type="button"
          class="nf-index-item"
          :class="{ 'is-pending': !isFeatureImplemented(item.no) }"
          :disabled="!isFeatureImplemented(item.no)"
          @click="openFeature(item)"
        >
          <span class="nf-index-no">{{ item.no }}</span>
          <span class="nf-index-text">
            <span class="nf-index-name">{{ item.title }}</span>
            <span class="nf-index-sub">{{ item.note || group.label }}</span>
          </span>
          <span class="nf-tag" :class="isFeatureImplemented(item.no) ? 'nf-tag-done' : 'nf-tag-pending'">
            {{ isFeatureImplemented(item.no) ? '已实现' : '待实现' }}
          </span>
        </button>
      </div>
    </section>
  </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { featureGroups, isFeatureImplemented } from './registry.js'

const router = useRouter()

function openFeature(item) {
  if (!isFeatureImplemented(item.no)) {
    return
  }
  router.push(`/new/${item.no}`)
}
</script>