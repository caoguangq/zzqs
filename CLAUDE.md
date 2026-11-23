# CLAUDE.md

## 批量开发规则入口（编号 1–25 与团队合并）

开始编号 1–25 的新页面开发、修改菜单/路由或整合同事 26–51 代码前，必须先阅读 [编号 1–25 开发规范与协作约定](docs/development/features-01-25.md)。此链接文档统一维护分工、素材、目录/注册契约、菜单面包屑、nf- 样式、模拟交互、验收和合并规则，不在本文件复制规范或进度。

本分支负责原表 A 列 1–25，同事负责 26–51；原表分类与截图导航分别记录，实际页面菜单以截图为准。文档列出的新注册器、公共样式和浮层菜单为待整合契约，不得当作本地已实现。现有即时任务查询为编号 6 的复用基础，尚待完整截图验收。

以下旧规范继续适用于已有页面；与上述新功能规范冲突时，在批量开发范围内按链接文档执行。用户明确要求始终优先。未经授权不提交或推送。 按最新约定：开发者逐项自验，批次内持续推进，每5项交用户验收（1–5、6–10、11–15、16–20、21–25），不得逐项停工等待确认。逐功能强制执行链接规范第七节 G1–G7 验收：当前编号全部通过并记录证据后才能开发下一个；失败必须先修复，不得跳项或集中补验。


This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目目标

复现 `D:\JXDSJ\cmd-jx-jxdsj-jx-repository`（江西移动「数据直通车」数据集市旧系统）的**主要前端功能**。

## 范围约束（硬性）

- **只做前端**：后端只需提供一个能返回展示数据的简单服务，不开发真实业务功能（不做取数执行、审批流转、权限体系、4A 金库等）。
- **不用数据库**：用内存/JSON/静态文件等方式造测试数据即可，不接 MySQL / PostgreSQL。
- **界面以截图为准**：前端展示必须和 `参考截图/参考图片1.jpeg` 一致，特别是左侧深色侧边栏的布局、配色、菜单项、图标、展开箭头、选中态和底部「© 亚信科技 版权所有」。
- 参考项目里**有两代前端界面，只参考新版**（见下）。

## 参考界面要点（`参考截图/参考图片1.jpeg`）

- 左侧深色竖栏（159px）：顶部 `Data Discovery` Logo；菜单自上而下为 我的首页、数据可视化、自助取数、业务数据管理、取数监控、参数配置、公告、手写SQL、5G消息，多数项右侧有展开箭头；选中项右侧有蓝色高亮条；底部版权。
- 顶栏（51px）：面包屑 `自助取数 / 取数任务 / 即时取数浏览`，右侧铃铛、`欢迎您：…`、`退出`。
- 内容区（即时取数浏览）：筛选表单（任务名称、提交日期、创建人、运行状态、取数用途 + 查询按钮）、标题行操作按钮（批量删除、批量下载、推送AA文件夹、共享数据查看）、红色下载大小提示、数据表格（任务名称/运行状态/创建者/通知状态/提交时间/查询开始时间/查询结束时间/执行时间/占用空间(M)/失败原因/操作），失败状态为红字，任务名与失败原因允许两行换行，操作列为 查看/重跑/另存/删除/修改/生命周期。

## 参考项目（只读）

位置：`D:\JXDSJ\cmd-jx-jxdsj-jx-repository`（独立 git 仓库，Java 8 + Maven）。**只读参考，不建议在其中改代码**。

### 新版前端（复现依据）

`DTS/dts-report-web` —— Spring Boot + FreeMarker + Vue 2 + Element UI：

