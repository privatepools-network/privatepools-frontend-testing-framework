<template>
  <div class="token-name-container text-black dark:!text-white">
    <div v-if="route.name === 'Manage Pools'" class="flex flex-wrap">
      
    <img
  
      class="pair_avatars_manage_pool"
      :class="{ pair_avatars_active: tokenEntities.length <= 5 }"
      :data-tooltip="tokenEntity.short"
      v-for="(tokenEntity, tokenEntityIndex) in tokenEntities"
      :key="`token-entity-key-${tokenEntityIndex}`"
      :src="tokenEntity.icon"
      :title="tokenEntity.short"
    />
   
  </div>
    <div v-else class="flex flex-wrap items-center">
    <img
      
      class="pair_avatars"
      :class="{ pair_avatars_active: tokenEntities.length <= 5 }"
      :data-tooltip="tokenEntity.short"
      v-for="(tokenEntity, tokenEntityIndex) in tokenEntities"
      :key="`token-entity-key-${tokenEntityIndex}`"
      :src="tokenEntity.icon"
      :title="tokenEntity.short"
    />
    <div class="flex items-center gap-1 pl-1" v-if="route.name === 'Portfolio' ">
    <div class="pool_type text-white" :class="'pool_type_WP'">WLP</div>
   <!-- <div class="range_container"><span class="pulse_blue"></span> In range</div> --> 
  </div>
  </div>

    <!-- {{ console.log("tokenEntity",tokenEntities) }}
    <div class="short" v-if="tokenEntities.length <= 5">
      {{ tokenEntities?.map((tokenEntity) => tokenEntity.short).join('/') }}
    </div> -->
  </div>
</template>

<script setup>
import { getTokenEntity } from '@/lib/helpers/util'
import { defineProps, computed } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()
console.log('route', route)

const props = defineProps(['value'])

const tokenEntities = computed(() => {
  let tokens = props?.value?.flat()
  let entities = tokens?.map((propValue) => getTokenEntity(propValue, 'short'))
  return entities
})
</script>

<style lang="scss" scoped>
.token-name-container {
  display: flex;
  align-items: center;
  padding-left: 30px;
  .avatar {
    &:not(:first-child) {
      margin-left: -20px;
    }
  }

  .short {
    font-size: 14px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0em;
    // color: #ffffff;
    margin-left: 8px;
  }
}

.pair_avatars {
  width: 30px;
    background: white;
    border-radius: 100%;
    border: 2px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
  margin-right: -2px;
}
.pair_avatars_manage_pool {
  width: 32px;
    background: white;
    border-radius: 100%;
    border: 2px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
  margin-right: -2px;
  
}

.pair_avatars_active {
  margin-right: 0;
  &:not(:first-child) {
    margin-left: -2px;
  }
}

.range_container {
  border-radius: 8px;
  background: #FFFFFF1A;
  font-weight: 500;
  font-family: 'Syne', sans-serif;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  padding: 4px;
}
</style>
