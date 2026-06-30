import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

export function useCursor() {
  let cursor = null
  let isMobile = false

  const move = (e) => {
    if (!cursor || isMobile) return

    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: 'power2.out'
    })
  }

  const checkMobile = () => {
    isMobile = window.matchMedia('(max-width: 1024px)').matches ||
               'ontouchstart' in window ||
               navigator.maxTouchPoints > 0
  }

  onMounted(() => {
    checkMobile()

    if (isMobile) return

    cursor = document.querySelector('.custom-cursor')

    if (!cursor) {
      cursor = document.createElement('div')
      cursor.className = 'custom-cursor'
      document.body.appendChild(cursor)
    }

    window.addEventListener('mousemove', move)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', move)
  })
}
