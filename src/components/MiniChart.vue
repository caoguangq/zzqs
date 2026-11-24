<script setup>
import { computed, useId } from 'vue'

/**
 * 轻量 SVG 图表：用于报告封面、仪表板缩略图和预览弹窗。
 * 纯展示组件，不引入 echarts，保持首屏体积可控。
 */
const props = defineProps({
  type: { type: String, default: 'line' },
  color: { type: String, default: '#0b81e7' },
  secondary: { type: String, default: '#22b8a7' },
  accent: { type: String, default: '#f0a12b' },
  data: { type: Array, default: () => [] }
})

const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
const W = 200
const H = 100

const fallback = {
  line: [34, 48, 40, 62, 55, 72, 64, 83, 76, 92],
  area: [34, 48, 40, 62, 55, 72, 64, 83, 76, 92],
  bar: [42, 68, 54, 86, 62, 94, 74, 58, 80, 90],
  hbar: [88, 72, 58, 44, 30],
  mix: [40, 62, 50, 78, 58, 86, 70, 92],
  quad: [50, 80, 64, 92, 58],
  donut: [45, 30, 25],
  scatter: [18, 30, 24, 44, 38, 55, 48, 66, 60, 78]
}

const series = computed(() => (props.data.length ? props.data : fallback[props.type] || fallback.line))
const maxVal = computed(() => Math.max(...series.value, 1))

const points = computed(() => {
  const values = series.value
  const innerW = W - 24
  const plotH = 68
  const stepX = values.length > 1 ? innerW / (values.length - 1) : 0
  return values.map((value, index) => ({
    x: 12 + index * stepX,
    y: 88 - (value / maxVal.value) * plotH,
    value
  }))
})

const linePath = computed(() => points.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '))
const areaPath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  return `${linePath.value} L${pts[pts.length - 1].x.toFixed(1)},88 L${pts[0].x.toFixed(1)},88 Z`
})

const bars = computed(() => {
  const values = series.value
  const innerW = W - 24
  const gap = 6
  const barW = Math.max(5, (innerW - gap * (values.length - 1)) / values.length)
  return values.map((value, index) => {
    const h = Math.max(4, (value / maxVal.value) * 66)
    return { x: 12 + index * (barW + gap), y: 88 - h, w: barW, h }
  })
})

const hbars = computed(() => {
  const values = series.value
  return values.map((value, index) => ({
    y: 14 + index * 16,
    w: Math.max(8, (value / 100) * 150),
    value
  }))
})

const quad = computed(() => {
  const cells = []
  const values = series.value
  for (let i = 0; i < 4; i++) {
    const originX = (i % 2) * 98 + 8
    const originY = Math.floor(i / 2) * 46 + 10
    const local = values.slice(i, i + 5)
    const sub = local.length ? local : values.slice(0, 5)
    const subMax = Math.max(...sub, 1)
    const barsLocal = sub.map((v, j) => {
      const h = Math.max(3, (v / subMax) * 26)
      return { x: originX + 6 + j * 8, y: originY + 30 - h, h }
    })
    cells.push({ originX, originY, bars: barsLocal })
  }
  return cells
})

const donutSegments = computed(() => {
  const values = series.value.length === 3 ? series.value : fallback.donut
  const total = values.reduce((sum, v) => sum + v, 0) || 1
  const radius = 27
  const circumference = 2 * Math.PI * radius
  const palette = [props.color, props.secondary, props.accent]
  let offset = 0
  return values.map((value, index) => {
    const length = (value / total) * circumference
    const segment = { length, circumference, offset: -offset, color: palette[index % palette.length] }
    offset += length
    return segment
  })
})

const scattered = computed(() =>
  series.value.map((value, index) => ({
    x: 18 + index * 17 + (index % 3) * 4,
    y: 86 - (value / maxVal.value) * 64 - (index % 2) * 4
  }))
)

const tableRows = computed(() => [0, 1, 2, 3])
</script>

