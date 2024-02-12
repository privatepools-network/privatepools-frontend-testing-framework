<template>
  <div class="new-tokens-container">
    <div class="d-flex flex-column gap-2">
      <div class="d-flex gap-2 justify-content-between">
        <div class="pool-info-single">
          <div class="pool-info-heading">LP Symbol</div>
          <div>
            WPT-{{
              pool?.tokens?.map((tokenEntity) => tokenEntity.symbol).join('-')
            }}
          </div>
        </div>
        <div class="pool-info-single">
          <div class="pool-info-heading">Pool Contract</div>
          <div
            class="d-flex align-items-center gap-1"
            style="color: #00C9FF"
          >
            <div>
              {{
                pool?.id?.substring(0, 6) +
                '....' +
                pool?.id?.substring(pool?.id?.length - 4)
              }}
            </div>
            <a target="_blank" :href="trackCurrentNetwork.name === 'arbitrum'
                  ? `${process.env.VUE_APP_EXPLORER_ARBITRUM}/address/${pool?.id?.substring(0, 42)}`
                  : trackCurrentNetwork.name === 'bnb'
                  ? `${process.env.VUE_APP_EXPLORER_BINANCE}/address/${pool?.id?.substring(0, 42)}`
                  : trackCurrentNetwork.name === 'matic'
                  ? `${process.env.VUE_APP_EXPLORER_POLYGON}/address/${pool?.id?.substring(0, 42)}`
                  : process.env.VUE_APP_EXPLORER_ARBITRUM">
            <img :src="link" />
          </a>
          </div>
        </div>
        <div class="pool-info-single">
          <div class="pool-info-heading">Pool Owner</div>
          <div
            class="d-flex align-items-center gap-1"
            style="color: #00C9FF"
          >
            <div>
              {{
                pool?.owner?.substring(0, 6) +
                '....' +
                pool?.owner?.substring(pool?.owner?.length - 4)
              }}
            </div>
            <a   target="_blank" :href="trackCurrentNetwork.name === 'arbitrum'
                  ? `${process.env.VUE_APP_EXPLORER_ARBITRUM}/address/${pool?.owner}`
                  : trackCurrentNetwork.name === 'bnb'
                  ? `${process.env.VUE_APP_EXPLORER_BINANCE}/address/${pool?.owner}`
                  : trackCurrentNetwork.name === 'matic'
                  ? `${process.env.VUE_APP_EXPLORER_POLYGON}/address/${pool?.owner}`
                  : process.env.VUE_APP_EXPLORER_ARBITRUM ">
            <img :src="link" />
          </a>
          </div>
        </div>
      </div>

      <div class="d-flex gap-2 justify-content-between">
        <div class="pool-info-single">
          <div class="pool-info-heading">Factory Contract</div>
          <div
            class="d-flex align-items-center gap-1"
            style="color: #00C9FF"
          >
            <div>
              {{
                pool?.factory?.substring(0, 6) +
                '....' +
                pool?.factory?.substring(pool?.factory?.length - 4)
              }}
            </div>
            <a   target="_blank" :href="trackCurrentNetwork.name === 'arbitrum'
                  ? `${process.env.VUE_APP_EXPLORER_ARBITRUM}/address/${pool?.factory}`
                  : trackCurrentNetwork.name === 'bnb'
                  ? `${process.env.VUE_APP_EXPLORER_BINANCE}/address/${pool?.factory}`
                  : trackCurrentNetwork.name === 'matic'
                  ? `${process.env.VUE_APP_EXPLORER_POLYGON}/address/${pool?.factory}`
                  : process.env.VUE_APP_EXPLORER_ARBITRUM">
            <img :src="link" />
          </a>
          </div>
        </div>
        <div class="pool-info-single">
          <div class="pool-info-heading">Vault</div>
          <div
            class="d-flex align-items-center gap-1"
            style="color: #00C9FF"
          >
            <div>
              {{
                trackCurrentNetwork.name === 'arbitrum'
                  ? '0x82A8d....9182661AB59'
                  : trackCurrentNetwork.name === 'bnb'
                  ? '0x36B12....21923E3fD63'
                  : trackCurrentNetwork.name === 'matic'
                  ? '0x30b5c....9361eEa5972'
                  : '0x82A8d....9182661AB59'
              }}
            </div>
            <a   target="_blank" :href="trackCurrentNetwork.name === 'arbitrum'
                  ? `${process.env.VUE_APP_EXPLORER_ARBITRUM}/address/0x82A8d8B59a13eD9df879C1f450a379182661AB59`
                  : trackCurrentNetwork.name === 'bnb'
                  ? `${process.env.VUE_APP_EXPLORER_BINANCE}/address/0x36B129B35Ac950b15558973fc246121923E3fD63`
                  : trackCurrentNetwork.name === 'matic'
                  ? `${process.env.VUE_APP_EXPLORER_POLYGON}/address/0x30b5c675a948e947aAc6eD4fC74439361eEa5972`
                  : process.env.VUE_APP_EXPLORER_ARBITRUM ">
            <img :src="link" />
          </a>
          </div>
        </div>
        <div class="pool-info-single">
          <div class="pool-info-heading">Number of investors</div>
          <div>{{ pool?.holdersCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import link from '@/assets/icons/link.svg'
import { defineProps, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const trackCurrentNetwork = computed(() => {
  return store.getters.getCurrentNetwork
})

defineProps(['pool'])
</script>
<style lang="scss">
.new-tokens-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #181c1f;
  border: 1px solid rgba(1, 180, 126, 0.35);
  border-radius: 5px;
  padding-top: 15px;
  padding-bottom: 15px;
}
.pool-info-single {
  color: rgba(193, 193, 209, 1);
  background-color: rgba(59, 97, 65, 0.06);
  padding: 8px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 33%;
  font-size: 14px;
}
.pool-info-heading {
  font-size: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: 600;
}
</style>
