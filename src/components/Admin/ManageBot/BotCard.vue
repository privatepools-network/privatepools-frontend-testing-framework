<template>
  <div class="d-flex flex-column">

    <div class="bot_container">
      <div style="width: 50%;">


        <div class="px-3 py-3 d-flex flex-column">
          <span class="text-white  mb-2 bot_status_text">Choose Strategy</span>
          <CFormSelect class="border-success strategy_form" color="primary" :value="botStrategySelect"
            :disabled="isBotLoading || isBotRunning" aria-label="Default select example"
            @change="(e) => isBotLoading || isBotRunning ? '' : emit('strategySelect', strategies[e.srcElement.selectedIndex])">
            <option class="select_strategie" v-for="opt in strategies" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </CFormSelect>
        </div>


        <div class="mt-2 px-3 py-3">
          <div class="text-white  mb-2 bot_status_text">Choose Deviation</div>
          <div class="d-flex align-items-baseline gap-2">
            <div style="width:95%">
              <Slider :disabled="isBotLoading || isBotRunning" v-model="deviationValue" :tooltips="false" :min="0"
                :max="10" :step="0.1" />
            </div>
            <div class="text-white  mb-2 bot_status_text">{{ deviationValue }}%</div>
          </div>
        </div>
      </div>
      <div>

        <div class="text-white px-3 py-4">
          <div class="bot_status_text d-flex justify-content-between align-items-center gap-3 mb-4">
            <div class="d-flex align-items-center gap-1">


              <div><img :src="currentStrategyImg" width="30" /></div>
              <div>Current Strategy:</div>
            </div>
            <div style="text-align:right">{{ botStrategySelect }}</div>
          </div>
          <div class="bot_status_text d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center gap-1">


              <div><img :src="derivationImg" width="30" /></div>
              <div>Deviation:</div>
            </div>
            <div class="text-center">{{ deviationValue }}%</div>
          </div>
          <div class="bot_status_text d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-1">
              <div><img :src="botStatusImg" width="30" /></div>
              <div>Bot Status:</div>
            </div>
            <div v-if="isBotRunning && !isBotLoading" class="text-success">
              Script is running
            </div>
            <div v-else-if="!isBotRunning && !isBotLoading" class="text-danger">
              Script is not running
            </div>
            <div v-else-if="isBotLoading === true"  style="display: flex; align-items: center; gap: 5px; margin-right: 15px;">
              <ThreeDots></ThreeDots>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bot_buttons d-flex gap-5 mt-5 mb-2">
      <CButton :disabled="!isBotRunning || isBotLoading" class="text-white bot_buttons_btn" color="danger"
        @click="$emit('endBot')">Stop
        Arbitrage</CButton>
      <CButton :disabled="isBotRunning || isBotLoading" class="text-white bot_buttons_btn" color="success"
        @click="$emit('startBot')">Start Arbitrage</CButton>
    </div>
  </div>
</template>
<script setup>
import { defineProps, ref, watch, defineEmits, toRefs } from 'vue'
import currentStrategyImg from '@/assets/icons/bot_icons/currentStrategy.svg'
import derivationImg from '@/assets/icons/bot_icons/derivation.svg'
import botStatusImg from '@/assets/icons/bot_icons/botStatus.svg'
import Slider from '@vueform/slider'
import ThreeDots from "@/components/loaders/ThreeDots.vue";


const emit = defineEmits(['updateDeviation', 'strategySelect'])
const props = defineProps([
  'botStrategySelect',
  'chainSelected',
  'botStarted',
  'botData',
  'botLoading',
  "isBotRunning",
  "isBotLoading",
  'deviation',
  'strategies'
])
const { deviation, strategies } = toRefs(props)

const deviationValue = ref(deviation.value)

watch(deviationValue, () => {
  emit('updateDeviation', deviationValue.value)
})

console.log(strategies)


watch(deviation, (_new) => {
  if (_new != deviationValue.value)
    deviationValue.value = deviation.value
})
</script>


<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.bot_card {
  padding: 10px 15px;
}

.bot_status_text {
  flex-direction: column;
  gap: 5px;
  font-size: clamp(10px, 0.8vw, 14px);

}

.select_strategie {
  font-size: clamp(10px, 0.8vw, 14px);
}

:deep(.form-select) {
  background-color: #22282c00 !important;
  border-radius: 20px;
  font-size: clamp(10px, 0.8vw, 14px);
  color: rgba(1, 180, 126, 1);


}

.bot_buttons {
  flex-direction: column;
  gap: 10px;


}

.bot_buttons_btn {

  font-size: clamp(10px, 0.8vw, 14px);
  border-radius: 20px;
}

.bot_container {
  display: flex;

  /* flex-wrap: wrap; */
  justify-content: center;
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 20px;
}

@media (min-width: $lg) {
  .bot_card {
    padding: 0px 0px;
  }

  .bot_status_text {
    flex-direction: row;
  }

  .bot_buttons {
    flex-direction: row;
    gap: 0px;
  }

  .select_strategie {
    font-size: clamp(10px, 0.8vw, 14px);
  }
}

@media (min-width: $md) {
  .bot_container {
    justify-content: space-between;
  }
}
</style>
