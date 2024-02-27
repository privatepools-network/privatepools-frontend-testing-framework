<template>
  <CModal alignment="normal" :visible="tokenSelectModal">
    <!-- <CModalHeader :close-button="false">
    </CModalHeader> -->
    <CModalBody>
      <div class="modal_body_inside">
        <div>
          <div class="modal_body_header d-flex justify-content-between align-items-start mb-3">
            <p style="font-size: 20px">Token search</p>
            <div class="back_button" @click="tokenSelectModal = false">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6 6L18 18" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          <CInputGroup class="d-flex align-items-normal justify-content-start search-input-group">
            <CAvatar :src="Search" class="search-input-avatar" />
            <CFormInput type="text" placeholder="Search by name, symbol or address" style="color: #fff !important"
              aria-label="Search by name, symbol or address" class="search-input" v-model="filterName"
              v-on:keyup.enter="emit('addToken', filterName)" />
          </CInputGroup>

          <div class="mt-3">
            <div style="color: white; font-size: 16px">Common Tokens</div>
            <div class="d-flex flex-wrap gap-3 justify-content-between">
              <div class="common_token d-flex gap-2">
                <img :src="getTokenEntity('BTC', 'short').icon" width="30" />
                BTC
              </div>
              <div class="common_token d-flex gap-2">
                <img :src="getTokenEntity('BTC', 'short').icon" width="30" />
                BTC
              </div>
              <div class="common_token d-flex gap-2">
                <img :src="getTokenEntity('BTC', 'short').icon" width="30" />
                BTC
              </div>
              <div class="common_token d-flex gap-2">
                <img :src="getTokenEntity('BTC', 'short').icon" width="30" />
                BTC
              </div>
              <div class="common_token d-flex gap-2">
                <img :src="getTokenEntity('BTC', 'short').icon" width="30" />
                BTC
              </div>
              <div class="common_token d-flex gap-2">
                <img :src="getTokenEntity('BTC', 'short').icon" width="30" />
                BTC
              </div>
              <div class="common_token d-flex gap-2">
                <img :src="getTokenEntity('BTC', 'short').icon" width="30" />
                BTC
              </div>
              <div class="common_token d-flex gap-2">
                <img :src="getTokenEntity('BTC', 'short').icon" width="30" />
                BTC
              </div>
            </div>
          </div>
          <div class="mt-3 tokens_container">
            <div v-for="(token, index) in filteredPossibleTokens" :key="`tokens-key-${index}`"
              class="d-flex align-items-center justify-content-between p-3 gap-3 token_card" @click="
                emit('updateToken', { ...token }, props.pairIndex), emit('tokenSelectModalOpen')
                ">
              <div class="d-flex align-items-center">
                <img :src="token.logoURI || getTokenEntity(token.symbol, 'short').icon
                  " width="60" class="p-2" />
                <div class="d-flex flex-column">
                  <div class="modal_body_header">{{ token.symbol }}</div>
                  <div class="modal_body_header">{{ token.name }}</div>
                </div>
              </div>
              <div class="d-flex flex-column align-items-end text-white">
                <div>{{ token.balance }} {{ token.symbol }}</div>
                <div>${{ token.balance * token.price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CModalBody>
  </CModal>
</template>

<script setup>
import Search from '@/assets/images/search.png'
import { ref, defineProps, defineEmits, computed, toRefs } from 'vue'
import { getTokenEntity } from '@/lib/helpers/util'
const props = defineProps([
  'tokenSelectModal',
  'possibleComposeTokens',
  'pairIndex',
])
const { possibleComposeTokens } = toRefs(props)
const emit = defineEmits(['updateToken', 'addToken', 'tokenSelectModalOpen'])
const filterName = ref('')

const filteredPossibleTokens = computed(() =>
  possibleComposeTokens.value.filter(
    (t) =>
      filterName.value == '' ||
      t.symbol.toLowerCase().includes(filterName.value.toLowerCase()) ||
      t.address.toLowerCase().includes(filterName.value.toLowerCase()),
  ),
)
</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.token-input {
  background-color: transparent;
  border: none;
  outline: none;
}

.modal_body_header {
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.5px;
  color: white;
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

.token_card:hover {
  overflow-y: auto;
  border-radius: 20px;
  cursor: pointer;
  background: rgba(152, 161, 192, 0.08);
}

.tokens_container {
  height: 55vh;
  overflow-y: auto;
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
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 28px;
  color: white;
  padding: 8px;
}
</style>
@/composables/math/investMath/useInvestMath@/composables/poolActions/deposit/useApproveTokens
