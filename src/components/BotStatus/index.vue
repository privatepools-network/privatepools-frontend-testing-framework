<template>
  <div>
    <!-- <span class="caption">Manage Bot</span> -->
    <div v-if="botCards < 1" class="py-4 px-4">
      <div class="text-white fs-5 mb-3">Manage Arbitrage Bot</div>
      <div class="d-flex gap-2 align-items-center text-white">
        <div class="button-add mb-0" @click="AddClick">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4.16699V15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M4.16699 10H15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
        <!-- <div class="fs-4">Add bot</div> -->
        <div>
          <CAlert class="d-flex gap-2 w-75" style="
                background-color: rgba(15, 17, 19, 1);
                color: white;
                border: none;
                display: flex;
              " color="primary" :visible="addBotAlert" dismissible @close="() => {
                addBotAlert = false
              }
                ">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M22 12C22 17.5228 17.5228 22 12 22H2.9937C2.11018 22 1.66771 20.9229 2.29245 20.2929L4.2495 18.3195C2.84334 16.597 2 14.397 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.2071 8.79289C15.5976 9.18342 15.5976 9.81658 15.2071 10.2071L13.4142 12L15.2071 13.7929C15.5976 14.1834 15.5976 14.8166 15.2071 15.2071C14.8166 15.5976 14.1834 15.5976 13.7929 15.2071L12 13.4142L10.2071 15.2071C9.81658 15.5976 9.18342 15.5976 8.79289 15.2071C8.40237 14.8166 8.40237 14.1834 8.79289 13.7929L10.5858 12L8.79289 10.2071C8.40237 9.81658 8.40237 9.18342 8.79289 8.79289C9.18342 8.40237 9.81658 8.40237 10.2071 8.79289L12 10.5858L13.7929 8.79289C14.1834 8.40237 14.8166 8.40237 15.2071 8.79289Z"
                fill="#FF507A" />
            </svg>

            <div>
              It's impossible to add another bot because there is one running
              at the moment
            </div>
          </CAlert>
        </div>
      </div>
    </div>
    
    <CCard v-else class="mb-4 mt-2" v-for="botCardIndex in botCards" :key="`synth-card-key-${botCardIndex}`">
      <CCardBody>
        <div class="d-flex flex-column" v-if="isBotRunning">
          <div class="bot_container">
            <div>
              <span class="text-white fs-5">Manage Arbitrage Bot</span>
              <CCard class="bot_card border-success mb-5 mt-2">
                <div class="px-3 py-3 d-flex flex-column">
                  <span class="text-white fs-6 mb-2">Choose Strategy</span>
                  <CFormSelect class="border-success text-white" color="primary" :value="botStrategySelect"
                    aria-label="Default select example">
                    <option class="select_strategie" :value="botStrategySelect">
                      {{botStrategySelect}}
                    </option>
                  </CFormSelect>
                  <div class="bot_buttons d-flex justify-content-around mt-5 mb-4">
                    <CButton :disabled="botLoading === true" class="text-white" color="danger" @click="terminateBot">Stop
                      Arbitrage</CButton>
                    <CButton :disabled="botStarted === true || botLoading === true" class="text-white" color="success"
                      @click="$emit('startBot')">Start Arbitrage</CButton>
                  </div>
                </div>
              </CCard>
            </div>
            <div>
              <span class="text-white fs-5">Current Arbitrage Bot Setup</span>
              <CCard class="bot_card border-success mb-4 mt-2">
                <div class="text-white px-3 py-4">
                  <div class="bot_status_text d-flex justify-content-between align-items-center mb-4">
                    <div class="d-flex align-items-center gap-1">
                      <CIcon :icon="currentStrategySvg" size="xxl" />
                      <div></div>
                      <div>Current Strategy:</div>
                    </div>
                    <div class="text-center">{{ botStrategySelect }}</div>
                  </div>
                  <div class="bot_status_text d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-1">
                      <CIcon :icon="botStatusSvg" size="xxl" />
                      <div></div>
                      <div>Bot Status:</div>
                    </div>
                    <div v-if="botStarted === true && botLoading === false" class="text-success">
                      Script is running
                    </div>
                    <div v-if="botStarted === false && botLoading === false" class="text-danger">
                      Script is not running
                    </div>
                    <div v-if="botLoading === true" style="display: flex; align-items: center; gap: 5px">
                      Bot loading
                      <CSpinner size="sm" />
                    </div>
                  </div>
                </div>
              </CCard>
            </div>
          </div>
        </div>
        <div class="d-flex flex-column" v-if="!isBotRunning && clickedPlus">
          <div class="bot_container">
            <div>
              <span class="text-white fs-5">Manage Arbitrage Bot</span>
              <CCard class="bot_card border-success mb-5 mt-2">
                <div class="px-3 py-3 d-flex flex-column">
                  <span class="text-white fs-6 mb-2">Choose Strategy</span>
                  <CFormSelect class="border-success text-white" color="primary" :value="botStrategySelect"
                    aria-label="Default select example">
                    <option class="select_strategie" :value="botStrategySelect">
                      {{botStrategySelect}}
                    </option>
                  </CFormSelect>
                  <div class="bot_buttons d-flex justify-content-around mt-5 mb-4">
                    <CButton :disabled="isBotRunning === false" class="text-white" color="danger" @click="terminateBot">Stop
                      Arbitrage</CButton>
                    <CButton :disabled="isBotRunning === true || botLoading === true" class="text-white" color="success"
                      @click="$emit('startBot')">Start Arbitrage</CButton>
                  </div>
                </div>
              </CCard>
            </div>
            <div>
              <span class="text-white fs-5">Current Arbitrage Bot Setup</span>
              <CCard class="bot_card border-success mb-4 mt-2">
                <div class="text-white px-3 py-4">
                  <div class="bot_status_text d-flex justify-content-between align-items-center mb-4">
                    <div class="d-flex align-items-center gap-1">
                      <CIcon :icon="currentStrategySvg" size="xxl" />
                      <div></div>
                      <div>Current Strategy:</div>
                    </div>
                  </div>
                  <div class="bot_status_text d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center gap-1">
                      <CIcon :icon="botStatusSvg" size="xxl" />
                      <div></div>
                      <div>Bot Status:</div>
                    </div>
                    <div class="text-danger">
                      Script is not running
                    </div>
                  </div>
                </div>
              </CCard>
            </div>
          </div>
        </div>
        <!-- <div v-if="botCards >= 1" class="d-flex gap-3">
          <div class="button-add" @click="AddClick">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4.16699V15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M4.16699 10H15.8337" stroke="white" stroke-width="1.66667" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </div>
          <div>
            <CAlert class="d-flex gap-2 w-75" style="
                background-color: rgba(15, 17, 19, 1);
                color: white;
                border: none;
                display: flex;
              " color="primary" :visible="addBotAlert" dismissible @close="() => {
                addBotAlert = false
              }
                ">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M22 12C22 17.5228 17.5228 22 12 22H2.9937C2.11018 22 1.66771 20.9229 2.29245 20.2929L4.2495 18.3195C2.84334 16.597 2 14.397 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.2071 8.79289C15.5976 9.18342 15.5976 9.81658 15.2071 10.2071L13.4142 12L15.2071 13.7929C15.5976 14.1834 15.5976 14.8166 15.2071 15.2071C14.8166 15.5976 14.1834 15.5976 13.7929 15.2071L12 13.4142L10.2071 15.2071C9.81658 15.5976 9.18342 15.5976 8.79289 15.2071C8.40237 14.8166 8.40237 14.1834 8.79289 13.7929L10.5858 12L8.79289 10.2071C8.40237 9.81658 8.40237 9.18342 8.79289 8.79289C9.18342 8.40237 9.81658 8.40237 10.2071 8.79289L12 10.5858L13.7929 8.79289C14.1834 8.40237 14.8166 8.40237 15.2071 8.79289Z"
                  fill="#FF507A" />
              </svg>

              <div>
                It's impossible to add another bot because there is one running
                at the moment
              </div>
            </CAlert>
          </div>
        </div> -->
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { currentStrategySvg } from '../../assets/icons/currentStrategy'
import { botStatusSvg } from '../../assets/icons/botStatus'
import { defineProps, ref, onMounted, defineEmits, toRefs, watch } from 'vue'

