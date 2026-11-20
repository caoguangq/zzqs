<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TaskExceptions from './TaskExceptions.vue'
import InstantTaskForm from './InstantTaskForm.vue'
const route = useRoute()
const router = useRouter()
const list = ref(null)
const editing = ref(null)
const names = ['吉-生日关怀目标客户明细20260313164905曾冰洁','2026有效新增明细（新口径增加价值度）20260312154006王涛','CN新春重点产品明细2026sjd20260312185747王涛','新增放号第4个月质量跟踪情况20260313164718袁超','吉-携入携出明细20250825120919刘志晖','未捆绑目标校园客户--测试20260313164605唐雯丽','【26年新春】加固提值明细20260313164439黄莹','吉-县一品明细表202601-03']
const tasks = names.map((taskName,i) => ({ id:'EDIT'+i, taskName, runState:['等待','成功','成功','正在运行','成功','成功','成功','成功'][i], creator:['曾冰洁','王涛','王涛','袁超','刘志晖','唐雯丽','黄莹','熊晖霞'][i], notifyState:[0,1,1,0,1,0,1,0][i], submitTime:'2026-03-13 '+['16:49:36','16:47:45','16:47:38','16:47:22','16:46:43','16:46:42','16:44:47','16:44:12'][i], queryStartTime:['-','2026-03-13 16:48:54','2026-03-13 16:48:51','2026-03-13 16:48:48','2026-03-13 16:47:57','2026-03-13 16:47:55','2026-03-13 16:45:48','2026-03-13 16:44:50'][i], queryEndTime:['-','2026-03-13 16:50:18','2026-03-13 16:50:07','-','2026-03-13 16:48:09','2026-03-13 16:50:36','2026-03-13 16:46:01','2026-03-13 16:44:57'][i], executeTime:['0秒','1分24秒','1分16秒','1分59秒','12秒','2分41秒','13秒','7秒'][i], occupySize:['0','6.26','28.7','0','4.53','34.29','53.93','0.21'][i], failReason:'',purpose:'运维' }))
const extraNames=['2026年新春劳动竞赛渠道级报表-日月级统计20260302111338','龚卫祥终端通报20260122093014','20260120测试20260120205452','取数_渠道中心_蔡芬_疑似违规外呼渠道业务办理清单2','取数_市场部_侯英凡_工作会材料取数20260118010016','取数_渠道运营中心_卢晓玲_所有工号唐雯丽2','吉-2025存量来电卫士办理明细']
extraNames.forEach((name,i)=>tasks.push({...tasks[5],id:'EDIT_EXTRA'+i,taskName:name+'唐雯丽',submitTime:['2026-03-02 11:14:44','2026-01-22 09:30:25','2026-01-20 20:55:03','2026-01-20 01:00:48','2026-01-18 01:00:25','2026-01-09 17:41:17','2026-01-08 23:27:34'][i],queryStartTime:['2026-03-02 11:14:26','2026-01-22 09:31:47','2026-01-20 20:55:34','2026-01-20 01:02:11','2026-01-18 01:01:33','2026-01-09 17:42:55','2026-01-08 23:27:31'][i],queryEndTime:['2026-03-02 11:17:27','2026-01-22 09:32:01','2026-01-20 20:58:11','2026-01-20 01:04:34','2026-01-18 01:03:59','2026-01-09 17:45:34','2026-01-08 23:27:40'][i],executeTime:['2分43秒','14秒','2分37秒','2分23秒','2分26秒','2分39秒','9秒'][i],occupySize:['19.68','5.35','60.35','0.39','0','9.45','7.28'][i]}))
function taskFromQuery() {
  const taskId = route.query.task
  if (!taskId) return null
  const existing = tasks.find((task) => task.id === taskId)
  if (existing) return existing
  const name = route.query.name
  if (!name) return null
  const created = {
    id: taskId,
    taskName: String(name),
    runState: String(route.query.state || '成功'),
    creator: '', notifyState: 0, submitTime: '-', queryStartTime: '-', queryEndTime: '-',
    executeTime: '-', occupySize: '-', failReason: '', purpose: '运维'
  }
  tasks.unshift(created)
  return created
}
const pendingTask = taskFromQuery()
const browseTasks = [...tasks]
onMounted(() => {
  if (pendingTask) editing.value = { ...pendingTask }
})
function apply(form) { list.value.updateTask(editing.value.id, { taskName:form.name, purpose:form.purpose, notifyState:form.notify==='发送'?1:0, queryStartTime:'2026-03-13 16:57:45',queryEndTime:'2026-03-13 17:01:39',executeTime:'3分54秒',occupySize:'29.96',runState:'成功' }); close() }
function close() {
  editing.value = null
  if (route.query.task) router.replace({ path: '/new/5' })
}
</script>
<template><TaskExceptions ref="list" :initial-tasks="browseTasks" default-run-state="" edit-enabled title="即时取数浏览" @edit-task="row => editing={...row}"/><InstantTaskForm v-if="editing" :key="editing.id" edit-mode :initial-task="editing" @saved="apply" @cancel="close"/></template>