- 页面模板：`src/main/resources/view/report/**`（UTF-8）
- 静态资源：`src/main/resources/static/report/**`、`static/bace/**`（Element UI、Vue、字体图标、公共样式）
- 截图中的侧边栏与顶栏骨架：`view/report/frame/bace/top.ftl`（`#bi-nav`、面包屑、铃铛、用户、退出）
- 侧栏样式/脚本/图标：`static/report/frame/bace/css/top.css`、`static/report/frame/bace/js/top.js`、`static/report/frame/bace/img/`（`LOGO-menu.png` 等）
- 菜单 HTML 由后端 `Session.UserSessBean.sysMenuList` 注入，模板见 `view/report/menu-*.ftl`
- 图标体系：`static/bace/js/font-awesome` 与 `va-common-iconfont vc-icon-*`

### 旧版前端（不要照抄）

`SA/sa-web`（SVN 工作副本）是 JSP/Struts + jQuery/jqGrid 的老界面，与截图风格完全不同：

- 文件编码是 **GBK**，用 `grep`/`Read` 直接查 UTF-8 中文会查不到，需要先 `iconv -f GBK -t UTF-8`。
- 仅作为业务逻辑与字段含义的参考（如 `jsp/powershow/query/delay_task_list.jsp` 是「即时取数浏览」的原始实现）。
- `SA-WRITE/` 是同一套 SA 的 Maven 版，同样是 JSP/FreeMarker 老界面。

`SA/sa-web/docs/download-approval-reproduction.md` 详细记录了「即时取数浏览 / 下载审批」的字段、状态机、脱敏规则和交互流程，需要还原业务语义时优先读它。

## 工程结构与常用命令

Vue 3 + Vite + Element Plus 前端，Express 提供 mock 接口（无数据库，数据在 `server/data/` 内存中，重启即恢复）。

```bash
npm install
npm run dev          # 同时启动 mock API(3001) 和 Vite(5173)，浏览器打开 http://localhost:5173
npm run dev:web      # 只启动前端（需另有 API）
npm run dev:api      # 只启动 mock API
npm run build        # 产物输出 dist/（`npm start` 时由 Express 托管）
npm start            # 生产模式：Express 同时提供 /api 与 dist 静态页
```

- `src/layout/`：`AppLayout`（侧栏 + 顶栏骨架）、`SideNav`、`TopBar`
- `src/config/menus.js`：侧栏菜单项（增删菜单只改这里；`route` 为空时进入占位页）
- `src/router/index.js`：`/` 重定向到 `/query/instant`；其他菜单为 `/module/:key` 占位页
- `src/views/InstantQuery.vue`：截图对应的「即时取数浏览」页（查询、勾选、批量操作、分页、详情弹窗）
- `src/views/Placeholder.vue`：其他菜单的占位页
- `src/styles/global.css`：全部视觉规范（侧栏 159px/深色、顶栏 51px、主色 `#0b81e7`、表格行高 49px 等）
- `src/views/newFeatures/`：新开发功能（编号 26-51）页面，见下文专章
- `docs/新开发功能开发规范.md`：给协作同学看的开发规范（素材取用、代码约定、菜单挂载、验收流程）
- `src/styles/new-feature.css`：新开发功能页面通用样式（`nf-` 前缀，不影响已有页面）
- `server/index.js` + `server/data/instantQuery.js`：mock 接口与测试数据（8 条失败任务）
- `public/logo-menu.png`：从参考项目复制的 Data Discovery Logo

### Mock 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/user` | 顶栏用户名（固定「唐...」） |
| GET | `/api/query/instant` | 列表，参数 `taskName/submitDate/creator/runState/purpose/page/pageSize` |
| GET | `/api/query/instant/:id` | 单条详情 |
| GET | `/api/query/instant/download?ids=a,b` | 导出 CSV（UTF-8 BOM） |
| DELETE | `/api/query/instant` | body `{ ids: [] }`，批量/单条删除 |

数据只存在内存中，重启 API 后恢复为种子数据；修改 `server/data/instantQuery.js` 后必须重启 `npm run dev:api`（或整个 `npm run dev`）。

## 当前进度

