<template>
  <div v-if="isFilterOpen === true" class="filters_container">
        <div>
          <multiselect
            :showLabels="false"
            v-model="selectedTokens"
            :modelValue="selectedTokens"
            open-direction="bottom"
            @update:modelValue="$emit('updateTokens', $event)"
            placeholder="Filter by Token..."
            label="name"
            track-by="code"
            :options="optionsTokens"
            @select="filterByStatus"
            :multiple="true"
            :taggable="true"
            :searchable="false"
          >
            <template v-slot:option="{ option }">
              <div style="display: flex; align-items: center">
                <img
                  style="width: 25px; height: 25px"
                  :src="option.img"
                /><span> {{ option.name }}</span>
                <span style="color: rgba(108, 114, 132, 1); margin-left: 2.5px"
                  >({{ option.code }})</span
                >
              </div>
            </template>
            <template v-slot:tag="{ option, remove }">
              <div
                class="multiselect-tag is-user"
                :class="{'is-user_margin-bottom': selectedTokens.length > 2}"

              >
                <div style="display: flex; align-items: center">
                  <img :src="option.img" />
                  {{ option.code }}
                </div>
                <div>
                  <span
                    v-if="!disabled"
                    style=""
                    @mousedown.prevent="remove(option, $event)"
                  >
                    <CIcon class="tag_close" icon="cilXCircle" size="md" />
                  </span>
                </div>
              </div>
            </template>
          </multiselect>
        </div>
        <div>
          <multiselect
            :showLabels="false"
            v-model="selectedStrategy"
            :modelValue="selectedStrategy"
            open-direction="bottom"

            @update:modelValue="$emit('updateStrategy', $event)"
            placeholder="Filter by Strategy..."
            label="name"
            track-by="code"
            :options="optionsStrategies"
            :multiple="true"
            :taggable="true"
            :searchable="false"
          >
            <template v-slot:tag="{ option, remove }">
              <div
                class="multiselect-tag is-user"

              >
                <div>
                  {{ option.name }}
                </div>
                <div>
                  <span
                    v-if="!disabled"
                    style=""
                    @mousedown.prevent="remove(option, $event)"
                  >
                    <CIcon class="tag_close" icon="cilXCircle" size="md" />
                  </span>
                </div>
              </div>
            </template>
          </multiselect>
        </div>
        <div>
          <multiselect
            :showLabels="false"
            v-model="selectedProfit"
            :modelValue="selectedProfit"
            open-direction="bottom"

            @update:modelValue="$emit('updateProfit', $event)"
            placeholder="Filter by Profit..."
            label="name"
            track-by="code"
            :options="optionsProfit"
            :multiple="true"
            :taggable="true"
            :searchable="false"
          >
            <template v-slot:tag="{ option, remove }">
              <div
                class="multiselect-tag is-user"
                :class="{'is-user_margin-bottom': selectedProfit.length > 2}"
              >
                <div>
                  {{ option.name }}
                </div>
                <div>
                  <span
                    v-if="!disabled"
                    style=""
                    @mousedown.prevent="remove(option, $event)"
                  >
                    <CIcon class="tag_close" icon="cilXCircle" size="md" />
                  </span>
                </div>
              </div>
            </template>
          </multiselect>
        </div>
        <div>
          <VueDatePicker
            class="dp__theme_dark"
            v-model="datePicker"
            :modelValue="datePicker"
            @update:modelValue="$emit('updateDatePicker', $event)"
            placeholder="Filter by Date"
            utc
            dark="true"
            range
          >
          </VueDatePicker>
        </div>
        <!-- <div>
          <multiselect
            :showLabels="false"
            v-model="selectedChain"
            placeholder="Filter by Chain..."
            label="name"
            track-by="code"
            :options="optionsChains"
            :multiple="true"
            :taggable="true"
            :searchable="false"
          >
            <template v-slot:tag="{ option, remove }">
              <div
                class="multiselect-tag is-user"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 5px 8px 5px 4px;
                  gap: 6px;
                "
              >
                <div>
                  {{ option.name }}
                </div>
                <div>
                  <span
                    v-if="!disabled"
                    style=""
                    @mousedown.prevent="remove(option, $event)"
                  >
                    <CIcon class="tag_close" icon="cilXCircle" size="md" />
                  </span>
                </div>
              </div>
            </template>
          </multiselect>
        </div> -->
      </div>
</template>
<script setup>
import Multiselect from 'vue-multiselect'
import { defineProps, toRefs } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps(['datePicker', 'isFilterOpen', 'selectedTokens', 'selectedStrategy', 'selectedProfit', 'selectedChain', 'optionsTokens', 'optionsStrategies', 'optionsProfit'])
const { datePicker, selectedProfit, selectedStrategy, selectedTokens } = toRefs(props)

