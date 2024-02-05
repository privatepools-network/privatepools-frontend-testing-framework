<template>
  <CSidebar position="fixed" :narrow="sidebarNarrow" :unfoldable="sidebarUnfoldable" :visible="sidebarVisible"
    :overlaid="false" @visible-change="(event) =>
      $store.commit({
        type: 'updateSidebarVisible',
        value: event,
      })

      ">

    <div class="d-flex justify-content-center" style="margin-top: 10px;">
      <CSidebarBrand class="text-white fw-bolder fs-4" style="background-color: transparent">
        <CAvatar :src="avatar" size="md" class="me-2 sidebar-brand-full sidebar-logo" />
        <div class="sidebar-brand-full sidebar-d3">
          <span class="sidebar-d3__top">Welcome!</span>
          <span class="sidebar-d3__bottom">{{ client }}</span>
        </div>
        <CAvatar :src="avatar" size="md" class="me-3 sidebar-brand-narrow sidebar-logo" style="margin-left: 12px" />
      </CSidebarBrand>
    </div>
    <div class="mb-2 px-2">
      <svg viewBox="0 0 234 1" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0.5H233.25" stroke="url(#paint0_linear_4369_14144)" />
        <defs>
          <linearGradient id="paint0_linear_4369_14144" x1="0" y1="0.5" x2="231" y2="0.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="#E0E1E2" stop-opacity="0" />
            <stop offset="0.5" stop-color="#E0E1E2" />
            <stop offset="1" stop-color="#E0E1E2" stop-opacity="0.15625" />
          </linearGradient>
        </defs>
      </svg>
    </div>


    <AppSidebarNav />


    <!-- <div class="sidebar_helper_component">
      <div class="sidebar_helper_icon">
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 3.5C7.53125 3.5 3.5 7.53125 3.5 12.5C3.5 17.4687 7.53125 21.5 12.5 21.5C17.4687 21.5 21.5 17.4687 21.5 12.5C21.5 7.53125 17.4687 3.5 12.5 3.5ZM12.2187 17.75C12.0333 17.75 11.8521 17.695 11.6979 17.592C11.5437 17.489 11.4236 17.3426 11.3526 17.1713C11.2817 17 11.2631 16.8115 11.2993 16.6296C11.3354 16.4477 11.4247 16.2807 11.5558 16.1496C11.6869 16.0185 11.854 15.9292 12.0359 15.893C12.2177 15.8568 12.4062 15.8754 12.5775 15.9464C12.7488 16.0173 12.8952 16.1375 12.9983 16.2916C13.1013 16.4458 13.1562 16.6271 13.1562 16.8125C13.1562 17.0611 13.0575 17.2996 12.8817 17.4754C12.7058 17.6512 12.4674 17.75 12.2187 17.75ZM13.7862 12.9687C13.0264 13.4787 12.9219 13.9461 12.9219 14.375C12.9219 14.549 12.8527 14.716 12.7297 14.839C12.6066 14.9621 12.4397 15.0312 12.2656 15.0312C12.0916 15.0312 11.9247 14.9621 11.8016 14.839C11.6785 14.716 11.6094 14.549 11.6094 14.375C11.6094 13.348 12.0819 12.5314 13.0541 11.8784C13.9578 11.2719 14.4687 10.8875 14.4687 10.0423C14.4687 9.46766 14.1406 9.03125 13.4614 8.70828C13.3016 8.63234 12.9458 8.55828 12.508 8.56344C11.9586 8.57047 11.532 8.70172 11.2034 8.96609C10.5837 9.46484 10.5312 10.0077 10.5312 10.0156C10.5271 10.1018 10.506 10.1863 10.4692 10.2644C10.4324 10.3424 10.3805 10.4124 10.3167 10.4704C10.2528 10.5284 10.1781 10.5732 10.0969 10.6024C10.0157 10.6315 9.92954 10.6444 9.84336 10.6402C9.75718 10.6361 9.67266 10.615 9.59463 10.5782C9.5166 10.5414 9.44659 10.4895 9.38859 10.4256C9.33059 10.3618 9.28574 10.2871 9.25659 10.2059C9.22745 10.1247 9.21459 10.0385 9.21875 9.95234C9.22391 9.83844 9.30312 8.81234 10.3798 7.94609C10.9381 7.49703 11.6483 7.26359 12.4892 7.25328C13.0845 7.24625 13.6437 7.34703 14.023 7.52609C15.1578 8.06281 15.7812 8.95766 15.7812 10.0423C15.7812 11.6281 14.7214 12.3402 13.7862 12.9687Z"
            fill="white"
          />
        </svg>
      </div>
      <div class="sidebar-brand-full">Documentation</div>
    </div> -->

    <!-- <div class="sidebar_helper_container">
      <div size="md" class="sidebar-brand-full">
      <div>Need help?</div>
      <div>Please check our docs</div>
      <button class="helper_button">DOCUMENTATION</button>
    </div>
  </div> -->

    <CSidebarToggler class="d-none d-lg-flex" @click="$store.commit('toggleUnfoldable')" />
  </CSidebar>
</template>

<script>
import { useStore } from 'vuex'
import { AppSidebarNav } from './AppSidebarNav'
import { logoNegative } from '@/assets/brand/logo-negative'
// import logo from '@/assets/images/d3v.png'
import avatar from '@/assets/images/Avatar.png'
import { sygnet } from '@/assets/brand/sygnet'

export default {
  name: 'AppSidebar',
  components: {
    AppSidebarNav,
  },
  setup() {
    const store = useStore()


    return {
      logoNegative,
      sygnet,
      avatar,
      sidebarNarrow: false,
      sidebarUnfoldable: true,
      sidebarVisible: () => store.state.sidebarVisible,
      client: process.env.VUE_APP_NAME_OF_CLIENT_DEPLOYMENT
    }

  },
}
</script>
<style lang="scss">
@import '@/styles/_variables.scss';


.sidebar_helper_component {
  padding-left: 15px;
  padding-bottom: 10px;
  padding-top: 10px;
  display: flex;
  gap: 15px;
  align-items: center;

}

.sidebar_helper_component:hover {
  border-radius: 15px;
  color: rgba(1, 180, 126, 1);

  cursor: pointer;
}

.sidebar-nav .nav-link {
  color: white !important;
}

.sidebar_helper_icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  border-radius: 12px;
  background-color: rgba(4, 15, 32, 1);
}

