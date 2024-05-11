<template>
    <div class="background-particles"></div>
  </template>
  <script setup>
  import { onMounted } from 'vue';
  import Particles from 'particles.js'; // Import this if you are using a module system
  const initParticles = (options) => {
    // array of colors to create smooth gradient lines
    const color = [options.colorDark, options.colorAccent, options.colorDark];
    const particlesAmount = options.particleAmount;
    Particles.init({
      selector: options.selector,
      color: color,
      connectParticles: true,
      maxParticles: particlesAmount,
      responsive: [
        {
          breakpoint: 768,
          options: {
            color: color,
            maxParticles: Math.floor(particlesAmount / 3.5),
            connectParticles: true
          }
        }
      ]
    });
  };
  onMounted(() => {
    const options = {
      selector: '.background-particles',
      colorDark: '#02031C',
      colorAccent: '#00E0FF',
      particleAmount: 140
    };
    // Initialize particles if the element is available
    if (document.querySelector(options.selector)) {
      initParticles(options);
    }
  });
  </script>
  <style scoped>
  .background-particles {
    /* your styles here */
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
  }
  </style>