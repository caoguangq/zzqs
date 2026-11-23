<template>
  <div class="nf-page nf-sql-page">
    <div class="nf-sql-modal">
      <header class="nf-sql-head">
        <svg class="nf-sql-head-icon" viewBox="0 0 30 40" width="30" height="40" fill="none" stroke="#d9eefc" stroke-width="2">
          <path d="M4 2h15l7 7v29H4z" />
          <path d="M19 2v7h7" />
          <path d="M9 16h12M9 21h12M9 26h12M9 31h8" />
        </svg>
        <span class="nf-sql-head-title">保存为模板</span>
      </header>

      <div class="nf-sql-tabbar">
        <span class="nf-sql-tab">STEP1</span>
      </div>

      <div class="nf-sql-body">
        <section class="nf-sql-sec">
          <div class="nf-sql-sec-head">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="#ffffff"><path d="M11.8 1.6 14.4 4.2 5.6 13H3v-2.6zM10.7 2.7 4.2 9.2l1.7 1.7 6.5-6.5z" /></svg>
            <span>任务执行的SQL语句</span>
          </div>
          <div class="nf-sql-sec-body">
            <pre class="nf-sql-code">select
a.offer_id,e.name,count(*) --total
from dw2.dw_ins_offer_1_prt_p{YYYYMMDD(LD1)} a
left join ods2.ods_up_Product_item_ds_1_prt_p{YYYYMMDD(LD1)} e on a.offer_id=e.product_item_id
where a.state='1'
and a.offer_id in
('310096200245','310096200244','310096200238','310096200237','310096200236','310096200235','310096200243','310096
200242','310096200241','310096200240','310096200239','310095800413','310095800412','310095800411','310095800410',
310095800409','310095800408','310095800399','310095800398','310095800397','310095800396','310095800407','3100958')</pre>
            <table class="nf-sql-fields">
              <colgroup>
                <col style="width: 70px" />
                <col style="width: 144px" />
                <col style="width: 166px" />
              </colgroup>
              <thead>
                <tr>
                  <th>序号</th>
                  <th>字段名称</th>
                  <th>展示方式</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>A.OFFER_ID</td><td>模糊查询</td></tr>
                <tr><td>2</td><td>E.NAME</td><td>模糊查询</td></tr>
                <tr><td>3</td><td>TOTAL</td><td>模糊查询</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="nf-sql-sec">
          <div class="nf-sql-sec-head">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#ffffff" stroke-width="1.6"><path d="M3 1.5h6l4 4v9H3z" /><path d="M9 1.5v4h4" /></svg>
            <span>SQL描述</span>
          </div>
          <div class="nf-sql-desc">暂无描述信息</div>
        </section>

        <section class="nf-sql-sec">
          <div class="nf-sql-sec-head">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="#ffffff" stroke-width="1.7"><circle cx="8" cy="8" r="6.2" /><path d="M8 7.2v4" /><circle cx="8" cy="4.7" r="0.4" fill="#ffffff" /></svg>
            <span>任务信息</span>
          </div>
          <table class="nf-sql-info">
            <colgroup>
              <col style="width: 12.7%" />
              <col style="width: 12.3%" />
              <col style="width: 12.7%" />
              <col style="width: 12.3%" />
              <col style="width: 12.7%" />
              <col style="width: 12.3%" />
              <col style="width: 12.8%" />
              <col style="width: 12.2%" />
            </colgroup>
            <tbody>
              <tr>
                <td class="nf-sql-info-label">任务名称：</td><td>活动办理量后评估</td>
                <td class="nf-sql-info-label">创建时间：</td><td>2026-03-13 14:43:…</td>
                <td class="nf-sql-info-label">创建人：</td><td>钟晓俊</td>
                <td class="nf-sql-info-label">需求提出人：</td><td>钟晓俊</td>
              </tr>
              <tr>
                <td class="nf-sql-info-label">失效日期：</td><td>2026-03-27</td>
                <td class="nf-sql-info-label">任务类型：</td><td>立即执行</td>
                <td class="nf-sql-info-label">任务状态：</td><td>否</td>
                <td class="nf-sql-info-label">最新数据时间：</td><td></td>
              </tr>
              <tr>
                <td class="nf-sql-info-label">执行状态：</td><td>成功</td>
                <td class="nf-sql-info-label">执行开始时间：</td><td>2026-03-14 23:14:…</td>
                <td class="nf-sql-info-label">执行结束时间：</td><td>2026-03-14 23:16:19</td>
                <td></td><td></td>
              </tr>
              <tr>
                <td class="nf-sql-info-label">是否保留历史记录：</td><td>不保留</td>
                <td class="nf-sql-info-label">任务描述：</td><td>任务描述：</td>
                <td></td><td></td>
                <td></td><td></td>
              </tr>
              <tr>
                <td class="nf-sql-info-label">口径说明：</td><td colspan="7">暂无口径信息</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.nf-sql-page {
  width: auto;
  min-height: calc(100vh - 51px);
  margin: -33px -43px -40px -31px;
  padding: 0;
  background: #eef1f4;
}

.nf-sql-modal {
  width: 1312px;
  margin: 0 auto;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.28);
}