.sidebar_helper_component:hover>.sidebar_helper_icon {
  filter: drop-shadow(0 0 0.3rem rgba(4, 15, 32, 1));
}

.sidebar_helper_container {
  border-radius: 12px;
  padding-left: 15px;
  background: lawngreen;
  width: 218px;
  height: 168px;

}

.helper_button {
  background: linear-gradient(126.97deg, #042E09 28.26%, rgba(10, 14, 35, 0.71) 91.2%);
  padding: 0px, 8px, 0px, 8px;
  border-radius: 12px;
  width: 100%;
}


/* Scrollbar */
.sidebar-nav::-webkit-scrollbar {
  height: 0px;
  width: 0px;
}

.sidebar-nav::-webkit-scrollbar {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background-color: rgba(0, 192, 135);
  border-radius: 3px;
}

.sidebar-d3 {
  display: flex;
  flex-direction: column;

  &__top {
    color: rgba(255, 255, 255, 0.32);
    font-size: clamp(10px, 0.9vw, 12px);
  }

  &__bottom {
    color: #fff;
    font-size: clamp(11px, 0.8vw, 13px);
  }
}

.sidebar-logo {
  background: rgba(1, 180, 126, 0.09);

}

@media (max-width: $xxl) {
  .sidebar {
    width: 190px;
  }

  .sidebar-nav .nav-link {
    padding: 6px;
    font-size: 10px;

  }

  .nav-symbol {
    width: 4px;
    height: 20px;
    margin-left: 8px;
    margin-right: 18px;
    
    // padding-left: 17px !important;
  }

  .sidebar-nav .nav-icon {
    height: 15px;
  }

  .sidebar-fixed.sidebar-narrow-unfoldable:not(:hover),
  .sidebar-fixed.sidebar-narrow {
    width: 35px;
  }

  .sidebar-logo {
    width: 25px;
    height: 20px;
  }

  .sidebar-d3 {
    font-size: 14px;
  }
}
</style>
