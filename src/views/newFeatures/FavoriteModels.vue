<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { favoriteModels } from '../../data/favoriteModels.js'

const tab = ref('favorite')
const keyword = ref('')
const activeIndex = ref(0)
const instantTasks = ref([])
const scheduledTasks = ref([])

const visibleFavorites = computed(() => {
  const word = keyword.value.trim()
  return word ? favoriteModels.filter((model) => model.name.includes(word)) : favoriteModels
})
const activeModel = computed(() => visibleFavorites.value[activeIndex.value] || visibleFavorites.value[0] || null)

function switchTab(value) {
  tab.value = value
  activeIndex.value = 0
}
function unstar(model) {
  const index = favoriteModels.findIndex((item) => item.id === model.id)
  if (index >= 0) favoriteModels.splice(index, 1)
  activeIndex.value = 0
  ElMessage.success('已取消收藏')
}
function selectTemplate(model) {
  ElMessage.success(`已选择模板：${model.name}`)
}
function addTask(model) {
  instantTasks.value.push({
    id: 'TASK' + Date.now(),
    name: model.name,
    status: '待运行',
    time: '2026-11-23 10:00:00',
    creator: '唐雯丽'
  })
  ElMessage.success('添加成功')
}
</script>

<template>
  <div class="nf-feature-21">
    <div class="nf-fav-top">
      <div class="nf-fav-tabs" role="tablist" aria-label="模型视图">
        <button :class="{ active: tab === 'search' }" role="tab" :aria-selected="tab === 'search'" @click="switchTab('search')">我的搜索模型</button>
        <button :class="{ active: tab === 'favorite' }" role="tab" :aria-selected="tab === 'favorite'" @click="switchTab('favorite')">我的收藏模型</button>
      </div>
      <div class="nf-fav-search">
        <span>模型名称：</span>
        <input v-model="keyword" aria-label="模型名称" placeholder="输入关键词..." />
        <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6" /><path d="m13 13 4.2 4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
      </div>
    </div>

    <div class="nf-fav-body">
      <aside class="nf-fav-list" :aria-label="tab === 'favorite' ? '我的收藏模型' : '我的搜索模型'">
        <template v-if="tab === 'favorite'">
          <article
            v-for="(model, index) in visibleFavorites"
            :key="model.id"
            :class="{ active: index === activeIndex }"
            @click="activeIndex = index"
          >
            <div class="nf-card-head">
              <span class="nf-cube" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9h10M7 12h10M7 15h6" /></svg></span>
              <h3 :title="model.name">{{ model.name }}</h3>
              <button type="button" class="nf-star" aria-label="取消收藏" title="取消收藏" @click.stop="unstar(model)">★</button>
            </div>
            <p class="nf-meta"><span>路径</span>{{ model.path }}</p>
            <p class="nf-meta"><span>指标</span>{{ model.indicators }}</p>
            <p class="nf-meta"><span>描述</span>{{ model.description }}</p>
            <div class="nf-card-actions">
              <button type="button" @click.stop="selectTemplate(model)">选择模板</button>
              <button type="button" @click.stop="addTask(model)">添加新任务</button>
            </div>
            <span v-if="index === activeIndex" class="nf-pointer" aria-hidden="true" />
          </article>
          <p v-if="!visibleFavorites.length" class="nf-list-empty">暂无收藏模型</p>
        </template>
        <p v-else class="nf-list-empty">暂无搜索模型</p>
      </aside>

      <section class="nf-task-panel">
        <div class="nf-task-section">
          <header class="nf-task-head">
            <svg class="nf-clock instant" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" /><circle cx="12" cy="12" r="7" fill="#fff" /><path d="M12 8v4.6l3 1.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg>
            <h2>即时任务</h2>
          </header>
          <table class="nf-task-table">
            <colgroup><col style="width:20%" /><col style="width:20%" /><col style="width:20%" /><col style="width:20%" /><col style="width:20%" /></colgroup>
            <thead><tr><th>任务名称</th><th>运行状态</th><th>提交时间</th><th>创建人</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="task in instantTasks" :key="task.id"><td>{{ task.name }}</td><td>{{ task.status }}</td><td>{{ task.time }}</td><td>{{ task.creator }}</td><td><button class="nf-op" type="button" @click="ElMessage.success('已打开任务：' + task.name)">查看</button></td></tr>
            </tbody>
          </table>
          <p v-if="!instantTasks.length" class="nf-no-data">没有符合条件的结果数据！</p>
          <div class="nf-task-footer">
            <span>共 {{ instantTasks.length }} 条记录</span>
            <nav aria-label="即时任务分页">
              <button type="button" disabled>上一页</button>
              <button type="button" disabled>下一页</button>
              <span class="nf-goto">至第</span><input aria-label="即时任务页码" value="1" /><span>页</span><button type="button" class="nf-confirm" @click="ElMessage.info('当前仅一页')">确定</button>
            </nav>
          </div>
        </div>

        <div class="nf-task-section">
          <header class="nf-task-head">
            <svg class="nf-clock scheduled" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="currentColor" /><circle cx="12" cy="12" r="7" fill="#fff" /><path d="M12 8v4.6l3 1.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg>
            <h2>定时任务</h2>
          </header>
          <table class="nf-task-table">
            <colgroup><col style="width:20%" /><col style="width:20%" /><col style="width:20%" /><col style="width:20%" /><col style="width:20%" /></colgroup>
            <thead><tr><th>任务名称</th><th>运行状态</th><th>下次调度时间</th><th>创建人</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="task in scheduledTasks" :key="task.id"><td>{{ task.name }}</td><td>{{ task.status }}</td><td>{{ task.time }}</td><td>{{ task.creator }}</td><td><button class="nf-op" type="button" @click="ElMessage.success('已打开任务：' + task.name)">查看</button></td></tr>
            </tbody>
          </table>
          <p v-if="!scheduledTasks.length" class="nf-no-data">没有符合条件的结果数据！</p>
          <div class="nf-task-footer">
            <span>共 {{ scheduledTasks.length }} 条记录</span>
            <nav aria-label="定时任务分页">
              <button type="button" disabled>上一页</button>
              <button type="button" disabled>下一页</button>
              <span class="nf-goto">至第</span><input aria-label="定时任务页码" value="1" /><span>页</span><button type="button" class="nf-confirm" @click="ElMessage.info('当前仅一页')">确定</button>
            </nav>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.nf-feature-21 { margin: 0 -20px 0 0; color: #333; font-size: 12px; min-height: 760px; }
.nf-fav-top { display: flex; align-items: flex-end; justify-content: space-between; height: 44px; margin-top: -8px; }
.nf-fav-tabs { display: flex; align-items: flex-end; align-self: flex-start; gap: 136px; padding-left: 10px; height: 37px; }
.nf-fav-tabs button { position: relative; border: 0; background: none; padding: 0 4px 8px; color: #606266; font-size: 14px; cursor: pointer; }
.nf-fav-tabs button.active { color: #333; font-weight: 600; }
.nf-fav-tabs button.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px; background: #2b87ff; }
.nf-fav-search { display: flex; align-items: center; gap: 8px; padding-bottom: 7px; margin-right: 192px; color: #606266; }
.nf-fav-search input { width: 246px; height: 36px; border: 1px solid #dfe5ee; border-radius: 18px; padding: 0 36px 0 14px; font: inherit; color: #333; outline: none; }
.nf-fav-search input::placeholder { color: #b6bec9; }
.nf-fav-search svg { width: 18px; height: 18px; margin-left: -34px; color: #8a97a8; }
.nf-fav-body { display: flex; align-items: flex-start; padding-top: 19px; }
.nf-fav-list { width: 274px; flex: none; display: flex; flex-direction: column; gap: 7px; }
.nf-fav-list article { position: relative; display: flex; flex-direction: column; background: #fff; border: 1px solid #e7ebf2; padding: 13px 13px 0; cursor: pointer; }
.nf-fav-list article.active { border: 2px solid #2b87ff; padding: 12px 12px 0; background: #fdfefe; }
.nf-card-head { display: flex; align-items: center; gap: 8px; min-width: 0; }
.nf-cube { flex: none; width: 22px; height: 22px; border-radius: 3px; background: #409eff; color: #fff; display: flex; align-items: center; justify-content: center; }
.nf-fav-list article:not(.active) .nf-cube { background: #ebedf0; color: #c0c4cc; }
.nf-cube svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.6; }
.nf-card-head h3 { flex: 1; min-width: 0; margin: 0; font-size: 14px; font-weight: 500; line-height: 19px; color: #333; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.nf-star { flex: none; align-self: flex-start; border: 0; background: none; padding: 0; color: #1f2329; font-size: 18px; line-height: 1; cursor: pointer; }
.nf-meta { display: flex; gap: 8px; margin: 9px 0 0; color: #333; line-height: 18px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nf-meta span { flex: none; color: #7d8a9c; }
.nf-card-actions { display: flex; margin: 14px -13px 0; border-top: 1px solid #e7ebf2; }
.nf-fav-list article.active .nf-card-actions { margin-left: -12px; margin-right: -12px; }
.nf-card-actions button { flex: 1; height: 35px; border: 0; background: #fff; color: #333; font: inherit; cursor: pointer; }
.nf-card-actions button + button { border-left: 1px solid #e7ebf2; }
.nf-card-actions button:hover { color: #1681d7; }
.nf-pointer { position: absolute; right: -16px; bottom: 46px; width: 0; height: 0; border: 8px solid transparent; border-left-color: #cfd5df; }
.nf-list-empty { padding: 40px 0; text-align: center; color: #909399; background: #fff; border: 1px solid #e7ebf2; }
.nf-task-panel { flex: 1; min-width: 0; margin-left: 42px; background: #fff; border: 1px solid #e7ebf2; box-shadow: 0 1px 6px rgba(23, 43, 77, 0.04); }
.nf-task-section { display: flex; flex-direction: column; min-height: 335px; }
.nf-task-section + .nf-task-section { margin-top: 0; }
.nf-task-head { display: flex; align-items: center; gap: 8px; height: 56px; padding: 0 12px; }
.nf-clock { width: 22px; height: 22px; flex: none; }
.nf-clock.instant { color: #f2a33c; }
.nf-clock.scheduled { color: #2f86e8; }
.nf-task-head h2 { margin: 0; font-size: 16px; font-weight: 600; color: #333; }
.nf-task-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.nf-task-table th { height: 50px; background: #fafafa; border-top: 1px solid #edf0f5; border-bottom: 1px solid #edf0f5; color: #333; font-size: 14px; font-weight: 500; }
.nf-task-table td { height: 44px; border-bottom: 1px solid #edf0f5; text-align: center; color: #333; }
.nf-op { border: 0; background: none; color: #1681d7; font: inherit; cursor: pointer; }
.nf-no-data { margin: 0; padding-top: 10px; height: 25px; border-bottom: 1px solid #edf0f5; text-align: center; color: #909399; font-size: 14px; }
.nf-task-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; height: 58px; padding: 0 18px; color: #303133; font-size: 14px; }
.nf-task-footer nav { display: flex; align-items: center; gap: 10px; color: #606266; }
.nf-task-footer nav button { border: 0; background: none; color: #a0a8b4; height: 30px; padding: 0 6px; font: inherit; cursor: default; }
.nf-task-footer nav input { width: 40px; height: 30px; border: 1px solid #e0e5ee; text-align: center; color: #333; font: inherit; }
.nf-task-footer .nf-goto { color: #606266; }
.nf-task-footer .nf-confirm { border: 0; background: none; padding: 0 4px; color: #1681d7; cursor: pointer; }
@media (max-width: 1500px) {
  .nf-fav-search { margin-right: 30px; }
  .nf-fav-search input { width: 210px; }
}
@media (max-width: 1100px) {
  .nf-fav-body { flex-direction: column; }
  .nf-fav-list { width: 100%; }
  .nf-task-panel { width: 100%; margin: 20px 0 0; }
}
</style>
