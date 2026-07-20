import { reactive } from 'vue'

const toasts = reactive([])
let seq = 0

function push(type, message) {
  const id = ++seq
  toasts.push({ id, type, message })
  setTimeout(() => dismiss(id), 4000)
}

function dismiss(id) {
  const i = toasts.findIndex((t) => t.id === id)
  if (i > -1) toasts.splice(i, 1)
}

export function useToast() {
  return {
    toasts,
    push,
    dismiss,
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m),
  }
}
