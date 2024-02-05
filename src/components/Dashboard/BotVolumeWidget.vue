<template>
  <div class="mb-xxl-3 mb-2">


    <div class="d-flex align-items-baseline gap-1">
      <Title :title="'System Volume'">

      </Title>
      <VTooltip :distance="0" :placement="'right'">
        <div style="cursor: help">
          <img :src="info" class="info_icon" />
        </div>
        <template #popper>
          <div style="
              background: linear-gradient(
                rgba(89, 89, 89, 0.75),
                rgba(73, 73, 73, 0.15)
              );
              backdrop-filter: blur(10px);
              padding: 10px;
              border-radius: 4px;
              width: 400px;
            ">
            <div style="font-size: clamp(10px, 0.9vw, 16px)">Information</div>
            <div style="
                display: flex;
                flex-direction: column;
                font-size: clamp(10px, 0.8vw, 14px);
              ">
              <p>
                This component consolidates volume data across multiple time
                periods, allowing you to assess your transaction costs
                comprehensively.
              </p>
            </div>
          </div>
        </template>
      </VTooltip>
    </div>

    <div class="widget_container">
      <div v-for="(item, i) in items" :key="`bot-volume-${i}`" class="widget_container_card">
        <div class="d-flex flex-column gap-1 align-items-center">
          <div class="d-flex align-items-center gap-2">
            <!-- <div class="widget_image">
              <img :src="item.icon" width="12" />
            </div> -->
            <div class="widget_timeline">{{ item.timeline }}</div>
          </div>
          <div v-if="item.value == null" class="totals_loader">
            <ThreeDots />
          </div>
          <div v-else class="widget_value">
            <div v-if="symbol === '₿'">
                  <img :src="btcSymbol" width="9" /> {{ numberToAposthrophe(item.value, currencyDecimals) }}
                </div>
                <div v-else-if="symbol === 'Ξ'">
                  <img :src="ethSymbol" width="9" /> {{ numberToAposthrophe(item.value, currencyDecimals) }}
                </div>
                <div v-else>{{ symbol }} {{ numberToAposthrophe(item.value, currencyDecimals) }}</div>
          </div>
          <!-- <div>
            <CProgress :height="3">
              <CProgressBar color="success" :value="item.progress"></CProgressBar>
            </CProgress>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script scoped setup>
import { defineProps, toRefs } from 'vue'
import numberToAposthrophe from "@/lib/formatter/numberToAposthrophe"
import ThreeDots from '@/components/loaders/ThreeDots.vue'
import Title from '@/UI/Title.vue'
import info from '@/assets/images/info.svg'
import btcSymbol from '@/assets/images/tokens/btcSymbol.png'
import ethSymbol from '@/assets/images/tokens/ethSymbol.png'


const props = defineProps(['text_header', 'text_value', 'widget_icon', 'items', 'symbol', 'currencyDecimals'])
console.log(props)
const { items } = toRefs(props)
</script>
<style scoped lang="scss">
@import '@/styles/_variables.scss';

.totals_loader {
  margin-left: 20px;
  margin-top: 6px;
  margin-bottom: 6px;
}

.widget_container {
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 10px;
  border: 0.5px solid #a3a4a538;
  border-radius: 20px;
  padding: 20px 25px;
  font-family: Poppins;
  letter-spacing: 0em;
}

.widget_container_card {
  // width: 20%;
}

.widget_text_container {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.widget_text_header {
  font-weight: 500;
  line-height: 12px;
  font-size: 14px;
  color: #a0aec0;
}

.widget_text_value {
  font-size: 18px;
  font-weight: 700;
  line-height: 25px;
  color: #ffffff;
}

.widget_image {
  display: flex;
  justify-content: center;
  background: #01b47e;
  box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px #00000005;
  width: 25px;
  height: 25px;
  border-radius: 5px;
}

.widget_timeline {
  font-family: Poppins;
  font-size: clamp(10px, 0.8vw, 12px);
  font-weight: 500;
  line-height: 21px;
  color: rgba(160, 174, 192, 1);
}

.widget_value {
  font-family: Poppins;
  font-size: clamp(10px, 0.8vw, 20px);
  font-weight: 700;
  line-height: 25px;

  color: rgba(255, 255, 255, 1);
}

@media (min-width: 2000px) {
  .widget_container_card {
    // width: auto;
  }

}

@media (max-width: $xxl2) {}


@media (max-width: $xxl) {
  .widget_container {
    // justify-content: space-around;
    // gap: 10px;

    padding: 10px;
  }


  .widget_container_card {
    // width: 20%;
  }

  .widget_image {

    width: 18px;
    height: 18px;
  }
}

@media (max-width: $md) {
  .widget_container {

    justify-content: space-around;

  }

  .widget_container_card {
    // width: 35%;
  }

  .widget_image {

    width: 25px;
    height: 25px;
  }

  .widget_timeline {
    font-size: 10px;

  }

  .widget_value {
    font-size: 10px;

  }
}
</style>