- 已完成：侧栏/顶栏外壳、即时取数浏览页（筛选、查询、全选、批量删除/下载、分页、查看弹窗）、mock 接口、占位页。
- 未实现（按需求刻意不做）：真实取数执行、审批/权限/4A、消息通知；「重跑/另存/修改/生命周期」只弹提示，「删除」为内存删除。
- 其他菜单目前都是占位页；后续要扩展页面时，在 `src/router/index.js` 加路由并在 `src/config/menus.js` 给对应菜单加 `route`。
- 新开发功能 26-51：26-47、49-51 已完成并验收（48 原表无截图，待定）。

## 新开发功能（编号 26-51）

### 目标与范围

后评估材料里分配给本人的功能点是**编号 26-51，共 26 个**，要做成能在浏览器里点开的最小可运行页面：

- 一个功能点 = 一个页面，页面既要能在 `/new` 索引页进入，**也要挂到截图面包屑对应的侧栏菜单路径下**。
- 每个页面要能看出截图里的**页面结构、字段、表格列、按钮和弹窗**，文案照抄截图。
- 外壳（侧栏、顶栏）**沿用现有 `AppLayout`**，不改 159px 侧栏，也不改「即时取数浏览」页。
- 数据全部是页面内写死的静态数据（`ref` 数组 + 内存增删），**不新增后端接口、不碰数据库**。
- 明确不做：真实业务逻辑、权限校验、文件读写、导出、SQL 执行。

### 素材来源与取图方法

素材：`新开发功能/中国移动江西公司2024年…后评估(1)_已处理(3).xlsx`（**304MB，已 gitignore，不要提交**）。

- 该文件是 WPS 生成的 xlsx：第 1 列是编号，E 列是功能点名称，Z/AA/AB/AC 列是 `=DISPIMG("ID_...",1)` 图片公式，图片实体在 `xl/media/`。
- **不要用 `openpyxl.load_workbook()` 打开**，304MB 会直接吃光内存。正确做法是把它当 zip 读：
  1. `xl/sharedStrings.xml` 还原文字；
  2. `xl/cellimages.xml` 里 `<xdr:pic>` 的 `cNvPr/@name` 就是 `DISPIMG` 的 ID，`@descr` 是图片说明，`a:blip/@r:embed` 经 `xl/_rels/cellimages.xml.rels` 映射到 `xl/media/imageXX.png`；
  3. 按 `xl/worksheets/sheet1.xml` 的行号取数据，编号 N 对应行号 N+1；
  4. 只把需要的图片从 zip 里 `read()` 出来写到临时目录再看。
- 注意命名空间混用：`xdr:pic` 用的是 `drawingml/2006/spreadsheetDrawing`，不是 `drawingml/2006/picture`，写错会解析出 0 张图。
- 取图脚本属于一次性工具，放临时目录，不要提交到仓库。

### 26-51 功能点与截图对照

