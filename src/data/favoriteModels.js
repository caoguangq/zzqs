import { reactive } from 'vue'

// 编号 21 “我的收藏模型”素材中的收藏列表
export const favoriteModels = reactive([
  {
    id: 'FAV01',
    name: '运维twl',
    path: '地市集市新库>吉安-存量运营类>运维twl',
    indicators: 'GP_DATE, PZ_TYPE, CITY_ID, CITY...',
    description: '暂时无描述信息'
  },
  {
    id: 'FAV02',
    name: '20260120测试',
    path: '省经GP主-fangchengyuan->点对点取...',
    indicators: 'id, user_id, create_date, expire_date, ...',
    description: '暂时无描述信息'
  },
  {
    id: 'FAV03',
    name: '取数_虚拟现实创新中心_杨尚_其他AI产品资费清单',
    path: '省经GP主-liukang4->点对点取数->取数...',
    indicators: 'offer_id, offer_name, type_name, djt_a...',
    description: '暂时无描述信息'
  },
  {
    id: 'FAV04',
    name: '吉安-宽带用户明细',
    path: '地市集市新库>吉安-存量运营类>宽带用户明细',
    indicators: 'USER_ID, ACCT_ID, OPEN_DATE, PROD_...',
    description: '暂时无描述信息'
  },
  {
    id: 'FAV05',
    name: '南昌-套餐订购清单',
    path: '地市集市新库>南昌-流量经营类>套餐订购清单',
    indicators: 'OFFER_ID, OFFER_NAME, ORDER_TIME, ...',
    description: '暂时无描述信息'
  },
  {
    id: 'FAV06',
    name: '5G终端换机客户标签',
    path: '省经GP主-zhaoyu7->客户标签->5G终端...',
    indicators: 'CUST_ID, TERMINAL_ID, BRAND, MODEL...',
    description: '暂时无描述信息'
  },
  {
    id: 'FAV07',
    name: '政企集团客户收入月报',
    path: '省经GP主-wangqian2->点对点取数->政企...',
    indicators: 'GROUP_ID, GROUP_NAME, MONTH, INCOME...',
    description: '暂时无描述信息'
  }
])
