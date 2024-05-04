<template>
  <div>
    <div
      class=" fixed inset-0 z-40"
    />
    <div
      ref="modalRef"
      class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full justify-center items-center flex"
      style="backdrop-filter: blur(5px);"
      tabindex="0"
      @click.self="clickOutside"
      @keyup.esc="closeWithEsc"
   
    >
      <div
        :class="`${modalSizeClasses[size]}`"
        class="fixed p-4 w-full"
       
      >
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:!bg-[#02031CC4] z-50">
          <!-- Modal header -->
          <div
            :class="
              $slots.header
                ? 'border-b border-gray-200 dark:border-gray-600'
                : ''
            "
            class="pt-4 px-4 rounded-t flex justify-between items-center"
          >
            <slot name="header" />
            <div class="flex justify-end w-full">
              <div
                class="back_button"
                v-if="!persistent"
                aria-label="close"
                @click="closeModal"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18"
                    stroke="#FFFFFF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6 6L18 18"
                    stroke="#FFFFFF"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <!-- Modal body -->
          <div :class="$slots.header ? '' : 'pt-0'" class="p-6">
            <slot name="body" />
          </div>
          <!-- Modal footer -->
          <div
            v-if="$slots.footer"
            class="p-6 rounded-b border-gray-200 border-t dark:border-gray-600"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  notEscapable: { type: Boolean, required: false, default: false },
  persistent: { type: Boolean, required: false, default: false },
  size: { type: String, required: false, default: '2xl' },
})

const emit = defineEmits(['close', 'click:outside'])
const modalSizeClasses = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
}

function closeModal() {
  emit('close')
}
function clickOutside() {
  if (!props.persistent) {
    emit('click:outside')
    closeModal()
  }
}

function closeWithEsc() {
  if (!props.notEscapable && !props.persistent) closeModal()
}
const modalRef = ref(null)
onMounted(() => {
  if (modalRef.value) {
    modalRef.value.focus()
  }
})
</script>
<style lang="scss" scoped>
.back_button {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #00000024;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border: 1px solid #ffffff0d;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
