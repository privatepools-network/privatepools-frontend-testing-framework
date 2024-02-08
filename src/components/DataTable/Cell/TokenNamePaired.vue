<template>
  <div class="token-name-container">
    <div v-if="route.name === 'Manage Pools'">
      
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
    <div v-else>
    <img
      
      class="pair_avatars"
      :class="{ pair_avatars_active: tokenEntities.length <= 5 }"
      :data-tooltip="tokenEntity.short"
      v-for="(tokenEntity, tokenEntityIndex) in tokenEntities"
      :key="`token-entity-key-${tokenEntityIndex}`"
      :src="tokenEntity.icon"
      :title="tokenEntity.short"
    />
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
    color: #ffffff;
    margin-left: 8px;
  }
}

.pair_avatars {
  width: 30px;
  margin-right: -2px;
}
.pair_avatars_manage_pool {
  width: 22px;
  margin-right: -2px;
}

.pair_avatars_active {
  margin-right: 0;
  &:not(:first-child) {
    margin-left: -2px;
  }
}
</style>
