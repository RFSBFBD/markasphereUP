// مساعد بسيط لمعرفة اتجاه الصفحة الحالي (عربي = RTL / إنجليزي = LTR)
// يُستخدم لعكس حركات GSAP الأفقية (محور x) تلقائياً حسب اللغة.

export function isRTL() {
  if (typeof document === 'undefined') return true
  return document.documentElement.getAttribute('dir') === 'rtl'
}

// 1 في الوضع LTR و -1 في الوضع RTL.
// اضرب أي قيمة أفقية (x) في الناتج عشان تتعكس صح.
export function dirSign() {
  return isRTL() ? -1 : 1
}
