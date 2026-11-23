# 编号08：定时任务修改
状态：自验通过，待用户验收；工作区未提交。
源Sheet!Z9:AB9，ID_AD5AA691820C4CC2BAD6BDCAC35F79A5、ID_3CDC1FADF9014C03AECD2C19F4C2AAF1、ID_3DE3C37A64C04D08929988E351F647EE，1910×873。
入口/new/8，自助取数/取数任务/定时取数浏览；修改在第一行操作区。
G1读取全部三张素材。G2直达刷新正常。G3实测4行、修改取消不生效、重新打开无草稿、保存选择否保留34.76、选择是变等待/--/成功0失败0/空间0、刷新恢复、未知查询为空。G4实现截图before/prompt/after保存在outputs/acceptance-08，已逐张读取并修正重复内边距和确认按钮位置。原版侧栏字形沿用用户反馈；菜单保持展开可见。
G5 Node24构建退出0；已有包大小警告，浏览器pageerror0。G6复用07表单，不新增接口，不改即时任务状态。G7允许开始09；脚本work/verify08.cjs。

最终批次验证：1—10导航和资源/控制台0错误；07/08/09/10浏览器脚本及10边界测试均通过；生产构建退出0，git diff --check通过。逐场景并排对比图位于C:/Users/Administrator/Documents/Codex/2026-11-20/t/outputs/acceptance-NN/*-compare.jpg。
