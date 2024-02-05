<template>
  <AppBreadcrumb :title="false"/>
    <div :class="gradient_bg ? 'main_card_bg' : 'main_card'">
        <slot></slot>
    </div>
</template>
<script setup>
import AppBreadcrumb from '@/components/AppBreadcrumb.vue';
import { defineProps } from 'vue'
defineProps(['gradient_bg', 'maxWidth'])

</script>
<style lang="scss" scoped>
@import '@/styles/_variables.scss';


.main_card {

    max-width: v-bind(maxWidth);
    border: 1px solid #a3a4a517;
    border-radius: 20px;
    background: linear-gradient(0deg, #02120A, #02120A),
linear-gradient(0deg, rgba(163, 164, 165, 0.4), rgba(163, 164, 165, 0.4));
    margin-bottom: 2%;
    padding: 1.3rem 2.3rem;

    &_bg {
      max-width: v-bind(maxWidth);
    border: 1px solid #a3a4a517;
    border-radius: 20px;
    background: linear-gradient(133.41deg, rgba(1, 180, 126, 0.3) 0.3%, rgba(0, 0, 0, 0.3) 102.13%),
;
    margin-bottom: 2%;
    padding: 1.3rem 2.3rem;


    }
}

@media (min-width: 2500px) {
  .main_card {
    padding: 1.3rem 20%;
}
}
@media (min-width: 2000px) {
  .main_card {
    padding: 1.3rem 20%;
}
}
@media (max-width: $xl) {
  .main_card {
    max-width: 100%;
}
}

@media (max-width: $md) {
  .main_card {
  padding: 0.5rem 0.5rem;
  background: none;
}
}
</style>