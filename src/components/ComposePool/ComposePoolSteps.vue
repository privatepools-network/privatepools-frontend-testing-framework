<template>
  <div class="compose_steps dark:!bg-[#DCEEF605] bg-white">
    <div class="compose_text dark:!text-white text-black">{{ $t('create_wp_steps') }}</div>
    <!-- Comment -->
    <hr class="compose_hr" />
    <div>
      <div class="my-3 d-flex flex-column justify-content-center gap-0">
        <div class="d-flex align-items-start gap-2">
          <img :src="step1activeImg" v-if="activeStep === 1" />
          <img :src="step1Img" v-else />

          <div :class="activeStep === 1 ? 'step_text active' : 'step_text'">
            {{ $t('choose_tokens_&_weights') }}
          </div>
        </div>
        <div class="d-flex align-items-start gap-2">
          <img :src="step2activeImg" v-if="activeStep === 2" />
          <img :src="step2Img" v-else />

          <div :class="activeStep === 2 ? 'step_text active' : 'step_text'">
            {{ $t('confirm_pool_creation') }}
          </div>
        </div>
        <div class="d-flex align-items-start gap-2">
          <img :src="step3activeImg" v-if="activeStep === 3" />
          <img :src="step3Img" v-else />

          <div :class="activeStep === 3 ? 'step_text active' : 'step_text'">
            {{ $t('add_initial_liquidity') }}
          </div>
        </div>
        <!-- <div class="d-flex align-items-end gap-2">
          <img :src="step4activeImg" v-if="activeStep === 4" />
          <img :src="step4Img" v-else />

          <div class="mb-1" :class="activeStep === 4 ? 'step_text active' : 'step_text'">
            {{ $t('swap_tokens') }}
          </div>
        </div> -->




      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
import step1Img from '@/assets/steps/step1.svg'
import step1activeImg from '@/assets/steps/step1active.svg'
import step2Img from '@/assets/steps/step2.svg'
import step2activeImg from '@/assets/steps/step2active.svg'
import step3Img from '@/assets/steps/step3.svg'
import step3activeImg from '@/assets/steps/step3active.svg'
import step4activeImg from '@/assets/steps/step4active.svg'
import step4Img from '@/assets/steps/step4.svg'


defineProps(['activeStep'])
</script>
<style lang="scss" scoped>
.compose_steps {
  padding: 10px;
  width: 100%;
  height: fit-content;
  border-radius: 16px;
  // background: #DCEEF605;
  border: 1px solid #FFFFFF0D;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000B5;

}

.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  // color: white;
}

.compose_hr {
  border-bottom: 1px solid #00C9FF57;
  margin: 0px;
  margin-top: 5px;
  margin-right: -10px;
  margin-left: -10px;
}

.step_text {
  font-size: clamp(10px, 0.8vw, 14px);
  font-family: 'Syne', sans-serif;

  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  padding-top: 5px;
  color: #94a3b8;

  &.active {
    color: #00C9FF;
  }
}
</style>
