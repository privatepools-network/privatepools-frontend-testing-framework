<template>
  <div style="position: relative; cursor: text">
    <vue-select
      :options="selectOptions"
      label-by="id"
      searchable
      @search:input="handleInput"
      :search-placeholder="''"
      :placeholder="''"
      :clear-on-select="true"
    >
      <template #dropdown-item="{ option }">
        <div v-if="isArrayOnlyFirstTokenAndFirstPool(selectOptions)">
          <div v-if="option.firstToken" class="p-10 text-center !text-black dark:!text-white font-semibold">
            No results with: {{ searchInput }}
          </div>
        </div>
        <div v-else>
          <div v-if="option.firstToken" class="search_groups !text-black dark:!text-[#7d7d7d]">
            <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 7L5.92308 2.2L10.8462 7L17 1M17 1H13.0615M17 1V4.84"
                stroke="#686868"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ $t('popular_tokens') }}
          </div>
          <template v-if="option.tokens">
            <div class="p-2 d-flex align-items-center justify-content-between gap-2" @click="goToFilteredPools(option.img)">
              <div class="d-flex align-items-center gap-2">
                <img :src="getTokenEntity(option.img, 'short').icon" width="38" />
                <div class="d-flex flex-column">
                  <div class="drop-shadow-lg text-[12px] !text-black dark:!text-white">
                    {{ option.label }}
                  </div>
                  <div class="drop-shadow-lg text-[10px] !text-black dark:!text-[#7d7d7d]">
                    {{ option.img }}
                  </div>
                </div>
              </div>
              <div>
                <div class="d-flex flex-column align-items-end">
                  <div class="drop-shadow-lg text-[12px] font-['Roboto_Mono',_monospace] !text-black dark:!text-white">
                    {{ option[`price${postfix}`] }}
                  </div>
                  <div style="font-size: 10px" class="d-flex align-items-center font-['Roboto_Mono',_monospace] gap-1 text-[12px] !text-black dark:!text-[#8e8e8e]">
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_74_4052)">
                        <path
                          d="M5.44288 3.82129C5.75064 4.35474 5.36567 5.02152 4.74981 5.02172L1.60344 5.02356C0.986982 5.02415 0.601322 4.3566 0.909584 3.82268L2.48436 1.09508C2.79262 0.561153 3.56357 0.561368 3.87129 1.09553L5.44288 3.82129Z"
                          fill="#40B66B"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_74_4052">
                          <rect width="5.12436" height="5.12436" fill="white" transform="translate(4.4375 7) rotate(-150)" />
                        </clipPath>
                      </defs>
                    </svg>
                    {{ option.percentChange }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-if="option.firstPool" class="search_groups !text-black dark:!text-[#7d7d7d]">
            <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 7L5.92308 2.2L10.8462 7L17 1M17 1H13.0615M17 1V4.84"
                stroke="#686868"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ $t('top_picks') }}
          </div>
          <template v-if="option.pools">
            <div class="p-2 d-flex align-items-center justify-content-between gap-2" @click="goToPool(option.poolId, option.chainId, option.type)">
              <div class="d-flex align-items-center gap-2">
                <img
                  class="pair_avatars_manage_pool"
                  :data-tooltip="tokenEntity"
                  v-for="(tokenEntity, tokenEntityIndex) in option.img"
                  :key="`token-entity-key-${tokenEntityIndex}`"
                  :src="computedTokenImage(tokenEntity)"
                  :title="tokenEntity"
                />
                <div class="d-flex flex-column">
                  <div class="drop-shadow-lg text-[12px] !text-black dark:!text-white ml-[18px]">
                    {{ option.label }}
                  </div>
                  <div class="drop-shadow-lg !text-black dark:!text-[#7d7d7d] ml-[18px] text-[10px]">
                    {{ option.desc }}
                  </div>
                </div>
              </div>
              <div>
                <div class="d-flex flex-column align-items-end">
                  <div class="drop-shadow-lg text-[12px] font-['Roboto_Mono',_monospace] !text-black dark:!text-white ml-[18px]">
                    {{ option[`price${postfix}`] }}
                  </div>
                  <div class="d-flex align-items-center gap-1 drop-shadow-lg font-['Roboto_Mono',_monospace] text-[12px] !text-black dark:!text-[#7d7d7d] ml-[18px]">
                    <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_74_4052)">
                        <path
                          d="M5.44288 3.82129C5.75064 4.35474 5.36567 5.02152 4.74981 5.02172L1.60344 5.02356C0.986982 5.02415 0.601322 4.3566 0.909584 3.82268L2.48436 1.09508C2.79262 0.561153 3.56357 0.561368 3.87129 1.09553L5.44288 3.82129Z"
                          fill="#40B66B"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_74_4052">
                          <rect width="5.12436" height="5.12436" fill="white" transform="translate(4.4375 7) rotate(-150)" />
                          </clipPath>
                      </defs>
                    </svg>
                    {{ option.percentChange }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </vue-select>
    <div v-if="!searchInput" style="position: absolute; left: 36px; top: 7px; pointer-events: none">
      <v-typical
        class="text-[12px] text-[#7d7d7d] font-medium blink"
        :steps="['Search tokens for market insights', 1000, 'Search liquidity pools for depth analysis', 1000, 'Search indexes aligned with your preferences', 1000]"
        :loop="Infinity"
        :wrapper="'span'"
      ></v-typical>
    </div>
    <div style="position: absolute; left: 7px; top: 9px; color: #858c90">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M17.9417 17.0583L14.7408 13.8575C15.8108 12.5883 16.4583 10.9525 16.4583 9.16667C16.4583 5.14583 13.1875 1.875 9.16667 1.875C5.14583 1.875 1.875 5.14583 1.875 9.16667C1.875 13.1875 5.14583 16.4583 9.16667 16.4583C10.9525 16.4583 12.5883 15.8108 13.8575 14.7408L17.0583 17.9417C17.18 18.0633 17.34 18.125 17.5 18.125C17.66 18.125 17.82 18.0642 17.9417 17.9417C18.1858 17.6983 18.1858 17.3025 17.9417 17.0583ZM3.125 9.16667C3.125 5.835 5.835 3.125 9.16667 3.125C12.4983 3.125 15.2083 5.835 15.2083 9.16667C15.2083 12.4983 12.4983 15.2083 9.16667 15.2083C5.835 15.2083 3.125 12.4983 3.125 9.16667Z"
          fill="#9B9B9B"
        />
      </svg>
    </div>

    <div class="bg-[#22222212] rounded py-1 px-2" style="position: absolute; right: 12px; top: 11px; color: #7d7d7d">
      <svg width="5" height="12" viewBox="0 0 5 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.35511 0.863636L1.54261 11.3125H0.191761L3.00426 0.863636H4.35511Z" fill="#7D7D7D" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import router from '@/router';
import VueSelect from 'vue-next-select';
import 'vue-next-select/dist/index.css';
import VTypical from 'vue-typical';
import { DisplayChain } from '@/composables/useNetwork';
import { getTokenEntity } from '@/lib/helpers/util';
import computedTokenImage from '@/composables/useComputedTokenImage';
import { storeToRefs } from 'pinia';
import { useSettings } from '@/store/settings';

const settingsStore = useSettings();
const { currentCurrency } = storeToRefs(settingsStore);
const postfix = computed(() => (currentCurrency.value == 'USD' ? '' : `_${currentCurrency.value}`));

defineProps(['selectOptions', 'handleInput', 'searchInput']);

function goToPool(poolId, chainId, type) {
  if (router.currentRoute.value.path.startsWith('/pools')) {
    router.push(
      `/pools/${type == 'Concentrated Liquidity' ? 'CLdetails' : 'details'}/${poolId}/${DisplayChain[chainId]}/info`
    );
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } else {
    router.push(
      `/pools/${type == 'Concentrated Liquidity' ? 'CLdetails' : 'details'}/${poolId}/${DisplayChain[chainId]}/info`
    );
  }
}

function goToFilteredPools(token) {
  if (router.currentRoute.value.path.startsWith('/pools')) {
    router.push({ path: `/pools`, query: { token } });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } else {
    router.push({ path: `/pools`, query: { token } });
  }
}

function isArrayOnlyFirstTokenAndFirstPool(array) {
  let count = 0;
  for (let obj of array) {
    // Check if the object has either 'firstToken' or 'firstPool' set to true
    if (obj.firstToken === true || obj.firstPool === true) {
      count++;
    } else {
      // If not, break out of the loop since we don't need to check further
      break;
    }
  }

  // Compare the count with the length of the array
  return count === array.length;
}
</script>

<style lang="scss" scoped></style>
