<template>
  <div class="compose_steps">
    <div class="compose_text">Token Prices
      <!-- <svg v-if="activeStep === 2" width="15" height="15" viewBox="0 0 20 20" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0.833008 17.4993L9.99967 1.66602L19.1663 17.4993H0.833008ZM3.70801 15.8327H16.2913L9.99967 4.99935L3.70801 15.8327ZM9.99967 14.9993C10.2358 14.9993 10.4338 14.9193 10.5938 14.7593C10.7538 14.5993 10.8336 14.4016 10.833 14.166C10.833 13.9299 10.753 13.7321 10.593 13.5727C10.433 13.4132 10.2352 13.3332 9.99967 13.3327C9.76356 13.3327 9.56579 13.4127 9.40634 13.5727C9.2469 13.7327 9.1669 13.9305 9.16634 14.166C9.16634 14.4021 9.24634 14.6002 9.40634 14.7602C9.56634 14.9202 9.76412 14.9999 9.99967 14.9993ZM9.16634 12.4993H10.833V8.33268H9.16634V12.4993Z"
          fill="#F84747" />
      </svg> -->

    </div>
    <hr class="compose_hr" />
    <div>
      <div class="mt-3 d-flex flex-column justify-content-center gap-0">
        <div class="d-flex flex-column gap-3">


          <div class="d-flex justify-content-between w-100 compose_text" v-for="token in tokenPrices" :key="token.symbol">
            <div>{{ token.symbol }}</div>
            <div>${{ parseFloat(token.price).toFixed(4) }}</div>
          </div>

        </div>


      </div>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps(['tokenPrices', 'activeStep'])

</script>
<style lang="scss" scoped>
.compose_steps {
  padding: 10px;
  width: 100%;

  height: fit-content;
  border-radius: 15.289px;
  background: linear-gradient(153deg, #000 0%, rgba(0, 0, 0, 0.00) 100%);
  backdrop-filter: blur(20.067087173461914px);
}

.compose_text {
  font-size: clamp(11px, 0.8vw, 15px);
  color: white;
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
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  padding-top: 5px;
  color: #94a3b8;

  &.active {
    color: #7ef6b2;
  }
}
</style>