| 编号 | 功能点 | 张数 | 主要素材 | 状态 |
| --- | --- | --- | --- | --- |
| 26 | 模型历史版本新增 | 3 | image18 / image13 / image14 | ✅ 已验收 |
| 27 | 模型历史版本修改 | 3 | image17 / image15 / image16 | ✅ 已验收 |
| 28 | 模型历史版本删除 | 4 | image20 / image21 / image22 / image19 | ✅ 已验收 |
| 29 | 模型顺序结构升级 | 2 | image194 / image192 | ✅ 已验收 |
| 30 | 模型顺序结构降级 | 2 | image192 / image193 | ✅ 已验收 |
| 31 | 模型元数据异常查询展示 | 2 | image23 / image24 | ✅ 已验收 |
| 32 | 模型账期异常查询展示 | 2 | image25 / image26 | ✅ 已验收 |
| 33 | 模型异常任务派发 | 4 | image175 / 180 / 227 / 228 | ✅ 已验收 |
| 34 | 模型异常任务处理 | 4 | image229 / 230 / 231 / 232 | ✅ 已验收 |
| 35 | 模型异常消息提醒 | 2 | image27 / image28 | ✅ 已验收 |
| 36 | 按负责人查询数据集 | 2 | image29 / image30 | ✅ 已验收 |
| 37 | 负责人关联数据集总览列表 | 2 | image31 / image32 | ✅ 已验收 |
| 38 | 负责人关联数据集新增赋权 | 2 | image190 / image191 | ✅ 已验收 |
| 39 | 负责人关联数据集撤销赋权 | 2 | image188 / image189 | ✅ 已验收 |
| 40 | 已赋权数据集权限查询展示 | 2 | image57 / image58 | ✅ 已验收 |
| 41 | 脱敏设置管理 | 3 | image33 / image34 / image35 | ✅ 已验收 |
| 42 | 直连数据模型管理 | 3 | image36 / image37 / image38 | ✅ 已验收 |
| 43 | 数据视图管理 | 1 | image187 | ✅ 已验收 |
| 44 | 模型样例数据管理 | 1 | image186 | ✅ 已验收 |
| 45 | 手写查询语句管理 | 1 | image185 | ✅ 已验收 |
| 46 | 模型数据抽取管理 | 1 | image184 | ✅ 已验收 |
| 47 | 模型数据采样 | 2 | image39 / image40 | ✅ 已验收 |
| 48 | 模型数据合并 | 0 | **原表无截图** | 待定 |
| 49 | 模型数据清洗 | 2 | image41 / image42 | ✅ 已验收 |
| 50 | 模型数据扩展和行列转换 | 3 | image43 / image44 / image56 | ✅ 已验收 |
| 51 | 维度管理适配改造 | 1 | image183 | ✅ 已验收 |

已知面包屑：26-28 `业务数据管理/数据模型准备/模型历史版本管理`；29-30 `…/数据模型管理`；31-32 `…/模型扫描管理`；34-35 `业务数据管理/数据模型准备/模型异常任务处理`、`…/模型扫描管理`；36 `业务数据管理/数据集管理/按负责人查询数据集`；41 `参数配置/脱敏设置管理/规则配置`；51 `业务数据管理/基础数据配置/维度管理`。

### 实现方式（新增一个功能点的标准流程）

1. 在 `src/views/newFeatures/` 下新建 `XxxYyy.vue`，模板从 `.nf-page` 开始，全部用 `nf-` 前缀类名；只写这一页特有的样式，通用样式加到 `src/styles/new-feature.css`。
2. 到 `registry.js` 里登记两处：`featureViews` 加 `编号: () => import('./XxxYyy.vue')`，`featureBreadcrumbs` 加截图中真实面包屑。索引页和「已实现」标记会自动更新。
3. 页面数据用 `ref([...])` 写死，字段名与截图表头一一对应；交互只做前端内存操作。
4. 路由不用改：`/new/:no` 由 `FeatureHost.vue` 按编号动态加载，未登记的编号自动落到「待实现」占位。

页面骨架（对照 26 的写法）：

```vue
<div class="nf-page">
  <p class="nf-section-label">过滤条件</p>
  <section class="nf-card"> …nf-filter-row… </section>
  <section class="nf-card">
    <div class="nf-card-head">标题 + 操作按钮</div>
    <table class="nf-table"> …colgroup / thead / tbody… </table>
    <div class="nf-pager">…</div>
  </section>
  <el-dialog class="nf-dialog">…</el-dialog>
</div>
```

### 编号 26 / 27 的实现要点（可当模板）

