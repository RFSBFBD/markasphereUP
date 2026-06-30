<template>
  <div class="main-layout">
    <div :class="['loader', { hidden: !loading }]">
      <div class="loader__content">
        <span class="loader__mark">M</span>
        <div class="loader__bar">
          <div class="loader__progress"></div>
        </div>
      </div>
    </div>

    <Header />
    <main>
      <RouterView />
    </main>
    <Footer />
    <WhatsAppFAB />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import WhatsAppFAB from '@/components/layout/WhatsAppFAB.vue'

const loading = ref(true)
let loaderTimer = null

onMounted(() => {
  loaderTimer = setTimeout(() => {
    loading.value = false
    loaderTimer = null
  }, 3000)
})

onUnmounted(() => {
  if (loaderTimer) clearTimeout(loaderTimer)
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
  visibility: visible;
}

.loader.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.loader__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
}

.loader__mark {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--gradient-accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display-en);
  font-size: 32px;
  font-weight: 700;
  animation: loaderPulse 2.8s ease-in-out 1;
}

@keyframes loaderPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.loader__bar {
  width: 200px;
  height: 2px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.loader__progress {
  width: 100%;
  height: 100%;
  background: var(--gradient-accent);
  border-radius: 2px;
  animation: loaderBar 2.8s ease-in-out 1;
}

@keyframes loaderBar {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
