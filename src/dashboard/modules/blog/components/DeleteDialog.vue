<script setup>
const props = defineProps({
  itemName: { type: String, default: 'هذا العنصر' },
})
const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <div class="del-overlay" @click.self="emit('cancel')">
      <div class="del-modal">
        <h3>تأكيد الحذف</h3>
        <p>هل أنت متأكد من حذف <strong>{{ itemName }}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div class="del-actions">
          <button type="button" class="ds-btn" @click="emit('cancel')">إلغاء</button>
          <button type="button" class="ds-btn is-danger" @click="emit('confirm')">حذف نهائي</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.del-overlay { position: fixed; inset: 0; background: rgba(15,17,22,.6); display: grid; place-items: center; z-index: 1400; padding: 20px; }
.del-modal { width: 100%; max-width: 420px; background: var(--ds-surface); border: 1px solid var(--ds-border); border-radius: var(--ds-radius); padding: 22px; box-shadow: var(--ds-shadow); }
.del-modal h3 { margin: 0 0 10px; font-size: 18px; font-weight: 800; }
.del-modal p { margin: 0 0 18px; color: var(--ds-text-muted); font-size: 14px; line-height: 1.7; }
.del-actions { display: flex; justify-content: flex-end; gap: 10px; }
</style>
