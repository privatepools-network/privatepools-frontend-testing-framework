<template>
<div class="d-flex align-items-center gap-4 !text-black dark:!text-[#7d7d7d]">
        <div @click="router.push('/pools')" :class="router.currentRoute.value.path === '/pools'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Pools
        </div>
        <Dropdown :distance="6">
          <div :class="router.currentRoute.value.path === '/general' || router.currentRoute.value.path === '/user_analytics'
            ? 'navigation_text_selected navigation_text'
            : 'navigation_text'
            ">
            Analytics
          </div>
          <template #popper>
            <div class="popup bg-white dark:!bg-[#171717]" style="width: 100px;">
            <a href="/general" :class="router.currentRoute.value.path === '/general'
              ? 'navigation_text_selected navigation_text'
              : 'navigation_text  !text-black dark:!text-[#7d7d7d] hover:!text-[#2abdff]'
              ">
              General
            </a>
            <a href="/user_analytics"  :class="router.currentRoute.value.path === '/user_analytics'
              ? 'navigation_text_selected navigation_text'
              : 'navigation_text  !text-black dark:!text-[#7d7d7d] hover:!text-[#2abdff]'
              ">
              User
            </a>
          </div>
          </template>
        </Dropdown>

        <div @click="router.push('/portfolio')" :class="router.currentRoute.value.path === '/portfolio'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Portfolio
        </div>
        <div @click="router.push('/referrals')" :class="router.currentRoute.value.path === '/referrals'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Referrals
        </div>
        <div @click="router.push('/buy')" :class="router.currentRoute.value.path === '/buy'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          Buy
        </div>
      </div>
</template>
<script setup>
import router from '@/router'
import { Dropdown } from 'floating-vue'

</script>
<style lang="scss" scoped>
.navigation_text {
  font-family: Poppins;
  font-size: clamp(10px, 0.8vw, 15px);
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0em;
  text-align: center;
  // color: #7d7d7d;
  text-decoration: none;

  &:hover {
    color: #2abdff;
    cursor: pointer;
  }

  &_selected {
    background: -webkit-linear-gradient(#2775ca, #2abdff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 0.7rem #00c9ff);
  }
}


.popup {
    width: 200px;
    border-radius: 16px;
    // background: #171717;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
    // border: 0.5px solid #ffffff0d;
    padding: 13px 8px;
    color: #fff;
    position: relative;
  }
</style>