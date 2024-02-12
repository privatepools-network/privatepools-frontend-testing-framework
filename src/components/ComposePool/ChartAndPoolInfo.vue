<template>
  <div class="total_epoch">
    <div>Total Rewards This Epoch:</div>
    <div>0%</div>
  </div>
  <div class="concentrated_card" style="height: 90%;">
    <div>
      <div class="compose_text mb-3">Price Range Overview</div>
    </div>

    <div class="range_chart_card">
      <img :src="range_chart_icon" />
      <div class="compose_text mt-3">Your position will appear here.</div>
    </div>
    <div style="text-align: center; color:#7DB0BC; margin-top: 10px;">Current Price: Token1 per Token2</div>
 
    <hr class="compose_hr" />
    <div class="pool_info">
        <div class="d-flex justify-content-between mb-3">
            <span style="font-size: 16px;">Pool Info</span>
            <span style="text-decoration: underline;">Address: 0x0000...0000</span>
        </div>
        <div class="d-flex justify-content-between">
            <span>Current Swap Fee:</span>
            <span>0.04%</span>
        </div>
        <div class="d-flex justify-content-between">
            <span>Tickspacing:</span>
            <span>10</span>
        </div>
        <div class="d-flex justify-content-between">
            <span>Average APR of this Pool:</span>
            <span>[ 51.1% -> 127% ]</span>
        </div>
        <div class="d-flex justify-content-between">
            <span>TVL:</span>
            <span>$345.56k</span>
        </div>
   
    </div>

    <hr class="compose_hr" />
 </div>
</template>
<script setup>
import range_chart_icon from '@/assets/icons/range_chart_icon.svg'
</script>
<style lang="scss" scoped>
.total_epoch {
  background: linear-gradient(152.97deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
  padding: 12px;
  border-radius: 15px;
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  color: #c1c8ce;
  display: flex;
  justify-content: space-between;
}

.concentrated_card {
  margin-top: 50px;
  background: linear-gradient(152.97deg, #000000 0%, rgba(0, 0, 0, 0) 100%);
  border-radius: 15px;
  padding: 15px;
}

.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  color: white;
}

.range_chart_card {
  border-radius: 8px;
  background: #07090c;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 120px 0px;
}

.compose_hr {
  border-bottom: 1px solid #00C9FF57;
  margin: 0px;
  margin-top: 5px;
  margin-right: -10px;
  margin-left: -10px;
}

.pool_info {
    margin-top: 20px;
    margin-bottom: 20px;
    font-family: Inter;
font-size: 14px;
font-weight: 400;
line-height: 17px;
color: #C1C8CE;
display: flex;
flex-direction: column;
gap: 10px;
}
</style>
