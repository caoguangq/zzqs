import express from 'express'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { instantTasks } from './data/instantQuery.js'

const app = express()
const port = 3001
const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')

let tasks = instantTasks.map((item) => ({ ...item }))

app.use(express.json())

app.get('/api/user', (req, res) => {
  res.json({ userName: '唐...', userId: 'TANG' })
})

app.get('/api/query/instant', (req, res) => {
  const { taskName = '', submitDate = '', creator = '', runState = '', purpose = '' } = req.query
  const page = Math.max(Number(req.query.page) || 1, 1)
  const pageSize = Math.max(Number(req.query.pageSize) || 10, 1)

  const filtered = tasks.filter((item) => {
    if (taskName && !item.taskName.includes(String(taskName).trim())) return false
    if (submitDate && !item.submitTime.startsWith(String(submitDate).trim())) return false
    if (creator && !item.creator.includes(String(creator).trim())) return false
    if (runState && item.runState !== runState) return false
    if (purpose && item.purpose !== purpose) return false
    return true
  })

  const start = (page - 1) * pageSize
  res.json({
    total: filtered.length,
    page,
    pageSize,
    list: filtered.slice(start, start + pageSize)
  })
})

app.get('/api/query/instant/download', (req, res) => {
  const ids = String(req.query.ids || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
  const selected = ids.length ? tasks.filter((item) => ids.includes(item.id)) : tasks

  const headers = ['任务名称', '运行状态', '创建者', '通知状态', '提交时间', '查询开始时间', '查询结束时间', '执行时间', '占用空间(M)', '失败原因']
  const rows = selected.map((item) =>
    [item.taskName, item.runState, item.creator, item.notifyState, item.submitTime, item.queryStartTime, item.queryEndTime, item.executeTime, item.occupySize, item.failReason]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(',')
  )
  const csv = `﻿${headers.join(',')}\r\n${rows.join('\r\n')}`
  const fileName = encodeURIComponent(selected.length === 1 ? `${selected[0].taskName}.csv` : '取数任务导出.csv')

  res.setHeader('Content-Type', 'text/csv; charset=UTF-8')
  res.setHeader('Content-Disposition', `attachment; filename="download.csv"; filename*=UTF-8''${fileName}`)
  res.send(csv)
})

app.get('/api/query/instant/:id', (req, res) => {
  const task = tasks.find((item) => item.id === req.params.id)
  if (!task) {
    res.status(404).json({ message: '任务不存在' })
    return
  }
  res.json(task)
})

app.delete('/api/query/instant', (req, res) => {
  const ids = Array.isArray(req.body?.ids) ? req.body.ids : []
  if (!ids.length) {
    res.status(400).json({ message: '请选择需要删除的任务' })
    return
  }
  const before = tasks.length
  tasks = tasks.filter((item) => !ids.includes(item.id))
  res.json({ deleted: before - tasks.length })
})

const distDir = join(rootDir, 'dist')
if (existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(join(distDir, 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`mock api listening on http://localhost:${port}`)
})
