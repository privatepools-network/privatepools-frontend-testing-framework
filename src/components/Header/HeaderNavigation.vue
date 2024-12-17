<template>

  <div class="d-flex align-items-center gap-4 !text-black dark:!text-[#DCEEF6]">
    <div
      v-if="width > 768"
      @click="router.push('/pools')"
      :class="'navigation_text'"
    >
      <img :src="PrivatePoolsLogo" width="140" />
    </div>
    <div v-else>
      <img :src="logo" alt="D3" class="w-7" @click="$emit('toggleNavigation')" />
    </div>
    <div
      v-if="width > 768"
      @click="router.push('/pools')"
      :class="
        router.currentRoute.value.path === '/pools'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
      "
    >
      {{ $t('pools') }}
    </div>

    <!-- <div
    v-if="width > 768"
      @click="router.push('/buy')"
      :class="
        router.currentRoute.value.path === '/buy'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
      "
    >
      {{ $t('buy') }}
    </div> -->

    <div
      v-if="address && width > 768"
      @click="router.push('/portfolio')"
      :class="
        router.currentRoute.value.path === '/portfolio'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
      "
    >
      {{ $t('portfolio') }}
    </div>

    <div
      v-if="width > 768"
      @click="router.push('/general')"
      :class="
        router.currentRoute.value.path === '/general'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
      "
    >
      {{ $t('Analytics') }}
    </div>

    <div
      v-if="width > 768"
      @click="router.push('/referrals')"
      :class="
        router.currentRoute.value.path === '/referrals'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
      "
    >
      {{ $t('Referrals') }}
    </div>

  
 

    <!-- <Dropdown :distance="10" v-if="width > 768">
      <div class="arrow_header">
        <svg
          width="9"
          height="7"
          viewBox="0 0 9 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L4.5 5.28571L8 1"
            stroke="#DCEEF6"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
 <template #popper>
        <div class="popup bg-white dark:!bg-[#02031C]" style="width: 200px">
          
         <div class="popup_headers">App</div>
          <a
            href="/general"
            :class="
              router.currentRoute.value.path === '/general'
                ? 'navigation_text_selected navigation_text'
                : 'navigation_text  !text-black dark:!text-[#868686] hover:!text-[#00e0ff]'
            "
          >
            {{ $t('Ecosystem Analytics') }}
          </a>
          <a
            href="/user_analytics"
            :class="
              router.currentRoute.value.path === '/user_analytics'
                ? 'navigation_text_selected navigation_text'
                : 'navigation_text  !text-black dark:!text-[#7d7d7d] hover:!text-[#00e0ff]'
            "
          >
            {{ $t('user') }}
          </a>
          <a
            href="/referrals"
            :class="
              router.currentRoute.value.path === '/referrals'
                ? 'navigation_text_selected navigation_text'
                : 'navigation_text  !text-black dark:!text-[#7d7d7d] hover:!text-[#00e0ff]'
            "
          >
            {{ $t('referrals') }}
          </a> 
          <div class="popup_headers">Protocol</div>
          <a
            href="https://medium.com/@privatepoolsnetwork"
            target="_blank"
            :class="'navigation_text  !text-black dark:!text-[#868686] hover:!text-[#00e0ff]'"
          >
            {{ $t('Blog') }}
          </a>
          <a
            href="https://medium.com/@privatepoolsnetwork"
            target="_blank"
            :class="'navigation_text  !text-black dark:!text-[#868686] hover:!text-[#00e0ff]'"
          >
            {{ $t('Documentation') }}
          </a>
          <div class="popup_headers">Need help?</div>
          <a
            href="mailto:team@privatepools.network?subject=Contact"
            target="_blank"
            :class="'navigation_text  !text-black dark:!text-[#868686] hover:!text-[#00e0ff]'"
          >
            {{ $t('Contact us') }}
          </a>
          <hr style="border: 1px solid #ffffff14" class="mx-3" />
          <div class="flex items-center gap-3 w-100">
            <a href="https://x.com/PrivatePoolDeFi" target="_blank">
              <div>
                <img :src="twitterIcon" />
              </div>
            </a>
            <a href="https://linktr.ee/privatepoolsnetwork" target="_blank">
              <div>
                <img :src="discordIcon" />
              </div>
            </a>
            <a href="https://medium.com/@privatepoolsnetwork" target="_blank">
              <div>
                <img :src="mediumIcon" />
              </div>
            </a>
            <a href="https://linktr.ee/privatepoolsnetwork" target="_blank">
              <div>
                <img :src="telegramIcon" />
              </div>
            </a>
          </div>
        </div>
      </template> 
    </Dropdown>-->

    <!-- <div @click="router.push('/referrals')" :class="router.currentRoute.value.path === '/referrals'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          {{ $t('referrals') }}
        </div>
        <div @click="router.push('/buy')" :class="router.currentRoute.value.path === '/buy'
          ? 'navigation_text_selected navigation_text'
          : 'navigation_text'
          ">
          {{ $t('buy') }}
        </div> -->
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import router from '@/router'
import { Dropdown } from 'floating-vue'
import PrivatePoolsLogo from '@/assets/icons/PrivatePoolsLogo.svg'
import discordIcon from '@/assets/icons/Footer/discord.svg'
import telegramIcon from '@/assets/icons/Footer/telegram.svg'
import mediumIcon from '@/assets/icons/Footer/medium.svg'
import twitterIcon from '@/assets/icons/Footer/twitter.svg'
import { useDevice } from '@/composables/adaptive/useDevice'
import logo from '@/assets/images/d3v.png'
import SidebarMobile from '../SidebarMobile.vue'


defineProps(['address'])
defineEmits(['toggleNavigation'])

const { width } = useDevice()
</script>
<style lang="scss" scoped>
.navigation_text {
  font-size: clamp(10px, 0.8vw, 15px);
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0em;
  // text-align: center;
  // color: #7d7d7d;
  text-decoration: none;

  &:hover {
    color: #00e0ff;
    cursor: pointer;
  }

  &_selected {
    background: -webkit-linear-gradient(#2775ca, #00e0ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 0.7rem #00c9ff);
  }
}

.popup {
  width: 200px;
  border-radius: 16px;
  border: 0.5px solid #dceef60d;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: 0px 4px 8.9px 0px #02031cb5;

  padding: 13px 13px;
  color: #fff;
  position: relative;

  &_headers {
    font-size: clamp(11px, 0.8vw, 16px);
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    margin-top: 6px;
    margin-bottom: 4px;
  }
}

.arrow_header {
  cursor: pointer;
}
.arrow_header:hover svg path {
  stroke: #00e0ff;
}
</style>