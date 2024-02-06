<template>
  <div class="breadcrumb flex">
    <div v-if="title !== true">
      <div class="breadcrumb-title text-[14px] family-ubuntu" v-if="breadcrumbs && breadcrumbs.length > 0">
        {{ breadcrumbs[breadcrumbs.length - 1].name }}
      </div>
    </div>

    <div v-else class="breadcrumb-list grid">
      <div class="breadcrumb-list__el" v-for="(item, index) in breadcrumbs" :key="item">
        <div v-if="item.active || item.isDisabled">{{ item.name }}</div>
        <a v-else :href="item.path">
          {{ item.name }}
        </a>
        <span v-if="index != breadcrumbs.length - 1">&nbsp;/&nbsp;</span>
      </div>

    </div>

    <div class="breadcrumb-title text-[14px] family-ubuntu ml-[9px]" v-if="breadcrumbs && breadcrumbs.length > 0">
      {{ breadcrumbs[breadcrumbs.length - 1].name }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'
import { defineProps } from 'vue'
defineProps(['title'])
const breadcrumbs = ref()

const getBreadcrumbs = () => {
  // console.log(router.currentRoute.value.matched)
  return router.currentRoute.value.matched.map((route) => {
    return {
      active: route.path === router.currentRoute.value.fullPath,
      name: route.name,
      path: `${router.options.history.base}${route.path}`,
      isDisabled: route.meta.isDisabled,
    }
  })
}

router.afterEach(() => {
  breadcrumbs.value = getBreadcrumbs()
})

onMounted(() => {
  breadcrumbs.value = getBreadcrumbs()
})
</script>

<style lang="sass">
.breadcrumb
  display: flex
  flex-direction: column
  margin-bottom: 0
  &-list
    display: flex
    font-size: clamp(9px, 0.8vw, 12px)
    margin-bottom: 3px
    margin-left: 8px
    font-family: 'Ubuntu'
    font-weight: 500
    &__el
      display: flex
      a
        color: #A0AEC0
        text-decoration: none
      div
        color: #ffffff
      span
        color: #fff
  &-title
    color: #fff
    font-size: 16px
    margin-left: 8px
</style>
