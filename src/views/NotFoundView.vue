<template>
  <div class="not-found">
    <div class="not-found__content">
      <span ref="code" class="not-found__code">404</span>
      <h1 ref="title" class="not-found__title">الصفحة غير موجودة</h1>
      <p ref="desc" class="not-found__desc">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <RouterLink ref="btn" to="/" class="not-found__btn">
        العودة للرئيسية
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'
import { useStagger } from '@/composables/animations/useMotionSystem'
import { MOTION } from '@/composables/animations/motion.config'

const code = ref(null)
const title = ref(null)
const desc = ref(null)
const btn = ref(null)

const { stagger } = useStagger()

let ctx = null

onMounted(() => {
  ctx = gsap.context(() => {
    const items = [code.value, title.value, desc.value, btn.value].filter(Boolean)
    if (items.length) {
      stagger(items, {
        y: 30,
        opacity: 0,
        duration: MOTION.normal,
        delay: 0.1,
        stagger: 0.2,
        ease: MOTION.ease.strong
      })
    }
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-xl);
}

.not-found__code {
  font-family: var(--font-display-en);
  font-size: 180px;
  font-weight: 700;
  line-height: 1;
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-lg);
  display: block;
}

.not-found__title {
  font-family: var(--font-display-ar);
  font-size: var(--text-display-lg);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.not-found__desc {
  font-family: var(--font-body-ar);
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  max-width: 400px;
  margin: 0 auto var(--space-2xl);
}

.not-found__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding-inline: 32px;
  border-radius: 14px;
  background: var(--gradient-accent);
  color: #fff;
  font-family: var(--font-body-ar);
  font-size: var(--text-body);
  font-weight: 500;
  transition: transform var(--duration-normal) var(--ease-primary),
              box-shadow var(--duration-normal) var(--ease-primary);
}

.not-found__btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-btn-accent-hover);
}

@media (max-width: 768px) {
  .not-found__code {
    font-size: 100px;
  }

  .not-found__title {
    font-size: var(--text-h2);
  }
}
</style>
