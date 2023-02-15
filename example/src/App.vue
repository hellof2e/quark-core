<script setup>
import Desc from './components/Desc/index.vue'
</script>

<template>
  <div>
    <a href="https://quark-design.hellobike.com" target="_blank">
      <img src="https://quark-design.hellobike.com/assets/quark-logo.7fd50e67.png" class="logo" alt="Vite logo" />
    </a>
  </div>
  <Desc />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