.nf-sql-head {
  display: flow-root;
  height: 86px;
  padding-left: 23px;
  background: #2180af;
  color: #ffffff;
}

.nf-sql-head-icon {
  display: block;
  margin: 11px 0 0 16px;
}

.nf-sql-head-title {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  line-height: 18px;
}

.nf-sql-tabbar {
  display: flex;
  height: 39px;
  background: #f8f8f8;
  border-bottom: 1px solid #dddddd;
}

.nf-sql-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 78px;
  height: 39px;
  margin-left: 1px;
  border-top: 3px solid #299fd6;
  border-right: 1px solid #dddddd;
  border-left: 1px solid #dddddd;
  background: #ffffff;
  color: #299fd1;
  font-size: 13px;
  font-weight: 700;
}

.nf-sql-body {
  padding: 26px 18px 20px 8px;
}

.nf-sql-sec {
  margin-bottom: 12px;
}

.nf-sql-sec:last-child {
  margin-bottom: 0;
}

.nf-sql-sec-head {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding-left: 9px;
  background: #58a3c5;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
}

.nf-sql-sec-body {
  display: flex;
  border: 1px solid #dddddd;
  border-top: 0;
}

.nf-sql-code {
  flex: 1;
  min-width: 0;
  height: 290px;
  margin: 0;
  padding: 0 0 0 4px;
  background: repeating-linear-gradient(to bottom, #f7f7f7 0, #f7f7f7 31px, #ffffff 31px, #ffffff 62px);
  color: #333333;
  font-family: Arial, "Microsoft YaHei", sans-serif;
  font-size: 15.5px;
  line-height: 31px;
  white-space: pre;
  overflow: hidden;
}

.nf-sql-fields {
  flex: none;
  align-self: flex-start;
  width: 386px;
  margin-left: 9px;
  border-collapse: collapse;
  border-left: 6px solid #78bed8;
  table-layout: fixed;
}

.nf-sql-fields th,
.nf-sql-fields td {
  height: 31px;
  padding: 0 0 0 7px;
  border-bottom: 1px solid #dddddd;
  color: #444444;
  font-size: 13px;
  font-weight: 400;
  text-align: left;
}

.nf-sql-fields tbody tr:first-child td {
  background: #f3f8f9;
}

.nf-sql-desc {
  min-height: 85px;
  padding: 10px 8px;
  border: 1px solid #dddddd;
  border-top: 0;
  color: #444444;
  font-size: 14px;
  line-height: 20px;
}

.nf-sql-info {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.nf-sql-info td {
  height: 31px;
  padding: 0 7px;
  border: 1px dashed #c3c3c3;
  color: #000000;
  font-size: 14px;
  text-align: left;
}

.nf-sql-info .nf-sql-info-label {
  color: #58a3c5;
  font-size: 13px;
  text-align: right;
}
</style>