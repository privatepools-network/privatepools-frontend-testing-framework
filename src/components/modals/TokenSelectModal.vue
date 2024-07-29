<template>
  <div class="modal_body_inside">
    <div>
      <div
        class="modal_body_header d-flex justify-content-between align-items-start mb-1"
      >
        <p style="font-size: 20px" class="dark:!text-white text-black">
          {{ $t('token_search') }}
        </p>
      </div>

      <label
        for="search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        {{ $t('search') }}
      </label>
      <div class="relative">
        <div
          class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="search"
          class="block w-full ps-10 text-sm text-gray-900 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-[#02031c] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          :placeholder="t('search_by_name_symbol_address')"
          aria-label="Search by name, symbol or address"
          v-model="filterName"
        />
      </div>

      <div class="mt-3">
        <div class="dark:!text-white text-black text-base">
          {{ $t('common_tokens') }}
        </div>
        <div class="d-flex flex-wrap gap-3">
          <div
            class="common_token text-black dark:!text-white d-flex gap-2"
            v-for="token in commonTokens"
            :key="token.symbol"
            @click="$emit('updateToken', { ...token }), $emit('close')"
          >
            <img
              :src="getTokenEntity(token.symbol, 'short').icon || token.logoURI"
              width="30"
            />
            {{ token.symbol }}
          </div>
        </div>
      </div>
      <!-- {{ console.log('filteredPossibleTokens', filteredPossibleTokens) }} -->
      <!-- {{ console.log('possibleComposeTokens', possibleComposeTokens) }} -->
      <div class="mt-3 tokens_container">
        <div
          class="flex items-center justify-center h-full"
          v-if="possibleComposeTokens.length === 0"
        >
          <LoaderPulse />
        </div>
        <div
          class="flex items-center justify-center h-full text-white font-semibold"
          v-else-if="filteredPossibleTokens.length === 0"
        >
          No result
        </div>
        <div
          v-else
          v-for="(token, index) in filterName === '' ? filteredPossibleTokens.filter((el) => el.img !== '') : filteredPossibleTokens"
          :key="`tokens-key-${index}`"
          class="flex items-center justify-between p-3 gap-3 token_card"
          @click="$emit('updateToken', token), $emit('close')"
        >
          <div class="d-flex align-items-center">
            <img
              :src="token.logoURI || getTokenEntity(token.symbol, 'short').icon"
              width="60"
              class="p-2"
            />
            <div class="d-flex flex-column">
              <div class="modal_body_header text-black dark:!text-white">
                {{ token.symbol }}
              </div>
              <div class="modal_body_header text-black dark:!text-white">
                {{ token.name }}
              </div>
            </div>
          </div>
          <div
            class="d-flex flex-column align-items-end text-black dark:!text-white"
          >
            <div>
              {{ parseFloat(token.balance).toFixed(6) }} {{ token.symbol }}
            </div>
            <div>${{ parseFloat(token.balance * token.price).toFixed(3) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, toRefs } from 'vue'
import { t } from 'i18next'

import Modal from '@/UI/Modal.vue'
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import { getTokenEntity } from '@/lib/helpers/util'
import { COMMON_TOKENS } from '@/composables/poolActions/compose/usePossibleComposeTokens'

const props = defineProps(['isOpen', 'possibleTokens', 'possibleComposeTokens'])
const { possibleTokens } = toRefs(props)

const emit = defineEmits(['updateToken', 'close'])

const filterName = ref('')

const filteredPossibleTokens = computed(() =>
  possibleTokens.value
    .filter(
      (t) =>
        filterName.value == '' ||
        t.symbol.toLowerCase().includes(filterName.value.toLowerCase()) ||
        t.address.toLowerCase().includes(filterName.value.toLowerCase()),
    )
    .slice(0, 50),
)

const commonTokens = computed(() => {
  return possibleTokens.value
    .filter((item) => COMMON_TOKENS.includes(item.name))
    .slice(0, 8)
})
</script>

<style lang="scss" scoped>
@import '@/styles/_variables.scss';

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

  font-size: 14px;
  font-weight: 500;
  line-height: 28px;
  // color: white;
  padding: 8px;
  &:hover {
    cursor: pointer;
    background: #304d6930;
  }
}
</style>