const props = defineProps([
  'botStrategySelect',
  'chainSelected',
  'botStarted',
  'botData',
  'botLoading',
  "isBotRunning"
])
const { isBotRunning } = toRefs(props)
const emit = defineEmits(['endBot'])

async function terminateBot() {
  clickedPlus.value = false
  isBotRunning.value = false
  emit('endBot')
  addBotAlert.value = false
  if (botCards.value > 0)
    botCards.value = botCards.value - 1
  console.log("BOT CARDS - ", botCards.value)
}

const clickedPlus = ref(false)

// Initial value
const botCards = ref(0)
const addBotAlert = ref(false)


watch([isBotRunning], () => {
  botCards.value = isBotRunning.value ? 1 : 0
  clickedPlus.value = isBotRunning.value ? false : true
  console.log(botCards.value)
})

onMounted(() => {
  botCards.value = props.botStarted || props.botLoading || props.isBotRunning ? 1 : 0
})

function AddClick() {
  clickedPlus.value = true;
  if (botCards.value == 0){
    botCards.value++
  }
  console.log('PLUS BOT CARDS - ', botCards.value);
}

console.log('botCards', botCards)
console.log(props)
</script>


<style lang="scss" scoped>
@import '@/styles/_variables.scss';

.bot_card {
  padding: 10px 15px;
}

.bot_status_text {
  flex-direction: column;
  gap: 5px;
}

.select_strategie {
  font-size: 14px;
}

.bot_buttons {
  flex-direction: column;
  gap: 10px;
}

.bot_container {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  justify-content: center;
}

@media (min-width: $lg) {
  .bot_card {
    padding: 0px 0px;
  }

  .bot_status_text {
    flex-direction: row;
  }

  .bot_buttons {
    flex-direction: row;
    gap: 0px;
  }

  .select_strategie {
    font-size: 18px;
  }
}

@media (min-width: $md) {
  .bot_container {
    justify-content: flex-start;
  }
}
</style>
