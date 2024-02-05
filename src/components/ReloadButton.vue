<template>
     <div class="reload" style="color: #8B93A7; display: flex; align-items: center; gap: 5px;">Data updated <span style="color: #01B47E;">{{ago}}</span><CIcon @click="fetchTradingData" :class="isLoading ? 'reload_button__active' : ''" class="reload_button" :icon="RefreshSvg" alt="Refresh"  size="lg" style="rotate: 18deg; cursor: pointer; margin-left: 4px;"/></div>
</template>
  
  <script>
  import {RefreshSvg} from '@/assets/icons/refresh'

  export default {
    name: 'ReloadButton',
    props: {
        isLoading: {
      type: Boolean,
    },
    fetchTradingData: {
      type: Function,
    },
    ago: {
        
    }
  },
  data() {
    return {
        RefreshSvg
    }
  }
  }
  </script>
<style lang="scss">
@import '@/styles/_variables.scss';


.reload {
  font-size: 13px;
}

@media (min-width: $md) {
  .reload {
    font-size: 18px;
}
}

</style>