- 三个截图对应的其实是同一业务的两套界面：以 `image18`（列表页：过滤条件 + 排序方式 + 表格 + 分页）为主界面，新增弹窗取 `image13`，成功提示取 `image14` 的绿色 toast。
- 表格：模型名称 / 版本号 / 版本说明 / 创建人 / 创建时间 / 发布状态 / 操作，列宽用 `colgroup` 百分比。
- 交互：查询（按模型名称过滤，含「客户价值评估表」空态）、重置、三种排序、分页与「前往 N 页」、全选、查看详情、修改、删除（二次确认）、新增版本。
- 新增版本弹窗：灰色「当前模型」横幅 + 必填项（模型新增时间 / 操作人只读 / 新增理由）+ 绿色校验通过提示；保存后按 `V(max+1).0` 生成新版本，旧的「当前版本」自动变「历史版本」，并弹 `ElMessage.success('新增成功')`。
- 空态、禁用态、`nf-btn[disabled]` 都已覆盖。
- **编号 26/27/28 是同一个页面的三个功能点**，共用 `ModelHistoryVersion.vue`，靠路由编号区分流程：26 进入即列表（新增流程）；27 进入自动打开 V4.0 的修改弹窗，保存后切到「模型历史版本修改结果」页（`image16`），「返回列表」回到列表；28 进入自动打开 V2.0 的删除弹窗，确认后弹「删除结果」弹窗（`image22`），列表变成 4 条（`image19`）。
- 修改弹窗（`image15`）字段：修改时间 / 修改理由 / 修改意见 / 修改人名称 / 修改人编码，全部必填，底部绿色提示「必填项完整；时间格式正确；修改人名称与编码匹配。」，按钮为「取消 / 保存修改」。
- 删除弹窗（`image21`）**没有必填星号**：当前模型/版本横幅 + 橙色感叹号「确认删除该历史版本？」+ 删除时间/删除人/删除理由/删除次数（数字步进器）+ 绿色提示，按钮为「取消 / 确认删除」；删除结果弹窗（`image22`）是绿色对勾 + 4 行键值表 + 「关闭」。

### 菜单挂载规则（硬性）

页面不能只存在于 `/new` 索引页，**必须挂到截图面包屑对应的侧栏菜单路径下**：

- 菜单树写在 `src/config/menus.js`，三级结构：一级 `业务数据管理` → 二级 `数据模型准备` → 三级叶子节点带 `route`。
- 有 `children` 的菜单点击只展开不跳转；叶子节点才跳转。
- 侧栏只有 159px，二/三级菜单用**右侧浮层**展示（悬停或点击打开，`SideNav.vue` + `.menu-flyout`），不要在侧栏内做内联缩进（8 个字的菜单名会被截断）。
- 同一业务页面的多个功能点各挂一个叶子节点，面包屑按截图分别登记：
  - `模型历史版本管理` → `/new/26`（面包屑 `业务数据管理/数据模型准备/模型历史版本管理`）
  - `模型历史版本查询` → `/new/27`（面包屑 `业务数据管理/数据模型准备/模型历史版本查询`，与 `image15/16` 一致）
- 面包屑写在 `registry.js` 的 `featureBreadcrumbs`，路由守卫自动写入顶栏，必须与截图一字不差。

### 验收流程（硬性）

**做完一个功能点，必须和素材截图逐项比对通过，才能开始下一个。**

1. 按参考图尺寸截图（26/27 的素材是 1672×941）：
   ```bash
   npx playwright screenshot --channel msedge --viewport-size=1672,941 --wait-for-timeout=2500 http://localhost:5173/new/27 out.png
   ```
2. 用 PIL 把素材图与新截图上下拼成一张对比图，逐项核对：
   - 菜单路径 / 面包屑三节文字与截图一致
   - 卡片标题、页面标题逐字一致
   - 筛选项标签、顺序、控件类型一致
   - 表格列名、列顺序、列宽比例、对齐方式一致
   - 数据行数、每行文案、顺序一致（异常日期照抄，不许「修正」）
   - 按钮文案、位置、主次样式一致
   - 弹窗标题、字段、必填星号、按钮一致
   - 截图里出现的交互都能点通，控制台 0 报错，`npm run build` 通过
3. 全过后在本文档进度表把该项改为「✅ 已验收」；有一项不过就改到过为止，**不做下一个**。

