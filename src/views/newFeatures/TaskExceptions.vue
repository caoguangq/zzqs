<template>
  <div class="nf-feature-1"><InstantQuery ref="query" local-mode :initial-tasks="initialTasks" :default-run-state="defaultRunState" :edit-enabled="editEnabled" :title="title" @edit-task="row => emit('edit-task', row)" /></div>
</template>
<script setup>
import InstantQuery from '../InstantQuery.vue'
import { ref } from 'vue'
defineProps({ initialTasks: Array, defaultRunState: { type: String, default: '失败' }, editEnabled: Boolean, title: { type: String, default: '即时取数浏览' } })
const emit = defineEmits(['edit-task'])
const query = ref(null)
defineExpose({ updateTask: (id, changes) => query.value.updateTask(id, changes) })
</script>
<style scoped>
.nf-feature-1 :deep(.action-title) { font-size: 14px; font-weight: 400; }
.nf-feature-1 :deep(.action-card) { padding: 13px 21px 32px; }
.nf-feature-1 :deep(.data-table th) { height: 49px; }
.nf-feature-1 :deep(.cell-ops) { text-align: left; padding-left: 7px; padding-right: 2px; }
.nf-feature-1 :deep(.data-table td) { color: #7c8794; }
.nf-feature-1 :deep(.data-table .cell-run-fail) { color: #f5222d; }

.nf-feature-1 :deep(.filter-grid) { grid-template-columns: repeat(4, 307px) minmax(0, 1fr); column-gap: 73px; }
.nf-feature-1 :deep(.el-date-editor.el-input) { width: 100%; }
.nf-feature-1 :deep(.field .el-input__wrapper),
.nf-feature-1 :deep(.field .el-select__wrapper) { height: 36px; min-height: 36px; }
.nf-feature-1 :deep(.action-card) { margin-top: 25px; }
.nf-feature-1 :deep(.table-card) { margin-top: 46px; }
@media (max-width: 1700px) {
  .nf-feature-1 :deep(.filter-grid) { grid-template-columns: repeat(4, minmax(0, 1fr)); column-gap: 40px; }
  .nf-feature-1 :deep(.field-purpose) { grid-column: 1; grid-row: 2; }
  .nf-feature-1 :deep(.field-actions) { grid-column: 4; grid-row: 2; }
}
@media (max-width: 1000px) {
  .nf-feature-1 :deep(.filter-grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .nf-feature-1 :deep(.field-purpose) { grid-row: 3; }
  .nf-feature-1 :deep(.field-actions) { grid-column: 2; grid-row: 3; }
}
.nf-feature-1 :deep(.data-table) { min-width: 0; }
.nf-feature-1 :deep(.field-actions) { transform: translateY(-14px); }
.nf-feature-1 :deep(.date-field .el-input__prefix) { order: 2; margin-left: 8px; margin-right: 0; }


.nf-feature-1 :deep(.data-table tr:hover .cell-ops) { background:#f8fbff; }

.nf-feature-1 :deep(.data-table td) {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
}
.nf-feature-1 :deep(.data-table .cell-ops) { white-space: normal; line-height: 24px; padding: 5px 8px; }
.nf-feature-1 :deep(.cell-ops .op-link) { display: inline-block; white-space: nowrap; }
.nf-feature-1 :deep(.cell-ops .op-sep) { margin: 0 3px; }
@media (max-width: 1000px) { .nf-feature-1 :deep(.data-table) { min-width: 1000px; } }
</style>
