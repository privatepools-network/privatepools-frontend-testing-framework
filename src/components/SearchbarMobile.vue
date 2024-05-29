<template>
  <div id="sidemenu" class="">
    <transition name="translateX">
      <nav v-show="searchbarVisible">
        <div class="sidemenu__wrapper bg-[#02031C]">
          <div class="sidemenu__item">
              <a @click="$emit('toggleSearhbarMobile')"><img :src="back" />Back</a>
            </div>
          <div class="d-flex my-3 gap-2 sidemenu__line"></div>
          <HeaderSearchbar
            :selectOptions="selectOptions"
            :handleInput="handleInput"
            :searchInput="searchInput"
          />
        </div>
      </nav>
    </transition>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import back from '@/assets/icons/sidebarMobile/back.svg'

import { useRoute } from 'vue-router'

import HeaderSearchbar from './Header/HeaderSearchbar.vue'

defineProps(['searchbarVisible', 'selectOptions', 'handleInput', 'searchInput'])
defineEmits(['toggleSearhbarMobile'])

const route = useRoute()
console.log('route', route.name)
</script>
<style lang="scss" scoped>
.toggle-down {
  transform: rotate(0deg);
  transition: all 0.3s;
}

.toggle-up {
  transform: rotate(180deg);
  transition: all 0.3s;
}

.sidemenu__line {
  border-width: 0px 0px 1px 0px;
  border-style: solid;
  border-image: linear-gradient(to left, #00c9ff 0%, rgba(126, 246, 178, 0)) 1;
}

#sidemenu {
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;

  nav {
    width: 100%;
    height: 100%;
    background: #02031c;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
  }

  .sidemenu {
    &__title {
      font-size: 24px;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);

      &__wallet {
        font-size: 15px;
        color: rgba(170, 199, 255, 1);
        margin-bottom: 15px;
      }
    }

    &__wrapper {
      margin-top: 20px;
      padding: 0px 15px;
      height: 100vh;
      overflow-y: auto;
    }

    &__list {
      padding-top: 50px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &__item {
      &__active {
        color: #00c9ff !important;
      }
      a {
        text-decoration: none;

        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        letter-spacing: 0em;

        padding: 5px 0px;
        display: block;
        color: #868686;
        transition: 0.4s ease;

        display: flex;
        align-items: center;
        gap: 5px;

        &:hover {
          color: #00c9ff;
        }
      }
    }
  }
}

.translateX-enter {
  transform: translateX(-200px);
  transition: 0.5s ease;
  opacity: 0;
}

.translateX-enter-active,
.translateX-leave-active {
  transform-origin: top left 0;
  transition: 0.5s ease;
}

.translateX-leave-to {
  transform: translateX(-200px);
  transition: 0.5s ease;

  opacity: 0;
}

.link_logo {
  width: 44px;
  height: 44px;
  background: #ffffff0d;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #00c8ff5b;
  }
}

.link_logo:hover svg path {
  fill: #00c9ff;
}
</style>
