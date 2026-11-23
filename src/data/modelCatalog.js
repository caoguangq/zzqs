import { overviewRows } from './modelOverview.js'

export const modelCities = ['景德镇', '省公司', '吉安', '赣州', '九江', '南昌', '萍乡', '宜春', '抚州', '新余', '上饶', '鹰潭']

export function addModel(row) {
  overviewRows.unshift({ id: 'MODEL' + Date.now(), status: '已发布', source: '数据表', city: '吉安', heat: 100, ...row })
}
