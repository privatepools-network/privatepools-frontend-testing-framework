<template>
  <div id="sidemenu">
    <transition name="translateX">
      <nav v-show="sidebarVisible">
        <div class="sidemenu__wrapper bg-[#02031C]">
          <div class="flex justify-between">
            <img :src="PrivatePoolsLogo" width="180" />
            <svg
              @click="$emit('toggleNavigation')"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.8371 1.9978L2 15.824"
                stroke="#00E0FF"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2.17712 2.17529L16 15.9873"
                stroke="#00E0FF"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="d-flex my-3 gap-2 sidemenu__line"></div>
          <ul class="sidemenu__list">
            <li
              class="font-['Syne',_sans-serif] font-semibold text-lg text-white mb-1"
            >
              App
            </li>
            <li class="sidemenu__item">
              <a
                href="/pools"
                :class="route.name === 'Manage Pools' ? 'sidemenu__item__active' : ''"
                >Pools</a
              >
            </li>

            <li class="sidemenu__item">
              <a
                href="/portfolio"
                :class="
                  route.name === 'Portfolio' ? 'sidemenu__item__active' : ''
                "
                >Portfolio</a
              >
            </li>

            <!-- <li class="sidemenu__item">
              <a
                href="/buy"
                :class="route.name === 'Buy' ? 'sidemenu__item__active' : ''"
                >Buy PPN</a
              >
            </li> -->
            <li class="sidemenu__item">
              <a
                href="/general"
                :class="
                  route.name === 'General' ? 'sidemenu__item__active' : ''
                "
                >General Analytics</a
              >
            </li>
            <!-- <li class="sidemenu__item">
              <a
                href="/user_analytics"
                :class="
                  route.name === 'UserAnalytics' ? 'sidemenu__item__active' : ''
                "
                >User Analytics</a
              >
            </li> -->
            <!-- <li class="sidemenu__item">
              <a
                href="/referrals"
                :class="
                  route.name === 'Referrals' ? 'sidemenu__item__active' : ''
                "
                >Referrals</a
              >
            </li> -->
          </ul>

          <div class="d-flex my-3 gap-2 sidemenu__line"></div>
          <ul class="sidemenu__list">
            <li
              class="font-['Syne',_sans-serif] font-semibold text-lg text-white mb-1"
            >
              Protocol
            </li>
            <li class="sidemenu__item">
              <a target="_blank" href="https://medium.com/@privatepoolnetwork"
                >Blog</a
              >
            </li>
            <li class="sidemenu__item">
              <a target="_blank" href="https://privatepools.network/"
                >Documentation</a
              >
            </li>
          </ul>

          <div class="d-flex my-3 gap-2 sidemenu__line"></div>
          <ul class="sidemenu__list">
            <li
              class="font-['Syne',_sans-serif] font-semibold text-lg text-white mb-1"
            >
            Need help?
            </li>
            <li class="sidemenu__item">
              <a target="_blank" href="mailto:team@privatepools.network?subject=Contact"
                >Contact us</a
              >
            </li>
          </ul>

          <div class="flex gap-2 my-2 w-100">
          <a href="https://x.com/PrivatePoolDeFi" target="_blank">
            <div class="link_logo">
              <img :src="twitterIcon" />
            </div>
          </a>
          <a href="https://linktr.ee/privatepoolsnetwork" target="_blank">
            <div class="link_logo">
              <img :src="discordIcon" />
            </div>
          </a>
          <a href="https://medium.com/@privatepoolnetwork" target="_blank">
            <div class="link_logo">
              <img :src="mediumIcon" />
            </div>
          </a>
          <a href="https://linktr.ee/privatepoolsnetwork" target="_blank">
            <div class="link_logo">
              <img :src="telegramIcon" />
            </div>
          </a>
        </div>

          <!-- <div class="my-2 sidemenu__line"></div>
          <ul class="sidemenu__list">
            <li class="sidemenu__item">
              <a @click="$emit('toggleNavigation')"><img :src="back" />Back</a>
            </li>
          </ul> -->
        </div>
      </nav>
    </transition>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue'
import logo from '@/assets/images/d3v.png'
import dashboard from '@/assets/icons/sidebarMobile/dashboard.svg'
import back from '@/assets/icons/sidebarMobile/back.svg'
import manage from '@/assets/icons/sidebarMobile/manage.svg'
// import portfolio from '@/assets/icons/sidebarMobile/portfolio.svg'
import track from '@/assets/icons/sidebarMobile/track.svg'
// import admin from '@/assets/icons/sidebarMobile/admin.svg'
import arrow_up from '@/assets/icons/arrow/arrow_up.svg'
import { useRoute } from 'vue-router'
import help from '@/assets/icons/sidebarMobile/help.svg'
import PrivatePoolsLogo from '@/assets/icons/PrivatePoolsLogo.svg'
import telegramIcon from '@/assets/icons/Footer/telegram.svg'

import discordIcon from '@/assets/icons/Footer/discord.svg'
import mediumIcon from '@/assets/icons/Footer/medium.svg'
import twitterIcon from '@/assets/icons/Footer/twitter.svg'

defineProps(['sidebarVisible'])
defineEmits(['toggleNavigation'])

const route = useRoute()
console.log('route', route.name)
</script>
<style lang="scss">
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
      padding: 50px 30px;
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
