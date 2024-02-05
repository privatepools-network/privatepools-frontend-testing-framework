<template>
  <div class="token-name-container" :class="{'token-name-container_small':isSmall==true}">
    <img :src="tokenEntity.icon" :alt="tokenEntity.short" width="25" class="p-1"/>
    <div class="name" v-if="isSmall==false">{{ tokenEntity.name }}</div>
    <div class="short" v-if="isSmall==false">{{ tokenEntity.short }}</div>
    <div class="name" v-if="isSmall==true">{{ tokenEntity.short }}</div>
  </div>
</template>

<script setup>
import { getTokenEntity } from '@/lib/helpers/util'
import { defineProps, computed, toRefs } from 'vue'
const props = defineProps(['value', 'isSmall'])
const tokenEntity = computed(() => getTokenEntity(props.value))
const {isSmall} = toRefs(props)
// console.log("tokenEntity", tokenEntity)

</script>

<style lang="scss" scoped>
.token-name-container {
  display: flex;
  align-items: center;

  .name {
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0em;
    color: #ffffff;
  }

  .short {
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0em;
    color: #6C7284;
    margin-left: 8px;
  }
  &_small {
    @media (max-width: 1400px) {
      .name {
        font-size: 10px;
      }
    }
  }
}
</style>