已知可接受的差异（其余都要对齐）：侧栏宽度 159px vs 参考 183px、顶栏右侧图标（参考多一个罗盘图标）、右下角固定客服按钮。

### 新页面视觉规范（与「即时取数浏览」不同，不要混用）

| 项 | 值 |
| --- | --- |
| 主色 / 主按钮 | `#1677ff`（悬停 `#4096ff`） |
| 卡片边框 / 圆角 | `#ebeef5` / 4px |
| 表头背景 / 表格线 | `#fafafa` / `#ebeef5`（全网格线） |
| 表头行高 / 数据行高 | 44px / 44px |
| 正文字号 / 表头字号 | 14px / 14px |
| 标签文字 / 次要文字 | `#606266` / `#909399` |
| 筛选行高 | 72px |
| 按钮高度 | 40px（`min-width: 96px`） |
| 内容区 | 白底 `app-content-plain`，左内边距 59px、上 32px；表格相对卡片左右各内缩 24px |
| 必填星号 / 校验通过提示 | `#f5222d` / `#00b42a` |

这些页面是后评估材料里的**另一套界面风格**（更接近 Ant Design），与 `参考图片1.jpeg` 的蓝色 `#0b81e7` 体系不同，不要为了「统一」去改已有页面。

## 复现经验（做改版前先读）

### 截图测量方法

不要靠目测调样式，直接用 Python + PIL 采样参考图片（尺寸 1910×873 JPEG）：

- 取色：`Image.open(p).convert('RGB').getpixel((x, y))`，注意 JPEG 有噪点，取多点/取最深值判断文字颜色。
- 找卡片边界：沿某一行/列扫描，比较与页面背景 `#f5f6fa` 的色差，能精确得到卡片 top/bottom/left/right。
- 找表格列边界：扫描多行中连续出现的浅灰竖线（约 `#edf1f5`），可得到每列宽度；本项目列宽就是由此换算成 colgroup 百分比的。
- 找文字行位置：按行统计暗色像素数量，或按列统计得到文本起点；红色提示文案用 `r>170 && g<150 && b<150` 判断行位置。
- 验证渲染效果：用本机 Edge 以相同视口截图后与参考图并排看：
  ```bash
  npx playwright screenshot --channel msedge --viewport-size=1910,873 --wait-for-timeout=2500 http://localhost:5173/ out.png
  ```

### 已确认的布局与配色（改样式时不要破坏）

| 项 | 值 |
| --- | --- |
| 侧栏宽度 / 顶栏高度 | 159px / 51px |
| Logo 区块 / 菜单首项起点 / 菜单行高 | 54px / 侧栏内 90px / 60px |
| 侧栏背景 / Logo 区背景 / 选中行背景 | `#262a36` / `#1b1f2b` / `#1f232e` |
| 选中项蓝色条 | 右侧 4px，`#2b87ff` |
| 页面背景 / 主色 | `#f5f6fa` / `#0b81e7` |
| 内容区内边距 | 上 33px、右 43px、下 40px、左 31px |
| 筛选输入框 | 291×32px，圆角 16px，输入文字 12px，列间距 89px |
| 查询按钮 | 100×36px，圆角 18px |
| 标题卡片 / 表格卡片顶边 | y≈259 / y≈433（1910×873 下） |
| 表头 / 数据行高 | 53px / 49px |
| 表格列宽（顺序） | 1.5 / 10.6 / 3.5 / 4.5 / 4.5 / 7.6 / 7.6 / 7.6 / 3.8 / 7.6 / 20.4 / 20.8 (%) |
| 失败红字 / 提示红字 | `#f5222d` |
| 表头背景 / 分隔线 | `#f9fafc` / `#edf1f5`（数据行 `#ededed`） |
| 操作链接 / 分页当前页 | `#0b76f4` / `#2181fb` |

### 踩坑记录

