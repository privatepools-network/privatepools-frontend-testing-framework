<template>
  <div class="flex flex-col items-center gap-[6px]">
    <div class="position-relative w-[35px] h-[35px]">
      <div
        v-if="activeStep < displayedActiveStep && !mmActive"
        :class="'step_number'"
      >
        {{ displayedActiveStep }}
      </div>
      <div
        v-else-if="mmActive && activeStep === displayedActiveStep"
        class="step_number"
      >
        <img :src="metamask" width="20" />
      </div>
      <div
        v-else-if="activeStep > displayedActiveStep"
        class="step_number !bg-[#00E0FF]"
      >
        <svg
          width="17"
          height="13"
          viewBox="0 0 17 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.57825 9.642L15.2202 0L16.5005 1.28025L5.57825 12.2025L0.5 7.12575L1.78025 5.8455L5.57825 9.642Z"
            fill="#02031C"
          />
        </svg>
      </div>
      <div v-else class="step_number">
        {{ displayedActiveStep }}
      </div>
    </div>
    <div
      class="text-[12px] text-center w-[40px] text-[#00E0FF] font-['Syne',_sans-serif]"
    >
      {{ stepText }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import metamask from '@/assets/icons/approveTokenSteps/metamask.svg'

defineProps(['activeStep', 'mmActive', 'stepText', 'displayedActiveStep'])
</script>
<style lang="scss" scoped></style>
