import { reactive } from 'vue'

// 编号17截图：文件“编码”的数据清单，仅第一页 10 条样本
export const previewRows = reactive([
  '197000384531',
  '400008325560',
  '400002140880',
  '400006578561',
  '400010830371',
  '197001296664',
  '400003419947',
  '197000403042',
  '197000542045',
  '400007675519'
].map((code, index) => ({ id: 'PREVIEW' + (index + 1), code })))

export const previewTaskInfo = {
  fileName: '编码',
  uploader: '邱艳',
  field: '用户编码',
  uploadedAt: '2026-03-13 17:53:21',
  database: '地市集市新库',
  expireAt: '2026-03-28',
  records: 909876,
  purpose: ''
}
