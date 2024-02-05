<template>
  <div class="overlay" v-if="isLoading">
    <CSpinner />
  </div>
</template>

<script>
import { CSpinner } from '@coreui/vue'

export default {
  name: 'Spinner',
  components: { CSpinner },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
