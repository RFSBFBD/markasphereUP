<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '@/dashboard/composables/useToast'
import { useInboxStore } from '@/dashboard/modules/inbox/stores/inboxStore'
import InboxTable from '@/dashboard/modules/inbox/components/InboxTable.vue'
import MessageModal from '@/dashboard/modules/inbox/components/MessageModal.vue'

const store = useInboxStore()
const toast = useToast()

const search = ref(store.filters.search)
const statusFilter = ref(store.filters.status)
const selected = ref(null)
const pendingDelete = ref(null)
const pendingAction = ref(false)

const statsCards = computed(() => [
  { key: 'unread', label: 'رسائل غير مقروءة', value: store.stats.unread, accent: 'var(--ds-primary)' },
  { key: 'today', label: 'رسائل اليوم', value: store.stats.today, accent: '#0ea5e9' },
  { key: 'total', label: 'إجمالي الرسائل', value: store.stats.total, accent: '#16a34a' },
  { key: 'archived', label: 'الرسائل المؤرشفة', value: store.stats.archived, accent: '#6b7280' },
])

let debounce
watch(search, (val) => {
  clearTimeout(debounce)
  debounce = setTimeout(() => store.setFilters({ search: val }), 350)
})
watch(statusFilter, (val) => store.setFilters({ status: val }))
watch(() => store.pagination.page, () => store.loadMessages())

onMounted(() => store.refresh())

function openMessage(m) {
  selected.value = m
  if (m.status === 'Unread') {
    store.markRead(m.id).catch((e) => toast.error(e.message))
  }
}
function closeMessage() {
  selected.value = null
}

async function onMarkRead(m) {
  try { await store.markRead(m.id); toast.success('تم تحديدها كمقروءة') }
  catch (e) { toast.error(e.message) }
}
async function onMarkUnread(m) {
  try { await store.markUnread(m.id); toast.success('تم تحديدها كغير مقروءة') }
  catch (e) { toast.error(e.message) }
}
async function onArchive(m) {
  try { await store.archive(m.id); toast.success('تم أرشفة الرسالة') }
  catch (e) { toast.error(e.message) }
}
function askDelete(m) {
  pendingDelete.value = m
}
async function confirmDelete() {
  const m = pendingDelete.value
  pendingDelete.value = null
  pendingAction.value = true
  try {
    await store.remove(m.id)
    if (selected.value?.id === m.id) selected.value = null
    toast.success('تم حذف الرسالة')
  } catch (e) {
    toast.error(e.message)
  } finally {
    pendingAction.value = false
  }
}

function goPage(p) {
  if (p >= 1 && p <= store.pagination.pages) store.setPage(p)
}
</script>

<template>
  <section>
    <div class="inbox-stats">
      <div
        v-for="card in statsCards"
        :key="card.key"
        class="inbox-stat"
        :style="{ '--c': card.accent }"
      >
        <span class="inbox-stat__value">{{ card.value }}</span>
        <span class="inbox-stat__label">{{ card.label }}</span>
      </div>
    </div>

    <div class="ds-card">
      <div class="inbox-toolbar">
        <div class="inbox-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input v-model="search" type="search" placeholder="بحث بالاسم، البريد، الهاتف، الموضوع..." />
        </div>
        <select v-model="statusFilter" class="inbox-select">
          <option value="">كل الحالات</option>
          <option value="Unread">غير مقروء</option>
          <option value="Read">مقروء</option>
          <option value="Archived">مؤرشف</option>
        </select>
      </div>

      <InboxTable
        :messages="store.messages"
        :loading="store.loading"
        @view="openMessage"
        @mark-read="onMarkRead"
        @mark-unread="onMarkUnread"
        @archive="onArchive"
        @delete="askDelete"
      />

      <div v-if="store.pagination.pages > 1" class="inbox-pager">
        <button type="button" class="ds-btn" :disabled="store.pagination.page <= 1" @click="goPage(store.pagination.page - 1)">السابق</button>
        <span class="inbox-pager__info">صفحة {{ store.pagination.page }} من {{ store.pagination.pages }} ({{ store.pagination.total }})</span>
        <button type="button" class="ds-btn" :disabled="store.pagination.page >= store.pagination.pages" @click="goPage(store.pagination.page + 1)">التالي</button>
      </div>
    </div>

    <MessageModal
      v-if="selected"
      :message="selected"
      :loading="pendingAction"
      @close="closeMessage"
      @mark-read="onMarkRead"
      @mark-unread="onMarkUnread"
      @archive="onArchive"
      @delete="askDelete"
    />

    <Teleport to="body">
      <div v-if="pendingDelete" class="dialog-overlay" @click.self="pendingDelete = null">
        <div class="dialog" role="alertdialog" aria-modal="true">
          <div class="dialog__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></svg>
          </div>
          <h3 class="dialog__title">حذف نهائي</h3>
          <p class="dialog__text">هل أنت متأكد من حذف رسالة <strong>{{ pendingDelete.full_name || pendingDelete.name }}</strong>؟ لا يمكن التراجع.</p>
          <div class="dialog__actions">
            <button type="button" class="ds-btn" :disabled="pendingAction" @click="pendingDelete = null">إلغاء</button>
            <button type="button" class="ds-btn is-danger" :disabled="pendingAction" @click="confirmDelete">
              {{ pendingAction ? 'جارٍ الحذف...' : 'حذف نهائي' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.inbox-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.inbox-stat {
  background: var(--ds-surface);
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius);
  box-shadow: var(--ds-shadow);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  overflow: hidden;
}
.inbox-stat::before {
  content: '';
  position: absolute;
  inset-inline-start: 0; top: 0; bottom: 0;
  width: 4px;
  background: var(--c);
}
.inbox-stat__value { font-size: 28px; font-weight: 800; color: var(--c); }
.inbox-stat__label { font-size: 13px; color: var(--ds-text-muted); font-weight: 600; }

.inbox-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.inbox-search {
  flex: 1;
  min-width: 240px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  background: var(--ds-surface-2);
  color: var(--ds-text-muted);
}
.inbox-search svg { width: 18px; height: 18px; flex-shrink: 0; }
.inbox-search input {
  border: none; background: none; outline: none; width: 100%;
  padding: 11px 0; font-size: 14px; color: var(--ds-text); font-family: var(--ds-font);
}
.inbox-select {
  border: 1px solid var(--ds-border);
  border-radius: var(--ds-radius-sm);
  background: var(--ds-surface-2);
  color: var(--ds-text);
  padding: 0 12px;
  font-size: 14px;
  font-family: var(--ds-font);
  cursor: pointer;
}

.inbox-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 18px;
}
.inbox-pager__info { font-size: 13px; color: var(--ds-text-muted); font-weight: 600; }

@media (max-width: 860px) {
  .inbox-stats { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .inbox-stats { grid-template-columns: 1fr; }
}
</style>
