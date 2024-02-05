<template>
  <div class="black_box_container" ref="scrollContainer">
    <p>{{ messages.join('\n') }}</p>
  </div>
</template>
<script setup>
//eslint-disable-next-line
import LoaderPulse from '@/components/loaders/LoaderPulse.vue'
import { ref, onMounted, watch, defineProps } from "vue"
import { InitSocket } from "@/composables/admin/useBotLogs"

const props = defineProps(['chainSelected'])

const messages = ref([])
const scrollContainer = ref(null);
onMounted(() => {
  InitSocket(props.chainSelected, messages)
})

watch(messages, () => {
  scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
}
)

</script>
<style lang="scss">
.black_box_container {
  margin-top: 5%;
  color: white;
  border: 1px solid rgba(163, 164, 165, 0.2);
  background-color: rgba(0, 0, 0, 1);
  height: 500px;
  width: 100%;
  display: flex;
  border-radius: 20px 6px 6px 20px;
  text-wrap: wrap;
  overflow-y: scroll;
  padding: 5px;
  white-space: pre-line;
  overflow-wrap: break-word;
  overflow-x: hidden;

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
    background-color: #191919;
    border-radius: 50px;
    margin-bottom: 10px;
  }

  &::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
    background: #191919;
    border-radius: 50px;
  }

  &::-webkit-scrollbar-thumb {
    border: 2px solid #02120a;
    background: rgb(1, 180, 126);
    border-radius: 21px;
  }
}
</style>
