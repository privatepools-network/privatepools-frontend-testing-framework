<template>
  <div
    class="flex flex-col mt-0 md:mt-4 gap-2 footer_text text-black dark:text-white"
  >
    <a
      v-for="(item, i) in footerLinks"
      :key="i"
      :href="item.href"
      target="_blank"
      class="text-decoration-none"
    >
      <div
        class="flex items-center gap-1 font-['Syne',_sans-serif] uppercase footer_text_svg"
      >
        {{ item.label }}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.9942 12.4373V8.16327C13.9942 7.94752 13.8192 7.77259 13.6035 7.77259H12.828C12.6122 7.77259 12.4373 7.94752 12.4373 8.16327V12.4373H1.55685V1.55685H5.8309C6.04665 1.55685 6.22157 1.38192 6.22157 1.16618V0.390671C6.22157 0.174927 6.04665 0 5.8309 0H1.55685C0.693878 0 0 0.693878 0 1.55685V12.4431C0 12.8561 0.164025 13.252 0.455991 13.544C0.747957 13.836 1.14395 14 1.55685 14H12.4431C12.8561 14 13.252 13.836 13.544 13.544C13.836 13.252 14 12.8561 14 12.4431L13.9942 12.4373ZM13.6152 0.180758L13.8251 0.390671C13.93 0.489796 13.9942 0.629738 13.9942 0.781341V5.83673C13.9942 6.05248 13.8192 6.22741 13.6035 6.22741H12.828C12.7244 6.22741 12.625 6.18625 12.5517 6.11298C12.4785 6.03972 12.4373 5.94035 12.4373 5.83673V2.66472L5.87755 9.21866C5.72595 9.37026 5.48105 9.37026 5.32945 9.21866L4.78717 8.67638C4.75114 8.64042 4.72255 8.59771 4.70304 8.55068C4.68353 8.50365 4.67349 8.45324 4.67349 8.40233C4.67349 8.35142 4.68353 8.30101 4.70304 8.25398C4.72255 8.20696 4.75114 8.16424 4.78717 8.12828L11.3411 1.55685H8.16327C8.05965 1.55685 7.96028 1.51569 7.88702 1.44243C7.81375 1.36916 7.77259 1.26979 7.77259 1.16618V0.390671C7.77259 0.174927 7.94752 0 8.16327 0H13.2187C13.3703 0.0058309 13.5102 0.0699708 13.6152 0.180758Z"
            fill="#DCEEF6"
          /></svg>
      </div>
    </a>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const footerLinks = ref([
  {
    label: 'docs',
    href: 'https://docs.privatepools.network/',
  },
  {
    label: 'Pitch deck',
    href: 'https://privatepoolsnetwork.docsend.com/v/qh6sz/private-pools-network-pitch-deck',
  },
  {
    label: 'whitepaper',
    href: 'https://privatepoolsnetwork.docsend.com/view/y7mfypipz654xd2u',
  },
])
</script>
