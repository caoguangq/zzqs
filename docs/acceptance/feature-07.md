# 编号07：定时任务新增
状态：自验通过，待用户验收。工作区未提交。
素材：Sheet!Z8 ID_280F7B444A2B4121A5B36BF07E017E0F，image215.jpeg 1910×873。
入口：/new/7；自助取数/取数任务/定时任务新增。
G1：读取完整截图，复用字段编辑器，新增630px高调度表单。
G2/G3：Playwright验证直达、日期必填、有效保存、取消、重开重置、刷新、1366×768操作可达。
G4：参考图和实现图均已读取，弹窗位置602/94、宽706、高630；使用完整可操作日期控件代替原图损坏图片。证据outputs/acceptance-07/form.png。
G5：Node24.22.1，vite build退出0，原有500k打包提示保留；pageerror0，无新增接口。
G6：沿用即时表单和预览组件，只增加定时事件，不改变即时保存。
G7：允许继续08；批末复跑已验收入口。脚本work/verify07.cjs。

最终批次验证：1—10导航和资源/控制台0错误；07/08/09/10浏览器脚本及10边界测试均通过；生产构建退出0，git diff --check通过。逐场景并排对比图位于C:/Users/Administrator/Documents/Codex/2026-11-20/t/outputs/acceptance-NN/*-compare.jpg。