</script>
<style scoped lang="scss">
@import '@/styles/_variables.scss';
:deep(.multiselect-tag.is-user_margin-bottom) {
  margin-bottom: 5px;
}
:deep(.multiselect-tag.is-user) {
  border-radius: 20px;
  background: rgba(0, 192, 135, 0.5);
  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 8px;
  gap: 6px;
  font-size: 12px;
  margin-right: 2px;
  @media (max-width: $xxl) {
    padding: 0 6px;
    font-size: 10px;
  }
}

:deep(.multiselect-tag.is-user img) {
  width: 20px;
  border-radius: 50%;
  height: 20px;
}

:deep(.multiselect-tag.is-user i:before) {
  color: #ffffff;
  border-radius: 50%;
}

:deep(.multiselect--active) {
  .multiselect__tags {
    border-radius: 20px 20px 0 0 !important;
    border-bottom: none !important;
  }

  .multiselect__placeholder {
    display: inline-block !important;
  }
}

:deep(.multiselect) {
  min-height: 35px !important;
  @media (max-width: $xxl) {
    min-height: 24px !important;
  }
}
:deep(.multiselect__tags) {
  min-height: 38px !important;
  min-width: 285px;
  max-width: 285px;
  display: block;
  padding: 7px 40px 7px 13px;
  border-radius: 20px !important;
  border: 1px solid #00C9FF !important;
  background: transparent !important;
  @media (max-width: $xxl) {
    min-height: 24px !important;
    padding: 3px 10px 3px 10px;
    min-width: 190px;
  }
}
:deep(.multiselect__select) {
  @media (max-width: $xxl) {
    width: 24px;
    height: 30px;
  }
}
:deep(.multiselect__placeholder) {
  margin-bottom: 0 !important;
  font-size: 12px !important;
  vertical-align: middle;
  padding: 0 !important;
  @media (max-width: $xxl) {
    font-size: 10px !important;
  }
}

:deep(.multiselect__tags-wrap) {
  display: flex !important;
  flex-wrap: wrap !important;
}

:deep(.multiselect__option--highlight) {
  background: lighten(#02120A, 0.05) !important;
}

:deep(.multiselect__option) {
  background: #02120A !important;
  color: white !important;
  font-size: 12px !important;
  @media (max-width: $xxl) {
    font-size: 10px !important;
  }
}

:deep(.multiselect__option:hover) {
  background: lighten(#02120A, 0.7) !important;
}

:deep(.multiselect__content-wrapper) {
  border: 1px solid #00C9FF !important;
  background: none !important;
  max-height: 300px !important;
  &::-webkit-scrollbar {
    width: 4px;
    /* ширина всей полосы прокрутки */
  }

  &::-webkit-scrollbar-track {
    background: #0f1113;
    /* цвет зоны отслеживания */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #a3a4a5;
    /* цвет бегунка */
    border-radius: 20px;
    /* округлось бегунка */
  }
}

:deep(.multiselect__option.multiselect__option--highlight::after) {
  background: rgba(15, 17, 19, 1) !important;
}

:deep(.multiselect__option--selected.multiselect__option--highlight::after) {
  background: rgba(15, 17, 19, 1) !important;
}

:deep(.multiselect__option--selected) {
  color: #00C9FF !important;
}

:deep(.multiselect__option--selected:hover) {
  color: rgb(229, 83, 83) !important;
}

:deep(.multiselect__option) {
  color: rgba(108, 114, 132, 1);
}
:deep(.tag_close) {
  margin-top: 2px;
  @media (max-width: 1400px) {
    width: 12px !important;
  }
}
:deep(.tag_close:hover) {
  color: rgb(255, 146, 146);
  cursor: pointer;
}

:deep(.dp__theme_dark) {
  --dp-background-color: #02120A;
  --dp-primary-color: #00C9FF;
  --dp-highlight-color: #00c8ff42;
  --dp-border-color: #00C9FF;
  --dp-menu-border-color: #00C9FF;
  --dp-border-color-hover: #00C9FF;
  --dp-border-radius: 12px;
  --dp-action-buttons-padding: 3px 9px;
  --dp-action-button-height: 32px
}

:deep(.dp__input) {
  min-height: 35px;
  border-radius: 20px;
  min-width: 285px !important;
  max-width: 285px !important;
  padding: 5px 30px 7px 35px;
  @media (max-width: $xxl) {
    min-height: 28.6px !important;
    min-width: 190px !important;
    width: 190px !important;
    height: 24px !important;
    padding: 10px 10px 16px 35px;
  }
  &::_wrap {
    svg {
      display: none;
    }
  }

  &::placeholder {
    color: #fff;
    font-family: Poppins;
    font-weight: 200;
    font-size: 12px;
    @media (max-width: $xxl) {
      font-size: 10px;
    }
  }
}

.filters_container {
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
}
@media (max-width:$md) {
  .filters_container {
  display: flex;
  flex-direction: column;

  align-items: stretch;

  gap: 10px;
  flex-wrap: wrap;
}

:deep(.multiselect__tags-wrap) {
  padding-top: 5px;
}

:deep(.multiselect__tags) {
  min-width: 100%;
  max-width: 100%;


}
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
