import gsap from 'gsap'
import { ref } from 'vue'
import { MOTION } from '@/composables/animations/motion.config'

export function createSlider() {
  let autoTimer = null
  let currentX = 0
  let setWidth = 0
  let cardWidth = 0
  let navigating = false
  let hovered = false
  let manualPause = false
  let trackEl = null
  let sliderEl = null
  let isDragging = false
  let dragStartX = 0
  let dragStartTrackX = 0
  let dragMoved = false
  let resumeTimeout = null
  let scrollResumeTimeout = null
  let scrolling = false
  let inView = true
  let observer = null

  const isTouch = window.matchMedia("(pointer: coarse)").matches

  const DRAG_THRESHOLD = 8
  const suppressClick = ref(false)

  const AUTO_INTERVAL = 3500
  const ANIM_DURATION = 1.2

  function paused() {
    return hovered || manualPause || scrolling || !inView
  }

  function clearResumeTimeout() {
    if (resumeTimeout) {
      clearTimeout(resumeTimeout)
      resumeTimeout = null
    }
  }

  function scheduleResume(delay) {
    clearResumeTimeout()
    resumeTimeout = setTimeout(() => {
      manualPause = false
      if (!paused()) startAutoAdvance()
      resumeTimeout = null
    }, delay)
  }

  function clearScrollResumeTimeout() {
    if (scrollResumeTimeout) {
      clearTimeout(scrollResumeTimeout)
      scrollResumeTimeout = null
    }
  }

  function onWindowScroll() {
    scrolling = true
    clearScrollResumeTimeout()
    scrollResumeTimeout = setTimeout(() => {
      scrolling = false
      scrollResumeTimeout = null
    }, 180)
  }

  function startAutoAdvance() {
    stopAutoAdvance()
    if (paused()) return
    autoTimer = setInterval(() => {
      if (!paused() && !navigating) navigate(-1)
    }, AUTO_INTERVAL)
  }

  function stopAutoAdvance() {
    if (autoTimer) {
      clearInterval(autoTimer)
      autoTimer = null
    }
  }

  function onHoverEnter() {
    hovered = true
    stopAutoAdvance()
  }

  function onHoverLeave() {
    hovered = false
    if (!manualPause) scheduleResume(500)
  }

  function onPointerDown(e) {
    if (navigating || e.button !== 0) return
    isDragging = false
    dragMoved = false
    dragStartX = e.clientX
    dragStartTrackX = currentX
  }

  function onPointerMove(e) {
    if (navigating) return
    const dx = e.clientX - dragStartX

    if (!isDragging) {
      if (Math.abs(dx) <= DRAG_THRESHOLD) return
      dragMoved = true
      isDragging = true
      manualPause = true
      clearResumeTimeout()
      stopAutoAdvance()
      trackEl.setPointerCapture(e.pointerId)
      trackEl.classList.add('portfolio-track--dragging')
    }

    e.preventDefault()

    currentX = dragStartTrackX + dx
    if (currentX <= -setWidth) currentX += setWidth
    if (currentX > 0) currentX -= setWidth
    gsap.set(trackEl, { x: currentX })
  }

  function snapAfterDrag() {
    const rawIndex = Math.round(currentX / cardWidth)
    let targetX = rawIndex * cardWidth
    if (targetX <= -setWidth) targetX += setWidth
    if (targetX >= 0) targetX -= setWidth

    navigating = true
    gsap.to(trackEl, {
      x: targetX,
      duration: 0.5,
      ease: MOTION.ease.primary,
      onComplete: () => {
        currentX = parseFloat(gsap.getProperty(trackEl, 'x'))
        navigating = false
        if (!hovered) scheduleResume(2000)
      }
    })
  }

  function onPointerUp(e) {
    if (!dragMoved) return

    isDragging = false
    trackEl.classList.remove('portfolio-track--dragging')
    try { trackEl.releasePointerCapture(e.pointerId) } catch (_) {}

    suppressClick.value = true
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        suppressClick.value = false
      })
    })

    snapAfterDrag()
  }

  function onPointerCancel(e) {
    if (!isDragging) return
    isDragging = false
    trackEl.classList.remove('portfolio-track--dragging')
    try { trackEl.releasePointerCapture(e.pointerId) } catch (_) {}
    manualPause = false
    if (!hovered) scheduleResume(500)
  }

  function navigate(direction) {
    if (!trackEl || navigating) return
    navigating = true
    manualPause = true
    clearResumeTimeout()
    stopAutoAdvance()

    let targetX = currentX - cardWidth * direction

    if (targetX <= -setWidth) targetX += setWidth
    if (targetX >= 0) targetX -= setWidth

    gsap.to(trackEl, {
      x: targetX,
      duration: ANIM_DURATION,
      ease: 'power3.out',
      onComplete: () => {
        currentX = parseFloat(gsap.getProperty(trackEl, 'x'))
        navigating = false
        if (!hovered) scheduleResume(2000)
      }
    })
  }

  function init(el, containerEl, scrollSpeed = 60, onClone) {
    destroy()
    if (!el) return

    trackEl = el
    sliderEl = containerEl

    const originalCards = [...el.querySelectorAll('.portfolio-card')]
    if (originalCards.length === 0) return

    originalCards.forEach(card => {
      const clone = card.cloneNode(true)
      el.appendChild(clone)
      if (onClone) onClone(clone)
    })

    currentX = 0
    navigating = false
    hovered = false
    manualPause = false
    isDragging = false
    scrolling = false
    inView = true

    sliderEl.addEventListener('mouseenter', onHoverEnter)
    sliderEl.addEventListener('mouseleave', onHoverLeave)
    window.addEventListener('scroll', onWindowScroll, { passive: true })

    if (isTouch) {
      trackEl.addEventListener('pointerdown', onPointerDown)
      trackEl.addEventListener('pointermove', onPointerMove)
      trackEl.addEventListener('pointerup', onPointerUp)
      trackEl.addEventListener('pointercancel', onPointerCancel)
    }

    if ('IntersectionObserver' in window && sliderEl) {
      observer = new IntersectionObserver((entries) => {
        inView = entries.some(entry => entry.isIntersecting)
        if (inView) {
          if (!paused()) startAutoAdvance()
        } else {
          stopAutoAdvance()
        }
      }, { rootMargin: '120px 0px' })
      observer.observe(sliderEl)
    }

    requestAnimationFrame(() => {
      setWidth = el.scrollWidth / 2
      if (setWidth <= 0) return

      const gap = parseFloat(getComputedStyle(el).gap) || 0
      const card = el.querySelector('.portfolio-card')
      cardWidth = card ? card.offsetWidth + gap : 0

      currentX = 0
      gsap.set(el, { x: 0 })
      startAutoAdvance()
    })
  }

  function destroy() {
    stopAutoAdvance()
    clearResumeTimeout()
    clearScrollResumeTimeout()

    if (observer) {
      observer.disconnect()
      observer = null
    }

    window.removeEventListener('scroll', onWindowScroll)

    if (sliderEl) {
      sliderEl.removeEventListener('mouseenter', onHoverEnter)
      sliderEl.removeEventListener('mouseleave', onHoverLeave)
    }

    if (trackEl) {
      if (isTouch) {
        trackEl.removeEventListener('pointerdown', onPointerDown)
        trackEl.removeEventListener('pointermove', onPointerMove)
        trackEl.removeEventListener('pointerup', onPointerUp)
        trackEl.removeEventListener('pointercancel', onPointerCancel)
      }
      trackEl.classList.remove('portfolio-track--dragging')
    }

    trackEl = null
    sliderEl = null
    isDragging = false
    navigating = false
    scrolling = false
    inView = true
  }

  function cleanup(el) {
    if (!el) return
    gsap.set(el, { x: 0 })
    const cards = el.querySelectorAll('.portfolio-card')
    const half = Math.floor(cards.length / 2)
    for (let i = cards.length - 1; i >= half; i--) {
      cards[i].remove()
    }
  }

  function slideNext() { navigate(-1) }
  function slidePrev() { navigate(1) }

  function pause() {
    manualPause = true
    clearResumeTimeout()
    stopAutoAdvance()
  }

  function resume() {
    manualPause = false
    clearResumeTimeout()
    if (!paused()) startAutoAdvance()
  }

  return { init, destroy, cleanup, slideNext, slidePrev, pause, resume, suppressClick }
}
