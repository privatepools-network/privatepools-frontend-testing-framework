<template>
  <div class="pools-card__header">
    <div class="pools-card__avatar">
      <div class="pools-card__img" v-for="(tokenEntity, tokenEntityIndex) in tokenEntities"
           :key="`token-entity-key-${tokenEntityIndex}`">
        <img :src="tokenEntity.icon"/>
        <!-- <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
          <mask id="mask0_3682_16039" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="60"
                height="60">
            <path
                d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z"
                fill="url(#paint0_linear_3682_16039)"/>
          </mask>
          <g mask="url(#mask0_3682_16039)">
            <path
                d="M30 60C46.5685 60 60 46.5685 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60Z"
                fill="#31D8A4"/>
            <path
                d="M30 56C44.3594 56 56 44.3594 56 30C56 15.6406 44.3594 4 30 4C15.6406 4 4 15.6406 4 30C4 44.3594 15.6406 56 30 56Z"
                fill="white"/>
          </g>
          <defs>
            <linearGradient id="paint0_linear_3682_16039" x1="30" y1="0" x2="30" y2="87.7272"
                            gradientUnits="userSpaceOnUse">
              <stop stop-color="#08021E"/>
              <stop offset="1" stop-color="#1F0777"/>
            </linearGradient>
          </defs>
        </svg> -->
      </div>

    </div>
    <div class="pools-card__label">
      <div class="pools-card__name">
        {{ tokenEntities.map((tokenEntity) => tokenEntity.short).join('/') }}
      </div>
      <div class="pools-card__value">
        WPT-{{
          tokenEntities.map((tokenEntity) => tokenEntity.short).join(`-${(100 / tokenEntities.length).toFixed(0)}%`)
        }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {getTokenEntity} from '@/lib/helpers/util'
import {defineProps, computed} from 'vue'

const props = defineProps(['value'])


const tokenEntities = computed(() => {
      let tokens = props.value.flat()
      console.log(tokens)
      let entities = tokens.map((propValue) => getTokenEntity(propValue, 'short'))
      console.log(entities)
      return entities
    }
)
</script>

<style lang="sass">
.pools-card
  color: #fff

  &__header
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 29px

  &__avatar
    display: flex
    align-items: center

  &__img
    position: relative
    width: 30px

    &:not(:first-child)
      margin-left: -10px

    img
      width: 100%

    svg
      width: 50px
      position: absolute
      left: 5px

  &__label
    overflow-x: auto

    &::-webkit-scrollbar
      height: 6px

    &::-webkit-scrollbar-track
      background: rgba(0, 147, 102, 0.3)
      border-radius: 3px

    &::-webkit-scrollbar-thumb
      background-color: rgba(0, 192, 135)
      border-radius: 3px

  &__name
    font-size: 14px
    font-weight: 900
    font-family: Inter
    text-overflow: ellipsis
    white-space: nowrap
    overflow: hidden
    color: #fff
  &__value
    font-size: 8px
    color: #8D8D9E
    font-weight: 700
    font-family: Inter
    text-overflow: ellipsis
    white-space: nowrap
    overflow: hidden
</style>
