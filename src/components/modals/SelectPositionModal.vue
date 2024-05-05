<template>
  <div class="modal_body_inside z-[10000]">
    <div>
      <div
        class="modal_body_header text-black dark:!text-white d-flex justify-content-between align-items-start mb-3"
      >
        <p style="font-size: 20px">{{ $t('select_position') }}</p>
       
      </div>

      <div class="mt-3">
        <div style="font-size: 14px" class="text-black dark:!text-white">Your CL Positions</div>
      </div>
      <div class="mt-3 tokens_container h-[400px] overflow-auto">
        <div
          v-for="(pos, PosIndex) in positions"
          :key="`tokens-key-${PosIndex}`"
          class="p-3 gap-3 token_card dark:!bg-[#00000024] bg-white text-black dark:!text-white"
          @click="selectPositionHandler(PosIndex)"
        >
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-1">
              <img
                class="pair_avatars_manage_pool"
                v-for="(tokenEntity, tokenEntityIndex) in pos.tokens"
                :key="`token-entity-key-${tokenEntityIndex}`"
                :title="tokenEntity"
                :src="getTokenEntity(tokenEntity, 'short').icon"
              />
              <span class="liquidity_title">{{ pos.name }}</span>
              <span class="fee_container">{{ pos.fee }} {{ $t('fee') }}</span>
            </div>
            <div>{{ pos.CLP }}</div>
          </div>
          <div class="d-flex align-items-center justify-content-between">
            <div>{{ $t('position_size') }}</div>
            <div>{{ pos.positionSize }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, toRefs } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
const props = defineProps(['selectPositionModalState', 'positions'])

const emit = defineEmits(['updateToken', 'selectPositionHandler'])

function selectPositionHandler(positionIndex) {
  emit('selectPositionHandler', positionIndex)
}
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.pair_avatars_manage_pool {
  width: 18px;
  margin-right: -2px;
}

.fee_container {
  background: #191919;
  padding: 2px;
  border-radius: 16px;
  
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  color: white;
  text-align: center;
  box-shadow: 0px 4px 4px 0px #00000040;
}

.token-input {
  background-color: transparent;
  border: none;
  outline: none;
}

.modal_body_header {
  
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  // color: white;
}

.modal_body_inside {
  // padding: 0px 110px;
}

.modal_balance_slider {
  margin-top: 20px;
  color: white;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
}

.modal_total_container {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 15px;
  font-size: 14px;
}

.modal_stake_preview {
  border: 1px solid rgba(163, 164, 165, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 14px;
}

.modal_preview_button {
  color: white;
  width: 100%;
  background: linear-gradient(89.26deg, #00c9ff 5.07%, #7ef6b2 99.37%);
  border-radius: 20px;
}

.deposit-settled {
  border: 1px solid rgba(1, 180, 126, 0.6);
  border-radius: 20px;
  width: 100%;
  height: 400px;
  margin-bottom: 30px;
  margin-top: 30px;
  padding: 30px 40px;
}

:deep(.range-slider) {
  background: transparent;
  border-radius: 8px;
  padding: 0;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 12px;
  outline: none;
  transition: opacity 0.2s;
  position: relative;

  /* Styling the track */
  &::-webkit-slider-runnable-track {
    height: 12px;
    background: rgba(59, 97, 65, 0.11);
    border-radius: 8px;
  }

  &::-moz-range-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  &::-moz-range-progress {
    background-color: #00c9ff;
    height: 12px;
    border-radius: 8px 0 0 8px;
  }

  &::-ms-track {
    height: 12px;
    background: #ffffff29;
    border-radius: 8px;
  }

  /* Styling the thumb */
  &::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -1px;
    /* necessary to center the thumb in the track */
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
  }

  &::-ms-thumb {
    width: 14px;
    height: 14px;
    background: #c1c1d1;
    border-radius: 50%;
    cursor: pointer;
    margin-top: 0;
  }
}

.bg-transparent {
  background-color: transparent;
}

.search-input {
  font-size: 12px;
  color: white !important;

  @media (max-width: $xxl) {
    font-size: 10px;
    padding: 0px 12px;
  }

  &-group {
    border-radius: 24px;
    background: transparent;
    padding: 1px 8px;
    width: 100%;
    color: #fff;

    @media (max-width: $xxl) {
      // width: 150px;
      padding: 4px 0;
    }
  }

  &::placeholder {
    color: #fff !important;
  }

  &-avatar {
    width: 15px;
    margin-left: 10px;
    margin-top: 2px;

    @media (max-width: $xxl) {
      width: 20px;
      // height: 15px;
    }
  }
}

.token_card {
  // border-radius: 16px;
  box-shadow: 0px 4px 7.4px 0px #000000b5;
  padding: 10px;
  // background: #00000024;
  // color: white;
  font-size: clamp(12px, 0.8vw, 14px);
}

.token_card:hover {
  cursor: pointer;
  // background: rgba(152, 161, 192, 0.08);
}

.tokens_container {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tokens_container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
  background-color: #02120a;
  border-radius: 50px;
  margin-bottom: 10px;
}

.tokens_container::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
  background: #02120a;
  border-radius: 50px;
  margin-bottom: 10px;
}

.tokens_container::-webkit-scrollbar-thumb {
  border: 2px solid #02120a;
  background: #00c9ff;
  border-radius: 21px;
}

.back_button {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #00000024;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border: 1px solid #ffffff0d;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.common_token {
  border-radius: 10px;
  background: #2f303230;
  
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  color: white;
  padding: 8px;
}
</style>
@/composables/math/investMath/useInvestMath@/composables/poolActions/deposit/useApproveTokens
