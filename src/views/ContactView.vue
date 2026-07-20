<template>
  <div class="contact-page">
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__tag">{{ t('pageHero.contact.tag') }}</p>
        <h1 class="page-hero__title">{{ t('pageHero.contact.title') }}</h1>
        <p class="page-hero__desc">
          {{ t('pageHero.contact.desc') }}
        </p>
      </div>
    </section>

    <BaseSection>
      <div class="contact-form">
        <div class="contact-form__info">
          <h2 class="contact-form__info-title">{{ t('contact.infoTitle') }}</h2>

          <div class="contact-form__list">
            <a v-if="site.email" :href="`mailto:${site.email}`" class="contact-form__item">
              <span class="contact-form__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>
              </span>
              <span class="contact-form__text">
                <span class="contact-form__label">{{ t('contact.email') }}</span>
                <span class="contact-form__value">{{ site.email }}</span>
              </span>
            </a>

            <a v-if="site.phone" :href="`tel:${site.phone}`" class="contact-form__item">
              <span class="contact-form__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              <span class="contact-form__text">
                <span class="contact-form__label">{{ t('contact.phone') }}</span>
                <span class="contact-form__value">{{ site.phone }}</span>
              </span>
            </a>

            <a v-if="site.whatsapp" :href="site.whatsapp" target="_blank" rel="noopener" class="contact-form__item">
              <span class="contact-form__icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </span>
              <span class="contact-form__text">
                <span class="contact-form__label">{{ t('contact.whatsapp') }}</span>
                <span class="contact-form__value">{{ t('footer.whatsapp') }}</span>
              </span>
            </a>

            <span v-if="site.address_ar || site.address_en" class="contact-form__item">
              <span class="contact-form__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <span class="contact-form__text">
                <span class="contact-form__label">{{ t('contact.address') }}</span>
                <span class="contact-form__value">{{ locale === 'ar' ? site.address_ar : (site.address_en || site.address_ar) }}</span>
              </span>
            </span>

            <a v-if="site.googleMapsUrl" :href="site.googleMapsUrl" target="_blank" rel="noopener" class="contact-form__item">
              <span class="contact-form__icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 20l-5.5-2V4l5.5 2 6-2 5.5 2v14l-5.5-2-6 2z"/><path d="M9 6v14M15 4v14"/></svg>
              </span>
              <span class="contact-form__text">
                <span class="contact-form__label">{{ t('contact.map') }}</span>
                <span class="contact-form__value">{{ t('footer.map') }}</span>
              </span>
            </a>
          </div>

          <div v-if="activeSocials.length" class="contact-form__socials">
            <span class="contact-form__socials-label">{{ t('contact.social') }}</span>
            <div class="contact-form__socials-row">
              <a
                v-for="(url, platform) in activeSocials"
                :key="platform"
                :href="url"
                target="_blank"
                rel="noopener noreferrer"
                class="contact-form__social"
                :aria-label="platform"
              >
                <svg v-if="platform === 'linkedin'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                <svg v-else-if="platform === 'instagram'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <svg v-else-if="platform === 'facebook'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                <svg v-else-if="platform === 'x'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                <svg v-else-if="platform === 'tiktok'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 3.84.96V7.01a4.84 4.84 0 0 1-2-.32z"/></svg>
                <svg v-else-if="platform === 'youtube'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5v-7l6.4 3.5z"/></svg>
                <svg v-else-if="platform === 'behance'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 7h-6V5h6zM12 11.5c.7-.4 1.2-1 1.2-2 0-1.9-1.4-2.9-3.5-2.9H3v12h7.1c2.3 0 4-1.4 4-3.6 0-1.4-.7-2.5-1.1-2.5zM5.4 7.2h3.3c.9 0 1.5.4 1.5 1.2 0 .8-.6 1.2-1.6 1.2H5.4zM9 15.4H5.4v-3.4H9c1.1 0 1.8.5 1.8 1.7 0 1.3-.8 1.7-1.8 1.7zM19 12.8c0-2.5-1.5-4.6-4.1-4.6s-4.3 2-4.3 4.6 1.6 4.7 4.3 4.7c2 0 3.3-.9 3.9-2.6h-2c-.2.6-.8 1-1.8 1-1.2 0-1.9-.7-2-2h5.9c.1-.3.1-.4.1-.7zm-5.8-.9c.2-.9.8-1.4 1.6-1.4.9 0 1.5.6 1.6 1.4z"/></svg>
                <svg v-else-if="platform === 'dribbble'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8.5 2.5c4 5 5 9 5.5 16M2.5 9c6-1 12 0 16 4M22 13c-5-1.5-11 0-15 5"/></svg>
                <svg v-else-if="platform === 'github'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <form class="contact-form__form" @submit.prevent="handleSubmit">
          <div v-if="submitStatus" :class="['contact-form__status', `contact-form__status--${submitStatus.type}`]">
            {{ submitStatus.message }}
          </div>

          <div class="contact-form__row">
            <div class="contact-form__field">
              <label for="cf-name">{{ t('contact.name') }}</label>
              <input id="cf-name" v-model="formData.name" type="text" :placeholder="t('contact.name')" :disabled="isSubmitting" />
            </div>
            <div class="contact-form__field">
              <label for="cf-email">{{ t('contact.email') }}</label>
              <input id="cf-email" v-model="formData.email" type="email" :placeholder="t('contact.email')" :disabled="isSubmitting" />
            </div>
          </div>

          <div class="contact-form__row">
            <div class="contact-form__field">
              <label for="cf-phone">{{ t('contact.phone') }}</label>
              <input id="cf-phone" v-model="formData.phone" type="tel" :placeholder="t('contact.phone')" :disabled="isSubmitting" />
            </div>
            <div class="contact-form__field">
              <label for="cf-company">{{ t('contact.company') }}</label>
              <input id="cf-company" v-model="formData.company" type="text" :placeholder="t('contact.company')" :disabled="isSubmitting" />
            </div>
          </div>

          <div class="contact-form__field">
            <label for="cf-subject">{{ t('contact.subject') }}</label>
            <input id="cf-subject" v-model="formData.subject" type="text" :placeholder="t('contact.subject')" :disabled="isSubmitting" />
          </div>

          <div class="contact-form__field">
            <label for="cf-message">{{ t('contact.message') }}</label>
            <textarea id="cf-message" v-model="formData.message" rows="5" :placeholder="t('contact.message')" :disabled="isSubmitting"></textarea>
          </div>

          <button type="submit" class="contact-form__submit" :disabled="isSubmitting">
            {{ isSubmitting ? t('contact.submitting') : t('contact.submit') }}
          </button>
        </form>
      </div>
    </BaseSection>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseSection from '@/components/base/BaseSection.vue'
