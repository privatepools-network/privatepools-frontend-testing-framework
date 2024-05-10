<template>
    <span class="progress_loader"></span>
</template>
<style lang="scss" scoped>
.progress_loader {
  width: 0;
  height: 2.8px;
  display: inline-block;
  position: relative;
  background: #00E0FF;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  box-sizing: border-box;
  animation: animFw 8s linear infinite;
}
  .progress_loader::after,
  .progress_loader::before {
    content: '';
    width: 3px;
    height: 1px;
    background: #00E0FF;
    position: absolute;
    top: 9px;
    right: -2px;
    opacity: 0;
    transform: rotate(-45deg) translateX(0px);
    box-sizing: border-box;
    animation: coli1 0.3s linear infinite;
  }
  .progress_loader::before {
    top: -4px;
    transform: rotate(45deg);
    animation: coli2 0.3s linear infinite;
  }

@keyframes animFw {
    0% {
  width: 0;
}
    100% {
  width: 100%;
}
  }

@keyframes coli1 {
    0% {
  transform: rotate(-45deg) translateX(0px);
  opacity: 0.7;
}
    100% {
  transform: rotate(-45deg) translateX(-25px);
  opacity: 0;
}
  }

@keyframes coli2 {
    0% {
  transform: rotate(45deg) translateX(0px);
  opacity: 1;
}
    100% {
  transform: rotate(45deg) translateX(-25px);
  opacity: 0.7;
}
  }
  
</style>
