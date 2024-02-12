<template>
  <div>
    <CRow>
      <CCol :md="8" class="mt-4">
        <span class="text-white fs-4">Arbitrage Bot Parameters</span>
        <CCard class="mb-4 mt-2">
          <CCardBody>
            <div class="d-flex flex-column">
              <CCard
                class="border-gradient mb-5"
                style="width: 400px; height: 100px"
              >
                <div class="d-flex">
                  <div
                    class="d-flex justify-content-between text-white gradient-bg align-items-center"
                  >
                    <div class="d-flex flex-column ps-2">
                      <span class="fs-4">Investment</span>
                      <span class="fs-3">$300,00</span>
                    </div>
                    <div class="d-flex flex-column pe-2">
                      <span class="fs-4 text-end">Arbitrage profit</span>
                      <span class="fs-4 text-end">+$160.73(+0.53%)</span>
                    </div>
                  </div>
                </div>
              </CCard>
              <div class="d-flex justify-content-between flex-wrap">
                <div class="d-flex flex-column text-white ms-1 me-2">
                  <span>Unrealized profit</span>
                  <span class="fs-5">$300,00</span>
                </div>
                <div class="d-flex flex-column text-white ms-1 me-2">
                  <span>Fees</span>
                  <span class="fs-5">$300,00</span>
                </div>
                <div class="d-flex flex-column text-white ms-1 me-2">
                  <span>Total profit</span>
                  <span class="fs-5">$300,00</span>
                </div>
                <div class="d-flex flex-column text-white ms-1 me-2">
                  <span>Today´s APR</span>
                  <span class="fs-5">$300,00</span>
                </div>
                <div class="d-flex flex-column text-white ms-1 me-2">
                  <span>7D APR</span>
                  <span class="fs-5">$300,00</span>
                </div>
                <div class="d-flex flex-column text-white ms-1 me-2">
                  <span>History APR</span>
                  <span class="fs-5">$300,00</span>
                </div>
              </div>
              <div class="d-flex flex-column mt-4">
                <span class="text-white">Select Deviation</span>
                <div class="d-flex mt-3 align-items-center">
                  <div
                    style="width: 100px"
                    class="border border-success rounded d-flex align-items-center justify-content-between px-1 py-1 text-white"
                  >
                    <CFormInput
                      type="text"
                      class="bg-transparent border-none border border-primary p-0 text-white"
                    />
                    %
                  </div>
                  <span class="text-success ms-2 text-decoration-underline"
                    >10%</span
                  >
                  <span class="text-success ms-2 text-decoration-underline"
                    >20%</span
                  >
                  <span class="text-success ms-2 text-decoration-underline"
                    >30%</span
                  >
                </div>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
// import Fieldset from 'primevue/fieldset'
import { CRow } from '@coreui/vue'

export default {
  name: 'Dashboard',
  components: {
    CRow,
  },
}
</script>

<style>
.gradient-bg {
  transition: transform 1s ease 0s;
  background: linear-gradient(135deg, #22282c 45%, #00C9FF 45% 100%);
  width: 400px;
  height: 94px;
}
</style>
