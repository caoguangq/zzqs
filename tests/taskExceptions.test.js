import test from 'node:test'
import assert from 'node:assert/strict'
import { createTaskStore, toCsv } from '../src/data/taskExceptions.js'
test('local query applies combined conditions and deletion is isolated', () => {
 const store = createTaskStore()
 assert.equal(store.query({ runState: '失败' }).total, 8)
 assert.equal(store.query({ taskName: '9435', creator: '吕艳景' }).total, 1)
 assert.equal(store.query({ taskName: '不存在' }).total, 0)
 assert.equal(store.remove(['TASK9435']), 1)
 assert.equal(store.query({}).total, 7)
 assert.equal(createTaskStore().query({}).total, 8)
})
test('CSV escapes commas quotes and newlines with a UTF8 BOM', () => {
 const csv = toCsv([{ taskName: 'a,"b"\nc' }])
 assert.equal(csv.charCodeAt(0), 0xfeff)
 assert.ok(csv.includes('"a,""b""\nc"'))
})
