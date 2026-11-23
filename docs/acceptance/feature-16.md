# 编号 16：文档内容自动化拆分（已按用户要求删除）

- 状态：已删除（2026-11-23，用户要求）
- 原页面地址/菜单：`/new/16`；自助取数 → 上传任务 → 文档自动化拆分
- 删除范围：
  - 侧栏菜单叶子“文档自动化拆分”已移除（`src/config/menus.js`）。
  - 路由映射、面包屑、功能元信息已移除（`src/views/newFeatures/registry-01-25.js`）；直达 `/new/16` 显示“该编号尚未实现或不存在”。
  - 原页面 `src/views/newFeatures/UploadAppend.vue` 与数据 `src/data/uploadAppend.js` 已移出项目，备份于 `C:\Users\Administrator\chatgpt-migration\removed-feature16\`。
- 保留内容：
  - 追加弹窗共享组件 `src/views/newFeatures/AppendUploadDialog.vue` 保留，供编号 15“文件上传浏览”的“追加/新建导入”使用；17 文件内容预览不受影响。
- 原因：用户查看侧栏后明确“这个功能就可以删除了”。编号 15 页面已提供追加/上传拆分能力，不再保留独立的文档自动化拆分页。
- 证据：删除前 16 的自验记录（48/48 中的 16 部分）保存在 `C:\Users\Administrator\chatgpt-migration\accept1620\`。删除后复测：`check-rm16.mjs` 6/6（上传任务子菜单仅“文件上传浏览/文件内容预览”、侧栏无“文档自动化拆分”、/new/16 显示“该编号尚未实现或不存在”、编号 15 追加弹窗正常、编号 17 正常、控制台 0 错误），`acceptfix.mjs` 14/14，构建退出码 0；证据在 `C:\Users\Administrator\chatgpt-migration\remove16\`。
