<template>
  <div class="contact-page">
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__tag">Contact</p>
        <h1 class="page-hero__title">تواصل معنا</h1>
        <p class="page-hero__desc">
          نحن هنا لمساعدتك. تواصل معنا ودعنا نحول فكرتك إلى واقع.
        </p>
      </div>
    </section>

    <BaseSection>
      <div class="contact-form">
        <div class="contact-form__info">
          <h2>معلومات التواصل</h2>
          <div class="contact-form__item">
            <span class="contact-form__label">البريد الإلكتروني</span>
            <a :href="`mailto:${site.email}`">{{ site.email }}</a>
          </div>
          <div class="contact-form__item">
            <span class="contact-form__label">الهاتف</span>
            <a :href="`tel:${site.phone}`">{{ site.phone }}</a>
          </div>
          <div class="contact-form__item">
            <span class="contact-form__label">تابعنا</span>
            <div class="contact-form__socials">
              <a
                v-for="(url, platform) in site.socials"
                :key="platform"
                :href="url"
                target="_blank"
                rel="noopener"
              >
                {{ platform }}
              </a>
            </div>
          </div>
        </div>

        <form class="contact-form__form" @submit.prevent="handleSubmit">
          <div v-if="submitStatus" :class="['contact-form__status', `contact-form__status--${submitStatus.type}`]">
            {{ submitStatus.message }}
          </div>
          
          <div class="contact-form__field">
            <label for="cf-name">الاسم</label>
            <input id="cf-name" v-model="formData.name" type="text" placeholder="اسمك الكامل" :disabled="isSubmitting" />
          </div>
          <div class="contact-form__field">
            <label for="cf-email">البريد الإلكتروني</label>
            <input id="cf-email" v-model="formData.email" type="email" placeholder="email@example.com" :disabled="isSubmitting" />
          </div>
          <div class="contact-form__field">
            <label for="cf-message">الرسالة</label>
            <textarea id="cf-message" v-model="formData.message" rows="5" placeholder="اكتب رسالتك هنا..." :disabled="isSubmitting"></textarea>
          </div>
          <button type="submit" class="contact-form__submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة' }}
          </button>
        </form>
      </div>
    </BaseSection>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseSection from '@/components/base/BaseSection.vue'
import { SITE } from '@/constants/site'

const site = SITE

const formData = ref({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const submitStatus = ref(null)

const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    submitStatus.value = { type: 'error', message: 'يرجى ملء جميع الحقول' }
    setTimeout(() => { submitStatus.value = null }, 3000)
    return
  }

  isSubmitting.value = true
  try {
    // In a real app, send to backend/email service
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    submitStatus.value = { type: 'success', message: 'تم إرسال رسالتك بنجاح!' }
    formData.value = { name: '', email: '', message: '' }
  } catch (error) {
    submitStatus.value = { type: 'error', message: 'حدث خطأ، يرجى المحاولة مرة أخرى' }
  } finally {
    isSubmitting.value = false
    setTimeout(() => { submitStatus.value = null }, 3000)
  }
}
</script>

<style scoped>
.page-hero {
  padding: 160px 0 80px;
  text-align: center;
}

.page-hero__tag {
  font-family: var(--font-body-en);
  font-size: var(--text-small);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--space-md);
}

.page-hero__title {
  font-family: var(--font-display-ar);
  font-size: var(--text-display-xl);
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.page-hero__desc {
  font-family: var(--font-body-ar);
  font-size: var(--text-body-lg);
  color: var(--color-text-muted);
  max-width: 560px;
  margin: 0 auto;
}

.contact-form {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: var(--space-4xl);
}

.contact-form__info h2 {
  font-family: var(--font-display-ar);
  font-size: var(--text-h2);
  color: var(--color-text);
  margin-bottom: var(--space-2xl);
}

.contact-form__item {
  margin-bottom: var(--space-xl);
}

.contact-form__label {
  display: block;
  font-family: var(--font-body-ar);
  font-size: var(--text-small);
  color: var(--color-text-muted);
  margin-bottom: var(--space-xs);
}

.contact-form__item a {
  font-family: var(--font-body-en);
  font-size: var(--text-body);
  color: var(--color-text);
  transition: color var(--duration-fast) var(--ease-primary);
}

.contact-form__item a:hover {
  color: var(--color-accent);
}

.contact-form__socials {
  display: flex;
  gap: var(--space-md);
}

.contact-form__socials a {
  text-transform: capitalize;
  font-size: var(--text-body);
}

.contact-form__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.contact-form__field label {
  display: block;
  font-family: var(--font-body-ar);
  font-size: var(--text-small);
  color: var(--color-text-muted);
  margin-bottom: var(--space-xs);
}

.contact-form__field input,
.contact-form__field textarea {
  width: 100%;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-bg-alt);
  color: var(--color-text);
  font-family: var(--font-body-ar);
  font-size: var(--text-body);
  transition: border-color var(--duration-fast) var(--ease-primary),
              box-shadow var(--duration-fast) var(--ease-primary);
}

.contact-form__field input:focus,
.contact-form__field textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-glow);
}

.contact-form__field textarea {
  resize: vertical;
}

.contact-form__submit {
  align-self: flex-start;
  height: 56px;
  padding-inline: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--gradient-accent);
  color: #fff;
  font-family: var(--font-body-ar);
  font-size: var(--text-body);
  font-weight: 500;
  cursor: pointer;
  transition: transform var(--duration-normal) var(--ease-primary),
              box-shadow var(--duration-normal) var(--ease-primary);
}

.contact-form__submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-btn-accent-hover);
}

.contact-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact-form__status {
  padding: 16px;
  border-radius: var(--radius-sm);
  font-family: var(--font-body-ar);
  font-size: var(--text-body);
  margin-bottom: var(--space-lg);
}

.contact-form__status--success {
  background: rgba(22, 163, 74, 0.1);
  color: #16a34a;
  border: 1px solid #16a34a;
}

.contact-form__status--error {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border: 1px solid #dc2626;
}

@media (max-width: 768px) {
  .contact-form {
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
  }

  .page-hero__title {
    font-size: var(--text-h1);
  }
}
</style>
