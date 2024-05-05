<template>
  <div id="sidemenu">
    <transition name="translateX">
      <nav v-show="navOpen">
        <div class="sidemenu__wrapper">
            <div class="d-flex mb-3 gap-2 sidemenu__line">
          <img :src="logo" alt="D3" height="40px" />
          <div class="">
            <div class="sidemenu__title">D3</div>
            <div class="sidemenu__title__wallet">{{ computedAddress }}</div>
          </div>
        </div>
          <ul class="sidemenu__list">
            <li class="sidemenu__item">
              <a
                href="/dashboard"
                :class="
                  route.name === 'Dashboard' ? 'sidemenu__item__active' : ''
                "
                ><img :src="dashboard" /> Dashboard</a
              >
            </li>
            <li class="sidemenu__item d-flex align-items-center gap-2">
              <a @click="visibleTrack = !visibleTrack; visibleAdmin = false"
                ><img :src="track" /> Track</a
              >
              <img
                :src="arrow_up"
                :class="!visibleTrack ? 'toggle-down' : 'toggle-up'"
              />
            </li>
            <CCollapse :visible="visibleTrack">
              <div style="color: rgba(204, 204, 204, 1)">
                <div style="margin-left: 20px">
                  <li class="sidemenu__item">
                    <a
                      href="/track/trades"
                      :class="
                        route.name === 'Track Trades'
                          ? 'sidemenu__item__active'
                          : ''
                      "
                      >Track Trades</a
                    >
                  </li>
                  <!-- <li class="sidemenu__item">
                    <a
                      href="/track/opportunities"
                      :class="
                        route.name === 'Track Opportunities'
                          ? 'sidemenu__item__active'
                          : ''
                      "
                      >Missed Opportunities</a
                    >
                  </li> -->
                  <li class="sidemenu__item">
                    <a
                      href="/track/tracking_info"
                      :class="
                        route.name === 'Tracking Info'
                          ? 'sidemenu__item__active'
                          : ''
                      "
                      >Track Info</a
                    >
                  </li>
                </div>
              </div>
            </CCollapse>
            <li class="sidemenu__item">
              <a
                href="/pools"
                :class="
                  route.name === 'Manage Pools' ? 'sidemenu__item__active' : ''
                "
                ><img :src="manage" /> Manage Pools</a
              >
            </li>
            <!-- <li class="sidemenu__item">
              <a
                href="/portfolio"
                :class="
                  route.name === 'portfolio' ? 'sidemenu__item__active' : ''
                "
                ><img :src="portfolio" /> My Portfolio</a
              >
            </li>
            <li class="sidemenu__item d-flex align-items-center gap-2">
              <a @click="visibleAdmin = !visibleAdmin; visibleTrack = false"
                ><img :src="admin" />Admin</a
              >
              <img
                :src="arrow_up"
                :class="!visibleAdmin ? 'toggle-down' : 'toggle-up'"
              />
            </li> -->
            <CCollapse :visible="visibleAdmin">
              <div style="color: rgba(204, 204, 204, 1)">
                <div style="margin-left: 20px">
                  <!-- <li class="sidemenu__item">
                    <a
                      href="/admin/bot"
                      :class="
                        route.name === 'Manage Bot'
                          ? 'sidemenu__item__active'
                          : ''
                      "
                      >Manage Bot</a>
                  </li> -->
                  <!-- <li class="sidemenu__item">
                    <a
                      href="/admin/tokens"
                      :class="
                        route.name === 'Manage Tokens'
                          ? 'sidemenu__item__active'
                          : ''
                      "
                      >Manage Tokens</a
                    >
                  </li>
                  <li class="sidemenu__item">
                    <a
                      href="/admin/1inch"
                      :class="
                        route.name === 'Manage 1INCH'
                          ? 'sidemenu__item__active'
                          : ''
                      "
                      >Manage 1INCH</a
                    >
                  </li>
                  <li class="sidemenu__item">
                    <a
                      href="/admin/firebird"
                      :class="
                        route.name === 'Manage Firebird'
                          ? 'sidemenu__item__active'
                          : ''
                      "
                      >Manage Firebird</a
                    >
                  </li>
                  <li class="sidemenu__item">
                    <a
                      href="/admin/swap"
                      :class="
                        route.name === 'Swap'
                          ? 'sidemenu__item__active'
                          : ''
                      "
                      >Swap</a
                    >
                  </li> -->
                </div>
              </div>
            </CCollapse>

          </ul>
          <div class="my-2 sidemenu__line"></div>
          <ul class="sidemenu__list">
            <li class="sidemenu__item">
              <a
                
               
                ><img :src="help" />Help</a
              >
            </li>
            <li class="sidemenu__item">
              <a
                
              @click="$emit('closeNav')"
               
                ><img :src="back" />Back</a
              >
            </li>
            </ul>
        </div>
      </nav>
    </transition>
  </div>
</template>
<script setup>
import { defineProps, ref } from 'vue'
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

defineProps(['navOpen', 'computedAddress'])

const route = useRoute()
console.log('route', route.name)
const visibleTrack = ref(false)
const visibleAdmin = ref(false)

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
  border-image: linear-gradient(to left, #00C9FF 0%, rgba(126, 246, 178, 0)) 1;
}

#sidemenu {
  font-family: Lato;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;

  nav {
    width: 100%;
    height: 100%;
    background: rgba(2, 18, 10, 1);
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
    }

    &__list {
      padding-top: 50px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &__item {
      &__active {
        color: #00C9FF !important;
      }
      a {
        text-decoration: none;
        
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        letter-spacing: 0em;

        padding: 10px 0px;
        display: block;
        color: white;
        transition: 0.4s ease;

        display: flex;
        align-items: center;
        gap: 5px;

        &:hover {
          color: #3fdfaf;
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
</style>
