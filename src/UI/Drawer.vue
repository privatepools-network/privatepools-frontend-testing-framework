<template>
  <div
    class="drawer"
    ref="target"
    :class="{ 'is-open': isOpen, 'is-visible': isVisible }"
  >
    <div
      class="drawer__content md:max-w-[400px] w-full duration-500 bg-[#fafafa]"
      v-click-away="closeDrawer"
      v-on:click.stop
    >
      <div
        v-if="width > 768"
        class="drawer_close dark:hover:!bg-[#98a1c014] hover:bg-[#98a1c063]"
        @click="closeDrawer"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.71023 6.71001C5.61753 6.80252 5.54398 6.91241 5.4938 7.03339C5.44362 7.15436 5.41779 7.28404 5.41779 7.41501C5.41779 7.54598 5.44362 7.67566 5.4938 7.79664C5.54398 7.91761 5.61753 8.0275 5.71023 8.12001L9.58023 12L5.70023 15.88C5.60765 15.9726 5.53421 16.0825 5.48411 16.2035C5.434 16.3244 5.40821 16.4541 5.40821 16.585C5.40821 16.7159 5.434 16.8456 5.48411 16.9666C5.53421 17.0875 5.60765 17.1974 5.70023 17.29C5.79281 17.3826 5.90272 17.456 6.02369 17.5061C6.14465 17.5562 6.2743 17.582 6.40523 17.582C6.53616 17.582 6.66581 17.5562 6.78677 17.5061C6.90774 17.456 7.01765 17.3826 7.11023 17.29L11.7002 12.7C11.7929 12.6075 11.8665 12.4976 11.9167 12.3766C11.9668 12.2557 11.9927 12.126 11.9927 11.995C11.9927 11.864 11.9668 11.7344 11.9167 11.6134C11.8665 11.4924 11.7929 11.3825 11.7002 11.29L7.11023 6.70001C6.73023 6.32001 6.10023 6.32001 5.71023 6.71001Z"
            fill="#F8F8F8"
            fill-opacity="0.67"
          />
          <path
            d="M12.3001 6.71001C12.2074 6.80252 12.1338 6.91241 12.0836 7.03339C12.0335 7.15436 12.0076 7.28404 12.0076 7.41501C12.0076 7.54598 12.0335 7.67566 12.0836 7.79664C12.1338 7.91761 12.2074 8.0275 12.3001 8.12001L16.1701 12L12.2901 15.88C12.1031 16.067 11.9981 16.3206 11.9981 16.585C11.9981 16.8494 12.1031 17.103 12.2901 17.29C12.4771 17.477 12.7306 17.582 12.9951 17.582C13.2595 17.582 13.5131 17.477 13.7001 17.29L18.2901 12.7C18.3828 12.6075 18.4563 12.4976 18.5065 12.3766C18.5567 12.2557 18.5825 12.126 18.5825 11.995C18.5825 11.864 18.5567 11.7344 18.5065 11.6134C18.4563 11.4924 18.3828 11.3825 18.2901 11.29L13.7001 6.70001C13.3201 6.32001 12.6901 6.32001 12.3001 6.71001Z"
            fill="#F8F8F8"
            fill-opacity="0.67"
          />
        </svg>
      </div>
      <div class="drawer_inside bg-white dark:!bg-[#02031C]">
        <div
          v-if="width <= 768"
          @click="closeDrawer"
          class="flex justify-center my-1"
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_129_2)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.4275 14.0525C11.1814 14.2983 10.8478 14.4363 10.5 14.4363C10.1522 14.4363 9.81857 14.2983 9.57247 14.0525L4.62172 9.10346C4.37562 8.85724 4.23741 8.52334 4.23749 8.17522C4.23757 7.82709 4.37594 7.49326 4.62216 7.24715C4.86838 7.00105 5.20228 6.86283 5.55041 6.86292C5.89853 6.863 6.23237 7.00137 6.47847 7.24759L10.5 11.2691L14.5215 7.24759C14.7689 7.00839 15.1004 6.87594 15.4445 6.87876C15.7887 6.88159 16.1179 7.01947 16.3614 7.2627C16.6048 7.50594 16.743 7.83507 16.7462 8.1792C16.7493 8.52333 16.6172 8.85494 16.3782 9.10259L11.4283 14.0533L11.4275 14.0525Z"
                fill="#F8F8F8"
              />
            </g>
            <defs>
              <clipPath id="clip0_129_2">
                <rect width="21" height="21" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect, defineProps, defineEmits } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useDevice } from '@/composables/adaptive/useDevice'

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['close'])
const { width } = useDevice()

const target = ref(null)
const isVisible = ref(false)
const isTransitioning = ref(false)

// Watch for changes in `isOpen`
watchEffect(() => {
  isTransitioning.value = true
  if (props.isOpen) {
    isVisible.value = true
  } else {
    setTimeout(() => (isVisible.value = false), 500) // Assuming `speed` is 500ms
  }
  setTimeout(() => (isTransitioning.value = false), 500)
})

onMounted(() => {
  isVisible.value = props.isOpen
})

function closeDrawer() {
  if (!isTransitioning.value) {
    emit('close')
  }
}

// Setup click-away directive
onClickOutside(target, () => closeDrawer())
</script>

<style lang="scss" scoped>
.drawer {
  display: none;
  &.is-visible {
    display: block;
  }

  &.is-open {
    .drawer__overlay {
      opacity: 0.5;
    }

    .drawer__content {
      transform: translateX(0);
    }
  }

  // &__overlay {
  //   position: fixed;
  //   top: 0;
  //   right: 0;
  //   bottom: 0;
  //   left: 0;
  //   width: 100%;
  //   z-index: 200;
  //   opacity: 0;
  //   transition-property: opacity;
  //   background-color: #000000;
  //   user-select: none;
  // }

  &__content {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: calc(100vh - 16px);
    overflow: hidden;
    position: fixed;
    right: 8px;
    top: 8px;
    z-index: 1030;
    transform: translateX(100%);
    // box-shadow: 0 2px 6px #00c9ff;

    background: transparent !important;

    @media (max-width: 768px) {
      height: 100vh;
      top: 50px;
      right: 0px;
      transform: translateY(100%);
    }
  }
}

.drawer_inside {
  width: 100%;

  // background: linear-gradient(0deg, #090909, #090909),
  //   linear-gradient(0deg, rgba(115, 115, 115, 0.16), rgba(115, 115, 115, 0.16));
  border: 1px solid #73737329;
  border-radius: 10px;
  padding: 10px 22px;
}

.drawer_close {
  text-decoration: none;
  cursor: pointer;
  height: 100%;
  padding: 14px calc(14px) 14px 14px;
  border-radius: 20px 0px 0px 20px;
  transition: background-color 250ms ease 0s, margin 250ms ease 0s;
  &:hover {
    z-index: -1;
    margin: 0px -8px 0px 0px;
    // background-color: rgba(152, 161, 192, 0.08);
  }
}
</style>
