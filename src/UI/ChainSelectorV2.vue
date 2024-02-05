<template>
  <div class="chain_selector_container">
    {{ console.log('path', path) }}
    <div
      v-for="(chain, i) in excludeAll ? chainOptions.filter(function (el) { return el.name != 'All Chains' }) : chainOptions"
      :key="`${i}-chain`">
      <div :class="chainSelected.name === chain.name ? 'chain_tag__active' : 'chain_tag'
        " @click="() => updateChain(chain)">
        {{ console.log('chain.name', chain.name) }}
        <img :src="chain.img" class="chain_image" v-if="chain.img !== ''" /> <span
          v-if="width > 768 || chain.name === 'All Chains'" class="chain_text">{{ chain.name }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, defineEmits, defineProps, computed } from 'vue'
import arb from '@/assets/images/networks/arbitrum2.png'
import polygon from '@/assets/images/networks/polygon.png'
import binance from '@/assets/icons/networks/binance.svg'
import { useRoute } from 'vue-router'
import { useDevice } from '@/composables/adaptive/useDevice'


defineProps(['excludeAll'])
const emit = defineEmits(['updateChain'])


const route = useRoute();
const { width } = useDevice()
const path = computed(() => route.path)


let chainOptions = [
  { name: 'All Chains', code: 'ALL', img: '' },
  process.env.VUE_APP_KEY_ARBITRUM ? { name: 'Arbitrum', code: 'ETH', img: arb } : undefined,
  process.env.VUE_APP_KEY_BINANCE ? { name: 'Binance', code: 'BNB', img: binance } : undefined,
  process.env.VUE_APP_KEY_POLYGON ? { name: 'Polygon', code: 'MATIC', img: polygon } : undefined,
].filter((item) => item != undefined)
if (chainOptions.length == 2) {
  chainOptions = [chainOptions[1]]
}
const chainSelected = ref(path.value === '/track/opportunities' || path.value === '/admin/bot' || path.value == '/rewards' ? (chainOptions[0].name == "All Chains" ? chainOptions[1] : chainOptions[0]) : chainOptions[0])

function updateChain(chain) {
  chainSelected.value = chain
  emit('updateChain', chain)
}
updateChain(chainSelected.value)

</script>
<style lang="scss">
@import '@/styles/_variables.scss';

.chain_selector_container {
  display: flex;
  gap: 10px;
  margin-bottom: 1.5vw;
}

.chain_tag {
  padding: 1px 8px 3px 8px;
  border: 1px solid #01b47e;
  border-radius: 15px;
  color: #7ef6b2;
}

.chain_tag:hover {
  background: #01b47ee1;
  color: white;
  cursor: pointer;
}

.chain_image {
  width: 20px;
}

.chain_text {
  font-family: Inter;
  font-size: clamp(10px, 0.6vw, 12px);
  font-weight: 500;
  line-height: 17px;
  letter-spacing: 0em;
}

.chain_tag__active {
  padding: 1px 8px 3px 8px;
  border: 1px solid #7ef6b2;
  border-radius: 15px;
  color: #ffffff;
  background-color: #01b47e;
}

.chain_tag__active:hover {
  background: #01b47e79;
  cursor: pointer;
}

@media (max-width:$xxl) {
  .chain_image {
    width: 15px;
  }

  .chain_tag {
    padding: 1px 8px 3px 8px;
    border: 1px solid #01b47e;
    border-radius: 15px;
    color: #7ef6b2;
  }

  .chain_tag__active {
    padding: 1px 8px 3px 8px;
    border: 1px solid #7ef6b2;
    border-radius: 15px;
    color: #ffffff;
    background-color: #01b47e;
  }
}

@media (max-width:$md) {
  .chain_image {
    width: 25px;
    padding: 0px;
  }

  .chain_tag {
    padding: 4px;

  }

  .chain_tag__active {
    padding: 4px;
  }
}
</style>
