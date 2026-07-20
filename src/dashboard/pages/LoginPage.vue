<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/dashboard/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  if (!email.value?.trim() || !password.value?.trim()) {
    error.value = 'يرجى إدخال البريد الإلكتروني وكلمة المرور'
    return
  }
  loading.value = true
  try {
    await authStore.login(email.value.trim(), password.value)
    const redirect = route.query.redirect || { name: 'dashboard-home' }
    router.push(redirect)
  } catch (e) {
    error.value = e?.message || 'فشل تسجيل الدخول، تأكد من البيانات'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="ds-center-screen">
    <div class="ds-card" style="width: 100%; max-width: 380px;">
      <div class="ds-brand" style="justify-content: center; padding-bottom: 18px;">
        <span class="ds-logo">M</span>
        <span>MarkaSphere</span>
      </div>
      <h2 style="text-align: center; margin: 0 0 18px;">تسجيل الدخول</h2>
      <form class="ds-form" @submit.prevent="submit">
        <label class="ds-field">
          <span>البريد الإلكتروني</span>
          <input v-model="email" type="email" placeholder="admin@markasphere.com" />
        </label>
        <label class="ds-field">
          <span>كلمة المرور</span>
          <input v-model="password" type="password" placeholder="••••••••" />
        </label>
        <button class="ds-btn is-primary" type="submit" style="width: 100%; justify-content: center;" :disabled="loading">
          {{ loading ? 'جاري الدخول...' : 'دخول' }}
        </button>
        <p v-if="error" class="ds-login-error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.ds-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ds-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ds-text-muted);
}
.ds-field input {
  padding: 11px 12px;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  background: var(--ds-surface-2);
  color: var(--ds-text);
  font-size: 14px;
  outline: none;
}
.ds-field input:focus {
  border-color: var(--ds-primary);
}

.ds-login-error {
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--ds-radius-sm);
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}
</style>