import { SITE } from '@/components/constants/site'
import { contactMessageService } from '@/services/contactMessageService'

const { t, locale } = useI18n()

const site = SITE

const activeSocials = computed(() => {
  const socials = site.socials || {}
  const order = ['linkedin', 'instagram', 'facebook', 'x', 'tiktok', 'youtube', 'behance', 'dribbble', 'github']
  const out = {}
  order.forEach(p => {
    const url = socials[p]
    if (url && String(url).trim()) out[p] = url
  })
  return out
})

const formData = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitStatus = ref(null)

const handleSubmit = async () => {
  submitStatus.value = null
  const { name, email, message } = formData.value
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    submitStatus.value = { type: 'error', message: t('contact.errorRequired') }
    return
  }

  isSubmitting.value = true
  try {
    await contactMessageService.submit({
      name: name.trim(),
      email: email.trim(),
      phone: formData.value.phone,
      company: formData.value.company,
      subject: formData.value.subject,
      message: message.trim(),
    })

    submitStatus.value = { type: 'success', message: t('contact.success') }
    formData.value = { name: '', email: '', phone: '', company: '', subject: '', message: '' }
  } catch (e) {
    submitStatus.value = { type: 'error', message: e?.message || t('contact.errorGeneric') }
  } finally {
    isSubmitting.value = false
    setTimeout(() => { submitStatus.value = null }, 5000)
  }
}

onMounted(() => {
  document.title = locale.value === 'ar' ? 'تواصل معنا | MarkaSphere' : 'Contact Us | MarkaSphere'
})
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

.contact-form__info-title {
  font-family: var(--font-display-ar);
  font-size: var(--text-h2);
  color: var(--color-text);
  margin-bottom: var(--space-2xl);
}

.contact-form__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.contact-form__item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  text-decoration: none;
  color: inherit;
}

.contact-form__icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  background: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
}

.contact-form__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-form__label {
  font-family: var(--font-body-ar);
  font-size: var(--text-small);
  color: var(--color-text-muted);
}

.contact-form__value {
  font-family: var(--font-body-en);
  font-size: var(--text-body);
  color: var(--color-text);
}

.contact-form__socials {
  margin-top: var(--space-2xl);
}

.contact-form__socials-label {
  display: block;
  font-family: var(--font-body-ar);
  font-size: var(--text-small);
  color: var(--color-text-muted);
  margin-bottom: var(--space-md);
}

.contact-form__socials-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.contact-form__social {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-bg-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: color var(--duration-fast) var(--ease-primary),
              border-color var(--duration-fast) var(--ease-primary),
              background var(--duration-fast) var(--ease-primary);
}

.contact-form__social:hover {
  color: #fff;
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.contact-form__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.contact-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

  .page-hero {
    padding: 120px 0 56px;
  }

  .page-hero__title {
    font-size: var(--text-h1);
  }

  .contact-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