<template>
  <svg
    class="mini-chart"
    :viewBox="`0 0 ${W} ${H}`"
    :preserveAspectRatio="type === 'donut' ? 'xMidYMid meet' : 'none'"
    role="img"
    aria-hidden="true"
  >
    <defs>
      <linearGradient :id="`mc-area-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.26" />
        <stop offset="100%" :stop-color="color" stop-opacity="0.02" />
      </linearGradient>
      <linearGradient :id="`mc-bar-${uid}`" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" :stop-color="color" stop-opacity="0.95" />
        <stop offset="100%" :stop-color="color" stop-opacity="0.45" />
      </linearGradient>
    </defs>

    <template v-if="type === 'line' || type === 'area'">
      <g stroke="#e9eef5" stroke-width="1" stroke-dasharray="3 4">
        <line x1="12" y1="24" x2="188" y2="24" />
        <line x1="12" y1="50" x2="188" y2="50" />
        <line x1="12" y1="76" x2="188" y2="76" />
      </g>
      <path v-if="type === 'area'" :d="areaPath" :fill="`url(#mc-area-${uid})`" />
      <path :d="linePath" fill="none" :stroke="color" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round" />
      <circle v-if="points.length" :cx="points[points.length - 1].x" :cy="points[points.length - 1].y" r="3" :fill="color" stroke="#fff" stroke-width="1.5" />
    </template>

    <template v-else-if="type === 'bar' || type === 'mix'">
      <g stroke="#eef2f7" stroke-width="1">
        <line x1="10" y1="88" x2="190" y2="88" />
      </g>
      <rect
        v-for="(bar, index) in bars"
        :key="index"
        :x="bar.x"
        :y="bar.y"
        :width="bar.w"
        :height="bar.h"
        rx="2"
        :fill="type === 'mix' && index % 3 === 0 ? secondary : `url(#mc-bar-${uid})`"
      />
      <path v-if="type === 'mix'" :d="linePath" fill="none" :stroke="accent" stroke-width="1.6" vector-effect="non-scaling-stroke" stroke-linecap="round" />
    </template>

    <template v-else-if="type === 'hbar'">
      <g v-for="(bar, index) in hbars" :key="index">
        <rect :x="12" :y="bar.y" :width="176" height="7" rx="3.5" fill="#f0f3f8" />
        <rect :x="12" :y="bar.y" :width="bar.w" height="7" rx="3.5" :fill="index === 0 ? color : index === 1 ? secondary : color" :opacity="index === 0 ? 1 : 0.82 - index * 0.12" />
      </g>
    </template>

    <template v-else-if="type === 'quad'">
      <g v-for="(cell, index) in quad" :key="index">
        <rect :x="cell.originX" :y="cell.originY" width="90" height="38" rx="3" fill="#fff" stroke="#eef2f7" />
        <rect
          v-for="(bar, bi) in cell.bars"
          :key="bi"
          :x="bar.x"
          :y="bar.y"
          width="4"
          :height="bar.h"
          rx="1"
          :fill="index % 2 === 0 ? color : secondary"
          :opacity="0.35 + bi * 0.13"
        />
      </g>
    </template>

    <template v-else-if="type === 'donut'">
      <circle cx="100" cy="50" r="27" fill="none" stroke="#f0f3f8" stroke-width="15" />
      <circle
        v-for="(seg, index) in donutSegments"
        :key="index"
        cx="100"
        cy="50"
        r="27"
        fill="none"
        :stroke="seg.color"
        stroke-width="15"
        :stroke-dasharray="`${Math.max(0, seg.length - 2)} ${seg.circumference}`"
        :stroke-dashoffset="seg.offset"
        transform="rotate(-90 100 50)"
        stroke-linecap="butt"
      />
      <text x="100" y="47" text-anchor="middle" font-size="12" font-weight="600" fill="#3d4552">{{ Math.round(series[0] || 0) }}%</text>
      <text x="100" y="60" text-anchor="middle" font-size="7" fill="#a0a7b3">占比</text>
    </template>

    <template v-else-if="type === 'scatter'">
      <g stroke="#eef2f7" stroke-width="1">
        <line x1="10" y1="86" x2="190" y2="86" />
        <line x1="10" y1="20" x2="10" y2="86" />
      </g>
      <path d="M16 78 184 22" stroke="#d7e6f7" stroke-width="1.5" stroke-dasharray="4 4" />
      <circle v-for="(dot, index) in scattered" :key="index" :cx="dot.x" :cy="dot.y" r="4" :fill="index % 3 === 0 ? secondary : color" opacity="0.65" />
    </template>

    <template v-else-if="type === 'table'">
      <rect x="12" y="14" width="176" height="72" rx="3" fill="#fff" stroke="#eef2f7" />
      <rect x="12" y="14" width="176" height="14" rx="3" fill="#f1f6fd" />
      <line x1="76" y1="28" x2="76" y2="86" stroke="#eef2f7" />
      <line x1="128" y1="28" x2="128" y2="86" stroke="#eef2f7" />
      <line v-for="row in tableRows" :key="row" x1="12" :y1="42 + row * 10.5" x2="188" :y2="42 + row * 10.5" stroke="#f2f5f9" />
      <rect x="18" y="32" width="30" height="4" rx="2" :fill="color" opacity="0.6" />
      <rect x="84" y="32" width="26" height="4" rx="2" fill="#c6d0dc" />
      <rect x="136" y="32" width="26" height="4" rx="2" fill="#c6d0dc" />
      <rect
        v-for="(row, index) in tableRows"
        :key="`c-${index}`"
        x="18"
        :y="37 + row * 10.5"
        :width="36 - (index % 2) * 6"
        height="3.5"
        rx="1.75"
        :fill="index % 2 === 0 ? '#bcd6ef' : '#e1e7ef'"
      />
    </template>
  </svg>
</template>