- **侧栏只有 159px**：菜单文字 14px 时「业务数据管理」刚好放得下（左内边距 15px、图标-label 间距 9px、箭头 14px）；再加大 padding/字体就会出现省略号。
- **表格时间列必须完整显示**：`td` 默认左右 padding 只能给 2px，否则 `2026-03-13 11:07:53` 会变成省略号；任务名单元格单独给 7px，失败原因给 2px。
- **任务名/失败原因换行规则**：必须 `white-space: normal; word-break: normal; overflow-wrap: break-word;`。用 `break-all` 会把 `20260311150738` 这类数字串拆断，和截图不一致。
- **操作列**是右对齐（`text-align: right; padding-right: 22px`），六个链接才能和截图一样贴着表格右侧。
- **红色提示文案有硬换行**：截图在「如果文件」后换行，是原始页面写死的 `<br>`，不要依赖容器宽度自动换行。
- **Element Plus 覆盖**：输入框用 `.field .el-input__wrapper`、`.field .el-select__wrapper`、`.field .el-date-editor .el-input__wrapper` 统一定制（`box-shadow: none`、`border-radius: 16px`、高 32px）；覆盖 `height` 时同时给 `min-height`，否则 select 会被内部样式撑高。
- **弹窗 scoped 样式**：`el-dialog` 被 teleport 到 body，且自定义 `class` 落在 `.el-dialog` 上而根节点没有本组件的 `data-v`，所以 `.xxx-dialog :deep(.el-dialog__header)` 不会命中；要改弹窗根类下的结构，用 `:global(.xxx-dialog .el-dialog__body)`（必要时叠加 `.nf-dialog` 提高优先级，例如 `:global(.nf-dialog.nf-notice-dialog .el-dialog__header)`）。
- **截图里的滚动条**：参考图右侧有 15px 经典滚动条，内容右边界因此比无滚动条时左移约 15px；Playwright 无头截图常隐藏滚动条，比对时不要把这点当成样式错误。
- **数据文案照抄**：截图中的异常日期（如提交 2026-03-10、查询开始 2026-03-13）是有意保留的原始数据，不要“修正”。
- **改完必须重启 mock 服务**：`server/` 不是热更新；Vite 只热更新前端。

### 验证清单

1. `npm run build` 必须通过。
2. 无头 Edge 截图与 `参考截图/参考图片1.jpeg` 对比：侧栏菜单、卡片位置、表格列宽、换行位置。
3. 交互自检（可用 Playwright）：查询、全选、查看弹窗、菜单跳转占位页，控制台无报错。
4. 未配置自动化测试，不要声称执行过测试；只报告实际跑过的命令和结果。

## 参考项目构建（需要跑起来对照时）

```bash
mvn -f D:\JXDSJ\cmd-jx-jxdsj-jx-repository\DTS\pom.xml clean package   # DTS 反应堆（含 dts-report-web）
mvn -f D:\JXDSJ\cmd-jx-jxdsj-jx-repository\SA-WRITE\pom.xml clean package
```

团队 Maven 在 `D:\softwore\maven\apache-maven-3.9.16`（使用其 `conf\settings.xml`）。

## 注意事项

- 截图里的按钮/字段文案是复现验收标准，不要自行改写或增删；新增界面前先确认参考图是否又换了（当前为 `参考截图/参考图片1.jpeg`）。
- 造数即可，不要为了「看起来完整」去实现真实的取数、审批、权限、消息通知。
- 参考项目中的 `dts_new8.25.sql`（约 324MB）、`sa_new8.25.sql`（约 615MB）不要读取或 diff。
- 端口：API 3001、Vite 5173。`npm run dev` 在改 mock 数据后需要重启；不要用 `taskkill /IM node.exe` 一把杀，按 `netstat -ano | grep -E ":3001|:5173"` 找到 PID 再停，避免影响其他项目。
- 未经允许不执行 `git commit` / `git push`；修改代码前先说明方案。
