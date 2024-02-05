<template>
  <div class="breadcrumb">
    <div v-if="title !== true" class="breadcrumb-list">
      <div
        class="breadcrumb-list__el"
        v-for="(item, index) in breadcrumbs"
        :key="item"
      >
        <div v-if="item.active || item.isDisabled">{{ item.name }}</div>
        <a v-else :href="item.path">
          {{ item.name }}
        </a>
        <span v-if="index != breadcrumbs.length - 1">&nbsp;/&nbsp;</span>
      </div>
    </div>
    <div v-else>
      <div
        class="breadcrumb-title"
        v-if="breadcrumbs && breadcrumbs.length > 0"
      >
      Dark Pool
        <!-- {{ breadcrumbs[breadcrumbs.length - 1].name }} -->
      </div>
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
    font-size: 24px
    color: #fff
</style>
